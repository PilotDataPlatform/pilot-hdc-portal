/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Row, Col, List, Button, message, Spin } from 'antd';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

import BaseCard from './BaseCard';
import styles from '../../index.module.scss';
import { getUserDeletedFiles, markFileForRestore } from '../../../../APIs';
import { FileOutlined, FolderOutlined } from '@ant-design/icons';

const RecentDeletedCard = (userId) => {
  const [deletedItems, setDeletedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  TimeAgo.addLocale(en)
  const timeAgo = new TimeAgo('en')

  const getDeletedItems = () => {
    if (userId) {
      try {
        const response = getUserDeletedFiles();
        response.then(
          (res) => {
            setDeletedItems(res.data.result);
          }
        );
      } catch {
        message.error(
          'Something went wrong while attempting to retrieve deleted items',
        );
      }
      setIsLoading(false);
    }
  };

  const restoreItem = (itemId, projectCode) => {
    try {
      markFileForRestore(itemId, projectCode);
      getDeletedItems();
      message.success(`Item restored successfully`);
      } catch {
        message.error(
          'Something went wrong while attempting to restore deleted item',
        );
      }
  }

  useEffect(() => {
    getDeletedItems();
  }, [userId]);

  return ( deletedItems.length > 0 ?
    <BaseCard
      title={'Recently Deleted'}
      className={styles['user-profile__card--activities']}
    >
      <div className={styles['activities__activity-log']}>
        <div className={styles['activity-log__head']}>
          <Row gutter={[8, 32]}>
            <Col span={8}>
              <span>File/Folder Name</span>
            </Col>
            <Col span={6}>
              <span>Project Name</span>
            </Col>
            <Col span={3}>
              <span>Deleted</span>
            </Col>
            <Col span={2}>
              <span>Actions</span>
            </Col>
          </Row>
        </div>
        <List
          dataSource={deletedItems}
          loading={isLoading}
          key="deleted-log"
          renderItem={(item) => (
            <Row className={styles['activities-log__activity-item']} gutter={[8, 32]}>
              <Col span={8}>
                <span>
                  {item.type === 'file' ? <div><FileOutlined/> {item.name}</div> : <div><FolderOutlined/> {item.name}</div>}
                </span>
              </Col>
              <Col span={6}>
                {item.containerCode ? `${item.containerCode}` : 'Unknown Project'}
              </Col>
              <Col span={3}>
                <span>{timeAgo.format(Date.parse(item.deletedTime), 'mini')}</span>
              </Col>
              <Col span={2}>
                <span>
                  <Button type="primary" onClick={() => restoreItem(item.id, item.containerCode)}>Restore</Button>
                </span>
              </Col>
            </Row>
          )}
        />
      </div>
    </BaseCard> : null
  );
};

export default RecentDeletedCard;