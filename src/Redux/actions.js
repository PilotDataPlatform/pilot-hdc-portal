/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import _ from 'lodash';
import {
  ADD_DATASET_LIST,
  SET_USER_LIST,
  SET_TAGS,
  SET_METADATAS,
  CLEAN_DATASET_LIST,
  SET_DATASET_LIST,
  SET_PERSONAL_DATASET_ID,
  SET_CONTAINERS_PERMISSION,
  SET_USER_ROLE,
  SET_UPLOAD_LIST,
  ADD_UPLOAD_LIST,
  UPDATE_UPLOAD_LIST_ITEM,
  DELETE_UPLOAD_LIST_ITEM,
  SET_UPLOAD_INDICATOR,
  USER_LOGOUT,
  SET_TOKEN_AUTO_REFRESH,
  APPEND_DOWNLOAD_LIST,
  UPDATE_DATASET_LIST,
  UPDATE_CLEAR_ID,
  SET_IS_LOGIN,
  SET_USER_NAME,
  SET_USER_LAST_LOGIN,
  SET_SUCCESS_NUM,
  SET_DOWNLOAD_CLEAR_ID,
  SET_PANEL_VISIBILITY,
  UPDATE_DOWNLOAD_ITEM,
  SET_DOWNLOAD_LIST,
  SET_CURRENT_PROJECT_PROFILE,
  SET_CURRENT_PROJECT_SYSTEM_TAGS,
  SET_CURRENT_PROJECT_TREE,
  SET_CURRENT_PROJECT_TREE_VFOLDER,
  SET_CURRENT_PROJECT_TREE_GREEN_ROOM,
  SET_CURRENT_PROJECT_TREE_CORE,
  SET_CURRENT_PROJECT_ACTIVE_PANE,
  SET_EMAIL,
  UPDATE_COPY2CORE_LIST,
  ADD_COPY2CORE_LIST,
  SET_COPY2_CORE_LIST,
  TRIGGER_EVENT,
  SET_IS_KEYCLOAK_READY,
  SET_IS_RELEASE_NOTE_SHOWN,
  SET_DELETE_LIST,
  SET_UPLOAD_FILE_MANIFEST,
  UPDATE_DELETE_LIST,
  ADD_DELETE_LIST,
  SET_SELECTED_FILES,
  SET_SELECTED_FILES_KEYS,
  CLEAN_FILES_SELECTION,
  SET_FOLDER_ROUTING,
  SHOW_SERVICE_REQUEST_RED_DOT,
  CLEAR_CURRENT_PROJECT,
  SET_USER_STATUS,
  SET_PROJECT_WORKBENCH,
  DATASET_DATA,
  MY_DATASET_LIST,
  DATASET_INFO,
  DATASET_FILE_OPERATION,
  SET_TABLE_RESET,
  SCHEMA_TEMPLATES,
  FILE_EXPLORER_TABLE as FILE_EXPLORER_TABLE,
  COPY_REQUEST,
  NOTIFICATIONS,
  SET_CANVAS_PAGE,
  SET_VIRTUAL_FOLDER_OPERATION,
  SET_CURRENT_PROJECT_TEMPLATES,
  BELLNOTIFICATION,
  SET_UPLOAD_COMMITTING,
  SET_DOWNLOAD_COMMITTING,
  UNSET_DOWNLOAD_COMMITTING,
  SET_RESUMABLE_LIST,
  ADD_RESUMABLE_LIST,
  ROLEPERMISSIONS,
  SET_KG_SPACE_BIND,
} from './actionTypes';

export const AddDatasetCreator = (datasetList, title) => ({
  type: ADD_DATASET_LIST,
  payload: {
    datasetList,
    title,
  },
});

export const UpdateDatasetCreator = (datasetList, title) => ({
  type: UPDATE_DATASET_LIST,
  payload: {
    datasetList,
    title,
  },
});

export const cleanDatasetCreator = () => ({
  type: CLEAN_DATASET_LIST,
});

