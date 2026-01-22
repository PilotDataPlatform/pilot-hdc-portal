/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import { DeploymentUnitOutlined } from '@ant-design/icons';
import PluginTooltip from '../PluginTooltip/PluginTooltip';
import { TABLE_STATE } from '../../RawTableValues';
import DatasetsModal from './DatasetsModal';
import { IS_DATASET_FUNCTIONALITY_ENABLED } from '../../../../../../../config';

const DatasetsPlugin = ({
  selectedRowKeys,
  clearSelection,
  selectedRows,
  tableState,
  setTableState,
}) => {
  const [dataSetsModalVisible, setDataSetsModalVisible] = useState(false);
  const addToDatasetsBtnRef = useRef(null);
  let leftOffset = 0;

  const foldersPath =
    addToDatasetsBtnRef?.current?.parentNode.querySelectorAll(
      '.ant-breadcrumb',
    );

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
    onClick: () => setDataSetsModalVisible(true),
    text: 'Add to Datasets',
    icon: <DeploymentUnitOutlined />,
    disabled: selectedRowKeys.length ? false : true,
  };

  return IS_DATASET_FUNCTIONALITY_ENABLED && (
    <>
      <Button
        type="link"
        onClick={() => {
          setTableState(TABLE_STATE.ADD_TO_DATASETS);
        }}
        icon={<DeploymentUnitOutlined />}
        style={{ marginRight: 8 }}
        ref={addToDatasetsBtnRef}
      >
        Add to Datasets
      </Button>
      {tableState === TABLE_STATE.ADD_TO_DATASETS ? (
        <PluginTooltip
          leftOffset={leftOffset}
          selected={
            selectedRowKeys?.length ? `${selectedRowKeys.length} selected` : ''
          }
          backButton={backButtonConfig}
          actionButton={actionButtonConfig}
        />
      ) : null}
      <DatasetsModal
        visible={dataSetsModalVisible}
        setVisible={setDataSetsModalVisible}
        selectedRows={selectedRows}
      />
    </>
  );
};

export default DatasetsPlugin;
