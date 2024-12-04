/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */

import projectRoles from './project-roles.json';

export function getProjectsAndRoles(tokenParsed) {
  const userRoles = tokenParsed.realm_access.roles;

  return userRoles.reduce((projects, projectRole) => {
    projectRole = projectRole.split('-');

    if (projectRole.length === 2 && projectRole[1] in projectRoles && projectRole[0] !== 'platform') {
      projects[projectRole[0]] = projectRole[1];
    }

    return projects;
  }, {});
}

export function getProjectsWithRole(tokenParsed, projectRole) {
  const projectsAndRoles = getProjectsAndRoles(tokenParsed);

  return Object.keys(projectsAndRoles).reduce((projects, projectCode) => {
    if (projectsAndRoles[projectCode] === projectRole) {
      projects.push(projectCode);
    }

    return projects;
  }, []);
}

export function getProjectsWithAdminRole(tokenParsed) {
  return getProjectsWithRole(tokenParsed, 'admin');
}