/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Badge, Popover, Tooltip } from 'antd';
import DatasetFilePanelContent from './DatasetFilePanelContent';
import Icon from '@ant-design/icons';
import styles from './DatasetFilePanel.module.scss';
import { useSelector } from 'react-redux';
import { JOB_STATUS } from '../../../../Components/Layout/FilePanel/jobStatus';

const DatasetFilePanel = () => {
  const {
    import: importDataset,
    rename,
    delete: deleteDataset,
    move,
  } = useSelector((state) => state.datasetFileOperations);

  const allOperationList = [
    ...(importDataset ? importDataset : []),
    ...(rename ? rename : []),
    ...(deleteDataset ? deleteDataset : []),
    ...(move ? move : []),
  ];

  const filePanelStatus = (allOperationList) => {
    if (allOperationList.length === 0) {
      return '';
    }
    const failedList = allOperationList.filter((el) => el.status === JOB_STATUS.FAILED);
    if (failedList.length > 0) {
      return JOB_STATUS.FAILED;
    } else {
      return JOB_STATUS.SUCCEED;
    }
  };

  return (
    <Tooltip title={'Dataset Status'} placement="top">
      <Popover
        className={styles.file_panel}
        placement="bottomRight"
        content={<DatasetFilePanelContent />}
        trigger="click"
        getPopupContainer={(trigger) => {
          return document.getElementById('global_site_header');
        }}
      >
        <div>
          <Badge
            className={styles.badge}
            status={filePanelStatus(allOperationList)}
          >
            <Icon
              style={{ padding: '15px 15px 5px 15px' }}
              component={() => (
                <img
                  className="pic"
                  src={require('../../../../Images/FilePanel.png')}
                />
              )}
            />
          </Badge>
        </div>
      </Popover>
    </Tooltip>
  );
};

export default DatasetFilePanel;