export const setUserListCreator = (userList) => ({
  type: SET_USER_LIST,
  payload: {
    userList,
  },
});

export const setDatasetCreator = (allDatasetLists) => ({
  type: SET_DATASET_LIST,
  payload: {
    allDatasetLists,
  },
});

export const setTagsCreator = (tags) => ({
  type: SET_TAGS,
  payload: {
    tags,
  },
});

export const setMetadatasCreator = (metadatas) => ({
  type: SET_METADATAS,
  payload: {
    metadatas,
  },
});

export const setPersonalDatasetIdCreator = (id) => ({
  type: SET_PERSONAL_DATASET_ID,
  payload: {
    id,
  },
});

export const setContainersPermissionCreator = (containersPermission) => ({
  type: SET_CONTAINERS_PERMISSION,
  payload: {
    containersPermission,
  },
});

export const setUserRoleCreator = (role) => ({
  type: SET_USER_ROLE,
  payload: {
    role,
  },
});

export const setUploadListCreator = (payload) => ({
  type: SET_UPLOAD_LIST,
  payload,
});

export const addUploadListCreator = (appendContent) => ({
  type: ADD_UPLOAD_LIST,
  payload: {
    appendContent,
  },
});

export const setResumeListCreator = (payload) => ({
  type: SET_RESUMABLE_LIST,
  payload,
});

export const addResumeListCreator = (appendContent) => ({
  type: ADD_RESUMABLE_LIST,
  payload: {
    appendContent,
  },
});

export const updateUploadItemCreator = (item) => ({
  type: UPDATE_UPLOAD_LIST_ITEM,
  payload: {
    item,
  },
});
export const deleteUploadItemCreator = (item) => ({
  type: DELETE_UPLOAD_LIST_ITEM,
  payload: {
    item,
  },
});

export const setNewUploadIndicator = () => ({
  type: SET_UPLOAD_INDICATOR,
  payload: {},
});

export const userLogoutCreator = () => ({
  type: USER_LOGOUT,
  payload: {},
});

export const setTokenAutoRefresh = (status) => ({
  type: SET_TOKEN_AUTO_REFRESH,
  payload: status,
});

export const appendDownloadListCreator = (downloadItem) => {
  return {
    type: APPEND_DOWNLOAD_LIST,
    payload: downloadItem,
  };
};

export const updateDownloadItemCreator = (payload) => ({
  type: UPDATE_DOWNLOAD_ITEM,
  payload,
});

export const setDownloadListCreator = (list) => ({
  type: SET_DOWNLOAD_LIST,
  payload: list,
});

export const updateCopy2CoreList = (payload) => ({
  type: UPDATE_COPY2CORE_LIST,
  payload: payload,
});

export const setCopy2CoreList = (payload) => ({
  type: SET_COPY2_CORE_LIST,
  payload,
});

export const addCopy2CoreList = (list) => {
  return {
    type: ADD_COPY2CORE_LIST,
    payload: list,
  };
};

export const setIsLoginCreator = (isLogin) => ({
  type: SET_IS_LOGIN,
  payload: isLogin,
});

export const setUsernameCreator = (username) => ({
  type: SET_USER_NAME,
  payload: username,
});
export const setSuccessNum = (num) => ({
  type: SET_SUCCESS_NUM,
  payload: num,
});

export const setDonwloadClearIdCreator = (downloadClearId) => ({
  type: SET_DOWNLOAD_CLEAR_ID,
  payload: downloadClearId,
});

export const setPanelVisibility = (key) => ({
  type: SET_PANEL_VISIBILITY,
  payload: key,
});

export const clearCurrentProject = () => ({
  type: CLEAR_CURRENT_PROJECT,
});

export const setCurrentProjectProfile = (profile) => ({
  type: SET_CURRENT_PROJECT_PROFILE,
  payload: profile,
});

export const setCurrentProjectTPL = (tpls) => ({
  type: SET_CURRENT_PROJECT_TEMPLATES,
  payload: tpls,
});

