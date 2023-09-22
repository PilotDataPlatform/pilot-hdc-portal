/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */

import {
  serverAxiosNoIntercept,
  serverAxios as axios,
  axios as Axios,
  uploadAxios,
  serverAxios,
  downloadGRAxios,
} from './config';
import { JOB_STATUS } from '../Components/Layout/FilePanel/jobStatus';
import { objectKeysToSnakeCase, checkGreenAndCore } from '../Utility';
import _ from 'lodash';
import { keycloak } from '../Service/keycloak';
import { API_PATH, DOWNLOAD_GR, DOWNLOAD_CORE } from '../config';

function uploadFileApi2(postedUrl, content, sessionId) {
  return Axios({
    url: postedUrl,
    method: 'PUT',
    data: content,
    timeout: 30 * 1000,
    headers: {
      'Session-ID': sessionId,
      'Content-Type': 'application/octet-stream',
    },
  });
}

async function getChunckPreSigned(data, sessionId, projectCode) {
  data['bucket'] = 'gr-' + projectCode;
  const res = await uploadAxios({
    url: `/v1/files/chunks/presigned`,
    method: 'GET',
    headers: {
      'Session-ID': `${sessionId}`,
    },
    params: data,
  });

  return res;
}

function preUploadApi(data, sessionId) {
  return axios({
    url: `/v1/project/${data.project_code}/files`,
    method: 'POST',
    data,
    timeout: 10 * 60 * 1000,
    headers: {
      'Session-ID': sessionId,
    },
  });
}

function combineChunksApi(data, sessionId) {
  return uploadAxios({
    url: `/v1/files`,
    method: 'POST',
    data,
    headers: {
      'Session-ID': sessionId,
      'Refresh-token': keycloak.refreshToken,
    },
  });
}

function deleteUploadStatus(containerId, sessionId) {
  return axios({
    url: `/v1/upload/containers/${containerId}/upload-state`,
    method: 'DELETE',
    headers: {
      'Session-ID': sessionId,
    },
  });
}

async function checkDownloadStatus(sessionId, projectCode, operator) {
  const res = await axios({
    url: `/v1/files/actions/tasks?action=data_download`,
    method: 'GET',
    headers: {
      'Session-ID': `${sessionId}`,
    },
    params: {
      project_code: projectCode,
      operator,
      session_id: sessionId,
    },
  });
  res.data.result = res.data.taskInfo;
  res.data.code = res.status;
  return res;
}

function deleteDownloadStatus(sessionId) {
  return downloadGRAxios({
    url: `/v1/download/status`,
    method: 'DELETE',
    headers: {
      'Session-ID': `${sessionId}`,
    },
  });
}

function deleteFileActionStatus(projectCode, sessionId) {
  return axios({
    url: `/v1/files/actions/tasks`,
    method: 'DELETE',
    data: {
      project_code: projectCode,
      session_id: sessionId,
    },
  });
}

function getFilesAPI(datasetId) {
  return axios({
    url: `/v1/${datasetId}/files`,
    method: 'GET',
  });
}

function getFileManifestAttrs(geidsList, lineageView = false) {
  return serverAxiosNoIntercept({
    url: `/v1/file/manifest/query`,
    method: 'POST',
    data: {
      geid_list: geidsList,
      lineage_view: lineageView,
    },
  });
}

async function getRequestFiles(
  requestGeid,
  page,
  pageSize,
  orderBy,
  orderType,
  filters,
  partial,
  projectCode,
  parentId,
) {
  const params = {
    page,
    page_size: pageSize,
    order_by: orderBy,
    order_type: orderType,
    partial,
    query: _.omit(filters, ['tags']),
    request_id: requestGeid,
  };
  if (parentId) {
    params.parent_id = parentId;
  }
  let res;
  res = await axios({
    url: `/v1/request/copy/${projectCode}/files`,
    params: objectKeysToSnakeCase(params),
  });
  res.data.result.entities = res.data.result.data.map((item) => {
    res.data.result.approximateCount = res.data.total;
    let formatRes = {
      geid: item.entityId,
      key: item.entityId,
      createTime: item.uploadedAt,
      nodeLabel:
        item.entityType === 'folder'
          ? ['Greenroom', 'Folder']
          : ['Greenroom', 'File'],
      displayPath: item.displayPath,
      name: item.name,
      fileSize: item.fileSize,
      owner: item.uploadedBy,
      path: item.path,
      location: item.location,
      folderRelativePath: item.folderRelativePath,
      tags: [],
      reviewedAt: item.reviewedAt,
      reviewedBy: item.reviewedBy,
      reviewStatus: item.reviewStatus,
    };
    return formatRes;
  });
  res.data.result.routing = res.data.result.routing.map((item, ind) => {
    let formatRes = {
      name: item.name,
      labels:
        item.entityType === 'folder'
          ? ['Greenroom', 'Folder']
          : ['Greenroom', 'File'],
      globalEntityId: item.entityGeid,
      folderLevel: res.data.result.routing.length - ind,
    };
    return formatRes;
  });
  return res;
}

