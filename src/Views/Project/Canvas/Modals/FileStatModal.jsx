/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import {
  Timeline,
  Tabs,
  DatePicker,
  Form,
  Select,
  Button,
  Pagination,
  Empty,
  Spin,
  Space,
  Tooltip,
} from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';

import { getUserOnProjectAPI, getAuditLogsApi } from '../../../../APIs';
import {
  objectKeysToCamelCase,
  timeConvert,
  useCurrentProject,
} from '../../../../Utility';

import { timeConvertWithOffestValue } from '../../../../Utility/timeCovert';

import CustomPagination from '../../../../Components/Pagination/Pagination';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

const FileStatModal = (props) => {
  const [form] = Form.useForm();
  const today = new Date();
  const { t } = useTranslation(['tooltips', 'formErrorMessages']);

  const [treeData, setTreeData] = useState([]);
  const [action, setAction] = useState('upload');
  const [dateRange, setDateRange] = useState([
    moment(today, dateFormat),
    moment(today, dateFormat),
  ]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const { currentUser, isAdmin } = props;
  const containersPermission = useSelector(
    (state) => state.containersPermission,
  );
  const username = useSelector((state) => state.username);
  const [currentDataset] = useCurrentProject();

  const currentPermission = containersPermission.find(
    (el) => el.code === currentDataset.code,
  );

  useEffect(() => {
    const now = moment();

    if (props.isAdmin) {
      getUserOnProjectAPI(currentDataset.globalEntityId).then((res) => {
        const result = objectKeysToCamelCase(res.data.result);
        setUsers(result);

        setSelectedUser('all');
        form.setFieldsValue({ user: 'all' });
        form.setFieldsValue({
          date: [moment(today, dateFormat), moment(today, dateFormat)],
        });
        form.setFieldsValue({ action: 'upload' });

        const paginationParams = {
          page: 1,
          page_size: 10,
        };
        const query = {
          activity_type: 'upload',
          activity_time_start: now.startOf('day').utc().format(),
          activity_time_end: now.endOf('day').utc().format(),
          sort_by: 'activity_time',
          sort_order: 'desc',
        };
        getAuditLogsApi(currentDataset.globalEntityId, paginationParams, query)
          .then((res) => {
            setTreeData(res.data.result);
            setTotal(res.data.total);
          })
          .finally(() => {
            setLoading(false);
          });
      });
    } else {
      const users = [];
      users.push({
        name: username,
      });
      setUsers(users);
      setSelectedUser(username);
      form.setFieldsValue({ user: username });
      form.setFieldsValue({
        date: [moment(today, dateFormat), moment(today, dateFormat)],
      });
      form.setFieldsValue({ action: 'upload' });

      const paginationParams = {
        page: 0,
        page_size: 10,
      };
      const query = {
        activity_type: 'upload',
        activity_time_start: now.startOf('day').utc().format(),
        activity_time_end: now.endOf('day').utc().format(),
        sort_by: 'activity_time',
        sort_order: 'desc',
        user: username,
      };
      getAuditLogsApi(currentDataset.globalEntityId, paginationParams, query)
        .then((res) => {
          setTreeData(res.data.result);
          setTotal(res.data.total);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [currentDataset]);

  const userOptions = users.map((el) => (
    <Option value={el.name}>{el.name}</Option>
  ));

  if (isAdmin) userOptions.unshift(<Option value="all">All Users</Option>);

  const disabledDate = (current) => {
    return current && current >= moment().endOf('day');
  };

  const onFinish = (values) => {
    setIsSearching(true);
    const params = {};
    setLoading(true);
    const date = values.date;

    setDateRange([
      moment(date[0]).format('YYYY-MM-DD'),
      moment(date[1]).format('YYYY-MM-DD'),
    ]);

    if (values.user !== 'all') params.user = values.user;

    params['activity_type'] = values.action;
    params['size'] = 10;

    setTreeData([]);
    setAction(values.action);
    setSelectedUser(values.user);

    let operation = 'copy';
    if (values.action === 'delete') operation = 'delete';
    if (values.action === 'download') operation = 'download';
    if (values.action === 'upload') operation = 'upload';
    if (values.action === 'all') operation = '';

    const paginationParams = {
      page: 1,
      page_size: 10,
    };
    const query = {
      activity_type: operation,
      activity_time_start: moment(date[0]).startOf('day').utc().format(),
      activity_time_end: moment(date[1]).endOf('day').utc().format(),
      sort_by: 'activity_time',
      sort_order: 'desc',
    };
    if (values.user !== 'all') query['user'] = values.user;
    getAuditLogsApi(currentDataset.globalEntityId, paginationParams, query)
      .then((res) => {
        setTreeData(res.data.result);
        setTotal(res.data.total);
        setPage(1);
      })
      .finally(() => {
        setLoading(false);
        setIsSearching(false);
      });
  };

  const onReset = () => {
    form.resetFields();
    setTreeData([]);
  };

  const onChangePage = (val) => {
    setPage(val.cur);
    setLoading(true);

    let operation = 'copy';
    if (action === 'delete') operation = 'delete';
    if (action === 'download') operation = 'download';
    if (action === 'upload') operation = 'upload';
    if (action === 'all') operation = 'all';

    const paginationParams = {
      page: val.cur,
      page_size: 10,
    };
    const query = {
      activity_type: operation,
      activity_time_start: moment(dateRange[0]).startOf('day').utc().format(),
      activity_time_end: moment(dateRange[1]).endOf('day').utc().format(),
      sort_by: 'activity_time',
      sort_order: 'desc',
    };
    if (selectedUser !== 'all') query['user'] = selectedUser;
    getAuditLogsApi(currentDataset.globalEntityId, paginationParams, query)
      .then((res) => {
        setTreeData(res.data.result);
        setTotal(res.data.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  let resultContent = (
    <Empty description="No Results" image={Empty.PRESENTED_IMAGE_SIMPLE} />
  );

  const filterData = treeData;

  if (filterData && filterData.length > 0) {
    resultContent = (
      <div>
        <Timeline style={{ marginTop: 40 }}>
          {filterData &&
            filterData.map((i) => {
              let { activityType, activityTime, itemName, user, changes, networkOrigin } = i;
              let localTime = timeConvertWithOffestValue(
                activityTime,
                'datetime',
              );

              let operate = 'copied';
              if (activityType === 'delete') operate = 'deleted';
              if (activityType === 'download') operate = 'downloaded';
              if (activityType === 'upload') operate = 'uploaded';

              if (['copied'].includes(operate)) {
                const originPathArray =
                  changes && changes[0]['oldValue'].split('/');
                const pathArray = changes && changes[0]['newValue'].split('/');

                const originPathName =
                  originPathArray &&
                  originPathArray.slice(0, originPathArray.length - 1);
                const pathName =
                  pathArray && pathArray.slice(0, pathArray.length - 1);

                return (
                  <Timeline.Item color="green">
                    <span>
                      {user} {operate} {itemName} from{' '}
                      {originPathName.join('/')} to {pathName.join('/')} at{' '}
                      {localTime}
                    </span>
                  </Timeline.Item>
                );
              } else if (operate === 'deleted') {
                return (
                  <Timeline.Item color="green">
                    <span>
                      {user} {operate} {itemName} from {i.itemParentPath} at{' '}
                      {localTime}
                    </span>
                  </Timeline.Item>
                );
              } else if (operate === 'uploaded') {
                return (
                  <Timeline.Item color="green">
                    {user} {operate} {itemName} at {localTime} from {networkOrigin} location
                  </Timeline.Item>
                );
              }

              return (
                <Timeline.Item color="green">
                  {user} {operate} {itemName} at {localTime} from {networkOrigin} location
                </Timeline.Item>
              );
            })}
        </Timeline>

        <CustomPagination
          onChange={onChangePage}
          total={
            page === 0 && filterData.length < 10 ? filterData.length : total
          }
          data={filterData}
          defaultPage={1}
          defaultSize={10}
          showPageSize={false}
        />
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 15 }}>
      <Tabs type="card">
        <TabPane tab="Search by" key="filters">
          <Form
            form={form}
            name="advanced_search"
            style={{
              padding: 24,
              background: '#fbfbfb',
              border: '1px solid #d9d9d9',
              borderRadius: 6,
            }}
            onFinish={onFinish}
            layout="vertical"
          >
            <div className={styles.filterWrapper}>
              <div className={styles.fieldGroup}>
                <Form.Item
                  name="date"
                  rules={[
                    {
                      required: true,
                      message: t(
                        'formErrorMessages:project.fileStatSearch.date.empty',
                      ),
                    },
                  ]}
                  label="Date"
                  className={styles.formItem}
                >
                  <RangePicker
                    disabledDate={disabledDate}
                    style={{ minWidth: 100, borderRadius: 6 }}
                  />
                </Form.Item>
              </div>
              <div className={styles.fieldGroup}>
                <Form.Item
                  name="user"
                  rules={[
                    {
                      required: true,
                      message: t(
                        'formErrorMessages:project.fileStatSearch.user.empty',
                      ),
                    },
                  ]}
                  label="User"
                  className={styles.formItem}
                >
                  <Select style={{ minWidth: 100 }}>{userOptions}</Select>
                </Form.Item>
              </div>
              <div className={styles.fieldGroup}>
                <Form.Item
                  name="action"
                  rules={[
                    {
                      required: true,
                      message: t(
                        'formErrorMessages:project.fileStatSearch.type.empty',
                      ),
                    },
                  ]}
                  label="Type"
                  className={styles.formItem}
                >
                  <Select style={{ minWidth: 100 }}>
                    <Option value="upload">Upload</Option>
                    <Option value="download">Download</Option>
                    {currentPermission.permission === 'admin' ? (
                      <Option value="copy">Copy</Option>
                    ) : null}
                    <Option value="delete">Delete</Option>
                    <Option value="all">All</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className={styles.fieldGroup}>
                <Space className={styles.buttons}>
                  <Button
                    loading={isSearching}
                    type="primary"
                    htmlType="submit"
                    style={{ borderRadius: 6 }}
                  >
                    Search
                  </Button>
                  <Button style={{ borderRadius: 6 }} onClick={onReset}>
                    Clear
                  </Button>
                </Space>
              </div>
            </div>
          </Form>
        </TabPane>
      </Tabs>

      <Spin spinning={loading}>{resultContent}</Spin>
    </div>
  );
};

export default FileStatModal;
