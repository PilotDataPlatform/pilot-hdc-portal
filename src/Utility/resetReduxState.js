/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import {
  updateClearIdCreator,
  setContainersPermissionCreator,
  cleanDatasetCreator,
  setDownloadListCreator,
  setMetadatasCreator,
  setNewUploadIndicator,
  setPersonalDatasetIdCreator,
  setRefreshModal,
  setUserRoleCreator,
  setTagsCreator,
  setUploadListCreator,
  setUserListCreator,
} from '../Redux/actions';
import reduxActionWrapper from './reduxActionWrapper';

const [
  updateClearIdDispatcher,
  setContainersPermissionDispatcher,
  cleanDatasetDispatcher,
  setDownloadListDispatcher,

  setMetadatasDispatcher,
  setNewUploadIndicatorDispatcher,
  setPersonalDatasetIdDispatcher,
  setRefreshModalDispatcher,
  setUserRoleDispatcher,
  setTagsDispatcher,
  setUploadListDispatcher,
  setUserListDispatcher,
] = reduxActionWrapper([
  updateClearIdCreator,
  setContainersPermissionCreator,
  cleanDatasetCreator,
  setDownloadListCreator,
  setMetadatasCreator,
  setNewUploadIndicator,
  setPersonalDatasetIdCreator,
  setRefreshModal,
  setUserRoleCreator,
  setTagsCreator,
  setUploadListCreator,
  setUserListCreator,
]);
function resetReduxState() {
  updateClearIdDispatcher('');
  setContainersPermissionDispatcher(null);
  cleanDatasetDispatcher();
  setDownloadListDispatcher([]);
  setMetadatasDispatcher({ metadatas: null });
  setNewUploadIndicatorDispatcher(0);
  setPersonalDatasetIdDispatcher(null);
  setRefreshModalDispatcher(false);
  setUserRoleDispatcher(null);
  setTagsDispatcher(null);
  setUploadListDispatcher([]);
  setUserListDispatcher(null);
}

export { resetReduxState };