export const setCurrentProjectSystemTags = (manifest) => ({
  type: SET_CURRENT_PROJECT_SYSTEM_TAGS,
  payload: manifest,
});

export const setCurrentProjectTree = (tree) => ({
  type: SET_CURRENT_PROJECT_TREE,
  payload: tree,
});

export const setCurrentProjectWorkbench = () => ({
  type: SET_PROJECT_WORKBENCH,
});

export const setCurrentProjectTreeVFolder = (vfolders) => ({
  type: SET_CURRENT_PROJECT_TREE_VFOLDER,
  payload: vfolders,
});

export const setCurrentProjectTreeGreenRoom = (folders) => ({
  type: SET_CURRENT_PROJECT_TREE_GREEN_ROOM,
  payload: folders,
});

export const setCurrentProjectTreeCore = (folders) => ({
  type: SET_CURRENT_PROJECT_TREE_CORE,
  payload: folders,
});

export const setCurrentProjectActivePane = (folders) => ({
  type: SET_CURRENT_PROJECT_ACTIVE_PANE,
  payload: folders,
});

export const setEmailCreator = (email) => ({
  type: SET_EMAIL,
  payload: email,
});

export const setIsKeycloakReady = (isKeycloakReady) => ({
  type: SET_IS_KEYCLOAK_READY,
  payload: isKeycloakReady,
});

export const setIsReleaseNoteShownCreator = (isReleaseNoteShown) => ({
  type: SET_IS_RELEASE_NOTE_SHOWN,
  payload: isReleaseNoteShown,
});

export const setDeletedFileList = (payload) => ({
  type: SET_DELETE_LIST,
  payload,
});

export const setUploadFileManifest = (payload) => ({
  type: SET_UPLOAD_FILE_MANIFEST,
  payload,
});

export const updateDeletedFileList = (payload) => ({
  type: UPDATE_DELETE_LIST,
  payload,
});

export const addDeletedFileList = (payload) => ({
  type: ADD_DELETE_LIST,
  payload,
});

export const setSelectedFiles = (payload) => ({
  type: SET_SELECTED_FILES,
  payload,
});

export const setSelectedFilesKeys = (payload) => ({
  type: SET_SELECTED_FILES_KEYS,
  payload,
});

export const clearFilesSelection = (payload) => ({
  type: CLEAN_FILES_SELECTION,
  payload,
});

export const setFolderRouting = (payload) => ({
  type: SET_FOLDER_ROUTING,
  payload,
});
export const setTableLayoutReset = (payload) => ({
  type: SET_TABLE_RESET,
  payload,
});
export const setServiceRequestRedDot = (payload) => ({
  type: SHOW_SERVICE_REQUEST_RED_DOT,
  payload,
});

export const setUserStatus = (payload) => ({
  type: SET_USER_STATUS,
  payload,
});

export const setUserLastLogin = (payload) => {
  return {
    type: SET_USER_LAST_LOGIN,
    payload,
  };
};

export const datasetDataActions = {
  resetTreeKey: (payload) => ({
    type: DATASET_DATA.RESET_TREE_KEY,
    payload,
  }),
  setTreeData: (payload) => ({
    type: DATASET_DATA.SET_TREE_DATA,
    payload,
  }),
  setSelectedData: (payload) => ({
    type: DATASET_DATA.SET_SELECTED_DATA,
    payload,
  }),
  setSelectedDataPos: (payload) => ({
    type: DATASET_DATA.SET_SELECTED_DATA_POS,
    payload,
  }),
  setMode: (payload) => ({
    type: DATASET_DATA.SET_MODE,
    payload,
  }),
  setHightLighted: (payload) => ({
    type: DATASET_DATA.SET_HIGHLIGHTED,
    payload,
  }),
  setPreviewFile: (payload) => ({
    type: DATASET_DATA.SET_PREVIEW_FILE,
    payload,
  }),
  clearData: (payload) => ({
    type: DATASET_DATA.CLEAR_DATA,
    payload,
  }),
  setTreeLoading: (payload) => ({
    type: DATASET_DATA.SET_TREE_LOADING,
    payload,
  }),
};

