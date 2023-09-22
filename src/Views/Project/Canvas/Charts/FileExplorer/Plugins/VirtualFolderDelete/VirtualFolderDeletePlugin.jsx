/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import VFolderDeleteModal from './VFolderDeleteModal';
function VirtualFolderDeletePlugin({
  selectedRows,
  panelKey,
  clearSelection,
  removePanel,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const files = selectedRows.map((v) => v.guid);
  return (
    <>
      <Button
        type="link"
        style={{ marginRight: '8px' }}
        icon={<DeleteOutlined />}
        onClick={() => {
          setModalVisible(true);
        }}
      >
        Delete Collection
      </Button>
      <VFolderDeleteModal
        visible={modalVisible}
        setVisible={setModalVisible}
        files={files}
        panelKey={panelKey}
        removePanel={removePanel}
        clearSelection={clearSelection}
      />
    </>
  );
}
export default VirtualFolderDeletePlugin;
