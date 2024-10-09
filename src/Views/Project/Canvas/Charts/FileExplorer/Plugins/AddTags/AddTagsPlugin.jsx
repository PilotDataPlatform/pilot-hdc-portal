/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useRef } from 'react';
import { TagOutlined } from '@ant-design/icons';
import { TABLE_STATE } from '../../RawTableValues';
import { Button } from 'antd';
import PluginTooltip from '../PluginTooltip/PluginTooltip';
import AddTagsModal from './AddTagsModal';

function AddTagsPlugin({
  selectedRowKeys,
  clearSelection,
  selectedRows,
  tableState,
  setTableState,
}) {
  const [addTagsModalVisible, setAddTagsModalVisible] = useState(false);
  const copyBtnRef = useRef(null);
  let leftOffset = 0;

  const handleAddTags = () => {
    setAddTagsModalVisible(true);
  };

  const foldersPath =
    copyBtnRef?.current?.parentNode.querySelectorAll('.ant-breadcrumb');
  if (foldersPath && foldersPath[0] && foldersPath[0]?.offsetWidth) {
    leftOffset = foldersPath[0]?.offsetWidth + 40;
  }

  const backButtonConfig = {
    onClick: () => {
      setTableState(TABLE_STATE.NORMAL);
      clearSelection();
    },
  };

  const actionButtonConfig = {
    onClick: handleAddTags,
    text: 'Add/Remove Tags',
    icon: <TagOutlined />,
    disabled: selectedRowKeys.length ? false : true,
  };

  return (
    <>
      <Button
        type="link"
        onClick={() => {
          setTableState(TABLE_STATE.ADD_TAGS);
        }}
        icon={<TagOutlined />}
        style={{ marginRight: 8 }}
        ref={copyBtnRef}
      >
        Add/Remove Tags
      </Button>

      {tableState === TABLE_STATE.ADD_TAGS ? (
        <PluginTooltip
          leftOffset={leftOffset}
          selected={
            selectedRowKeys?.length ? `${selectedRowKeys.length} selected` : ''
          }
          backButton={backButtonConfig}
          actionButton={actionButtonConfig}
        />
      ) : null}
      <AddTagsModal
        visible={addTagsModalVisible}
        setVisible={setAddTagsModalVisible}
        selectedRows={selectedRows}
      />
    </>
  );
}

export default AddTagsPlugin;
