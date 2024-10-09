/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { Table, Button, Collapse, Radio, Spin } from 'antd';
import SearchResultCard from './SearchResultCard';
import DataSetsModal from '../../Canvas/Charts/FileExplorer/Plugins/Datasets/DatasetsModal';
import styles from '../index.module.scss';
import { useCurrentProject } from '../../../../Utility';
import {
  HomeOutlined,
  CloudServerOutlined,
  DeploymentUnitOutlined,
} from '@ant-design/icons';

const { Panel } = Collapse;

function SearchResultTable({
  files,
  page,
  setPage,
  pageSize,
  filters,
  setFilters,
  onTableChange,
  loading,
  attributeList,
  searchConditions,
  greenRoomTotal,
  coreTotal,
  grAccess,
  coreAccess,
}) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDataSetsModal, setShowDataSetsModal] = useState(false);
  const currentProject = useCurrentProject();

  const currentProjectRole = currentProject[0].permission;
  const columns = [
    {
      title: ' ',
      dataIndex: 'index',
      render: (text, record) => (
        <SearchResultCard
          record={record}
          attributeList={attributeList}
          searchConditions={searchConditions}
        />
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
    },
    getCheckboxProps: (record) => ({
      name: record.name,
    }),
  };

  const locationOnChange = (e) => {
    setFilters({ ...filters, zone: e.target.value });
    setPage(1);
  };

  const openDatasetsModal = () => {
    setShowDataSetsModal(true);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className={styles.search_result_actions}>
        {filters.zone === 'core' ? (
          <Button
            type="link"
            icon={<DeploymentUnitOutlined />}
            disabled={selectedRows.length ? false : true}
            onClick={() => {
              openDatasetsModal();
            }}
          >
            Add to Datasets
          </Button>
        ) : null}

        {grAccess || coreAccess ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: '60px',
              marginTop: '6px',
              width: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <span style={{ margin: '0px 0px 0px 10px', cursor: 'pointer' }}>
              Location:
            </span>

            <Radio.Group
              style={{ marginLeft: 10 }}
              value={filters.zone}
              onChange={locationOnChange}
            >
              {grAccess ? (
                <Radio value="greenroom" style={{ marginRight: '50px' }}>
                  <HomeOutlined style={{ margin: '0px 5px 0px 3px' }} /> Green
                  Room{' '}
                  {typeof greenRoomTotal === 'number' ? (
                    <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                      {greenRoomTotal}
                    </span>
                  ) : (
                    '-'
                  )}
                </Radio>
              ) : null}
              {coreAccess ? (
                <Radio value="core">
                  <CloudServerOutlined style={{ margin: '0px 5px 0px 3px' }} />
                  Core{' '}
                  {typeof coreTotal === 'number' ? (
                    <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                      {coreTotal}
                    </span>
                  ) : (
                    '-'
                  )}
                </Radio>
              ) : null}
            </Radio.Group>
          </div>
        ) : null}
        <DataSetsModal
          visible={showDataSetsModal}
          setVisible={setShowDataSetsModal}
          selectedRows={selectedRows}
        />
      </div>
      <div className={styles.search_result_table}>
        <div style={{ flex: 1 }}>
          <Spin spinning={loading}>
            <Table
              rowSelection={rowSelection}
              rowKey={(record) => record.id}
              className={styles.search_result_table}
              columns={columns}
              dataSource={files}
              pagination={{
                total:
                  filters.zone === 'greenroom' ? greenRoomTotal : coreTotal,
                pageSize: pageSize,
                current: page,
                showSizeChanger: true,
              }}
              onChange={onTableChange}
            />
          </Spin>
        </div>
      </div>
    </div>
  );
}
export default SearchResultTable;
