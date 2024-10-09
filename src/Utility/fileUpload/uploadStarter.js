/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import reduxActionWrapper from '../reduxActionWrapper';
import {
  addUploadListCreator,
  updateUploadItemCreator,
  fileActionSSEActions,
} from '../../Redux/actions';
import i18n from '../../i18n';
import { preUpload } from './preUpload';
import { resumableUpload } from './resumableUpload';
import { message } from 'antd';
import { getPath } from './getPath';
import { truncateFileName } from '../fileNameOrPathDisplay';
import { JOB_STATUS } from '../../Components/Layout/FilePanel/jobStatus';
import { store } from '../../Redux/store';
import { validateChunkHash } from './utils';
import { v4 as uuidv4 } from 'uuid';
const [
  appendUploadListDispatcher,
  updateUploadItemDispatcher,
  setUploadCommittingDispatcher,
] = reduxActionWrapper([
  addUploadListCreator,
  updateUploadItemCreator,
  fileActionSSEActions.setUploadCommitting,
]);

const uploadStarter = async (data, q) => {
  let resumableList = [];
  let fileList = [];
  const resumableJobs = store.getState().resumableUploadList;
  const uploadList = store.getState().uploadList;
  for (let file of data.fileList) {
    let relativePath = getPath(file.originFileObj.webkitRelativePath);
    if (relativePath === '') {
      relativePath = data.folderPath;
    } else {
      relativePath = data.folderPath + '/' + relativePath;
    }
    const fileKey = relativePath + '/' + file.originFileObj.name;
    const resumableJob = resumableJobs.find((job) =>
      job.objectPath.endsWith(fileKey.normalize()),
    );
    if (resumableJob) {
      const sameFile = await validateChunkHash(file, resumableJob);
      if (sameFile) {
        const uploadItem = uploadList.find((item) => {
          return resumableJob.objectPath.endsWith(
            item.targetNames[0].normalize(),
          );
        });
        if (uploadItem) {
          if (
            uploadItem.status === JOB_STATUS.UPLOADING ||
            uploadItem.status === JOB_STATUS.SUCCEED ||
            uploadItem.status === JOB_STATUS.CHUNK_UPLOADED
          ) {
            continue;
          }
          resumableJob['jobId'] = uploadItem['jobId'];
          file['resumable'] = resumableJob;
          resumableList.push(file);
        }
      } else {
        fileList.push(file);
      }
    } else {
      fileList.push(file);
    }
  }
  if (resumableList.length) {
    const resumableFilesList = resumableList.map((item, index) => {
      const resumableInfo = item.resumable;
      return {
        file: item.originFileObj,
        datasetId: data.dataset,
        uploader: data.uploader,
        projectCode: data.projectCode,
        tags: data.tags,
        manifest: data.manifest,
        createdTime: Date.now(),
        sessionId: null,
        resumableIdentifier: resumableInfo.resumableId,
        jobId: resumableInfo.jobId,
        itemId: resumableInfo.itemId,
        folderPath: data.folderPath,
        resumableInfo: resumableInfo,
      };
    });

    q.push(resumableFilesList);
  }
  if (fileList.length) {
    preUpload(
      data.projectCode,
      data.uploader,
      data.jobType,
      data.tags,
      fileList,
      '',
      data.folderPath,
      data.parentFolderId,
    )
      .then((res) => {
        const result = res.data.result;
        if (result?.length > 0) {
          const fileActions = fileList.map((item, index) => {
            const resFile = result[index];

            return {
              actionType: 'data_upload',
              status: resFile.status,
              progress: null,
              targetNames: resFile.targetNames,
              projectCode: resFile.projectCode,
              createdTime: Date.now(),
              jobId: resFile.jobId,
            };
          });
          appendUploadListDispatcher(fileActions);
          setUploadCommittingDispatcher(true);
          const newFileList = fileList.map((item, index) => {
            const resFile = result[index];

            return {
              file: item.originFileObj,
              datasetId: data.dataset,
              uploader: data.uploader,
              projectCode: data.projectCode,
              tags: data.tags,
              manifest: data.manifest,
              createdTime: Date.now(),
              sessionId: resFile.sessionId,
              resumableIdentifier: resFile.payload.resumableIdentifier,
              jobId: resFile.jobId,
              itemId: resFile.payload?.itemId,
              folderPath: data.folderPath,
            };
          });

          q.push(newFileList);
        } else {
          throw new Error('Failed to get identifiers from response');
        }
      })
      .catch((err) => {
        const failedFiles = [];
        if (err.response.data.result?.failed) {
          for (let fileObj of err.response.data.result?.failed) {
            let nameStr;
            if (fileObj.name) {
              nameStr = fileObj.name;
            } else {
              nameStr = fileObj.display_path
                .replace(/[\[\]']+/g, '')
                .split('/')
                .at(-1);
            }
            failedFiles.push(nameStr);
          }
        } else {
          const [filePathErr] =
            err.response.data.error_msg.match(/\[(.*?)\]/gm);
          const fileName = filePathErr
            .replace(/[\[\]']+/g, '')
            .split('/')
            .at(-1);

          failedFiles.push(fileName);
        }

        for (let file of failedFiles) {
          const fileName = truncateFileName(file);
          message.error(
            `${i18n.t('errormessages:preUpload.409.0')} ${fileName} ${i18n.t(
              'errormessages:preUpload.409.1',
            )}`,
          );
        }

        for (const file of fileList) {
          updateUploadItemDispatcher({
            status: JOB_STATUS.FAILED,
            uploadedTime: Date.now(),
            projectCode: data.projectCode,
          });
        }
      });
  }

  q.error((err, task) => {
    console.log(`task ${task} error`);
  });
};
export default uploadStarter;