export const myDatasetListCreators = {
  setLoading: (payload) => ({
    type: MY_DATASET_LIST.SET_LOADING,
    payload,
  }),
  setDatasets: (payload) => ({
    type: MY_DATASET_LIST.SET_DATASETS,
    payload,
  }),
  setTotal: (payload) => ({
    type: MY_DATASET_LIST.SET_TOTAL,
    payload,
  }),
};

export const datasetInfoCreators = {
  setBasicInfo: (payload) => ({
    type: DATASET_INFO.SET_BASIC_INFO,
    payload,
  }),
  setDatasetVersion: (payload) => ({
    type: DATASET_INFO.SET_VERSION,
    payload,
  }),
  setProjectName: (payload) => ({
    type: DATASET_INFO.SET_PROJECT_NAME,
    payload,
  }),
  setProjectCode: (payload) => ({
    type: DATASET_INFO.SET_PROJECT_CODE,
    payload,
  }),
  setLoading: (payload) => ({
    type: DATASET_INFO.SET_LOADING,
    payload,
  }),
  setHasInit: (payload) => ({
    type: DATASET_INFO.SET_HAS_INIT,
    payload,
  }),
};

export const datasetFileOps = {
  import: 'data_import',
  rename: 'data_rename',
  delete: 'data_delete',
  transfer: 'data_transfer',
};

export const datasetFileOperationsCreators = {
  setMove: (payload) => ({
    type: DATASET_FILE_OPERATION.SET_MOVE,
    payload: { ...payload, actionType: datasetFileOps.transfer },
  }),
  setRename: (payload) => ({
    type: DATASET_FILE_OPERATION.SET_RENAME,
    payload: { ...payload, actionType: datasetFileOps.rename },
  }),
  setDelete: (payload) => ({
    type: DATASET_FILE_OPERATION.SET_DELETE,
    payload: { ...payload, actionType: datasetFileOps.delete },
  }),
  setImport: (payload) => ({
    type: DATASET_FILE_OPERATION.SET_IMPORT,
    payload: { ...payload, actionType: datasetFileOps.import },
  }),
  updateMove: (payload) => ({
    type: DATASET_FILE_OPERATION.UPDATE_MOVE,
    payload: { ...payload, actionType: datasetFileOps.transfer },
  }),
  updateRename: (payload) => ({
    type: DATASET_FILE_OPERATION.UPDATE_RENAME,
    payload: { ...payload, actionType: datasetFileOps.rename },
  }),
  updateDelete: (payload) => ({
    type: DATASET_FILE_OPERATION.UPDATE_DELETE,
    payload: { ...payload, actionType: datasetFileOps.delete },
  }),
  updateImport: (payload) => ({
    type: DATASET_FILE_OPERATION.UPDATE_IMPORT,
    payload: { ...payload, actionType: datasetFileOps.import },
  }),
};

