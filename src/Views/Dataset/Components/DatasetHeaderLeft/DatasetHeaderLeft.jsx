/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useEffect, useState } from 'react';
import {
  PageHeader,
  Tooltip,
  Dropdown,
  Menu,
  Space,
  Button,
  message,
} from 'antd';
import { DownOutlined, DownloadOutlined } from '@ant-design/icons';
import styles from './DatasetHeaderLeft.module.scss';
import { useSelector } from 'react-redux';
import moment from 'moment';
import {
  downloadDataset,
  checkDatasetDownloadStatusAPI,
} from '../../../../APIs';
import { useTranslation } from 'react-i18next';
import { tokenManager } from '../../../../Service/tokenManager';
import { API_PATH, DOWNLOAD_PREFIX_V1 } from '../../../../config';

export default function DatasetHeaderLeft(props) {
  const { setDatasetDrawerVisibility } = props;
  const { t } = useTranslation(['errormessages', 'success']);
  const {
    basicInfo: { title, timeCreated, creator, geid, code },
    projectName,
  } = useSelector((state) => state.datasetInfo);
  const username = useSelector((state) => state.username);
  const [downloading, setDownloading] = useState(false);
  const [downloadHash, setDownloadHash] = useState(null);
  const menu = (
    <Menu>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          1st menu item
        </a>
      </Menu.Item>
    </Menu>
  );

  const downloadEntireDataset = async () => {
    const sessionId = tokenManager.getLocalCookie('sessionId');
    let res;
    setDownloading(true);
    try {
      res = await downloadDataset(code, username, sessionId);
    } catch (e) {
      message.error(t('errormessages:downloadDataset.default.0'));
      setDownloading(false);
      return;
    }
    if (res?.data?.result?.payload?.hashCode) {
      setDownloadHash(res.data?.result?.payload?.hashCode);
    } else {
      message.error(t('errormessages:downloadDataset.default.0'));
      setDownloading(false);
    }
  };
  const checkDownload = async (timer) => {
    const res = await checkDatasetDownloadStatusAPI(downloadHash);
    const { status } = res.data.result;
    if (status === 'SUCCEED') {
      setDownloadHash(null);
      setDownloading(false);
      clearInterval(timer);
      if (downloadHash) {
        const url = API_PATH + DOWNLOAD_PREFIX_V1 + `/` + downloadHash;
        window.open(url, '_blank');
      } else {
        message.error(t('errormessages:downloadDataset.default.0'));
      }
    }
  };
  useEffect(() => {
    if (downloadHash) {
      const timer = setInterval(() => {
        checkDownload(timer);
      }, 2 * 1000);
      checkDownload(timer);
    }
  }, [downloadHash]);
  return (
    <>
      <>
        <PageHeader
          ghost={true}
          className={styles['pageHeader']}
          title={getTitle(title, setDatasetDrawerVisibility)}
        ></PageHeader>
      </>
      <>
        <div className={styles['createdTime']}>
          <b>
            {' '}
            Dataset Code: {code} / Created on{' '}
            {moment.utc(timeCreated).local().format('YYYY-MM-DD')}
          </b>{' '}
          by <b className={styles['editor']}>{creator || 'N/A'}</b>
        </div>
        <Button
          className={styles['download-button']}
          type="link"
          loading={downloading}
          icon={<DownloadOutlined />}
          onClick={downloadEntireDataset}
        >
          Download
        </Button>
      </>
    </>
  );
}

const getTitle = (title, setDatasetDrawerVisibility) => {
  title = title ? title : 'N/A';
  const titleComponent =
    title.length > 60 ? (
      <div style={{ display: 'flex' }}>
        <Tooltip title={title}>
          <div className={styles['toolTip-div']}>
            <span>{`${title.slice(0, 60)}...`}</span>
          </div>
        </Tooltip>
        <p
          style={{
            cursor: 'pointer',
            margin: '0px 0px 0px 20px',
            fontSize: '12px',
            textDecoration: 'underline',
            color: '#595959',
            fontWeight: 500,
          }}
          onClick={() => setDatasetDrawerVisibility(true)}
        >
          Versions
        </p>
      </div>
    ) : (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className={styles['no-toolTip-div']}>
          <span>{title}</span>
        </div>
        <p
          style={{
            cursor: 'pointer',
            margin: '0px 0px 0px 20px',
            fontSize: '12px',
            textDecoration: 'underline',
            color: '#595959',
            fontWeight: 500,
          }}
          onClick={() => setDatasetDrawerVisibility(true)}
        >
          Versions
        </p>
      </div>
    );

  return titleComponent;
};
