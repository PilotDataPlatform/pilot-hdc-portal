/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { serverAxios, serverAxiosNoIntercept } from './config';
import { keycloak } from '../Service/keycloak';
import _ from 'lodash';
import { API_PATH, DOWNLOAD_PREFIX_V2, DOWNLOAD_PREFIX_V1 } from '../config';

export function createDatasetApi(
  creator,
  title,
  code,
  authors,
  type = 'GENERAL',
  modality,
  collectionMethod,
  license,
  tags,
  description,
) {
  return serverAxios({
    url: '/v1/datasets/',
    method: 'post',
    headers: { 'Refresh-token': keycloak.refreshToken },
    data: {
      creator,
      title,
      code,
      authors,
      type,
      modality,
      collection_method: collectionMethod,
      license,
      tags,
      description,
    },
  });
}

export async function listDatasetFiles(datasetGeid, folderGeid, query) {
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
  const params = {
    folder_id: folderGeid,
    query: query,
  };
  const res = await serverAxios({
    url: `/v1/dataset/${datasetGeid}/files`,
    params: params,
  });
  const objFormatted = res.data?.result?.data.map((item) => {
    let formatRes = {
      globalEntityId: item.id,
      datasetCode: item.containerCode,
      archived: item.archived,
      timeCreated: item.createdTime,
      timeLastmodified: item.lastUpdatedTime,
      labels: generateLabels(item),
      displayPath: item.parentPath,
      name: item.name,
      fileSize: item.size,
      operator: item.owner,
      location: item.storage.locationUri,
    };
    return formatRes;
  });
  res.data.result.data = objFormatted;
  return res;
}

const mapBasicInfo = (result) => {
  const {
    createdAt,
    creator,
    title,
    authors,
    type,
    modality,
    collectionMethod,
    license,
    code,
    projectId = '',
    size,
    totalFiles,
    description,
    id,
    tags,
  } = result;

  const basicInfo = {
    timeCreated: createdAt,
    creator,
    title,
    authors,
    type,
    modality,
    collectionMethod,
    license,
    code,
    projectGeid: projectId,
    size,
    totalFiles,
    description,
    geid: id,
    tags: tags,
  };

  return basicInfo;
};

export function getDatasetByDatasetCode(datasetCode) {
  return serverAxios({
    url: `/v1/datasets/${datasetCode}`,
  }).then((res) => {
    _.set(res, 'data', mapBasicInfo(res.data));
    return res;
  });
}

export function deleteDatasetFiles(datasetGeid, geids, operator, sessionId) {
  return serverAxios({
    url: `/v1/dataset/${datasetGeid}/files`,
    method: 'DELETE',
    headers: {
      'Refresh-token': keycloak.refreshToken,
      'Session-ID': sessionId,
    },
    data: {
      source_list: geids,
      operator: operator,
    },
  });
}

export function moveDatasetFiles(
  datasetGeid,
  sourceGeids,
  targetGeid,
  operator,
  sessionId,
) {
  return serverAxios({
    url: `/v1/dataset/${datasetGeid}/files`,
    method: 'POST',
    headers: {
      'Refresh-token': keycloak.refreshToken,
      'Session-ID': sessionId,
    },
    data: {
      source_list: sourceGeids,
      target_geid: targetGeid,
      operator: operator,
    },
  });
}

