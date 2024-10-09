/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import { PLATFORM, SUPPORT_EMAIL, ORGANIZATION_PORTAL_DOMAIN } from './config';
i18n
  .use(initReactI18next)
  .use(Backend)
  .init({
    debug: false,
    lng: 'en',
    ns: ['errormessages'],
    backend: {
      loadPath: `${process.env.PUBLIC_URL}/locales/{{lng}}/{{ns}}.json`,
    },
    interpolation: {
      escapeValue: false,
      defaultVariables: {
        PLATFORM: PLATFORM,
        SUPPORT_EMAIL: SUPPORT_EMAIL,
        ORGANIZATION: ORGANIZATION_PORTAL_DOMAIN,
      },
    },
  });
export default i18n;
