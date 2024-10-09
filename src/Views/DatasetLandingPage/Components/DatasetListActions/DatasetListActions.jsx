/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { Menu, Dropdown, Button, Checkbox } from 'antd';
import {
  SortAscendingOutlined,
  DownOutlined,
  SearchOutlined,
  UpOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useQueryParams } from '../../../../Utility';
import { useHistory } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { getProjectsWithAdminRole } from '../../../../Utility/userProjects';

export default function DatasetListActions(props) {
  const { ACTIONS, action, setAction } = props;
  const { showOnlyMine = 'true' } = useQueryParams(['showOnlyMine']);
  const { keycloak } = useKeycloak();
  const history = useHistory();

  const sortPanel = (
    <Menu onClick={() => {}}>
      <Menu.Item key="1" value="time-desc">
        Last created
      </Menu.Item>
      <Menu.Item id="uploadercontent_first_created" key="2" value="time-asc">
        First created
      </Menu.Item>
      <Menu.Item key="3" value="name-asc">
        Project name A to Z
      </Menu.Item>
      <Menu.Item key="4" value="name-desc">
        Project name Z to A
      </Menu.Item>
      <Menu.Item key="5" value="code-asc">
        Project code A to Z
      </Menu.Item>
      <Menu.Item key="6" value="code-desc">
        Project code Z to A
      </Menu.Item>
    </Menu>
  );

  if (action === ACTIONS.create) return null;

  const userProjectsWithAdminRole = getProjectsWithAdminRole(keycloak?.tokenParsed);
  const isShowOnlyMineCheckboxAvailable = userProjectsWithAdminRole.length > 0;

  return (
    <div>
      {isShowOnlyMineCheckboxAvailable ? (
        <Checkbox
          defaultChecked={showOnlyMine.toLowerCase() === 'true'}
          style={{
            position: 'absolute',
            left: '30px',
            fontSize: '16px',
          }}
          onChange={(e) => {
            const showOnlyMineValue = e.target.checked;
            history.push(`/datasets?showOnlyMine=${showOnlyMineValue}`);
          }}
        >
          Show only the Datasets I've created
        </Checkbox>
      ) : null}
      <Button
        type="link"
        onClick={() => {
          setAction(ACTIONS.create);
        }}
        style={{
          fontWeight: 500,
          fontSize: 16,
        }}
        icon={<PlusOutlined />}
      >
        Create New
      </Button>
    </div>
  );
}