export function getDatasetActivityLogsAPI(datasetCode, params) {
  return serverAxios({
    url: `v1/activity-logs/${datasetCode}`,
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function downloadDataset(datasetCode, operator, sessionId) {
  return serverAxios({
    url: `/v2/dataset/download/pre`,
    method: 'POST',
    headers: {
      'Refresh-token': keycloak.refreshToken,
      'Session-ID': `${sessionId}`,
    },
    data: {
      dataset_code: datasetCode,
      operator: operator,
    },
  });
}

export function checkDatasetDownloadStatusAPI(hashCode) {
  return serverAxios({
    url: `${DOWNLOAD_PREFIX_V1}/status/${hashCode}`,
    method: 'GET',
  });
}
export function downloadDatasetFiles(datasetCode, files, operator, sessionId) {
  const options = {
    url: `/v2/download/pre`,
    method: 'post',
    headers: {
      'Refresh-token': keycloak.refreshToken,
      'Session-ID': `${sessionId}`,
    },
    data: {
      files,
      container_type: 'dataset',
      container_code: datasetCode,
      operator: operator,
    },
  };
  return serverAxios(options);
}

export function previewDatasetFile(datasetGeid, fileGeid) {
  return serverAxios({
    url: `/v1/${fileGeid}/preview/`,
    headers: { 'Refresh-token': keycloak.refreshToken },
    method: 'GET',
    params: {
      dataset_geid: datasetGeid,
    },
  });
}

export function previewDatasetFileStream(datasetGeid, fileGeid) {
  return serverAxios({
    url: `/v1/${fileGeid}/preview/stream`,
    method: 'GET',
    params: {
      dataset_geid: datasetGeid,
    },
  });
}

export function getFileOperationsApi(action, datasetGeid, sessionId, operator) {
  return serverAxios({
    url: `/v1/dataset/${datasetGeid}/file/tasks`,
    params: {
      action: `dataset_file_${action}`,
      session_id: sessionId,
      operator,
    },
  });
}

export function getDatasetVersionsAPI(datasetGeid, params) {
  return serverAxios({
    url: `/v1/dataset/${datasetGeid}/versions`,
    method: 'GET',
    params,
  });
}

export function publishNewVersionAPI(datasetGeid, operator, notes, version) {
  return serverAxios({
    url: `/v1/dataset/${datasetGeid}/publish`,
    method: 'POST',
    data: {
      operator,
      notes,
      version,
    },
  });
}

export function datasetDownloadReturnURLAPI(datasetGeid, version) {
  return serverAxios({
    url: `/v1/dataset/${datasetGeid}/download/pre`,
    method: 'GET',
    params: {
      version,
    },
  });
}

export function checkPublishStatusAPI(datasetGeid, statusId) {
  return serverAxios({
    url: `/v1/dataset/${datasetGeid}/publish/status`,
    method: 'GET',
    params: {
      status_id: statusId,
    },
  });
}

export function renameFileApi(
  datasetGeid,
  fileGeid,
  newName,
  operator,
  sessionId,
) {
  return serverAxios({
    url: `/v1/dataset/${datasetGeid}/files/${fileGeid}`,
    method: 'post',
    data: { new_name: newName, operator },
    headers: {
      'Refresh-token': keycloak.refreshToken,
      'Session-ID': sessionId,
    },
  });
}

export function getDefaultSchemaTPLDetail(tplGeid) {
  return serverAxiosNoIntercept({
    url: `/v1/dataset/schemaTPL/default/${tplGeid}`,
    method: 'GET',
  });
}

export function getCustomSchemaTPLDetail(datasetGeid, tplGeid) {
  return serverAxiosNoIntercept({
    url: `/v1/dataset/${datasetGeid}/schemaTPL/${tplGeid}`,
    method: 'GET',
  });
}

export function getSchemaDataDetail(datasetGeid, schemaDataGeid) {
  return serverAxiosNoIntercept({
    url: `/v1/dataset/${datasetGeid}/schema/${schemaDataGeid}`,
    method: 'GET',
  });
}

export function createSchemaData(
  datasetGeid,
  systemDefined,
  standard,
  schemaName,
  content,
  tplGeid,
  creator,
  isDraft,
) {
  return serverAxios({
    url: `/v1/dataset/${datasetGeid}/schema`,
    method: 'post',
    data: {
      name: schemaName,
      dataset_geid: datasetGeid,
      tpl_geid: tplGeid,
      standard: standard,
      system_defined: systemDefined,
      is_draft: isDraft,
      content: content,
      creator: creator,
      activity: [
        {
          action: 'CREATE',
          resource: 'Schema',
          detail: {
            name: schemaName,
          },
        },
      ],
    },
  });
}
export function deleteDatasetSchemaData(datasetGeid, schemaGeid, schemaName) {
  return serverAxios({
    url: `/v1/dataset/${datasetGeid}/schema/${schemaGeid}`,
    method: 'DELETE',
    data: {
      activity: [
        {
          action: 'REMOVE',
          resource: 'Schema',
          detail: {
            name: schemaName,
          },
        },
      ],
    },
  });
}
export function getDatasetSchemaListAPI(datasetGeid) {
  return serverAxios({
    url: `/v1/dataset/${datasetGeid}/schema/list`,
    method: 'post',
    data: {},
  });
}
export function getKGMetaListAPI(ids) {
  return serverAxios({
    url: `/v1/kg/metadata`,
    method: 'post',
    data: {
      metadata: ids,
    },
  });
}

export function getDatasetDefaultSchemaTemplateListAPI() {
  return serverAxios({
    url: `/v1/dataset/schemaTPL/list`,
    method: 'post',
    data: {},
  });
}
export function getDatasetCustomSchemaTemplateListAPI(datasetGeid) {
  return serverAxios({
    url: `/v1/dataset/${datasetGeid}/schemaTPL/list`,
    method: 'post',
    data: {},
  });
}
export function createDatasetSchemaTPL(
  datasetGeid,
  tplName,
  tplContent,
  creator,
) {
  return serverAxios({
    url: `/v1/dataset/${datasetGeid}/schemaTPL`,
    method: 'post',
    data: {
      name: tplName,
      dataset_geid: datasetGeid,
      standard: 'default',
      system_defined: false,
      is_draft: false,
      content: tplContent,
      creator: creator,
      activity: [
        {
          action: 'ADD',
          resource: 'Dataset.Schema.Template',
          detail: {
            name: tplName,
          },
        },
      ],
    },
  });
}

export function updateDatasetSchemaDataApi(
  datasetGeid,
  schemaGeid,
  schemaName,
  isDraft,
  content,
  activity,
) {
  return serverAxios({
    url: `/v1/dataset/${datasetGeid}/schema/${schemaGeid}`,
    method: 'PUT',
    data: {
      name: schemaName,
      dataset_geid: datasetGeid,
      is_draft: isDraft,
      content,
      activity,
    },
  });
}

export function preValidateBids(datasetCode) {
  return serverAxios({
    url: '/v1/dataset/bids-validate',
    method: 'POST',
    headers: { 'Refresh-token': keycloak.refreshToken },
    data: {
      dataset_code: datasetCode,
    },
  });
}

export function getBidsResult(datasetCode) {
  return serverAxios({
    url: `/v1/dataset/bids-validate/${datasetCode}`,
  });
}

export function createKGSpace(datasetCode) {
  return serverAxios({
    url: `/v1/kg/spaces/create/dataset/${datasetCode}`,
    method: 'POST',
    timeout: 5 * 60 * 1000,
  });
}

export function getKGSpace(spaceName) {
  return serverAxios({
    url: `/v1/kg/spaces/${spaceName}`,
  });
}

export function transferMetaToKG(space, metadataId, jsonBody) {
  return serverAxios({
    url: `/v1/kg/metadata/update/${metadataId}?space=${space}&metadata_id=${metadataId}`,
    method: 'PUT',
    data: jsonBody,
  });
}
