/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Row, Col, List, message } from 'antd';

import BaseCard from './BaseCard';
import RecentActivitiesItem from '../ListItems/RecentActivitiesItem';
import styles from '../../index.module.scss';
import { getUserProjectActivitiesAPI } from '../../../../APIs';

const RecentActivitiesCard = ({ userId, currentProject = null }) => {
  const [projectActivities, setProjectActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const renderTitle = () => {
    if (currentProject) {
      return (
        <>
          Lastest Account Activities{' '}
          <span style={{ fontWeight: 400 }}> - {currentProject.name}</span>
        </>
      );
    } else {
      return (
        <>
          Lastest Account Activities{' '}
          {projectActivities.length ? (
            <span style={{ fontWeight: 400 }}> - All Projects</span>
          ) : null}
        </>
      );
    }
  };
  const getUserProjectActivities = async (pageNo, pageSizeSet) => {
    if (userId) {
      const params = currentProject
        ? { user_id: userId, project_code: currentProject.code }
        : { user_id: userId };
      params['page'] = pageNo;
      params['page_size'] = pageSizeSet;
      params['order_by'] = 'timestamp';
      params['order_type'] = 'desc';
      try {
        const userActivitiesResponse = await getUserProjectActivitiesAPI(
          params,
        );
        setTotal(userActivitiesResponse.data.total);
        setProjectActivities(userActivitiesResponse.data.result);
      } catch {
        message.error(
          'Something went wrong while attempt to retrieve project activities',
        );
      }
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getUserProjectActivities(page, pageSize);
  }, [userId]);
  async function changePage(pageNo, changedPageSize) {
    setIsLoading(true);
    setPage(pageNo - 1);
    setPageSize(changedPageSize);
    await getUserProjectActivities(pageNo - 1, changedPageSize);
  }
  return (
    <BaseCard
      title={renderTitle()}
      className={styles['user-profile__card--activities']}
    >
      <div className={styles['activities__activity-log']}>
        <div className={styles['activity-log__head']}>
          <Row>
            <Col flex="0 0 150px">
              <span>Date</span>
            </Col>
            <Col>
              <span>Action</span>
            </Col>
          </Row>
        </div>
        <List
          dataSource={projectActivities}
          loading={isLoading}
          key="activity-log"
          renderItem={(activity) => (
            <RecentActivitiesItem activity={activity} />
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

export default RecentActivitiesCard;
