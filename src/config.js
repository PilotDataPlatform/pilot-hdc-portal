/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const BRANDING_PREFIX = process.env.REACT_APP_BRANDING_PATH || '';
const PORTAL_PREFIX = process.env.REACT_APP_PORTAL_PATH || '';
const DOWNLOAD_PREFIX_V2 = process.env.REACT_APP_DOWNLOAD_URL_V2 || '';
const DOWNLOAD_PREFIX_V1 = process.env.REACT_APP_DOWNLOAD_URL_V1 || '';
const DOWNLOAD_GR = process.env.REACT_APP_DOWNLOAD_GR || '';
const DOWNLOAD_CORE = process.env.REACT_APP_DOWNLOAD_CORE || '';
const KEYCLOAK_REALM = process.env.REACT_APP_KEYCLOAK_REALM;
const DEFAULT_AUTH_URL = process.env.REACT_APP_DEFAULT_AUTH_URL || '';
const API_PATH = process.env.REACT_APP_API_PATH || '';
const UPLOAD_URL = process.env.REACT_APP_UPLOAD_URL || '';
const PLATFORM = process.env.REACT_APP_PLATFORM || '';
const DOMAIN = process.env.REACT_APP_DOMAIN || '';
const SUPPORT_EMAIL = process.env.REACT_APP_SUPPORT_EMAIL || '';
const XWIKI = process.env.REACT_APP_XWIKI || '';
const DOC_BUCKET = process.env.REACT_APP_DOC_BUCKET || '';
const ORGANIZATION_PORTAL_DOMAIN =
  process.env.REACT_APP_ORGANIZATION_PORTAL_DOMAIN;
const PLATFORM_INTRODUCTION_URL =
  process.env.REACT_APP_PLATFORM_INTRODUCTION_URL;
const SUPERSET_SUBDOMAIN = process.env.REACT_APP_SUPERSET_SUBDOMAIN;
const SUPERSET_SUBDOMAIN_BASE = process.env.REACT_APP_SUPERSET_SUBDOMAIN_BASE;
const ORGANIZATION_DOMAIN = process.env.REACT_APP_ORGANIZATION_DOMAIN;

if (!KEYCLOAK_REALM) throw new Error(`keycloak realm is empty`);

module.exports = {
  BRANDING_PREFIX,
  PORTAL_PREFIX,
  DOWNLOAD_PREFIX_V2,
  DOWNLOAD_PREFIX_V1,
  DOWNLOAD_GR,
  DOWNLOAD_CORE,
  KEYCLOAK_REALM,
  DEFAULT_AUTH_URL,
  API_PATH,
  UPLOAD_URL,
  PLATFORM,
  DOMAIN,
  SUPPORT_EMAIL,
  XWIKI,
  DOC_BUCKET,
  ORGANIZATION_PORTAL_DOMAIN,
  PLATFORM_INTRODUCTION_URL,
  ORGANIZATION_DOMAIN,
  SUPERSET_SUBDOMAIN,
  SUPERSET_SUBDOMAIN_BASE,
};
