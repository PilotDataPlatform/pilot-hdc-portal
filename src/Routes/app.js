/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import AuthHDC from '../Views/Login/AuthHDC';
import MySpace from '../Views/MySpace/MySpace';
import LandingPageLayout from '../Views/ProjectLandingPage/LandingPageLayout';
import Project from '../Views/Project/Project';
import DatasetLandingPage from '../Views/DatasetLandingPage/DatasetLandingPage';
import Dataset from '../Views/Dataset/Dataset';
import UserProfile from '../Views/UserProfile/UserProfile';

import ErrorPage from '../Views/ErrorPage/ErrorPage';
import General404Page from '../Views/GeneralPage/General404Page';
import SelfRegistration from '../Views/Self-Registration/Self-Registration';
import PlatformManagement from '../Views/PlatformManagement/PlatformManagement';
const authedRoutes = [
  {
    path: '/landing',
    component: MySpace,
    protectedType: 'isLogin',
  },
  {
    path: '/projects',
    component: LandingPageLayout,
    protectedType: 'isLogin',
  },
  {
    path: '/project/:projectCode',
    component: Project,
    protectedType: 'isLogin',
  },
  {
    path: '/users',
    component: PlatformManagement,
    protectedType: 'PlatformAdmin',
  },
  {
    path: '/datasets',
    component: DatasetLandingPage,
    protectedType: 'isLogin',
  },
  {
    path: '/dataset/:datasetCode',
    component: Dataset,
    protectedType: 'isLogin',
  },
  {
    path: '/user-profile',
    component: UserProfile,
    protectedType: 'isLogin',
  },
  { path: '/error', component: ErrorPage, protectedType: 'isLogin' },
];

const unAuthedRoutes = [
  {
    path: '/login',
    component: AuthHDC,
    protectedType: 'unLogin',
    exact: true,
  },
  {
    path: '/404',
    component: General404Page,
    exact: true,
  },
];

if (process.env.REACT_APP_ENABLE_SELF_REGISTRATION === 'true') {
  unAuthedRoutes.push({
    path: '/self-registration/:invitationHash',
    component: SelfRegistration,
    protectedType: 'unLogin',
  });
}

export { authedRoutes, unAuthedRoutes };
