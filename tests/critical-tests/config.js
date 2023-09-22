/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const dotenv = require('dotenv');
dotenv.config();

const PORTAL_PREFIX = process.env.REACT_APP_PORTAL_PATH;
const DOMAIN = process.env.REACT_APP_DOMAIN;
let baseUrl;
switch (process.env.REACT_APP_TEST_ENV) {
  case 'local':
    baseUrl = `http://localhost:3000${PORTAL_PREFIX}/`;
    break;
  case 'dev':
    baseUrl = `https://${DOMAIN}${PORTAL_PREFIX}/`;
    break;
}

mailHogHost = `https://mail.${DOMAIN}/`;
mailHogAdminEmail = 'pilotplatform_support@example.org';
let dataConfig = {
  copyReq: {
    projectCode: 'automatic001',
    contributorProjectCode: 'automatic002',
  },
  adminCanvas: {
    projectCode: 'automatic001',
  },
  contributorCanvas: {
    projectCode: 'automatic002',
  },
  fileCopy: {
    adminProjectCode: 'automatic001',
    collaboratorProjectCode: 'automatic006',
  },
  fileUpload: {
    projectCode: 'automatic005',
  },
  fileDownload: {
    projectCode: 'automatic005',
  },
  fileDelete: {
    projectCode: 'automatic005',
  },
  userProfile: {
    projectCode: 'automatic004',
  },
  favoring: {
    projectCode: 'automatic001',
  },
};

module.exports = {
  baseUrl,
  mailHogHost,
  mailHogAdminEmail,
  dataConfig,
};
