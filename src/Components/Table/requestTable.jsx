/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import TableWrapper from './TableWrapper';
import { isEqual, sortBy } from 'lodash';
import {
  getResourceRequestsAPI,
  approveResourceRequestAPI,
  getProjectVMs,
  updateUserVM,
} from '../../APIs';
import {
  timeConvert,
  timeConvertWithOffestValue,
  useCurrentProject,
} from '../../Utility';
import camelCase from 'camelcase';
import { useTranslation } from 'react-i18next';
import { namespace, ErrorMessager } from '../../ErrorMessages/index';
import { Tooltip, Button, Checkbox, message, Spin, Empty } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import styles from './requestTable.module.scss';

const ServiceRequestTable = (props) => {
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isVMLoading, setIsVMLoading] = useState(false);
  const [requests, setRequests] = useState(null);
  const [filters, setFilters] = useState({
    page: 0,
    pageSize: 10,
    orderBy: 'requested_at',
    orderType: 'desc',
    filters: {},
  });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState([]);
  const [visibleId, setVisibleId] = useState(0);
  const [selectedVm, setSelectedVm] = useState({});
  const [projectVm, setProjectVm] = useState([]);

  const [currentProject] = useCurrentProject();
  const { t } = useTranslation(['errormessages']);

  const getResourceRequests = async (filters) => {
    try {
      setIsTableLoading(true);
      const res = await getResourceRequestsAPI({
        ...filters,
        projectCode: currentProject.code,
      });

      const { page, result, total } = res.data;
      setRequests(result);
      setTotal(total);
      setPage(page);
      setIsTableLoading(false);
      return res;
    } catch (error) {
      setIsTableLoading(false);
      const errorMessager = new ErrorMessager(
        namespace.userManagement.getServiceRequestAPI,
      );
    }
  };

  const getGuacamoleVM = async () => {
    setIsVMLoading(true);

    try {
      const response = await getProjectVMs(currentProject.code);
      const vmOptions = response.data.result.map((vm) => ({
        label: vm.name,
        value: vm.name,
        id: vm.id,
      }));
      setProjectVm(vmOptions);
    } catch {
      message.error(t('errormessages:guacamole.get.0'));
    }

    setIsVMLoading(false);
  };

  const completeRequest = async (requestId) => {
    const response = await approveResourceRequestAPI(requestId);
    if (response.data.code === 200) getResourceRequests(filters);
  };

  const onChange = (pagination, filter, sorter) => {
    let newFilters = Object.assign({}, filters);

    setPage(pagination.current - 1);
    newFilters.page = pagination.current - 1;

    if (pagination.pageSize) {
      setPageSize(pagination.pageSize);
      newFilters.pageSize = pagination.pageSize;
    }

    let searchText = [];

    if (filter.username && filter.username.length > 0) {
      searchText.push({
        key: 'username',
        value: filter.username[0],
      });

      newFilters.filters['username'] = filter.username[0];
    } else {
      delete newFilters.filters['username'];
    }

    if (filter.email && filter.email.length > 0) {
      searchText.push({
        key: 'email',
        value: filter.email[0],
      });

      newFilters.filters['email'] = filter.email[0];
    } else {
      delete newFilters.filters['email'];
    }

    if (sorter && sorter.order) {
      if (sorter.columnKey) {
        newFilters.orderBy = sorter.columnKey;
      }
      newFilters.orderType = sorter.order === 'ascend' ? 'asc' : 'desc';
    }

    if (sorter && !sorter.order) {
      newFilters = {
        ...newFilters,
        orderBy: 'requested_at',
        orderType: 'desc',
      };
    }

    setFilters(newFilters);
    setSearchText(searchText);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters, dataIndex, confirm) => {
    clearFilters();
    let filters = searchText;
    filters = filters.filter((el) => el.key !== dataIndex);
    setSearchText(filters);
    confirm();
  };

  const parseRecordVMs = (record) => {
    if (record.vmConnections === null) {
      return [];
    }

    const recordConnections = Object.keys(record.vmConnections);

    const checkedList = projectVm.reduce((totalVm, vm) => {
      if (recordConnections.includes(camelCase(vm.value))) {
        totalVm.push(vm.value);
      }
      return totalVm;
    }, []);
    return checkedList;
  };

  const updateVM = async (record, connections) => {
    try {
      await updateUserVM(record.id, connections, currentProject.code);
      return true;
    } catch (err) {
      message.error(
        `${t('errormessages:guacamole.patch.default.0')} ${
          record.username
        }'s ${t('errormessages:guacamole.patch.default.1')}`,
      );
      return false;
    }
  };

  const handleVMConfirm = async (record) => {
    const userCurrentVm = parseRecordVMs(record);
    const hasChanges =
      selectedVm[record.userId] === undefined
        ? false
        : !isEqual(sortBy(userCurrentVm), sortBy(selectedVm[record.userId].vm));

    if (hasChanges) {
      const addConnections = selectedVm[record.userId].vm
        .filter((vm) => !userCurrentVm.includes(vm))
        .map((vmName) => ({
          name: vmName,
          permissions: ['READ'],
          operation: 'add',
        }));

      const removeConnections = userCurrentVm
        .filter((vm) => !selectedVm[record.userId].vm.includes(vm))
        .map((vmName) => ({
          name: vmName,
          permissions: ['READ'],
          operation: 'remove',
        }));

      const connections = [...addConnections, ...removeConnections];
      const updateSuccessful = await updateVM(record, connections);
      if (updateSuccessful) getResourceRequests(filters);
    }

    setSelectedVm({});
    setVisibleId(0);
  };

  const handleCheckBoxChange = (checkedValues, record) => {
    if (!checkedValues.length) {
      setSelectedVm({});
    } else {
      setSelectedVm({ [record.userId]: { vm: checkedValues } });
    }
  };

  const columns = [
    {
      title: 'Account',
      dataIndex: 'username',
      key: 'username',
      sorter: true,
      width: '12%',
      searchKey: 'username',
      render: (text) => {
        return <span style={{ wordBreak: 'break-word' }}>{text}</span>;
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
      width: '19%',
      searchKey: 'email',
    },
    {
      title: 'Request Date',
      dataIndex: 'requestedAt',
      key: 'requested_at',
      sorter: true,
      width: '13%',
      render: (text) => text && timeConvertWithOffestValue(text, 'datetime'),
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      sorter: (a, b) => (a ? 1 : -1),
      width: '9%',
      render: (text, record) => {
        if (text) {
          return (
            <Tooltip placement="bottomLeft" title={<>{text}</>}>
              <span className={styles['message']}>View message</span>
            </Tooltip>
          );
        }
      },
    },
    {
      title: 'VM',
      dataIndex: 'vm',
      key: 'is_completed',
      width: '11%',
      render: (text, record) => {
        return (
          <div className={styles['vm-container']}>
            <div
              onClick={() => {
                if (visibleId === record.id) {
                  setVisibleId(0);
                  return;
                }
                setVisibleId(record.id);
              }}
              className={styles['vm-container__text']}
            >
              <span>
                Select VM{' '}
                {visibleId == record.id ? <UpOutlined /> : <DownOutlined />}
              </span>
            </div>
            {visibleId == record.id ? (
              <div className={styles['vm-selection']}>
                <Spin spinning={isVMLoading}>
                  {!projectVm.length && !isVMLoading ? (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  ) : (
                    <Checkbox.Group
                      options={projectVm}
                      onChange={(checkedValues) => {
                        handleCheckBoxChange(checkedValues, record);
                      }}
                      value={
                        selectedVm[record.userId]
                          ? selectedVm[record.userId].vm
                          : parseRecordVMs(record)
                      }
                    />
                  )}
                </Spin>
                <div className={styles['vm-selection__footer']}>
                  <Button type="text" onClick={() => setVisibleId()}>
                    Close
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => handleVMConfirm(record)}
                  >
                    Confirm Selection
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'isCompleted',
      key: 'is_completed',
      width: '10%',
      render: (text, record) => {
        if (!text) {
          return (
            <div className={styles['request-table__status-pending']}>
              <Button
                type="primary"
                disabled={
                  record.vmConnections === null
                    ? true
                    : !Object.keys(record.vmConnections).length
                }
                onClick={() => completeRequest(record.id)}
              >
                Complete
              </Button>
            </div>
          );
        } else {
          return (
            <div className={styles['request-table__status-approved']}>
              {' '}
              <img alt="Approved" src={require('../../Images/Approved.png')} />
              <span>Completed</span>
            </div>
          );
        }
      },
    },
    {
      title: 'Completed on',
      dataIndex: 'completedAt',
      key: 'completed_at',
      sorter: true,
      width: '13%',
      render: (text) => {
        if (text) {
          return timeConvertWithOffestValue(text, 'datetime');
        } else {
          return '';
        }
      },
    },
  ];

  useEffect(() => {
    async function refreshTable() {
      const res = await getResourceRequests(filters);
      if (
        Object.keys(filters.filters).length === 0 &&
        filters.page === 0 &&
        filters.pageSize === 10 &&
        filters.orderBy === 'requested_at' &&
        filters.orderType === 'desc' &&
        res?.data?.result &&
        res?.data?.result.length > 0
      ) {
        let requestVMTimeRecord = localStorage.getItem('requestVMTimeRecord')
          ? JSON.parse(localStorage.getItem('requestVMTimeRecord'))
          : {};
        requestVMTimeRecord[currentProject.code] =
          res.data.result[0].requestedAt;
        localStorage.setItem(
          'requestVMTimeRecord',
          JSON.stringify(requestVMTimeRecord),
        );
      }
    }
    refreshTable();
  }, [filters]);

  useEffect(() => {
    getGuacamoleVM();
  }, []);

  return (
    <Spin spinning={isTableLoading}>
      <TableWrapper
        variant="request"
        columns={columns}
        onChange={onChange}
        handleReset={handleReset}
        handleSearch={handleSearch}
        dataSource={requests}
        totalItem={total}
        pageSize={pageSize}
        page={page}
      />
    </Spin>
  );
};
export default ServiceRequestTable;
