/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { TABLE_STATE } from '../../RawTableValues';
import DeleteFilesModal from './DeleteFilesModal';
import i18n from '../../../../../../../i18n';

const DeleteFilesPlugin = ({
  tableState,
  selectedRowKeys,
  clearSelection,
  selectedRows,
  setTableState,
  panelKey,
  permission,
}) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const deleteFiles = selectedRows
    .map((v) => {
      if (!v) return null;
      return {
        input_path: v.name,
        fileName: v.fileName,
        uploader: v.owner,
        geid: v.geid,
        zone: v.nodeLabel[0]
      };
    })
    .filter((v) => !!v);

  const fileDeletion = (e) => {
    if (selectedRowKeys.length === 0) {
      message.error(
        `${i18n.t('errormessages:fileOperations.noFileToDelete')}`,
        3,
      );
      return;
    }
    setTableState(TABLE_STATE.NORMAL);
    setDeleteModalVisible(true);
  };

  return (
    <>
      <Button
        type="link"
        onClick={() => {
          fileDeletion();
        }}
        icon={<DeleteOutlined />}
        style={{ marginRight: 8 }}
      >
        Delete
      </Button>

      <DeleteFilesModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        files={deleteFiles}
        eraseSelect={() => {
          clearSelection();
        }}
        panelKey={panelKey}
        permission={permission}
      />
    </>
  );
};

export default DeleteFilesPlugin;
