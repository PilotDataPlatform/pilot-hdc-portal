/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Row, Col, List, Button, message, Spin } from 'antd';

import BaseCard from './BaseCard';
import styles from '../../index.module.scss';
import { getUserProjectActivitiesAPI } from '../../../../APIs';
import { timeConvert } from '../../../../Utility';

const RecentDeletedCard = ({ userId, currentProject = null }) => {
  const [deletedItems, setDeletedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const renderTitle = () => (
    <>Recently Deleted</>
  );

  const getDeletedItems = async (pageNo, pageSizeSet) => {
    if (userId) {
      const params = currentProject
        ? { user_id: userId, project_code: currentProject.code }
        : { user_id: userId };
      params['page'] = pageNo;
      params['page_size'] = pageSizeSet;
      params['order_by'] = 'timestamp';
      params['order_type'] = 'desc';
      params['deleted_only'] = true; // Assuming API supports this filter
      try {
        const response = await getUserProjectActivitiesAPI(params);
        setTotal(response.data.total);
        console.log('Deleted Items Response:', response.data.result);
        // setDeletedItems(response.data.result);
        const items = document.cookie
          .split('; ')
          .filter(cookie => cookie.startsWith('record_'))
          .map(cookie => {
            const [key, rawValue] = cookie.split('=');
            const geid = key.replace('record_', '');
            const value = decodeURIComponent(rawValue);
            try {
              const { name, timestamp, project } = JSON.parse(value);
              return { geid, name, timestamp, project };
            } catch {
              return null;
            }
          })
          .filter(Boolean);
        console.log('Deleted Items:', items);
        setDeletedItems(items);
      } catch {
        message.error(
          'Something went wrong while attempting to retrieve deleted items',
        );
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDeletedItems(page, pageSize);
  }, [userId]);

  async function changePage(pageNo, changedPageSize) {
    setIsLoading(true);
    setPage(pageNo - 1);
    setPageSize(changedPageSize);
    await getDeletedItems(pageNo - 1, changedPageSize);
  }

  function getCookieValue(name) {
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
}

  return (
    <BaseCard
      title={renderTitle()}
      className={styles['user-profile__card--activities']}
    >
      <div className={styles['activities__activity-log']}>
        <div className={styles['activity-log__head']}>
          <Row>
            <Col span={6}>
              <span>Project Name</span>
            </Col>
            <Col span={6}>
              <span>File/Folder Name</span>
            </Col>
            <Col span={8}>
              <span>Date</span>
            </Col>
          </Row>
        </div>
        <List
          dataSource={deletedItems}
          loading={isLoading}
          key="deleted-log"
          renderItem={(item) => (
            <Row className={styles['activities-log__activity-item']}>
              <Col span={6}>
                {item.project ? `${item.project}` : 'Unknown Project'}
              </Col>
              <Col span={6}>
                {item.name}
              </Col>
              <Col span={8}>
                <span>
                  {timeConvert(item.timestamp, 'datetime')}
                </span>
              </Col>
            </Row>
          )}
          pagination={{
            current: page + 1,
            total: total,
            showSizeChanger: true,
            onChange: function (pageNo, pageSizePassed) {
              changePage(pageNo, pageSizePassed);
            },
            onShowSizeChange: (pageNo, changePageSize) => {
              changePage(1, changePageSize);
            },
          }}
        />
      </div>
    </BaseCard>
  );
};

export default RecentDeletedCard;