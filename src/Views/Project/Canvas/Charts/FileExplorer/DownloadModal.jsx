/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import styles from './index.module.scss';

function DownloadModal(props) {
  useEffect(() => {
    if (props.visible) {
      let timer = setTimeout(() => {
        props.setVisible(false);

        clearTimeout(timer);
      }, 5000);
    }
  }, [props.visible]);

  return (
    <div className={styles['download-modal']}>
      <Modal
        visible={props.visible}
        onOk={() => {
          props.setVisible(false);
        }}
        onCancel={() => {
          props.setVisible(false);
        }}
        footer={null}
        centered
        bodyStyle={{ paddingTop: 45, paddingBottom: 30 }}
      >
        <p className={styles['download-notice']}>
          <InfoCircleOutlined /> Please wait a few seconds, while we prepare
          your file{'(s).'}
        </p>
      </Modal>
    </div>
  );
}

export default DownloadModal;
