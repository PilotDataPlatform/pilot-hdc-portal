/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { authedRoutes, unAuthedRoutes } from './app';
import projectRoutes from './project';
import { datasetRoutes } from './dataset';
import errorPageRoutes from './errorPage';
import { createBrowserHistory } from 'history';
import { PORTAL_PREFIX } from '../config';

const basename = PORTAL_PREFIX;
const history = createBrowserHistory({ basename });
export {
  authedRoutes,
  unAuthedRoutes,
  projectRoutes,
  errorPageRoutes,
  history,
  basename,
  datasetRoutes,
};
