/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { serverAxios, axios, serverAxiosNoIntercept } from './config';
import Axios from 'axios';
import { objectKeysToSnakeCase } from '../Utility';
import _ from 'lodash';
import { keycloak } from '../Service/keycloak';
import { SUPERSET_SUBDOMAIN, SUPERSET_SUBDOMAIN_BASE } from '../config';
function roleMap(role) {
  if (role === 'admin') return 'administrator';
  if (role === 'collaborator') return 'editor';
  if (role === 'contributor') return 'viewer';
  return role;
}
function getProjectStatistics(params, projectCode) {
  return serverAxios({
    url: `v1/project-files/${projectCode}/statistics`,
    method: 'GET',
    params,
  });
}

function getProjectFileSize(params, projectCode) {
  return serverAxios({
    url: `v1/project-files/${projectCode}/size`,
    method: 'GET',
    params,
  });
}

function getProjectActivity(params, projectCode) {
  return serverAxios({
    url: `v1/project-files/${projectCode}/activity`,
    method: 'GET',
    params,
  });
}

function searchProjectFilesAPI(params, projectCode) {
  params['type'] = 'folder,file';
  params['is_archived'] = false;
  return serverAxios({
    url: `/v1/project-files/${projectCode}/search`,
    method: 'GET',
    params,
  });
}

function getUserProjectActivitiesAPI(params) {
  return serverAxios({
    url: '/v1/user/events',
    method: 'GET',
    params,
  });
}

async function getDatasetsAPI(params = {}) {
  if (params['tags']) {
    params['tags'] = params['tags'].join(',');
  }
  const res = await serverAxios({
    url: '/v1/containers/',
    method: 'GET',
    params: objectKeysToSnakeCase(params),
  });
  if (res.data.result && res.data.result.length) {
    res.data.result = res.data.result.map((v) => {
      v.globalEntityId = v.id;
      return v;
    });
  }
  return res;
}

function createProjectAPI(data, cancelAxios) {
  const CancelToken = axios.CancelToken;
  const url = `/v1/projects`;
  return serverAxios({
    url: url,
    method: 'POST',
    data,
    timeout: 60 * 1000,
    cancelToken: new CancelToken(function executor(c) {
      cancelAxios.cancelFunction = c;
    }),
  });
}

function getChildrenAPI(datasetId) {
  return serverAxios({
    url: `/v1/containers/${datasetId}/relations/children`,
    method: 'GET',
  });
}

function queryDatasetAPI(data) {
  return serverAxios({
    url: '/v1/containers/queries',
    method: 'POST',
    data,
  });
}

function getTagsAPI() {
  return serverAxios({
    url: `/v1/containers/?type=tag`,
  });
}

function getSystemTagsAPI(projectCode) {
  return serverAxios({
    url: `/v1/system-tags?project_code=${projectCode}`,
  });
}

function getMetadatasAPI() {
  return serverAxios({
    url: `/v1/containers/?type=metadata`,
  });
}

function changeUserRoleInDatasetAPI(username, projectGeid, roles) {
  return serverAxios({
    url: `/v1/containers/${projectGeid}/users/${username}`,
    data: roles,
    method: 'put',
  });
}

function broadcastChangeRole(username, projectGeid, oldRole, newRole) {
  return serverAxios({
    url: `/v1/kg/users/${projectGeid}/${username}`,
    params: {
      current_role: roleMap(oldRole),
      new_role: roleMap(newRole),
    },
    method: 'put',
  });
}
function broadcastAddUser(username, projectGeid, role) {
  return serverAxios({
    url: `/v1/kg/users/${projectGeid}/${username}`,
    method: 'POST',
    params: { role: roleMap(role) },
  });
}

function addUserToProjectAPI(username, projectGeid, role) {
  return serverAxios({
    url: `/v1/containers/${projectGeid}/users/${username}`,
    data: { role },
    method: 'POST',
  });
}

function addUserToStartingProjectAPI(username, email) {
  return serverAxios({
    url: `/v1/users/default`,
    data: {username: username, email: email},
    method: 'POST',
  });
}

function checkUserStartingProjectAPI(username) {
  return serverAxios({
    url: `/v1/users/default?username=${username}`,
    method: 'GET',
  });
}

