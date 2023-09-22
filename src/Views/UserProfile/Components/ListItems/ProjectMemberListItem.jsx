/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { List } from 'antd';

import { mapProjectRoles } from '../../utils';
import { history } from '../../../../Routes';

const ProjectMemberListItem = ({ project }) => {
  const { name, code, permission } = project;
  const projectDescription = (
    <>
      <p>
        <strong>Project: {code} </strong>
        {permission ? (
          <>
            / Member role is <strong>{mapProjectRoles(permission)}</strong>
          </>
        ) : null}
      </p>
    </>
  );

  return (
    <List.Item
      onClick={() => {
        history.push(`/project/${code}/canvas`);
      }}
    >
      <List.Item.Meta title={name} description={projectDescription} />
    </List.Item>
  );
};

export default ProjectMemberListItem;
