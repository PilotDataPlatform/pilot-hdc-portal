/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import Error404 from '../Views/ErrorPage/404/Error404';
import Error403 from '../Views/ErrorPage/403/Error403';

const routes = [
  {
    path: '/404',
    component: Error404,
  },
  {
    path: '/403',
    component: Error403,
  },
];

export default routes;