function removeUserFromDatasetApi(username, projectGeid) {
  return serverAxios({
    url: `/v1/containers/${projectGeid}/users/${username}`,
    method: 'DELETE',
  });
}

function broadcastRemoveUser(username, projectGeid, role) {
  return serverAxios({
    url: `/v1/kg/users/${projectGeid}/${username}`,
    method: 'DELETE',
    params: { role: roleMap(role) },
  });
}

function getPersonalDatasetAPI(username) {
  return serverAxios({
    url: `/v1/users/${username}/default`,
  });
}

function createPersonalDatasetAPI(username) {
  return serverAxios({
    url: `/v1/users/${username}/default`,
    method: 'POST',
  });
}

function traverseFoldersContainersAPI(containerId) {
  return serverAxios({
    url: `/v1/files/folders`,
    params: { container_id: containerId, trash_can: true },
  });
}

async function listUsersContainersPermission(username, data) {
  const res = await serverAxios({
    url: `/v1/users/${username}/containers`,
    method: 'POST',
    data,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
  if (res.data.results && res.data.results.length) {
    res.data.results = res.data.results.map((v) => {
      v.globalEntityId = v.id;
      return v;
    });
  }
  return res;
}

function updateDatasetInfoAPI(projectGeid, data) {
  return serverAxios({
    url: `/v1/containers/${projectGeid}`,
    method: 'PUT',
    data,
  });
}

function updateDatasetIcon(projectGeid, base64Img) {
  if (base64Img && base64Img.split(',').length > 1)
    return serverAxios({
      url: `/v1/containers/${projectGeid}`,
      method: 'PUT',
      data: {
        icon: base64Img.split(',')[1],
      },
    });
}

function updateVirtualFolder(
  projectGeid,
  username,
  projectCode,
  collectionList,
) {
  return serverAxios({
    url: `/v1/project/${projectGeid}/collections`,
    method: 'PUT',
    data: {
      owner: username,
      container_code: projectCode,
      collections: collectionList,
    },
  });
}

async function listAllVirtualFolder(projectCode, username) {
  const res = await serverAxios({
    url: `/v1/collections?project_code=${projectCode}&owner=${username}`,
    method: 'GET',
  });
  return res;
}

async function listVirtualFolderFiles(collection_geid, pageSize = 10) {
  const res = await serverAxios({
    url: `/v1/collections/${collection_geid}/files?page=0&page_size=${pageSize}&order_by=time_created&order_type=desc`,
    method: 'GET',
  });
  return res;
}

function createVirtualFolder(projectCode, collectionName, username) {
  return serverAxios({
    url: `/v1/collections`,
    method: 'POST',
    data: {
      project_code: projectCode,
      name: collectionName,
      username: username,
    },
  });
}

function deleteVirtualFolder(collectionGeid) {
  return serverAxios({
    url: `/v1/collections/${collectionGeid}`,
    method: 'DELETE',
  });
}

async function getProjectManifestList(projectCode) {
  const res = await serverAxios({
    url: `/v1/data/manifests?project_code=${projectCode}`,
    method: 'GET',
  });
  res.data.result = res.data.result.map((v) => {
    v.globalEntityId = v.id;
    v.attributes = v.attributes.map((attr) => {
      if (attr.type === 'multiple_choice') {
        attr.value = attr.options ? attr.options.join(',') : [];
      }
      return attr;
    });
    return v;
  });
  return res;
}

function getManifestById(manifestId) {
  return serverAxios({
    url: `/v1/data/manifest/${manifestId}`,
  });
}

function updateFileManifestAPI(geid, attributes) {
  return serverAxios({
    url: `/v1/file/${geid}/manifest`,
    method: 'PUT',
    data: {
      ...attributes,
    },
  });
}

function addNewManifest(name, projectCode, attributes) {
  return serverAxios({
    url: `/v1/data/manifests`,
    method: 'POST',
    data: {
      name: name,
      project_code: projectCode,
      attributes,
    },
  });
}
function updateManifest(manifestId, name, projectCode) {
  return serverAxios({
    url: `/v1/data/manifest/${manifestId}`,
    method: 'PUT',
    data: {
      name: name,
      project_code: projectCode,
    },
  });
}
function deleteManifest(manifestId) {
  return serverAxios({
    url: `/v1/data/manifest/${manifestId}`,
    method: 'DELETE',
  });
}

function addNewAttrToManifest(manifestId, name, projectCode, attributes) {
  return serverAxios({
    url: `/v1/data/manifest/${manifestId}`,
    method: 'PUT',
    data: {
      name: name,
      project_code: projectCode,
      attributes: attributes,
    },
  });
}

function attachManifest(projectCode, manifestId, geids, attributes) {
  return serverAxios({
    url: `/v1/file/attributes/attach`,
    method: 'POST',
    data: {
      project_code: projectCode,
      manifest_id: manifestId,
      item_ids: geids,
      attributes: attributes,
      inherit: true,
    },
  });
}

function getProjectInfoAPI(projectGeid) {
  return serverAxios({
    url: `/v1/project/${projectGeid}`,
    method: 'GET',
  });
}

function getDatasetByCode(projectCode) {
  return serverAxios({
    url: '/v1/project/code/' + projectCode,
  });
}

function importManifestAPI(manifest) {
  return serverAxios({
    url: '/v1/import/manifest',
    data: manifest,
    method: 'POST',
  });
}

function getAnnouncementApi({
  projectCode,
  startDate,
  endDate,
  page,
  pageSize,
  order,
}) {
  const params = {
    page: page ? page + 1 : 1,
    page_size: pageSize,
    sort_by: 'created_at',
    sort_order: order || 'desc',
  };
  if (startDate) {
    params['created_at_start'] = startDate;
  }
  if (endDate) {
    params['created_at_end'] = endDate;
  }
  return serverAxios({
    url: `/v1/project/${projectCode}/announcements/`,
    params,
  });
}

function addAnnouncementApi({ projectCode, content }) {
  return serverAxios({
    method: 'post',
    url: `/v1/project/${projectCode}/announcements/`,
    data: {
      message: content,
    },
  });
}

function getUserAnnouncementApi(username) {
  return serverAxios({
    url: `/v1/users/${username}`,
  });
}

function putUserAnnouncementApi(username, projectCode, announcementId) {
  return serverAxios({
    method: 'put',
    url: `/v1/users/${username}`,
    data: { [`announcement_${projectCode}`]: announcementId },
  });
}

function getAuditLogsApi(projectGeid, paginationParams, query) {
  if (query['activity_type'] === 'all') {
    delete query['activity_type'];
  }
  return serverAxios({
    method: 'get',
    url: `/v1/project/activity-logs/${projectGeid}`,
    params: {
      ...paginationParams,
      ...query,
    },
  });
}

async function getWorkbenchInfo(projectGeid) {
  const res = serverAxios({
    method: 'get',
    url: `/v1/${projectGeid}/workbench`,
  });
  return res;
}

function deployWorkbenchAPI(projectGeid, workbench) {
  return serverAxios({
    method: 'post',
    url: `/v1/${projectGeid}/workbench`,
    data: {
      workbench_resource: workbench,
    },
  });
}

function createDatasetFolderAPI(datasetGeid, folderName) {
  return serverAxios({
    method: 'POST',
    url: `/v1/dataset/${datasetGeid}/folder`,
    data: { folder_name: folderName },
  });
}

function createSubFolderApi(
  folderName,
  parentPath,
  projectCode,
  uploader,
  zone,
  projectGeid,
) {
  return serverAxios({
    url: `/v1/containers/${projectGeid}/folder`,
    method: 'POST',
    data: {
      folder_name: folderName,
      parent_path: parentPath,
      project_code: projectCode,
      zone: _.lowerCase(zone),
    },
  });
}

function requestToCoreAPI(
  projectCode,
  entityId,
  destinationId,
  sourceId,
  sourcePath,
  destinationPath,
  requestNote,
  userName,
) {
  return serverAxios({
    url: `/v1/request/copy/${projectCode}`,
    method: 'POST',
    data: {
      entity_ids: entityId,
      destination_id: destinationId,
      source_id: sourceId,
      source_path: sourcePath,
      destination_path: destinationPath,
      note: requestNote,
      submitted_by: userName,
    },
  });
}

function addToDatasetsAPI(datasetGeid, payLoad, sessionId) {
  return serverAxios({
    url: `/v1/dataset/${datasetGeid}/files`,
    method: 'PUT',
    headers: {
      'Refresh-token': keycloak.refreshToken,
      'Session-ID': sessionId,
    },
    data: payLoad,
  });
}

async function getDatasetsListingAPI(params) {
  const res = await serverAxios({
    url: `/v1/datasets/`,
    method: 'GET',
    params: params,
  });
  if (res.data.result && res.data.result.length) {
    res.data.result = res.data.result.map((v) => {
      v.globalEntityId = v.id;
      return v;
    });
  }
  return res;
}

function listAllCopyRequests(projectCode, status, pageNo, pageSize) {
  return serverAxios({
    url: `/v1/request/copy/${projectCode}`,
    method: 'get',
    params: {
      status: status,
      page: pageNo,
      page_size: pageSize,
    },
  });
}

function requestPendingFilesAPI(projectCode, requestId) {
  return serverAxios({
    url: `/v1/request/copy/${projectCode}/pending-files`,
    method: 'GET',
    params: {
      request_id: requestId,
    },
  });
}

function requestCompleteAPI(projectCode, requestId, status, reviewNotes) {
  return serverAxios({
    url: `/v1/request/copy/${projectCode}`,
    method: 'PUT',
    data: {
      request_id: requestId,
      status,
      review_notes: reviewNotes,
    },
  });
}

function testWorkbenchDeploy(projectCode, workbench) {
  let url = '';
  if (workbench === 'Superset') {
    if (SUPERSET_SUBDOMAIN === 'true') {
      url = `https://${projectCode}-superset.${SUPERSET_SUBDOMAIN_BASE}`;
    } else {
      url = `/bi/${projectCode}/superset/welcome`;
    }
  }
  if (workbench === 'Guacamole') {
    url = `/workbench/${projectCode}/guacamole/`;
  }
  if (workbench === 'Jupyterhub') {
    url = `/workbench/${projectCode}/j/`;
  }
  return Axios.get(url);
}

async function getRolesAndPermissions({ projectCode, pageSize = 10 }) {
  const res = await serverAxiosNoIntercept({
    url: `/v1/permissions/metadata`,
    method: 'GET',
    params: {
      project_code: projectCode,
      page_size: pageSize,
      order_by: 'name',
      order_type: 'desc',
    },
  });
  res.data.result = res.data.result.filter(
    (v) => v.category === 'Data Operation Permissions',
  );
  return res;
}

export {
  getProjectStatistics,
  getProjectFileSize,
  getProjectActivity,
  searchProjectFilesAPI,
  getUserProjectActivitiesAPI,
  getDatasetsAPI,
  createProjectAPI,
  queryDatasetAPI,
  getTagsAPI,
  getMetadatasAPI,
  changeUserRoleInDatasetAPI,
  broadcastChangeRole,
  addUserToProjectAPI,
  addUserToStartingProjectAPI,
  checkUserStartingProjectAPI,
  broadcastAddUser,
  getChildrenAPI,
  getPersonalDatasetAPI,
  createPersonalDatasetAPI,
  traverseFoldersContainersAPI,
  broadcastRemoveUser,
  removeUserFromDatasetApi,
  updateDatasetInfoAPI,
  updateDatasetIcon,
  getSystemTagsAPI,
  createVirtualFolder,
  listAllVirtualFolder,
  listVirtualFolderFiles,
  updateVirtualFolder,
  deleteVirtualFolder,
  listUsersContainersPermission,
  getProjectInfoAPI,
  getDatasetByCode,
  getProjectManifestList,
  addNewManifest,
  addNewAttrToManifest,
  deleteManifest,
  updateManifest,
  attachManifest,
  importManifestAPI,
  getManifestById,
  addAnnouncementApi,
  getAuditLogsApi,
  updateFileManifestAPI,
  getAnnouncementApi,
  getUserAnnouncementApi,
  putUserAnnouncementApi,
  getWorkbenchInfo,
  deployWorkbenchAPI,
  createSubFolderApi,
  addToDatasetsAPI,
  getDatasetsListingAPI,
  requestToCoreAPI,
  listAllCopyRequests,
  requestPendingFilesAPI,
  requestCompleteAPI,
  createDatasetFolderAPI,
  testWorkbenchDeploy,
  getRolesAndPermissions,
};
