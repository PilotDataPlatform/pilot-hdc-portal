/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import {
  combineChunksApi,
  uploadFileApi2,
  getChunckPreSigned,
} from '../../APIs';
import { ErrorMessager, namespace } from '../../ErrorMessages';
import {
  setNewUploadIndicator,
  updateUploadItemCreator,
  setUploadFileManifest,
} from '../../Redux/actions';
import { slice, retry, MAX_LENGTH } from './utils';
import { store } from '../../Redux/store';
import { sleep } from '../common';
import reduxActionWrapper from '../reduxActionWrapper';
import { keepAlive } from '../';
import { tokenManager } from '../../Service/tokenManager';
import _ from 'lodash';
import { objectKeysToSnakeCase } from '../';
import { getPath } from './getPath';
import { JOB_STATUS } from '../../Components/Layout/FilePanel/jobStatus';
const [
  updateUploadItemDispatcher,
  setNewUploadIndicatorDispatcher,
  setUploadFileManifestDispatcher,
] = reduxActionWrapper([
  updateUploadItemCreator,
  setNewUploadIndicator,
  setUploadFileManifest,
]);
const Promise = require('bluebird');
const USER_LOGOUT = 'user logged out';
export async function resumableUpload(data, resolve, reject) {
  const {
    itemId,
    uploader,
    file,
    projectCode,
    tags,
    manifest,
    jobId,
    resumableIdentifier,
    folderPath,
    resumableInfo,
  } = data;
  let chunks = slice(file, MAX_LENGTH);
  const totalSize = file.size;
  let uploadedSize = Object.keys(resumableInfo.chunksInfo).length * MAX_LENGTH;
  const sessionId = tokenManager.getLocalCookie('sessionId');
  let relativePath = getPath(file.webkitRelativePath);
  if (relativePath === '') {
    relativePath = folderPath;
  } else {
    relativePath = folderPath + '/' + relativePath;
  }
  const sendOneChunk = async function (chunk, index) {
    var params = {
      key:
        file.webkitRelativePath == ''
          ? folderPath + '/' + file.name
          : relativePath + '/' + file.name,
      upload_id: resumableIdentifier,
      chunk_number: index + 1,
    };
    let resUrl = await getChunckPreSigned(params, sessionId, projectCode);
    let res = await uploadFileApi2(resUrl.data.result, chunk, sessionId);
    return res;
  };
  async function combineChunks() {
    try {
      const reqData = {
        projectCode,
        itemId,
        operator: uploader,
        resumableIdentifier,
        jobId,
        resumableFilename: file.name.normalize('NFD'),
        resumableRelativePath: relativePath,
        resumableTotalChunks: chunks.length,
        resumableTotalSize: file.size,
        tags,
      };

      const result = await combineChunksApi(
        objectKeysToSnakeCase(reqData),
        sessionId,
      );
      updateUploadItemDispatcher({
        actionType: 'data_upload',
        progress: 1,
        status: result.data.result.status,
        jobId,
        projectCode,
        uploadedTime: Date.now(),
        resumed: false,
      });
    } catch (err) {
      const errorMessage = new ErrorMessager(
        namespace.project.files.combineChunk,
      );
      errorMessage.triggerMsg(null, null, { fileName: file.name });
    }
  }
  try {
    updateUploadItemDispatcher({
      jobId,
      progress: uploadedSize / totalSize,
      status: JOB_STATUS.UPLOADING,
      uploadedTime: Date.now(),
      projectCode,
    });
    await Promise.map(
      chunks,
      function (chunk, index) {
        if (resumableInfo.chunksInfo[index + 1]) {
          return null;
        }
        return sendOneChunk(chunk, index)
          .then(async (res) => {
            uploadedSize += chunk.size;
            updateUploadItemDispatcher({
              actionType: 'data_upload',
              jobId,
              status: JOB_STATUS.UPLOADING,
              progress: uploadedSize / totalSize,
              fileName: file.name,
              projectCode,
            });
            keepAlive();
          })
          .catch(async (err) => {
            const { isLogin } = store.getState();
            if (!isLogin) return Promise.reject(new Error(USER_LOGOUT));
            await sleep(5000);
            return retry(sendOneChunk, chunk, index, 3);
          });
      },
      {
        concurrency: 2,
      },
    );
  } catch (err) {
    reject();
    if (err.message === USER_LOGOUT) return;

    if (err.response) {
      const errorMessager = new ErrorMessager(
        namespace.project.files.uploadFileApi,
      );
      errorMessager.triggerMsg(err.response.status, null, {
        fileName: file.name,
      });
    } else {
      const errorMessager = new ErrorMessager(
        namespace.project.files.uploadRequestFail,
      );
      errorMessager.triggerMsg(null, null, { fileName: file.name });
    }
    return;
  }
  await combineChunks();
  setTimeout(() => {
    resolve();
  }, 2000);
}
