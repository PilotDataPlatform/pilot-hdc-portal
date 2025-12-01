/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { store } from '../../Redux/store';
import { reduxActionWrapper } from '../../Utility';
import {
  updateCopy2CoreList,
  addCopy2CoreList,
  setSuccessNum,
  updateDownloadItemCreator,
  addMovedToBinList,
  appendDownloadListCreator,
  updateMovedToBinList,
  addUploadListCreator,
  updateUploadItemCreator,
  deleteUploadItemCreator,
} from '../../Redux/actions';
import { JOB_STATUS } from '../../Components/Layout/FilePanel/jobStatus';
import { keepAlive } from '../../Utility';
import _ from 'lodash';

const [
  updateCopy2CoreListDispatcher,
  addCopy2CoreListDispatcher,
  updateDownloadItemDispatcher,
  appendDownloadListDispatcher,
  updateDeletedFileListDispatcher,
  addDeletedFileListDispatcher,
  addUploadListCreatorDispatcher,
  updateUploadItemCreatorDispatcher,
  deleteUploadItemCreatorDispatcher,
  setSuccessNumDispatcher,
] = reduxActionWrapper([
  updateCopy2CoreList,
  addCopy2CoreList,
  updateDownloadItemCreator,
  appendDownloadListCreator,
  updateMovedToBinList,
  addMovedToBinList,
  addUploadListCreator,
  updateUploadItemCreator,
  deleteUploadItemCreator,
  setSuccessNum,
]);

class FileActionHandler {
  constructor() {
    this.successNum = store.getState();

    this.unsubscribeSuccessNum = store.subscribe(() => {
      this.successNum = store.getState().successNum;
    });

    this.unsubscribefileActionSSE = store.subscribe(() => {
      this.fileActionSSE = store.getState().fileActionSSE;
    });
  }

  unsubscribeStore() {
    this.unsubscribeSuccessNum();
    this.unsubscribefileActionSSE();
  }

  copy(data) {
    const copy2CoreList = store.getState().copy2CoreList;

    const existingCopy = copy2CoreList.find(
      (copy) => copy.jobId === data.jobId,
    );

    const currentCopy = [
      {
        ...data,
        updatedTime: Date.now(),
        projectCode: data.containerCode,
      },
    ];
    delete currentCopy[0].containerCode;

    if (existingCopy) {
      updateCopy2CoreListDispatcher(currentCopy);

      if (data.status === JOB_STATUS.SUCCEED) {
        setSuccessNumDispatcher(this.successNum + 1);
      } else if (data.status !== JOB_STATUS.FAILED) {
        keepAlive();
      }
    } else {
      addCopy2CoreListDispatcher(currentCopy);
    }
  }

  delete(data) {
    const deletedFileList = store.getState().movedToBinFileList;

    const existingFile = deletedFileList.find(
      (file) => file.jobId === data.jobId,
    );

    const currentDelete = [
      {
        ...existingFile,
        ...data,
        updatedTime: Date.now(),
        projectCode: data.containerCode,
      },
    ];
    delete currentDelete[0].containerCode;

    if (existingFile) {
      updateDeletedFileListDispatcher(currentDelete);

      if (data.status === JOB_STATUS.SUCCEED) {
        setSuccessNumDispatcher(this.successNum + 1);
      } else if (data.status !== JOB_STATUS.FAILED) {
        keepAlive();
      }
    } else {
      addDeletedFileListDispatcher(currentDelete);
    }
  }

  download(data) {
    const downloadList = store.getState().downloadList;
    const existingDownload = downloadList.find(
      (item) => item.jobId === data.jobId,
    );

    const currentDownload = { ...data, updatedTime: Date.now() };
    currentDownload.projectCode = currentDownload.containerCode;
    delete currentDownload.containerCode;

    if (existingDownload) {
      updateDownloadItemDispatcher(currentDownload);
    } else {
      appendDownloadListDispatcher(currentDownload);
    }
  }

  upload(data, cb) {
    const uploadList = store.getState().uploadList;
    const existingUpload = uploadList.find((upload) =>
      _.isEqual(upload.targetNames, data.targetNames),
    );
    const currentUpload = {
      ...data,
      projectCode: data.containerCode,
    };
    delete data.containerCode;

    if (typeof cb === 'function') {
      cb(currentUpload);
    }

    if (existingUpload) {
      if (existingUpload?.jobId !== data.jobId) {
        deleteUploadItemCreatorDispatcher(existingUpload);
        addUploadListCreatorDispatcher(currentUpload);
      } else {
        updateUploadItemCreatorDispatcher(currentUpload);
        if (
          data.status !== JOB_STATUS.SUCCEED &&
          data.status !== JOB_STATUS.FAILED
        ) {
          keepAlive();
        }
      }
    } else {
      addUploadListCreatorDispatcher(currentUpload);
    }
  }
}

function fileActionRouter(data, handleAction, callbacks) {
  switch (data.actionType) {
    case 'data_transfer':
      handleAction.copy(data);
      break;
    case 'data_upload':
      handleAction.upload(data, callbacks?.upload);
      break;
    case 'data_delete':
      handleAction.delete(data);
      break;
    case 'data_download':
      handleAction.download(data);
  }
}

export { fileActionRouter, FileActionHandler };