async function getRequestFilesDetailByGeid(geids) {
  return axios({
    url: `/v1/files/bulk/detail`,
    method: 'POST',
    data: {
      ids: geids,
    },
  });
}

async function getProjectFiles(
  parentPath,
  parentId,
  page,
  pageSize,
  orderBy,
  orderType,
  filters,
  zone,
  sourceType,
  partial,
  panelKey,
  projectCode,
) {
  const archived = panelKey.toLowerCase().includes('trash') ? true : false;
  filters['archived'] = archived;
  if (archived && orderBy === 'created_time') {
    orderBy = 'last_updated_time';
  }
  filters = _.omit(filters, ['tags']);
  let url = `/v1/files/meta`;
  const params = {
    page,
    page_size: pageSize,
    order_by: orderBy,
    order_type: orderType,
    zone: zone.toLowerCase(),
    project_code: projectCode,
    parent_path: parentPath,
    source_type: sourceType,
    ...filters,
  };
  if (parentId) {
    params['parent_id'] = parentId;
  }
  let res;
  res = await axios({
    url,
    params: objectKeysToSnakeCase(params),
  });

  function generateLabels(item) {
    const labels = [];
    if (item.zone === 'greenroom') {
      labels.push('Greenroom');
    }
    if (item.zone === 'core') {
      labels.push('Core');
    }
    if (item.archived) {
      labels.push('TrashFile');
    }
    if (item.type === 'folder' || item.type === 'name_folder') {
      labels.push('Folder');
    } else {
      labels.push('File');
    }
    return labels;
  }
  const objFormatted = {
    entities: res.data.result,
    approximateCount: res.data.total,
  };
  let parentPath4Routing = parentPath;
  let parentId4Routing;
  let parentZone = objFormatted.entities[0] && objFormatted.entities[0].zone;
  let pathIdMap = sessionStorage.getItem('pathIdMap')
    ? JSON.parse(sessionStorage.getItem('pathIdMap'))
    : {};
  objFormatted.entities = objFormatted.entities.map((item) => {
    parentId4Routing = item.parent;
    const identifier = item.parentPath
      ? `${zone}/${item.parentPath}/${item.name}`
      : `${zone}/${item.name}`;
    if (!pathIdMap[identifier]) {
      pathIdMap[identifier] = item.id;
    }
    const tags =
      item.extended.extra &&
      item.extended.extra.tags &&
      item.extended.extra.tags.length
        ? item.extended.extra.tags
        : [];
    const systemTags =
      item.extended.extra &&
      item.extended.extra.systemTags &&
      item.extended.extra.systemTags.length
        ? item.extended.extra.systemTags
        : [];
    let formatRes = {
      guid: item.id,
      geid: item.id,
      archived: item.archived,
      attributes: {
        createTime: item.createdTime,
        lastUpdatedTime: item.lastUpdatedTime,
        nodeLabel: generateLabels(item),
        displayPath: item.parentPath,
        fileName: item.name,
        fileSize: item.size,
        owner: item.owner,
        location: item.storage.locationUri,
        favourite: item.favourite,
      },
      labels: tags.length || systemTags.length ? tags.concat(systemTags) : [],
    };
    return formatRes;
  });
  sessionStorage.setItem('pathIdMap', JSON.stringify(pathIdMap));
  res.data.result = objFormatted;

  const routingArr = parentPath4Routing ? parentPath4Routing.split('/') : [];
  const routingFormated = [];
  for (let i = 0; i < routingArr.length; i++) {
    routingFormated.push({
      folderLevel: i,
      name: routingArr[i],
      displayPath: routingFormated.map((v) => v.name).join('/'),
      labels: parentZone ? [_.capitalize(parentZone)] : [],
    });
  }
  res.data.result.routing = routingFormated;
  if (routingFormated && routingFormated.length) {
    let lastNavItem = res.data.result.routing[routingFormated.length - 1];
    if (parentId4Routing) {
      lastNavItem.globalEntityId = parentId4Routing;
    } else {
      const pathIdentifier = lastNavItem.displayPath
        ? `${zone}/${lastNavItem.displayPath}/${lastNavItem.name}`
        : `${zone}/${lastNavItem.name}`;
      lastNavItem.globalEntityId = pathIdMap[pathIdentifier];
    }
  }
  return res;
}

