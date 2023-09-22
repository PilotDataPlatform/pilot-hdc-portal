/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import styles from '../../index.module.scss';

const WorkbenchWarningModal = (props) => {
  const { showModal, workbench, closeModal } = props;
  return (
    <Modal
      title={`${workbench} Deployment`}
      className={styles.workbench_warn_modal}
      visible={showModal}
      maskClosable={false}
      centered={true}
      footer={null}
      closable={true}
      onCancel={() => {
        closeModal();
      }}
    >
      <div className={styles.workbench_warn_modal__content}>
        <p>
          {workbench} is not yet deployed,
          <br /> please come back to complete when it’s deployed
        </p>
        <div>
          <Button type="primary" onClick={closeModal}>
            Ok
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default WorkbenchWarningModal;
