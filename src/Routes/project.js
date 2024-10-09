/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import Canvas from '../Views/Project/Canvas/Canvas';
import Teams from '../Views/Project/Teams/Teams';
import Settings from '../Views/Project/Settings/Settings';
import Search from '../Views/Project/Search/Search';
import Announcement from '../Views/Project/Announcement/Announcement';
import RequestToCore from '../Views/Project/RequestToCore/RequestToCore';
import FileExplorer from '../Views/Project/FileExplorer/FileExplorer';

const routes = [
  {
    path: '/data',
    component: FileExplorer,
    protectedType: 'projectMember',
  },
  {
    path: '/canvas',
    component: Canvas,
    protectedType: 'projectMember',
  },
  {
    path: '/teams',
    component: Teams,
    protectedType: 'projectAdmin',
  },
  {
    path: '/settings',
    component: Settings,
    protectedType: 'projectAdmin',
  },
  {
    path: '/search',
    component: Search,
    protectedType: 'projectMember',
  },
  {
    path: '/announcement',
    component: Announcement,
    protectedType: 'projectMember',
  },
  {
    path: '/request',
    component: RequestToCore,
    protectedType: 'projectMember',
  },
];

export default routes;
