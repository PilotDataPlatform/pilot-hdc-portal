/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { combineReducers } from 'redux';
import datasetList from './datasetList';
import userList from './userList';
import { tags } from './tags';
import { metadatas } from './metadatas';
import { personalDatasetId } from './personalDatasetId';
import containersPermission from './containersPermission';
import role from './role';
import uploadList from './uploadList';
import resumableUploadList from './resumableUploadList';
import newUploadIndicator from './newUploadIndicator';
import { USER_LOGOUT } from '../actionTypes';
import tokenAutoRefresh from './tokenAutoRefresh';
import downloadList from './downloadList';
import username from './username';
import isLogin from './isLogin';
import successNum from './successNum';
import downloadClearId from './downloadClearId';
import panelActiveKey from './panelActiveKey';
import project from './currentProject';
import email from './userEmail';
import copy2CoreList from './copy2CoreList';
import isKeycloakReady from './isKeycloakReady';
import isReleaseNoteShown from './isReleaseNoteShown';
import deletedFileList from './deletedFileList';
import uploadFileManifest from './uploadFileManifest';
import fileExplorer from './fileExplorer';
import serviceRequestRedDot from './serviceRequest';
import user from './user';
import { datasetData } from './datasetData';
import { myDatasetList } from './myDatasetList';
import { datasetInfo } from './datasetInfo';
import { datasetFileOperations } from './datasetFileOperations';
import { schemaTemplatesInfo } from './schemaTemplatesInfo';
import { fileExplorerTable } from './fileExplorerTable';
import request2Core from './request2Core';
import notifications from './notification';
import canvasPage from './canvasPage';
import bellNotificationReducer from './BellNotification';
import virtualFolders from './virtualFolders';
import fileActionSSE from './fileActionSSE';
import rolePermissions from './rolePermissions';
import kgSpaceList from './kgSpaceList';
const appReducer = combineReducers({
  datasetList,
  userList,
  tags,
  metadatas,
  personalDatasetId,
  containersPermission,
  role,
  uploadList,
  resumableUploadList,
  newUploadIndicator,
  tokenAutoRefresh,
  project,
  copy2CoreList,
  downloadList,
  isLogin,
  username,
  successNum,
  downloadClearId,
  panelActiveKey,
  email,
  isKeycloakReady,
  isReleaseNoteShown,
  deletedFileList,
  uploadFileManifest,
  fileExplorer,
  serviceRequestRedDot,
  user,
  datasetData,
  myDatasetList,
  datasetInfo,
  datasetFileOperations,
  schemaTemplatesInfo,
  fileExplorerTable,
  request2Core,
  notifications,
  canvasPage,
  bellNotificationReducer,
  virtualFolders,
  fileActionSSE,
  rolePermissions,
  kgSpaceList,
});

const rootReducer = (state, action) => {
  if (action.type === USER_LOGOUT) {
    state = {};
  }
  return appReducer(state, action);
};

export default rootReducer;