async function getAllProjectFiles({
  page,
  pageSize,
  orderBy = 'created_time',
  orderType = 'desc',
  zone,
  projectCode,
  parentPath,
  sourceType = 'folder',
  archived = false,
}) {
  const params = {
    page,
    page_size: pageSize,
    order_by: orderBy,
    order_type: orderType,
    zone,
    project_code: projectCode,
    parent_path: parentPath,
    source_type: sourceType,
    archived,
  };
  const url = `/v1/files/meta`;

  return await axios({
    url,
    params: objectKeysToSnakeCase(params),
  });
}

function generateDownloadLinkAPI(
  taskId,
  hashCode,
  namespace,
  updateDownloadItemDispatch,
  setSuccessNumDispatcher,
  successNum,
) {
  return downloadGRAxios({
    url: `/v1/download/status/${hashCode}`,
    method: 'GET',
  })
    .then((res) => {
      const result = res.data.result;
      const namespaceUrl =
        namespace.toLowerCase() === 'greenroom' ? 'gr' : 'core';

      let url;
      if (namespaceUrl === 'gr') {
        url = DOWNLOAD_GR + `/v1/download/${hashCode}`;
      }
      if (namespaceUrl === 'core') {
        url = DOWNLOAD_CORE + `/v1/download/${hashCode}`;
      }

      if (result.status === JOB_STATUS.SUCCEED) {
        window.open(url, '_blank');

        setSuccessNumDispatcher(successNum + 1);
        updateDownloadItemDispatch({
          ...result,
          status: JOB_STATUS.SUCCEED,
        });
      } else {
        updateDownloadItemDispatch({ ...result });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

async function downloadFilesAPI(
  containerId,
  files,
  projectCode,
  operator,
  namespace,
  requestId,
  sessionId,
  dispatch,
) {
  const fileIds = files.map((file) => ({ id: file.id }));
  const fileNames = files.map((file) => file.fileName);

  const options = {
    url: `/v2/download/pre`,
    method: 'post',
    headers: {
      'Refresh-token': keycloak.refreshToken,
      'Session-Id': `${sessionId}`,
    },
    data: {
      files: fileIds,
      container_type: 'project',
      container_code: projectCode,
      operator: operator,
    },
  };
  if (requestId) {
    options.data['approval_request_id'] = requestId;
  }

  axios(options).then((res) => {
    const result = res.data.result;

    let item = {
      actionType: 'data_download',
      jobId: result.jobId,
      sessionId,
      projectCode: result.containerCode,
      status: result.status,
      targetNames: fileNames,
      projectId: containerId,
      namespace,
      payload: result.payload,
      createdTime: Date.now(),
    };

    dispatch.appendDownloadListCreator(item);
    dispatch.setDownloadCommitting(true);
  });
}

function checkPendingStatusAPI(containerId, taskId) {
  return axios({
    url: `/v1/upload/containers/${containerId}/status`,
    method: 'GET',
    params: objectKeysToSnakeCase({
      taskId,
    }),
  });
}

function updateProjectTagsAPI(geid, data) {
  return axios({
    url: `/v2/${geid}/tags`,
    method: 'POST',
    data,
  });
}

function batchTagsAPI(data) {
  return axios({
    url: '/v2/entity/tags',
    method: 'POST',
    data,
  });
}

function deleteProjectTagsAPI(containerId, params) {
  return axios({
    url: `/v2/files/containers/${containerId}/files/tags`,
    method: 'DELETE',
    data: params,
  });
}

function fileLineageAPI(key, typeName, direction) {
  return axios({
    url: `/v1/lineage`,
    method: 'GET',
    params: { item_id: key, direction, type_name: typeName },
  });
}

function addToVirtualFolder(collectionGeid, geids) {
  return axios({
    url: `/v1/collections/${collectionGeid}/files`,
    method: 'POST',
    data: {
      item_ids: geids,
    },
  });
}

function removeFromVirtualFolder(collectionGeid, geids) {
  return axios({
    url: `/v1/collections/${collectionGeid}/files`,
    method: 'DELETE',
    data: {
      item_ids: geids,
    },
  });
}

function getZipContentAPI(fileGeid, projectGeid) {
  return serverAxiosNoIntercept({
    url: '/v1/archive',
    params: {
      project_geid: projectGeid,
      file_id: fileGeid,
    },
  });
}

function deleteFileAPI(data) {
  return axios({
    url: '/v1/files/actions',
    method: 'DELETE',
    headers: { 'Refresh-token': keycloak.refreshToken },
    data,
  });
}

function validateRepeatFiles(
  targets,
  destination,
  operator,
  operation,
  projectGeid,
  sessionId,
) {
  let payload = {
    targets,
  };
  if (destination) {
    payload.destination = destination;
  }
  return axios({
    url: `/v1/files/repeatcheck`,
    method: 'POST',
    headers: {
      'Session-ID': sessionId,
    },
    data: {
      payload,
      operator,
      operation,
      project_geid: projectGeid,
      session_id: sessionId,
    },
  });
}

function commitFileAction(
  payload,
  operator,
  operation,
  projectCode,
  sessionId,
) {
  return axios({
    url: `/v1/files/actions`,
    method: 'POST',
    headers: {
      'Session-ID': sessionId,
      'Refresh-token': keycloak.refreshToken,
    },

    data: {
      payload,
      operator,
      operation,
      project_code: projectCode,
      session_id: sessionId,
    },
  });
}
function reviewAllRequestFiles(
  projectCode,
  requestId,
  reviewStatus,
  sessionId,
) {
  return axios({
    url: `/v1/request/copy/${projectCode}/files`,
    method: 'PUT',
    headers: {
      'Session-ID': sessionId,
    },
    data: {
      request_id: requestId,
      review_status: reviewStatus,
      session_id: sessionId,
    },
  });
}
function reviewSelectedRequestFiles(
  projectCode,
  requestId,
  geids,
  reviewStatus,
  sessionId,
  source,
) {
  return axios({
    url: `/v1/request/copy/${projectCode}/files`,
    method: 'PATCH',
    headers: {
      'Session-ID': sessionId,
    },
    data: {
      request_id: requestId,
      entity_ids: geids,
      review_status: reviewStatus,
      session_id: sessionId,
      source,
    },
  });
}

async function getResumableJobs(projectCode) {
  const resBasics = await axios({
    url: `/v1/project/${projectCode}/files/resumable`,
    method: 'GET',
  });
  const objectInfos = resBasics.data.result
    .sort((a, b) => {
      return new Date(b.createdTime) - new Date(a.createdTime);
    })
    .map((v) => {
      return {
        resumable_id: v.storage?.uploadId,
        object_path: `${v.parentPath}/${v.name}`,
        item_id: v.id,
      };
    })
    .filter((v) => v.resumable_id);
  if (objectInfos.length) {
    const resJobs = await axios({
      url: `/v1/project/${projectCode}/files/resumable`,
      method: 'POST',
      data: {
        object_infos: objectInfos,
      },
    });
    resJobs.data.result = resJobs.data.result.map((job) => {
      const curJob = resBasics.data.result.find(
        (v) => v.storage?.uploadId === job.resumableId,
      );
      return {
        ...job,
        itemId: curJob.id,
      };
    });
    return resJobs;
  } else {
    return null;
  }
}
export {
  getFilesAPI,
  downloadFilesAPI,
  generateDownloadLinkAPI,
  checkPendingStatusAPI,
  preUploadApi,
  uploadFileApi2,
  getChunckPreSigned,
  combineChunksApi,
  deleteUploadStatus,
  updateProjectTagsAPI,
  batchTagsAPI,
  deleteProjectTagsAPI,
  fileLineageAPI,
  checkDownloadStatus,
  deleteDownloadStatus,
  addToVirtualFolder,
  removeFromVirtualFolder,
  getZipContentAPI,
  deleteFileAPI,
  getFileManifestAttrs,
  getProjectFiles,
  getAllProjectFiles,
  getRequestFiles,
  validateRepeatFiles,
  commitFileAction,
  reviewSelectedRequestFiles,
  reviewAllRequestFiles,
  getRequestFilesDetailByGeid,
  deleteFileActionStatus,
  getResumableJobs,
};
