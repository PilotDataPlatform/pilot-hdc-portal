/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import axios from 'axios';
import { message } from 'antd';
import _ from 'lodash';
import camelcaseKeys from 'camelcase-keys';
import { activeManager } from '../Service/activeManager';
import { keycloak } from '../Service/keycloak';
import { API_PATH, PORTAL_PREFIX, UPLOAD_URL, DOWNLOAD_GR } from '../config';

function successHandler(response) {
  const url = _.get(response, 'config.url');
  if (url && url !== '/users/refresh') {
    activeManager.activate();
  }
  return camelcaseKeys(response, { deep: true });
}

const setRequestHeaders = (item) => {
  item.interceptors.request.use((request) => {
    request.headers['Authorization'] = 'Bearer ' + keycloak.token;
    return request;
  });
};

function errorHandler(error) {
  if (error.response) {
    const { data, status } = error.response;

    switch (status) {
      case 401: {
        if (data.result === 'Permission Denied') {
          message.warning('User permission denied.');
        } else if (window.location.pathname !== PORTAL_PREFIX + '/') {
          console.log('logout in config.js since 401');
        }

        break;
      }
      default: {
      }
    }
  } else if (error.request) {
    if (error.request.status === 0) {
    }
  } else {
    if (error.message) {
      message.error(error.message || 'The request has been cancelled');
    } else {
      message.error('Error Network: please check your network connection');
    }
  }
  return new Promise((resolve, reject) => reject(error));
}
let kongAPI = API_PATH;
let devOpServerUrl = API_PATH + '/dataops';

const CancelToken = axios.CancelToken;

const setupServerAxios = (url) => {
  const serverAxios = axios.create({
    baseURL: url,
  });
  serverAxios.defaults.headers.post['Content-Type'] = 'application/json';
  serverAxios.defaults.timeout = 100000;
  serverAxios.interceptors.response.use(successHandler, errorHandler);
  setRequestHeaders(serverAxios);

  return serverAxios;
};

const serverAxios = setupServerAxios(kongAPI);

const serverAxiosNoIntercept = axios.create({
  baseURL: kongAPI,
});
serverAxiosNoIntercept.defaults.headers.post['Content-Type'] =
  'application/json';
serverAxiosNoIntercept.defaults.timeout = 100000;
setRequestHeaders(serverAxiosNoIntercept);

function cancelRequestReg(requestFunction, ...arg) {
  const source = CancelToken.source();
  return {
    request: requestFunction(...arg, source.token),
    source,
  };
}

const uploadAxios = axios.create({ baseURL: UPLOAD_URL });
uploadAxios.defaults.headers.post['Content-Type'] = 'application/json';
uploadAxios.defaults.timeout = 10000;
setRequestHeaders(uploadAxios);
uploadAxios.interceptors.response.use(successHandler, errorHandler);

const downloadGRAxios = axios.create({ baseURL: DOWNLOAD_GR });
downloadGRAxios.defaults.headers.post['Content-Type'] = 'application/json';
downloadGRAxios.defaults.timeout = 10000;
setRequestHeaders(downloadGRAxios);
downloadGRAxios.interceptors.response.use(successHandler, errorHandler);

export {
  axios,
  serverAxios,
  serverAxiosNoIntercept,
  cancelRequestReg,
  devOpServerUrl,
  kongAPI,
  uploadAxios,
  downloadGRAxios,
  setupServerAxios,
};
