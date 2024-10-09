/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { store } from '../Redux/store';
import { mapProjectRoles } from '../Views/UserProfile/utils';
export const getProjectPermissionRoles = () => {
  if (!store.getState().rolePermissions.roles.length) {
    return [];
  }

  return Object.keys(store.getState().rolePermissions.roles[0].permissions)
    .reduce((allRoles, currentRole, index) => {
      let order;
      let label = `${mapProjectRoles(currentRole)}`;
      let defaultRole = false;
      switch (currentRole) {
        case 'admin':
          order = -3;
          defaultRole = true;
          label = 'Project Admin';
          break;
        case 'collaborator':
          order = -2;
          defaultRole = true;
          label = 'Project Collaborator';
          break;
        case 'contributor':
          order = -1;
          label = 'Project Contributor';
          defaultRole = true;
          break;
        default:
          order = index + 3;
      }

      return [
        ...allRoles,
        {
          label,
          value: currentRole,
          order,
          default: defaultRole,
        },
      ];
    }, [])
    .sort((a, b) => (a.order < b.order ? -1 : 1));
};

export const permissionResource = {
  ownFile: 'file_in_own_namefolder',
  anyFile: 'file_any',
  copyReqOwn: 'copyrequest_in_own_namefolder',
  copyReqAny: 'copyrequest_in_any_namefolder',
};

export const permissionOperation = {
  view: 'view',
  copy: 'copy',
  create: 'create',
  upload: 'upload',
  download: 'download',
  delete: 'delete',
  annotate: 'annotate',
};

export const getProjectRolePermission = (role, permission) => {
  if (!role) {
    return false;
  }

  const { operation, resource } = permission;
  const zone = permission.zone.split('-')[0];

  if (!zone || !operation || !resource) {
    throw new Error(
      'getProjectRolePermission is missing zone, operator or resource property',
    );
  }

  const rolePermissions = store.getState().rolePermissions.roles;

  let permissionItem;
  if (Array.isArray(resource)) {
    const permissions = resource.reduce((allPermissions, currentResource) => {
      const validPermission = rolePermissions.find(
        (rp) =>
          rp.operation === operation &&
          rp.resource === currentResource &&
          (rp.zone === zone || rp.zone === '*') &&
          rp.permissions[role],
      );
      if (validPermission) {
        allPermissions.push(validPermission);
      }
      return allPermissions;
    }, []);

    permissionItem =
      permissions.length > 1
        ? permissions.find((permResource) =>
            permResource.resource.includes('any'),
          )
        : permissions[0];
  } else {
    permissionItem = rolePermissions.find(
      (rp) =>
        rp.operation === operation &&
        rp.resource === resource &&
        (rp.zone === zone || rp.zone === '*'),
    );
  }

  return permissionItem?.permissions[role];
};
