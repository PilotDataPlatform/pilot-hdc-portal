/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
var roleMap = {
  site_admin: 'Platform Administrator',
  admin: 'Project Administrator',
  member: 'Member',
  contributor: 'Project Contributor',
  uploader: 'Project Contributor',
  visitor: 'Visitor',
  collaborator: 'Project Collaborator',
};

function formatRole(role) {
  if (roleMap[role]) {
    return roleMap[role];
  } else {
    return role
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
  return;
}

function convertRole(role) {
  return role === 'uploader' ? 'contributor' : role;
}

export { formatRole, convertRole };
