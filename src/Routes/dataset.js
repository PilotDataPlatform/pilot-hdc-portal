/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import DatasetHome from '../Views/Dataset/DatasetHome/DatasetHome';
import DatasetData from '../Views/Dataset/DatasetData/DatasetData';
import DatasetSchema from '../Views/Dataset/DatasetSchema/DatasetSchema';
import DatasetActivity from '../Views/Dataset/DatasetActivity/DatasetActivity';

export const datasetRoutes = [
  {
    path: '/home',
    component: DatasetHome,
    protectedType: 'isLogin',
  },
  {
    path: '/data',
    component: DatasetData,
    protectedType: 'isLogin',
  },
  {
    path: '/schema',
    component: DatasetSchema,
    protectedType: 'isLogin',
  },
  {
    path: '/activity',
    component: DatasetActivity,
    protectedType: 'isLogin',
  },
];
