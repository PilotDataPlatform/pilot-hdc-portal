/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { preUploadApi } from '../../APIs';
import { tokenManager } from '../../Service/tokenManager';
import { objectKeysToSnakeCase } from '../';
import { getPath } from './getPath';

export function preUpload(
  projectCode,
  operator,
  jobType,
  folderTags,
  files,
  uploadMessage,
  folderPath,
  parentFolderId,
) {
  let currentFolderName = '';
  const filesInfo = files.map((file) => {
    let relativePath = getPath(file.originFileObj.webkitRelativePath);
    currentFolderName = relativePath.split('/')[0];
    if (relativePath === '') {
      relativePath = folderPath;
    } else {
      relativePath = folderPath + '/' + relativePath;
    }
    const fileInfo = {
      resumableFilename: file.originFileObj.name,
      resumableRelativePath: relativePath,
    };
    return fileInfo;
  });
  let currentFolderNode = '';
  if (jobType === 'AS_FOLDER') {
    if (folderPath) {
      currentFolderNode = folderPath + '/' + currentFolderName;
    } else {
      currentFolderNode = currentFolderName;
    }
  }
  const param = {
    projectCode,
    operator,
    jobType,
    folderTags,
    data: filesInfo,
    uploadMessage,
    currentFolderNode,
    parentFolderId,
  };

  const sessionId = tokenManager.getLocalCookie('sessionId');
  return preUploadApi(objectKeysToSnakeCase(param), sessionId);
}
