/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { fileUpload, uploadStarter } from './fileUpload';
import reduxActionWrapper from './reduxActionWrapper';
import { objectKeysToCamelCase, objectKeysToSnakeCase } from './caseConvert';
import getChildrenTree from './getChildrenTree';
import protectedRoutes from './protectedRoutes';
import { getTags } from './tagsDisplay';
import { validateEmail } from './tokenRefresh';
import {
  sleep,
  getFileSize,
  trimString,
  currentBrowser,
  toFixedNumber,
} from './common';
import { useCurrentProject, withCurrentProject } from './useCurrentProject';
import { usePrevious } from './usePrevious';
import { useIsMount } from './useIsMount';
import { validateTag } from './validateTag';
import { formatRole, convertRole } from './roleConvert';
import { partialString } from './column';
import { displayTitle, nestedLoop } from './fileTree';
import {
  fileNameOrPathDisplay,
  truncateFileName,
} from './fileNameOrPathDisplay';
import { getHighlightedText, hightLightCaseInsensitive } from './highlight';

import {
  checkIsVirtualFolder,
  checkUserHomeFolder,
  checkRootFolder,
  checkGreenAndCore,
} from './panelKey';

import {
  convertToFileSizeInUnit,
  setLabelsDate,
  getCurrentYear,
} from './cavasCharts';
export { useQueryParams } from './useQueryParams';
export {
  fileUpload,
  uploadStarter,
  reduxActionWrapper,
  objectKeysToCamelCase,
  objectKeysToSnakeCase,
  getChildrenTree,
  protectedRoutes,
  validateEmail,
  useCurrentProject,
  withCurrentProject,
  sleep,
  getFileSize,
  useIsMount,
  validateTag,
  formatRole,
  convertRole,
  trimString,
  partialString,
  fileNameOrPathDisplay,
  truncateFileName,
  displayTitle,
  nestedLoop,
  getHighlightedText,
  hightLightCaseInsensitive,
  currentBrowser,
  toFixedNumber,
  checkIsVirtualFolder,
  checkUserHomeFolder,
  checkRootFolder,
  checkGreenAndCore,
  getTags,
  usePrevious,
  convertToFileSizeInUnit,
  setLabelsDate,
  getCurrentYear,
};
export { randomTxt } from './randomTxt';
export { logout, refresh, login } from './keycloakActions';
export {
  actionType,
  broadcastAction,
  keepAlive,
  debouncedBroadcastAction,
} from './triggerAction';
export * from './timeCovert';
export * from './compressContent';
export * from './rolePermissions';
export * from './localStorageExpire';
