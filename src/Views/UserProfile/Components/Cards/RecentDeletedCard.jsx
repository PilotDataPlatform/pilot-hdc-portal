/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { Row, Col, List, Button, message, Modal } from 'antd';

import BaseCard from './BaseCard';
import styles from '../../index.module.scss';
import { markFileForRestore, deleteFile } from '../../../../APIs';
import { FileOutlined, FolderOutlined } from '@ant-design/icons';
import { timeConvert } from '../../../../Utility';


const RecentDeletedCard = ({ deletedItems }) => {
  const [items, setItems] = useState(deletedItems);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const restoreItem = async (itemId, projectCode) => {
    try {
      await markFileForRestore(itemId, projectCode);
      setItems(items.filter((item) => item.id !== itemId));
      message.success('Item restored successfully');
    } catch {
      message.error('Something went wrong while attempting to restore deleted item');
    }
  };


  const showDeleteModal = (item) => {
    setItemToDelete(item);
    setIsModalVisible(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) {
      return;
    }
    try {
      await deleteFile(itemToDelete.id, itemToDelete.containerCode);
      setItems(items.filter((item) => item.id !== itemToDelete.id));
      message.success('Item permanently deleted');
    } catch {
      message.error('Something went wrong while attempting to permanently delete item');
    } finally {
      setIsModalVisible(false);
      setItemToDelete(null);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setItemToDelete(null);
  };

  return (
    <BaseCard
      title={'Recently Deleted'}
      className={styles['user-profile__card--deleteditems']}
    >
      <div className={styles['deleteditems__activity-log']}>
        <div className={styles['activity-log__head']}>
          <Row gutter={[5, 5]}>
            <Col span={8}><span>File/Folder Name</span></Col>
            <Col span={5}><span>Project Name</span></Col>
            <Col span={5}><span>Deleted At</span></Col>
            <Col span={6}><span>Actions</span></Col>
          </Row>
        </div>
        <List
          dataSource={items}
          key="deleted-log"
          renderItem={(item) => (
            <Row className={styles['deleteditems-log__activity-item']} gutter={[5, 5]}>
              <Col span={8}>
                <span title={item.name} className={styles['truncate']}>
                  {item.type === 'file' ? <div><FileOutlined/> {item.name}</div> : <div><FolderOutlined/> {item.name}</div>}
                </span>
              </Col>
              <Col span={5} title={item.name} className={styles['truncate']}>
                {item.containerCode ? `${item.containerCode}` : 'Unknown Project'}
              </Col>
              <Col span={5}>
                <span>
                  {timeConvert(item.deletedTime, 'datetime')}
                </span>
              </Col>
              <Col span={6}>
                <div>
                  <Button
                    type="primary"
                    style={{ minWidth: 80, maxWidth: 80, marginRight: 8, marginBottom: 8 }}
                    onClick={async() => await restoreItem(item.id, item.containerCode)}
                  >
                    Restore
                  </Button>
                  <Button
                    danger
                    style={{ minWidth: 80, maxWidth: 80, marginBottom: 8 }}
                    onClick={() => showDeleteModal(item)}
                  >
                    Delete
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        />
        <Modal
          title="Confirm Deletion"
          open={isModalVisible}
          onOk={handleDelete}
          onCancel={handleCancel}
          okText="Delete"
          okButtonProps={{ danger: true }}
        >
          Are you sure you want to permanently delete the {itemToDelete?.type} {itemToDelete?.name}?
        </Modal>
      </div>
    </BaseCard>
  );
};

export default RecentDeletedCard;