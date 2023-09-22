/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useRef } from 'react';
import { ProfileOutlined } from '@ant-design/icons';
import { TABLE_STATE } from '../../RawTableValues';
import { Button, message } from 'antd';
import ManifestManagementModal from './ManifestManagementModal';
import PluginTooltip from '../PluginTooltip/PluginTooltip';
import i18n from '../../../../../../../i18n';

function ManifestManagementPlugin({
  selectedRowKeys,
  clearSelection,
  selectedRows,
  tableState,
  setTableState,
}) {
  const [manifestModalVisible, setManifestModalVisible] = useState(false);
  const attrBtnRef = useRef(null);
  let leftOffset = 0;
  const foldersPath =
    attrBtnRef?.current?.parentNode.querySelectorAll('.ant-breadcrumb');
  if (foldersPath && foldersPath[0] && foldersPath[0]?.offsetWidth) {
    leftOffset = foldersPath[0]?.offsetWidth + 40;
  }
  const selFilesAll = selectedRows.map((v) => {
    if (!v) return null;
    if (v.nodeLabel.indexOf('Folder') !== -1) {
      return {
        geid: v.geid,
        nodeLabel: v.nodeLabel,
        fileName: v.fileName,
        manifest: null,
      };
    }
    return {
      geid: v.geid,
      manifest: v.manifest,
      nodeLabel: v.nodeLabel,
      fileName: v.fileName,
    };
  });
  const selFiles = selFilesAll.filter(
    (v) => !!v && (!v.manifest || v.manifest.length === 0),
  );
  const withManifest = selFilesAll.filter(
    (v) => !!v && v.manifest && v.manifest.length,
  );
  const selText = withManifest.length
    ? `${selectedRowKeys.length} Selected - ${withManifest.length} Unavailable `
    : `${selectedRowKeys.length} Selected`;

  function attach(e) {
    if (selFiles.length === 0) {
      message.error(
        `${i18n.t('formErrorMessages:attachManifestModal.files.empty')}`,
        3,
      );
      return;
    }
    setTableState(TABLE_STATE.NORMAL);
    setManifestModalVisible(true);
  }

  const backButtonConfig = {
    onClick: () => {
      setTableState(TABLE_STATE.NORMAL);
      clearSelection();
    },
  };

  const actionButtonConfig = {
    onClick: attach,
    text: 'Add Attributes',
    icon: <ProfileOutlined />,
    disabled: selFiles.length === 0,
  };

  return (
    <>
      <Button
        type="link"
        onClick={() => {
          setTableState(TABLE_STATE.MANIFEST_APPLY);
        }}
        ref={attrBtnRef}
        icon={<ProfileOutlined />}
        style={{ marginRight: 8 }}
      >
        Add Attributes
      </Button>

      {tableState === TABLE_STATE.MANIFEST_APPLY ? (
        <PluginTooltip
          leftOffset={leftOffset}
          selected={selectedRowKeys?.length ? selText : ''}
          backButton={backButtonConfig}
          actionButton={actionButtonConfig}
        />
      ) : null}
      <ManifestManagementModal
        visible={manifestModalVisible}
        setVisible={setManifestModalVisible}
        files={selFiles}
        eraseSelect={() => {
          clearSelection();
        }}
      />
    </>
  );
}

export default ManifestManagementPlugin;
