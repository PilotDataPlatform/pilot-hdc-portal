/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { getVisitCount } from '../../../APIs';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import RecentlyVisitedCard from './RecentlyVisitedCard';
import styles from '../MySpace.module.scss';
const LIST_LENGTH_MAX = 3;
const RecentlyVisitedList = (props) => {
  const containersPermission = useSelector(
    (state) => state.containersPermission,
  );
  const [projectList, setProjectList] = useState([]);
  const [datasetList, setDatasetList] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  useEffect(() => {
    async function initData() {
      try {
        const resProject = await getVisitCount(LIST_LENGTH_MAX, 'project');
        if (resProject?.data?.result && resProject?.data?.result.length) {
          let projectListTemp = resProject?.data?.result.map((project) => {
            const containerDetail = containersPermission.find(
              (container) => container.code === project.code,
            );
            if (!containerDetail) return null;
            return {
              ...project,
              permission: containerDetail.permission,
            };
          });
          projectListTemp = projectListTemp.filter((v) => !!v);
          setProjectList(projectListTemp);
        }
      } catch (e) {
        console.log(e);
      }
      try {
        const resDataset = await getVisitCount(LIST_LENGTH_MAX, 'dataset');
        if (resDataset?.data?.result && resDataset?.data?.result.length) {
          setDatasetList(resDataset?.data?.result);
        }
      } catch (e) {
        console.log(e);
      }

      setStatsLoading(false);
    }
    initData();
  }, []);
  return (
    <Spin spinning={statsLoading}>
      {!statsLoading && datasetList.length === 0 && projectList.length === 0 ? (
        <div className={styles['newsfeed-content']}>
          <span className={styles['newsfeed-content__smile']}>
            <SmileOutlined />
          </span>
          <span className={styles['newsfeed-content__info']}>
            There has been no available data for projects or datasets.
          </span>
        </div>
      ) : (
        <div className={styles['recent-visited']}>
          {projectList.length !== 0 ? (
            <>
              <span className={styles['recent-visited__title-top']}>
                Recently accessed Projects
              </span>
              {projectList.map((proj) => (
                <RecentlyVisitedCard type="projects" data={proj} />
              ))}
            </>
          ) : null}
          {datasetList.length !== 0 ? (
            <>
              {' '}
              <span className={styles['recent-visited__title-bottom']}>
                Recently accessed Datasets
              </span>
              {datasetList.map((dataset) => (
                <RecentlyVisitedCard type="datasetects" data={dataset} />
              ))}
            </>
          ) : null}
        </div>
      )}
    </Spin>
  );
};

export default withRouter(RecentlyVisitedList);
