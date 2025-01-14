/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, message } from 'antd';
import styles from '../../index.module.scss';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { deployWorkbenchAPI } from '../../../../../APIs';
import { useTranslation } from 'react-i18next';
import { setCurrentProjectWorkbench } from '../../../../../Redux/actions';
import variables from '../../../../../Themes/constants.scss';

const modalTitle = (
  <p style={{ padding: '14px 0px 0px 29px' }}>
    <ExclamationCircleOutlined
      style={{ color: '#FF9418', marginRight: '8px' }}
    />
    Confirmation
  </p>
);

const WorkbenchDeployModal = (props) => {
  const { t } = useTranslation(['errormessages', 'success']);
  const [btnLoading, setBtnLoading] = useState(false);
  const {
    showModal,
    workbench,
    closeModal,
    projectGeid,
    setCurrentProjectWorkbench,
  } = props;

  const deployWorkbench = async () => {
    try {
      setBtnLoading(true);
      const res = await deployWorkbenchAPI(
        projectGeid,
        workbench.toLowerCase(),
      );
      if (res.data.result) {
        setBtnLoading(false);
        setCurrentProjectWorkbench();
        closeModal();
      }
    } catch (error) {
      setBtnLoading(false);
      message.error(
        t('errormessages:projectWorkench.deployWorkbench.default.0'),
      );
    }
  };

  return (
    <Modal
      className={styles.workbench_modal}
      title={modalTitle}
      visible={showModal}
      maskClosable={false}
      centered={true}
      footer={null}
      closable={false}
    >
      <div>
        <p style={{ marginLeft: '38px' }}>
          Do you confirm to configure{' '}
          <span style={{ color: variables.primaryColor1 }}>
            <strong>{workbench}</strong>
          </span>
          ?
        </p>
        <div style={{ textAlign: 'end', marginRight: '24px' }}>
          <Button type="text" style={{ border: 'none' }} onClick={closeModal}>
            Cancel
          </Button>
          <Button
            type="primary"
            style={{
              borderRadius: '6px',
              width: '80px',
              height: '30px',
              padding: '0px',
            }}
            loading={btnLoading}
            onClick={() => {
              deployWorkbench();
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default connect(null, { setCurrentProjectWorkbench })(
  WorkbenchDeployModal,
);