export const schemaTemplatesActions = {
  updateDefaultSchemaList: (payload) => ({
    type: SCHEMA_TEMPLATES.UPDATE_DEFAULT_SCHEMA_LIST,
    payload,
  }),
  updateDefaultSchemaTemplateList: (payload) => ({
    type: SCHEMA_TEMPLATES.UPDATE_DEFAULT_SCHEMA_TEMPLATE_LIST,
    payload,
  }),
  setDefaultActiveKey: (payload) => ({
    type: SCHEMA_TEMPLATES.SET_DEFAULT_SCHEMA_ACTIVE_KEY,
    payload,
  }),
  setCustomActiveKey: (payload) => ({
    type: SCHEMA_TEMPLATES.SET_CUSTOM_SCHEMA_ACTIVE_KEY,
    payload,
  }),
  addDefaultOpenTab: (payload) => ({
    type: SCHEMA_TEMPLATES.ADD_DEFAULT_OPEN_TAB,
    payload,
  }),
  updateDefaultOpenTab: (payload) => ({
    type: SCHEMA_TEMPLATES.UPDATE_DEFAULT_OPEN_TAB,
    payload,
  }),
  clearDefaultOpenTab: () => ({
    type: SCHEMA_TEMPLATES.CLEAR_DEFAULT_OPEN_TAB,
  }),
  addCustomOpenTab: (payload) => ({
    type: SCHEMA_TEMPLATES.ADD_CUSTOM_OPEN_TAB,
    payload,
  }),
  removeDefaultOpenTab: (payload) => ({
    type: SCHEMA_TEMPLATES.REMOVE_DEFAULT_OPEN_TAB,
    payload,
  }),
  removeCustomOpenTab: (payload) => ({
    type: SCHEMA_TEMPLATES.REMOVE_CUSTOM_OPEN_TAB,
    payload,
  }),
  setPreviewSchemaGeid: (payload) => ({
    type: SCHEMA_TEMPLATES.SET_PREVIEW_SCHEMA_GEID,
    payload,
  }),
  setSchemaTypes: (payload) => ({
    type: SCHEMA_TEMPLATES.SET_SCHEMA_TYPES,
    payload,
  }),
  switchTPLManagerMode: (payload) => ({
    type: SCHEMA_TEMPLATES.SWITCH_TEMPLATE_MANAGER_MODE,
    payload,
  }),
  showTplDropdownList: (payload) => ({
    type: SCHEMA_TEMPLATES.SHOW_TEMPLATES_DROPDOWN_LIST,
    payload,
  }),
  updateKgSchemaMetaList: (payload) => ({
    type: SCHEMA_TEMPLATES.UPDATE_KG_SCHEMA_META_LIST,
    payload,
  }),
};

export const fileExplorerTableActions = {
  setLoading: (payload) => ({
    type: FILE_EXPLORER_TABLE.SET_LOADING,
    payload,
  }),
  setCurrentPlugin: (payload) => ({
    type: FILE_EXPLORER_TABLE.SET_CURRENT_PLUGIN,
    payload,
  }),
  setData: (payload) => ({
    type: FILE_EXPLORER_TABLE.SET_DATA,
    payload,
  }),
  setRoute: (payload) => ({
    type: FILE_EXPLORER_TABLE.SET_ROUTE,
    payload,
  }),
  setPage: (payload) => ({
    type: FILE_EXPLORER_TABLE.SET_PAGE,
    payload,
  }),
  setPageSize: (payload) => ({
    type: FILE_EXPLORER_TABLE.SET_PAGE_SIZE,
    payload,
  }),
  setTotal: (payload) => ({
    type: FILE_EXPLORER_TABLE.SET_TOTAL,
    payload,
  }),
  setSortBy: (payload) => ({
    type: FILE_EXPLORER_TABLE.SET_SORT_BY,
    payload,
  }),
  setSortType: (payload) => ({
    type: FILE_EXPLORER_TABLE.SET_SORT_ORDER,
    payload,
  }),
  setFilter: (payload) => ({
    type: FILE_EXPLORER_TABLE.SET_FILTER,
    payload,
  }),
  setSelections: (payload) => ({
    type: FILE_EXPLORER_TABLE.SET_SELECTION,
    payload,
  }),
  setDataOriginal: (payload) => ({
    type: FILE_EXPLORER_TABLE.SET_DATA_ORIGINAL,
    payload,
  }),
  setColumnsCompMap: (payload) => ({
    type: FILE_EXPLORER_TABLE.SET_COLUMNS_COMP_MAP,
    payload,
  }),
  setAdd: (payload) => ({
    type: FILE_EXPLORER_TABLE.ADD,
    payload,
  }),
  clear: (payload) => ({
    type: FILE_EXPLORER_TABLE.REMOVE,
    payload,
  }),
  setPropertyRecord: (payload) => ({
    type: FILE_EXPLORER_TABLE.SET_PROPERTY_RECORD,
    payload,
  }),
  setSidePanelOpen: (payload) => ({
    type: FILE_EXPLORER_TABLE.SET_SIDE_PANEL_OPEN,
    payload,
  }),
  setSourceType: (payload) => ({
    type: FILE_EXPLORER_TABLE.SET_SOURCE_TYPE,
    payload,
  }),
  refreshTable: (payload) => ({
    type: FILE_EXPLORER_TABLE.REFRESH_TABLE,
    payload,
  }),
  setCurrentGeid: (payload) => ({
    type: FILE_EXPLORER_TABLE.SET_CURRENT_GEID,
    payload,
  }),
  setHardFreshKey: (payload) => ({
    type: FILE_EXPLORER_TABLE.SET_HARD_REFRESH_KEY,
    payload,
  }),
};

