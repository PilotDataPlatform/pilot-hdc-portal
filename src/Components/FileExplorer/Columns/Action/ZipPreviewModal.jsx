/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useEffect, useState } from 'react';
import { Tree, Modal, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { nestedLoop } from '../../../../Utility';
const { DirectoryTree } = Tree;

export default function ZipPreviewModal(props) {
  const [data, setData] = useState([]);
  const [defaultKeys, setDefaultKeys] = useState([]);
  const fileName = props.record.fileName;
  const upperZipContent = props.zipContent || {};

  const [loading, setLoading] = useState(false);
  const zipContent = {};
  zipContent[fileName] = upperZipContent;

  useEffect(() => {
    if (props.visible) {
      for (const key in zipContent) {
        setLoading(true);
        setData([]);
        setDefaultKeys([]);
        const { treeData, expandedKey } = nestedLoop(zipContent[key], key);
        setData(treeData);
        setDefaultKeys(expandedKey);
        setLoading(false);
      }
    }
  }, [props.visible]);

  const onSelect = (keys, info) => {
    console.log('Trigger Select', keys, info);
  };

  const onExpand = () => {
    console.log('Trigger Expand');
  };

  const titile = (
    <div>
      <span style={{ fontSize: '16px', fontWeight: 500, lineHeight: '22px' }}>
        File Previewer
      </span>
    </div>
  );
  return (
    <Modal
      title={titile}
      visible={props.visible}
      maskClosable={false}
      onOk={props.handlePreviewCancel}
      onCancel={props.handlePreviewCancel}
      footer={[
        <Button key="back" onClick={props.handlePreviewCancel}>
          OK
        </Button>,
      ]}
    >
      {loading ? (
        <LoadingOutlined style={{ fontSize: 24 }} spin />
      ) : (
        <div style={{ overflowX: 'scroll' }}>
          <DirectoryTree
            multiple
            onSelect={onSelect}
            onExpand={onExpand}
            treeData={data}
            height={500}
            defaultExpandedKeys={defaultKeys}
          />
        </div>
      )}
    </Modal>
  );
}
