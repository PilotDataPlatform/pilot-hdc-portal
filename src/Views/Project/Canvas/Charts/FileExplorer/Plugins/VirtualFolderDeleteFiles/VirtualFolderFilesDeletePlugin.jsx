/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import VFolderFilesDeleteModal from './VFolderFilesDeleteModal';
function VirtualFolderFilesDeletePlugin({
  selectedRowKeys,
  selectedRows,
  panelKey,
  clearSelection,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const files = selectedRows.map((v) => v.geid);
  return (
    <>
      <Button
        type="link"
        disabled={!selectedRowKeys || selectedRowKeys.length === 0}
        onClick={() => {
          setModalVisible(true);
        }}
        icon={<DeleteOutlined />}
        style={{ marginRight: 8 }}
      >
        Remove From Collection
      </Button>
      <VFolderFilesDeleteModal
        visible={modalVisible}
        setVisible={setModalVisible}
        files={files}
        panelKey={panelKey}
        clearSelection={clearSelection}
      />
    </>
  );
}
export default VirtualFolderFilesDeletePlugin;
