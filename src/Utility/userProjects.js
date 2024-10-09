/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
export function getProjectsWithAdminRole(tokenParsed) {
  const userRoles = tokenParsed.realm_access.roles;

  return userRoles.reduce((projects, projectRole) => {
    projectRole = projectRole.split('-');

    if (projectRole.length === 2 && projectRole[1] === 'admin') {
      projects.push(projectRole[0]);
    }

    return projects;
  }, []);
}