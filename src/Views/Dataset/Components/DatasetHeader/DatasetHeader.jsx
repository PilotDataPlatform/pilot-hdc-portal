/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Card, message, Skeleton } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import styles from './DatasetHeader.module.scss';
import DatasetHeaderLeft from '../DatasetHeaderLeft/DatasetHeaderLeft';
import DatasetHeaderRight from '../DatasetHeaderRight/DatasetHeaderRight';
import { useHistory, useParams } from 'react-router-dom';
import {
  getDatasetByDatasetCode,
  getProjectInfoAPI,
  getDatasetVersionsAPI,
  getBidsResult,
} from '../../../../APIs';
import { useDispatch, useSelector } from 'react-redux';
import { datasetInfoCreators } from '../../../../Redux/actions';
import { useTranslation } from 'react-i18next';

export default function DatasetHeader(props) {
  const { setDatasetDrawerVisibility } = props;
  const history = useHistory();
  const { datasetCode } = useParams();
  const dispatch = useDispatch();
  const { loading, basicInfo } = useSelector((state) => state.datasetInfo);
  const { t } = useTranslation(['errormessages']);

  const getDatasetVersions = async () => {
    const res = await getDatasetVersionsAPI(basicInfo.geid);
    res.data.result = res.data.result.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    if (res.data.result.length > 0) {
      dispatch(
        datasetInfoCreators.setDatasetVersion(res.data.result[0].version),
      );
    }
  };

  useEffect(() => {
    if (basicInfo.geid) {
      getDatasetVersions();
    }
  }, [basicInfo.geid]);

  useEffect(() => {
    init();
  }, [datasetCode]);

  async function getProjectInfo(projectGeid) {
    try {
      const res = await getProjectInfoAPI(projectGeid);
      const projectInfo = res.data.result;
      dispatch(datasetInfoCreators.setProjectName(projectInfo.name));
    } catch (error) {
      message.error(t('errormessages:getDatasetInfo.projectNameErr.0'));
    }
  }

  const init = async () => {
    dispatch(datasetInfoCreators.setLoading(true));

    try {
      const { data: basicInfo } = await getDatasetByDatasetCode(datasetCode);
      if (basicInfo.code && basicInfo.type === 'BIDS') {
        try {
          const bidsResult = await getBidsResult(basicInfo.code);
          if (
            bidsResult.status === 200 &&
            bidsResult.data.result.validateOutput
          ) {
            basicInfo['bidsResult'] = bidsResult.data.result.validateOutput;
            basicInfo['bidsUpdatedTime'] = bidsResult.data.result.updatedTime;
            basicInfo['bidsCreatedTime'] = bidsResult.data.result.createdTime;
            basicInfo['bidsLoading'] = false;
          }
        } catch (error) {}
      }
      dispatch(datasetInfoCreators.setDatasetVersion(''));
      dispatch(datasetInfoCreators.setBasicInfo(basicInfo));
      dispatch(datasetInfoCreators.setHasInit(true));

      if (basicInfo?.projectGeid) {
        await getProjectInfo(basicInfo.projectGeid);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        history.push('/error/404');
      } else if (error.response?.status === 403) {
        history.push('/error/403');
      } else {
        message.error(t('errormessages:getDatasetInfo.default.0'));
      }
    } finally {
      dispatch(datasetInfoCreators.setLoading(false));
    }
  };

  const goBack = () => {
    history.push('/datasets');
  };

  return (
    <Card className={styles['dataset-header-card']}>
      <Skeleton loading={loading}>
        <div className={styles['back-button']}>
          <LeftOutlined onClick={goBack} />
        </div>

        <div className={styles['left']}>
          <DatasetHeaderLeft
            setDatasetDrawerVisibility={setDatasetDrawerVisibility}
          />
        </div>

        <div className={styles['right']}>
          <DatasetHeaderRight />
        </div>
      </Skeleton>
    </Card>
  );
}
