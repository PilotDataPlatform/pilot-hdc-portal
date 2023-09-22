/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Modal, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import styles from './maintenance.module.scss';
import {
  timeConvertWithOffestValue,
  mapMinutesToUnitObj,
} from '../../Utility/timeCovert';

const UpcomingMaintenanceModal = ({
  visible,
  data,
  hideMask,
  onOk,
  onCancel,
  getContainer,
  previewMode = false,
}) => {
  const title = (
    <div className={styles['maintenance-modal__title']}>
      <SettingOutlined />
      <p>{`Upcoming Maintenance`}</p>
    </div>
  );

  const footerButton = (
    <Button
      type="primary"
      className={styles['maintenance-modal__primary-button']}
      onClick={onOk}
    >
      OK
    </Button>
  );

  return (
    <Modal
      className={styles['maintenance-modal']}
      title={title}
      footer={footerButton}
      visible={visible}
      onCancel={onCancel}
      centered
      getContainer={getContainer}
      maskClosable={false}
      maskStyle={
        hideMask
          ? { display: 'none' }
          : {
              background: '#595959BC',
              'backdrop-filter': 'blur(12px)',
              top: '80px',
            }
      }
    >
      <p className={styles['maintenance-modal__message']}>{data.message}</p>
      {previewMode ? (
        <p
          className={styles['maintenance-modal__date']}
        >{`${timeConvertWithOffestValue(
          data?.detail?.maintenanceDate,
          'text',
        )} - Estimated Duration: ${data?.detail?.duration} ${
          data?.detail?.durationUnit
        }`}</p>
      ) : (
        <p
          className={styles['maintenance-modal__date']}
        >{`${timeConvertWithOffestValue(
          data?.effectiveDate,
          'text',
        )} - Estimated Duration: ${
          mapMinutesToUnitObj(data?.durationMinutes).duration
        } ${mapMinutesToUnitObj(data?.durationMinutes).durationUnit}`}</p>
      )}
    </Modal>
  );
};

export default UpcomingMaintenanceModal;
