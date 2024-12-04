/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Menu, Dropdown, Button, Checkbox } from 'antd';
import {
  SortAscendingOutlined,
  DownOutlined,
  PlusOutlined,
  FilterOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useQueryParams } from '../../../../Utility';
import { useHistory } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { getProjectsAndRoles, getProjectsWithAdminRole } from '../../../../Utility/userProjects';
import updateDatasetListHistory from '../DatasetListHistory';

export default function DatasetListActions(props) {
  const { keycloak } = useKeycloak();
  const history = useHistory();
  const { ACTIONS, action, setAction } = props;
  const {
    showOnlyMine = 'true',
    projectCode = null,
    page = 1,
    pageSize = 10,
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = useQueryParams(['showOnlyMine', 'projectCode', 'pageSize', 'page', 'sortBy', 'sortOrder']);

  const handleProjectFilterClick = (e) => {
    const newProjectCode = e.item.props.value;

    updateDatasetListHistory(history, showOnlyMine, newProjectCode, page, pageSize, sortBy, sortOrder);
  };

  const handleSortClick = (e) => {
    const sortRule = e.item.props.value.split('-');
    const newSortBy = sortRule[0];
    const newSortOrder = sortRule[1];

    updateDatasetListHistory(history, showOnlyMine, projectCode, page, pageSize, newSortBy, newSortOrder);
  };

  const userProjectsAndRoles = getProjectsAndRoles(keycloak?.tokenParsed);
  const isProjectFilterDropdownAvailable = !!Object.keys(userProjectsAndRoles).length

  const projectFilterDropdownMenu = (
    <Menu onClick={handleProjectFilterClick}>
      {projectCode ? (
        <>
          <Menu.Item value={null} style={{ textStyle: 'bold' }} icon={<CloseOutlined />}>
            Clear project filtering
          </Menu.Item>
          <Menu.Divider />
        </>
      ) : null}
      {Object.keys(userProjectsAndRoles).map((project) => (
        <Menu.Item value={project}>
          {(projectCode === project) ? <b>{project}</b> : project}
        </Menu.Item>
      ))}
    </Menu>
  );

  const sortPanel = (
    <Menu onClick={handleSortClick}>
      <Menu.Item key='1' value='created_at-desc'>
        Last created
      </Menu.Item>
      <Menu.Item key='2' value='created_at-asc'>
        First created
      </Menu.Item>
      <Menu.Item key='3' value='creator-asc'>
        Creator A to Z
      </Menu.Item>
      <Menu.Item key='4' value='creator-desc'>
        Creator Z to A
      </Menu.Item>
      <Menu.Item key='5' value='code-asc'>
        Dataset code A to Z
      </Menu.Item>
      <Menu.Item key='6' value='code-desc'>
        Dataset code Z to A
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
            const newShowOnlyMine = e.target.checked;
            updateDatasetListHistory(history, newShowOnlyMine, projectCode, page, pageSize, sortBy, sortOrder);
          }}
        >
          Show only the Datasets I've created
        </Checkbox>
      ) : null}
      {isProjectFilterDropdownAvailable ? (
        <Dropdown overlay={projectFilterDropdownMenu} placement='bottomRight'>
          <Button
            style={{
              borderRadius: '6px',
              height: '36px',
              fontSize: '16px',
              verticalAlign: 'middle',
            }}
          >
            <FilterOutlined />
            {projectCode ? `Project: ${projectCode}` : 'Filter by project code'}
            <DownOutlined />
          </Button>
        </Dropdown>
      ) : null}
      <Dropdown overlay={sortPanel} placement='bottomRight'>
        <Button
          style={{
            borderRadius: '6px',
            height: '36px',
            fontSize: '16px',
            verticalAlign: 'middle',
          }}
        >
          <SortAscendingOutlined />
          Sort by {`${sortBy && sortBy.split('_').shift()} : ${sortOrder}`}
          <DownOutlined />
        </Button>
      </Dropdown>
      <Button
        type='link'
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