export const request2CoreActions = {
  setStatus: (payload) => ({
    type: COPY_REQUEST.SET_STATUS,
    payload,
  }),
  setReqList: (payload) => ({
    type: COPY_REQUEST.SET_REQ_LIST,
    payload,
  }),
  setActiveReq: (payload) => ({
    type: COPY_REQUEST.SET_ACTIVE_REQ,
    payload,
  }),
  setPagination: (payload) => ({
    type: COPY_REQUEST.SET_PAGINATION,
    payload,
  }),
};

export const notificationActions = {
  setActiveNotification: (payload) => ({
    type: NOTIFICATIONS.SET_ACTIVE_NOTIFICATION,
    payload,
  }),
  setCreateNewNotificationStatus: (payload) => ({
    type: NOTIFICATIONS.SET_CREATE_NEW_NOTIFICATION_LIST_ITEM__STATUS,
    payload,
  }),
  setUserNotifications: (payload) => ({
    type: NOTIFICATIONS.SET_USER_NOTIFICATIONS,
    payload,
  }),
  setNotificationList: (payload) => ({
    type: NOTIFICATIONS.SET_NOTIFICATION_LIST,
    payload,
  }),
  setUpdateNotificationTimes: (payload) => ({
    type: NOTIFICATIONS.SET_UPDATE_NOTIFICATION_TIMES,
    payload,
  }),
  setEditNotification: (payload) => ({
    type: NOTIFICATIONS.SET_EDIT_NOTIFICATION,
    payload,
  }),
};

export const bellNotificationActions = {
  setActiveBellNotification: (payload) => ({
    type: BELLNOTIFICATION.SET_ACTIVE_BELL_NOTIFICATION,
    payload,
  }),
};

export const canvasPageActions = {
  setCanvasPage: (payload) => ({
    type: SET_CANVAS_PAGE,
    payload,
  }),
};

export const VIRTUAL_FOLDER_OPERATIONS = {
  RENAME: 'rename',
  CREATE: 'create',
};

export const vFolderOperation = {
  setVFolderOperationRename: (geid) => ({
    type: SET_VIRTUAL_FOLDER_OPERATION,
    payload: { operation: VIRTUAL_FOLDER_OPERATIONS.RENAME, geid },
  }),
  setVFolderOperationCreate: () => ({
    type: SET_VIRTUAL_FOLDER_OPERATION,
    payload: { operation: VIRTUAL_FOLDER_OPERATIONS.CREATE, geid: null },
  }),
  clearVFolderOperation: () => ({
    type: SET_VIRTUAL_FOLDER_OPERATION,
    payload: { operation: null, geid: null },
  }),
};

export const fileActionSSEActions = {
  setUploadCommitting: (payload) => ({ type: SET_UPLOAD_COMMITTING, payload }),
  setDownloadCommitting: (payload) => ({
    type: SET_DOWNLOAD_COMMITTING,
    payload
  }),
  unSetDownloadCommitting: (payload) => ({
    type: UNSET_DOWNLOAD_COMMITTING,
    payload,
  }),
};

export const rolePermissionsActions = {
  setRoles: (payload) => ({
    type: ROLEPERMISSIONS.SET_ROLES_LIST,
    payload,
  }),
};

export const setKgSpaceBind = (payload) => ({
  type: SET_KG_SPACE_BIND,
  payload,
});
