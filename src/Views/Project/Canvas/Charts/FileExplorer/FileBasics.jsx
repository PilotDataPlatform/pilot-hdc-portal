/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Descriptions, Tooltip } from 'antd';
import FileTags from './FileTags';
import {
  getFileSize,
  timeConvert,
  getProjectRolePermission,
  permissionResource,
  permissionOperation,
} from '../../../../../Utility';
import { useSelector } from 'react-redux';
import { PanelKey } from '../../Charts/FileExplorer/RawTableValues';

function FileBasics({ record, panelKey, pid, role }) {
  let pathsArr;
  let pathStr;
  if (record.displayPath) {
    pathsArr = record.displayPath.split('/');
    pathStr = pathsArr.join('/');
  }

  const folderRouting = useSelector(
    (state) => state.fileExplorer && state.fileExplorer.folderRouting,
  );
  const currentRouting = folderRouting[panelKey]
    ? folderRouting[panelKey].filter(
        (r) => typeof r.folderLevel !== 'undefined',
      )
    : folderRouting[panelKey];

  const username = useSelector((state) => state.username);
  const showTags = () => {
    const PermAnyFile =
      panelKey !== PanelKey.TRASH
        ? getProjectRolePermission(role, {
            zone: panelKey.includes('vfolder') ? PanelKey.CORE : panelKey,
            resource: permissionResource.anyFile,
            operation: permissionOperation.view,
          })
        : true;
    let user;
    let parentPath = record?.displayPath;

    if (currentRouting != null) {
      if (currentRouting.length >= 1) {
        user = currentRouting[0].name;
      }
    }
    if (panelKey.includes('vfolder')) {
      user = parentPath?.split('/')[0];
    }
    if (PermAnyFile) {
      return true;
    } else {
      if (user === username) {
        return getProjectRolePermission(role, {
          zone: panelKey.includes('vfolder') ? PanelKey.CORE : panelKey,
          resource: permissionResource.ownFile,
          operation: permissionOperation.view,
        });
      } else {
        return false;
      }
    }
  };

  return (
    <div style={{ paddingBottom: '16px' }}>
      <Descriptions size="small" column={1}>
        <Descriptions.Item label="Name" style={{ wordBreak: 'break-word' }}>
          {record.fileName}
        </Descriptions.Item>

        <Descriptions.Item label="Added by">{record.owner}</Descriptions.Item>
        <Descriptions.Item label="Created">
          {timeConvert(record.createTime, 'datetime')}
        </Descriptions.Item>
        {record.nodeLabel.indexOf('Folder') === -1 ? (
          <Descriptions.Item label="File Size">
            {![undefined, null].includes(record.fileSize)
              ? getFileSize(record.fileSize)
              : 'N/A'}
          </Descriptions.Item>
        ) : null}
        {pathsArr && (
          <Descriptions.Item label="Path">
            {pathStr.length > 22 ? (
              <Tooltip title={pathStr}>{pathStr.slice(0, 22) + '...'}</Tooltip>
            ) : (
              pathStr
            )}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="ID">{record.geid}</Descriptions.Item>
        {showTags() && (
          <Descriptions.Item>
            <FileTags
              panelKey={panelKey}
              key={record.guid}
              pid={pid}
              record={record}
              guid={record.guid}
              geid={record.geid}
              permission={role}
            />
          </Descriptions.Item>
        )}
      </Descriptions>
    </div>
  );
}

export default FileBasics;
