/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useContext } from 'react';
import { Tooltip, Button, Progress, Upload, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCurrentProject, uploadStarter } from '../../../Utility';
import { UploadQueueContext } from '../../../Context';
import Icon, {
  CloudUploadOutlined,
  DownloadOutlined,
  RestOutlined,
  CopyOutlined,
  WarningOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import styles from '../index.module.scss';
import _ from 'lodash';
import { validateChunkHash } from '../../../Utility/fileUpload/utils';

export const displayName = (fileName) => {
  let shortFileName = fileName.split('/').at(-1);
  if (shortFileName.length > 40) {
    shortFileName = `...${shortFileName.slice(-32)}`;
  }
  return <Tooltip title={fileName}>{shortFileName}</Tooltip>;
};

const getToolTipTitle = (actionType) => {
  switch (actionType) {
    case 'data_transfer':
      return 'file copy';
    case 'data_delete':
      return 'file delete';
    case 'data_download':
      return 'file download';
    case 'data_upload':
      return 'file upload';
  }
};

const getItemIcon = (actionType, iconClass) => {
  switch (actionType) {
    case 'data_transfer':
      return (
        <CopyOutlined
          className={iconClass ? styles[iconClass] : styles.icons}
        />
      );
    case 'data_delete':
      return (
        <RestOutlined
          className={iconClass ? styles[iconClass] : styles.icons}
        />
      );
    case 'data_download':
      return (
        <DownloadOutlined
          className={iconClass ? styles[iconClass] : styles.icons}
        />
      );
    case 'data_upload':
      return (
        <CloudUploadOutlined
          className={iconClass ? styles[iconClass] : styles.icons}
        />
      );
  }
};

export const InProgressListItem = ({
  action,
  name,
  waiting = true,
  iconClass,
}) => (
  <span>
    <Tooltip title={getToolTipTitle(action)}>
      {getItemIcon(action, iconClass)}
    </Tooltip>
    <span style={{ display: 'inline-block', marginLeft: '2%' }}>
      {name}
      {waiting ? (
        <>
          {' - '}
          <span style={{ fontStyle: 'Italic', color: '#A5B0B6' }}>Waiting</span>
        </>
      ) : null}
    </span>
  </span>
);

export const ResumedUploadListItem = ({ action, name, progress }) => {
  const { t } = useTranslation([
    'tooltips',
    'formErrorMessages',
    'errormessages',
  ]);
  const [currentDataset = {}] = useCurrentProject();
  const q = useContext(UploadQueueContext);
  const { username, resumableUploadList } = useSelector((state) => state);
  return (
    <>
      <div style={{ display: 'flex' }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Tooltip title={getToolTipTitle(action)}>
            {getItemIcon(action, 'icons__failed-item')}
          </Tooltip>
          <span style={{ display: 'inline-block', marginLeft: '2%' }}>
            {name}
          </span>
          {progress ? (
            <div style={{ width: '95%' }}>
              <Progress
                status="active"
                size="small"
                percent={Math.floor(100 * progress)}
              />
            </div>
          ) : null}
        </div>
        {progress === null ? (
          <div className={styles['reupload-btn']}>
            <Upload
              showUploadList={false}
              beforeUpload={() => {
                return false;
              }}
              multiple={false}
              disabled={progress && progress > 0}
              fileList={[]}
              onChange={async (value) => {
                let jobType = 'AS_FILE';
                let fileList = value.fileList;
                fileList = _.cloneDeep(fileList);
                const filesWithZeroSize = fileList.filter(
                  (file) => file.size === 0,
                );
                fileList = fileList.filter((file) => file.size > 0);

                if (filesWithZeroSize?.length) {
                  for (let file of filesWithZeroSize) {
                    message.error(
                      `${file.name} ${t(
                        'errormessages:preUpload.emptyFile.0',
                      )}`,
                    );
                  }
                }
                const currentJob = resumableUploadList.find((job) =>
                  job.objectPath.endsWith(fileList[0].name.normalize()),
                );
                const sameFile = await validateChunkHash(
                  fileList[0],
                  currentJob,
                );
                if (currentJob && sameFile) {
                  let filePathArr = currentJob.objectPath.split('/');
                  let folderPath = filePathArr
                    .slice(0, filePathArr.length - 1)
                    .join('/');

                  const data = Object.assign(
                    {},
                    {
                      uploader: username,
                      projectName: currentDataset.name,
                      projectCode: currentDataset.code,
                      fileList,
                      jobType,
                      folderPath,
                      parentFolderId: null,
                      manifest: null,
                    },
                  );

                  if (fileList.length) {
                    uploadStarter(data, q);
                  }
                } else {
                  message.error(
                    `${t('errormessages:resumeUpload.sameFile.0')}`,
                  );
                }
              }}
            >
              <Button
                disabled={progress && progress > 0}
                icon={<PlayCircleOutlined />}
              >
                Re-upload file
              </Button>
            </Upload>
          </div>
        ) : null}
      </div>
      {progress === null ? (
        <div
          style={{
            color: '#850000',
            fontSize: '1rem',
            fontStyle: 'italic',
            fontWeight: 400,
          }}
        >
          <WarningOutlined
            style={{ fontSize: '1.3rem', marginRight: '1rem' }}
          />
          You need to select the same local file to resume
        </div>
      ) : null}
    </>
  );
};
export const ChunkUploadedItem = ({ action, name }) => (
  <span>
    <Tooltip title={getToolTipTitle(action)}>
      {getItemIcon(action, null)}
    </Tooltip>
    <span style={{ display: 'inline-block', marginLeft: '2%' }}>
      {displayName(name)}

      {' - '}
      <span style={{ fontStyle: 'Italic', color: '#A5B0B6' }}>Uploaded</span>
    </span>
  </span>
);

export const FailedListItem = ({ action, name }) => (
  <span style={{ color: '#FF6D72' }}>
    <Tooltip title={getToolTipTitle(action)}>
      {getItemIcon(action, 'icons__failed-item')}
    </Tooltip>
    {displayName(name)}
    {'-'} <span style={{ fontStyle: 'Italic' }}>Failed</span>
  </span>
);

export const CompletedListItem = ({ name, status = 'success' }) => (
  <>
    <Icon
      style={{ marginRight: '2%' }}
      component={() => (
        <img
          alt={status === 'fail' ? 'Failed' : 'Approved'}
          style={{ marginTop: '-25%' }}
          src={
            status === 'fail'
              ? require('../../../Images/Fail-X.png')
              : require('../../../Images/Approved.png')
          }
        />
      )}
    />
    <span className={styles.fileName}>{displayName(name)}</span>
  </>
);
