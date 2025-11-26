/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { getDatasetSharingRequests, processDatasetSharingRequest } from '../../../APIs';
import { timeConvertWithOffestValue, useCurrentProject } from '../../../Utility';
import { Space, Button, Spin, message, Table } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { tokenManager } from '../../../Service/tokenManager';

const ProcessingButtons = ({ itemId, onProcessCallback }) => {
  const [isAccepting, setAccepting] = useState(false);
  const [isDeclining, setDeclining] = useState(false);

  const onProcessingClick = (versionSharingRequestId, status, sessionId) => {
    return processDatasetSharingRequest(versionSharingRequestId, status, sessionId).then(() => {
      message.success(`Dataset Version Sharing Request has been ${status}.`);
      onProcessCallback();
    });
  };

  const sessionId = tokenManager.getLocalCookie('sessionId');

  return (
    <Space>
      <Button
        value='accept'
        icon={<CheckOutlined />}
        size='small'
        onClick={() => {
          setAccepting(true);
          onProcessingClick(itemId, 'accepted', sessionId).finally(() => {
            setAccepting(false);
          });
        }}
        loading={isAccepting}
        disabled={isDeclining}
      >
        Accept
      </Button>
      <Button
        value='decline'
        icon={<CloseOutlined />}
        size='small'
        onClick={() => {
          setDeclining(true);
          onProcessingClick(itemId, 'declined', null).finally(() => {
            setDeclining(false);
          });
        }}
        loading={isDeclining}
        disabled={isAccepting}
      >
        Decline
      </Button>
    </Space>
  );
};

const DatasetSharingRequestTable = () => {
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [requests, setRequests] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [currentProject] = useCurrentProject();

  const loadDatasetSharingRequestsTable = async () => {
    try {
      setIsTableLoading(true);
      const response = await getDatasetSharingRequests(currentProject.code);

      const { page, result, total } = response.data;
      setRequests(result);
      setTotal(total);
      setPage(page);
      setPageSize(pageSize);
      setIsTableLoading(false);
    } catch (error) {
      setIsTableLoading(false);
    }
  };

  const columns = [
    {
      title: 'Created',
      dataIndex: 'createdAt',
      width: '15%',
      align: 'center',
      render: (text) => text && timeConvertWithOffestValue(text, 'datetime'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Source Project Code',
      dataIndex: 'sourceProjectCode',
      width: '15%',
      align: 'center',
    },
    {
      title: 'Dataset Code',
      dataIndex: 'datasetCode',
      width: '15%',
      align: 'center',
    },
    {
      title: 'Dataset Version',
      dataIndex: 'versionNumber',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Shared By',
      dataIndex: 'initiatorUsername',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Processed By',
      dataIndex: 'receiverUsername',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Action',
      width: '15%',
      align: 'center',
      render: (item) => {
        return ['accepted', 'declined'].includes(item.status) ? null : (
          <ProcessingButtons itemId={item.id} onProcessCallback={loadDatasetSharingRequestsTable} />
        );
      },
    },
  ];

  useEffect(() => {
    loadDatasetSharingRequestsTable();
  }, []);

  return (
    <Spin spinning={isTableLoading}>
      <Table
        variant='versionRequest'
        columns={columns}
        dataSource={requests}
        totalItem={total}
        pageSize={pageSize}
        page={page}
      />
    </Spin>
  );
};
export default DatasetSharingRequestTable;
