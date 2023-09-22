/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { serverAxios as axios } from './config';
import { objectKeysToSnakeCase } from '../Utility';
import { KEYCLOAK_REALM } from '../config';

function getUserProfileAPI(username, projectCode = null) {
  const params = projectCode ? { project_code: projectCode } : {};
  return axios({
    url: `/v1/users/${username}`,
    params,
  });
}

function getAllUsersAPI() {
  return axios({
    url: '/v1/users/platform',
  });
}

function createUserAPI(data) {
  return axios({
    url: '/v1/users/platform',
    method: 'post',
    data,
  });
}

function getUsersCountOnProjectAPI(projectGeid) {
  return axios({
    url: `/v1/containers/${projectGeid}/roles/users/stats`,
  });
}

function getUserOnProjectAPI(projectGeid, data) {
  return axios({
    url: `/v1/containers/${projectGeid}/users`,
    params: objectKeysToSnakeCase(data),
  });
}

function getPortalUsers(params) {
  return axios({
    url: `/v1/users/platform`,
    method: 'GET',
    params: objectKeysToSnakeCase(params),
  });
}

function checkIsUserExistAPI(username, code) {
  return axios({
    url: `/users/name`,
    method: 'GET',
    params: { realm: KEYCLOAK_REALM, username: username, invite_code: code },
  });
}

function inviteUserApi(email, platformRole, inviter, projectRole, projectCode) {
  const data = {
    email,
    platform_role: platformRole,
  };
  if (projectCode && projectRole && inviter) {
    const relationship = {
      project_code: projectCode,
      project_role: projectRole,
      inviter,
    };
    data['relationship'] = relationship;
  }
  return axios({
    url: '/v1/invitations',
    method: 'post',
    data,
  });
}

function contactUsApi(data) {
  return axios({
    url: '/v1/contact',
    method: 'post',
    data,
    timeout: 100 * 1000,
  });
}

function getAdminsOnDatasetAPI(projectGeid) {
  return axios({
    url: `/v1/containers/${projectGeid}/admins`,
  });
}

function checkUserPlatformRole(email, projectCode) {
  if (projectCode) {
    return axios({
      url: `/v1/invitation/check/${email}`,
      method: 'GET',
      timeout: 5 * 60 * 1000,
      params: { project_code: projectCode },
    });
  }
  return axios({
    url: `/v1/invitation/check/${email}`,
    timeout: 5 * 60 * 1000,
    method: 'GET',
  });
}

function updateUserStatusAPI(params) {
  return axios({
    url: `v1/user/account`,
    method: 'PUT',
    timeout: 5 * 60 * 1000,
    data: {
      operation_type: params.operationType,
      realm: params.userRealm,
      user_geid: params.userGeid,
      user_email: params.userEmail,
      payload: params.payload,
    },
  });
}

function getInvitationsAPI(params) {
  return axios({
    url: `/v1/invitation-list`,
    method: 'POST',
    data: objectKeysToSnakeCase(params),
  });
}

function getResourceRequestsAPI(params) {
  const newParams = params['filters']
    ? {
        ...params,
        ...params['filters'],
      }
    : params;
  delete newParams['filters'];
  return axios({
    url: `/v1/resource-requests/query`,
    method: 'POST',
    data: objectKeysToSnakeCase(newParams),
  });
}

function createResourceRequestAPI(params) {
  return axios({
    url: `/v1/resource-requests`,
    method: 'POST',
    data: objectKeysToSnakeCase(params),
  });
}

function getProjectVMs(projectCode) {
  return axios({
    url: '/v1/guacamole/connection',
    method: 'GET',
    params: {
      container_code: projectCode,
    },
  });
}

function updateUserVM(requestId, connections, projectCode) {
  return axios({
    url: `/v1/resource-request/${requestId}/`,
    method: 'PATCH',
    data: {
      connections,
      container_code: projectCode,
    },
  });
}

function approveResourceRequestAPI(requestId) {
  return axios({
    url: `/v1/resource-request/${requestId}/complete`,
    method: 'PUT',
  });
}
function getUserstatusAPI() {
  return axios({
    url: `/v1/user/status`,
    method: 'GET',
  });
}

function changeUserStatusAPI(email, userName, familyName, givenName) {
  return axios({
    url: `/v1/users`,
    method: 'PUT',
    data: {
      email: email,
      username: userName,
      last_name: familyName,
      first_name: givenName,
    },
  });
}

export {
  getUserProfileAPI,
  getAllUsersAPI,
  createUserAPI,
  checkIsUserExistAPI,
  inviteUserApi,
  contactUsApi,
  getAdminsOnDatasetAPI,
  getPortalUsers,
  getUserOnProjectAPI,
  checkUserPlatformRole,
  updateUserStatusAPI,
  getInvitationsAPI,
  getResourceRequestsAPI,
  createResourceRequestAPI,
  approveResourceRequestAPI,
  getUserstatusAPI,
  changeUserStatusAPI,
  getUsersCountOnProjectAPI,
  getProjectVMs,
  updateUserVM,
};
