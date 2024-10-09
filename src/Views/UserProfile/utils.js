/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const mapProjectRoles = (role) => {
  switch (role) {
    case 'admin':
      return 'Project Administrator';
    case 'collaborator':
      return 'Project Collaborator';
    case 'contributor':
      return 'Project Contributor';
    default:
      return role
        ?.split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
  }
};
const mapProjectRolesShort = (role) => {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'collaborator':
      return 'Collaborator';
    case 'contributor':
      return 'Contributor';
    default:
      return role
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
  }
};

module.exports = {
  mapProjectRoles,
  mapProjectRolesShort,
};
