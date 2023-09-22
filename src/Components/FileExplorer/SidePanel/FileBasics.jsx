/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Descriptions, Tooltip } from 'antd';
import FileTags from './FileTags';
import { getFileSize, timeConvert } from '../../../Utility';
function FileBasics(props) {
  const { record, panelKey } = props;
  let pathsArr;
  let pathStr;
  if (record.displayPath) {
    pathsArr = record.displayPath.split('/');
    pathStr = pathsArr.join('/');
  }

  return (
    <div style={{ paddingBottom: '16px' }}>
      <Descriptions size="small" column={1}>
        <Descriptions.Item label="Name" style={{ wordBreak: 'break-word' }}>
          {record.name}
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
        <Descriptions.Item>
          <FileTags
            panelKey={panelKey}
            key={record.guid}
            pid={props.pid}
            record={record}
            guid={record.guid}
            geid={record.geid}
          />
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}

export default FileBasics;
