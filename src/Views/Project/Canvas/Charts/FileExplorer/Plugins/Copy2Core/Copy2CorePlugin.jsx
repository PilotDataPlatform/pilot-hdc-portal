/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useRef } from 'react';
import { CopyOutlined } from '@ant-design/icons';
import { TABLE_STATE } from '../../RawTableValues';
import { Button, message } from 'antd';
import Copy2CoreModal from './Copy2CoreModal';
import PluginTooltip from '../PluginTooltip/PluginTooltip';
import i18n from '../../../../../../../i18n';

function Copy2CorePlugin({
  selectedRowKeys,
  clearSelection,
  selectedRows,
  tableState,
  setTableState,
}) {
  const [copyModalVisible, setCopyModalVisible] = useState(false);
  const copyBtnRef = useRef(null);
  let leftOffset = 0;
  const copyFiles = selectedRows
    .map((v) => {
      if (!v) return null;
      return {
        file_name: v.fileName,
        input_path: v.name,
        uploader: v.owner,
        geid: v.geid,
        nodeLabel: v.nodeLabel,
      };
    })
    .filter((v) => !!v);
  async function copy2Core(e) {
    if (selectedRowKeys.length === 0) {
      message.error(
        `${i18n.t('formErrorMessages:copyFilesModal.files.empty')}`,
        3,
      );
      return;
    }
    setTableState(TABLE_STATE.NORMAL);
    setCopyModalVisible(true);
  }
  const foldersPath =
    copyBtnRef?.current?.parentNode.querySelectorAll('.ant-breadcrumb');
  if (foldersPath && foldersPath[0] && foldersPath[0]?.offsetWidth) {
    leftOffset = foldersPath[0]?.offsetWidth + 20;
  }

  const backButtonConfig = {
    onClick: () => {
      setTableState(TABLE_STATE.NORMAL);
    },
  };

  const actionButtonConfig = {
    onClick: copy2Core,
    text: 'Copy to Core',
  };

  return (
    <>
      <Button
        type="link"
        onClick={() => {
          setTableState(TABLE_STATE.COPY_TO_CORE);
        }}
        icon={<CopyOutlined />}
        style={{ marginRight: 8 }}
        ref={copyBtnRef}
      >
        Copy To Core
      </Button>
      {tableState === TABLE_STATE.COPY_TO_CORE ? (
        <PluginTooltip
          leftOffset={leftOffset}
          backButton={backButtonConfig}
          actionButton={actionButtonConfig}
        />
      ) : null}
      <Copy2CoreModal
        visible={copyModalVisible}
        setVisible={setCopyModalVisible}
        files={copyFiles}
        selectedRows={selectedRows}
        eraseSelect={() => {
          clearSelection();
        }}
      />
    </>
  );
}

export default Copy2CorePlugin;
