/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const common = {
  getDataset: 'common.getDataset',
  listUsersContainersPermission: 'common.listUsersContainersPermission',
  emailFileList: 'common.emailFileList',
  logout: 'common.logout',
};
const login = {
  auth: 'login.auth',
  refresh: 'login.refresh',
  parseInviteHashAPI: 'login.parseInviteHashAPI',
  forgotPassword: 'login.forgotPassword',
  resetForgottenPassword: 'login.resetForgottenPassword',
  checkToken: 'login.checkToken',
  forgotUsername: 'login.forgotUsername',
};
const landing = {
  createProject: 'landing.createProject',
};

const project = {
  files: {
    uploadFileApi: 'project.files.uploadFileApi',
    uploadRequestFail: 'project.files.uploadRequestFail',
    traverseFoldersContainersAPI: 'project.files.traverseFoldersContainersAPI',
    downloadFilesAPI: 'project.files.downloadFilesAPI',
    processingFile: 'project.files.processingFile',
    preUpload: 'project.files.preUpload',
    combineChunk: 'project.files.combineChunks',
  },
};
const dataset = {
  files: {
    downloadFilesAPI: 'dataset.files.downloadFilesAPI',
  },
};

const selfRegister = {
  selfRegistration: 'selfRegister.selfRegistration',
};

const teams = {
  checkEmailExistAPI: 'teams.checkEmailExistAPI',
  inviteUser: 'teams.inviteUser',
  addUsertoDataSet: 'team.addUsertoDataSet',
  getUsersOnDataset: 'teams.getUsersOnDataset',
  changeRoleInDataset: 'teams.changeRoleInDataset',
  removeUserFromDataset: 'teams.removeUserFromDataset',
  restoreUserFromDataset: 'teams.restoreUserFromDataset',
  checkUserPlatformRole: 'teams.checkUserPlatformRole',
};

const contactUs = {
  contactUsAPI: 'contactUs.contactUsAPI',
};

const userManagement = {
  inviteUserApi: 'userManagement.inviteUserApi',
  getPortalUsers: 'userManagement.getPortalUsers',
  updateUserStatusAPI: 'userManagement.updateUserStatusAPI',
  getInvitationsAPI: 'userManagement.getInvitationsAPI',
  getServiceRequestAPI: 'userManagement.getServiceRequestAPI',
};

const announcement = {
  getAnnouncementApi: 'announcement.getAnnouncementApi',
  getUserAnnouncementApi: 'announcement.getUserAnnouncementApi',
};

const manifest = {
  getManifestById: 'manifest.getManifestById',
};

const fileExplorer = {
  createFolder: 'fileExplorer.createFolder',
};

export default {
  common,
  login,
  landing,
  project,
  dataset,
  selfRegister,
  teams,
  contactUs,
  userManagement,
  announcement,
  manifest,
  fileExplorer,
};
