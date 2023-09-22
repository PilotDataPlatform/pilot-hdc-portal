/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import { message, Spin } from 'antd';
import {
  FileTextOutlined,
  HddOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import HeatMapTabSwitcher from '../Charts/Card/HeatMapTabSwitcher';
import { StackedAreaPlot } from '../Charts/Card';
import { useTheme } from '../../../../Themes/theme';
import styles from './index.module.scss';
import {
  convertToFileSizeInUnit,
  setLabelsDate,
  getCurrentYear,
  getFileSize,
  curTimeZoneOffset,
  useCurrentProject,
  getProjectRolePermission,
  permissionResource,
  permissionOperation,
} from '../../../../Utility';
import {
  getProjectStatistics,
  getProjectFileSize,
  getProjectActivity,
  getUserOnProjectAPI,
} from '../../../../APIs';
import { convertLargeNumToAbbreviated } from '../../../../Utility/convertLargeNumToAbbreviated';
import { Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import { PanelKey } from '../Charts/FileExplorer/RawTableValues';
import { projectRoutes } from '../../../../Routes';

function Charts() {
  const theme = useTheme();
  const { t } = useTranslation(['errormessages']);
  const [currentProject] = useCurrentProject();

  const [projectStats, setProjectStats] = useState([]);
  const [isProjectStatsLoading, setIsProjectStatsLoading] = useState(true);

  const [projectFileSize, setProjectFileSize] = useState([]);
  const [isProjectFileSizeLoading, setIsProjectFileSizeLoading] =
    useState(true);

  const [projectFileActivity, setProjectFileActivity] = useState({
    download: [],
    upload: [],
    delete: [],
    copy: [],
  });
  const [isProjectFileActivityLoading, setIsProjectFileActivityLoading] =
    useState(true);

  const rolePermissions = useSelector((state) => state.rolePermissions.roles);

  const SAPConfig = useMemo(
    () => ({
      meta: {
        size: {
          type: 'linear',
          formatter: (val) => convertToFileSizeInUnit(val),
        },
        date: {
          range: [0, 1],
          formatter: (val) => setLabelsDate(val, SAPCurrentYear),
        },
      },
    }),
    [projectFileSize],
  );
  const tzOffset = curTimeZoneOffset();

  const SAPDataField = {
    xField: 'date',
    yField: 'size',
    seriesField: 'source',
  };
  const SAPCurrentYear = getCurrentYear(projectFileSize);

  const heatMapDataField = {
    xField: 'week',
    yField: 'day',
    colorField: 'frequency',
  };

  const folderRouting = useSelector(
    (state) => state.fileExplorer && state.fileExplorer.folderRouting,
  );

  const username = useSelector((state) => state.username);

  const getStatAttrs = (meta, stat) => {
    switch (meta) {
      case 'totalCount':
        return {
          class: 'file-total',
          title: 'Total Files',
          icon: <FileTextOutlined />,
          stat: convertLargeNumToAbbreviated(stat),
        };
      case 'totalSize':
        return {
          class: 'file-size',
          title: 'Total File Size',
          icon: <HddOutlined />,
          stat: getFileSize(stat, { roundingLimit: 1 }),
        };
      case 'totalUsers':
        return {
          class: 'users-total',
          title: 'Project Members',
          icon: <TeamOutlined />,
          stat,
        };
      case 'todayUploaded':
        return {
          class: 'uploaded',
          title: 'Uploaded',
          icon: <CloudUploadOutlined />,
          stat,
        };
      case 'todayDownloaded':
        return {
          class: 'downloaded',
          title: 'Downloaded',
          icon: <DownloadOutlined />,
          stat,
        };
    }
  };

  useEffect(() => {
    async function fetchProjectStats() {
      if (currentProject?.code) {
        const params = { time_zone: tzOffset };
        try {
          const statsResults = await getProjectStatistics(
            params,
            currentProject.code,
          );

          const result = Object.keys(statsResults.data).map((stat) => ({
            [stat]: statsResults.data[stat],
          }));

          if (currentProject.permission === 'admin') {
            const usersResults = await getUserOnProjectAPI(currentProject.id, {
              page: 0,
              pageSize: 10,
              orderBy: 'time_created',
              orderType: 'desc',
            });
            result.splice(1, 0, {
              user: { totalUsers: usersResults.data.total },
            });
          }
          setProjectStats(result);
        } catch {
          message.error(t('errormessages:projectMetaData:statistics:0'));
        }

        setIsProjectStatsLoading(false);
      }
    }
    fetchProjectStats();
  }, [currentProject]);

  useEffect(() => {
    async function fetchProjectFileSize() {
      if (currentProject?.code) {
        const toMonth = moment().endOf('month').format('YYYY-MM-DDTHH:mm:ss');
        const fromMonth = moment()
          .subtract(15, 'months')
          .startOf('month')
          .format('YYYY-MM-DDTHH:mm:ss');

        const params = {
          from: fromMonth,
          to: toMonth,
          group_by: 'month',
          time_zone: tzOffset,
        };
        try {
          const fileSizeResults = await getProjectFileSize(
            params,
            currentProject.code,
          );

          const fileSizeData = fileSizeResults.data.data.datasets.reduce(
            (result, dataset) => {
              const datasetKeys = Object.keys(dataset);
              const label = dataset[datasetKeys[0]];
              const values = dataset[datasetKeys[1]];
              let sum = 0;
              values.forEach((val, index) => {
                sum = parseInt(sum + val);
                result.push({
                  [SAPDataField.seriesField]: label,
                  [SAPDataField.xField]: fileSizeResults.data.data.labels[index]
                    .split('-')
                    .reverse()
                    .join('-'),
                  [SAPDataField.yField]: sum,
                });
              });

              return result;
            },
            [],
          );
          const permOwnCore = getProjectRolePermission(
            currentProject.permission,
            {
              zone: PanelKey.CORE_HOME,
              operation: permissionOperation.view,
              resource: permissionResource.ownFile,
            },
          );
          const permAnyFileCore = getProjectRolePermission(
            currentProject.permission,
            {
              zone: PanelKey.CORE_HOME,
              operation: permissionOperation.view,
              resource: permissionResource.anyFile,
            },
          );
          const plotData = !(permOwnCore || permAnyFileCore)
            ? fileSizeData.filter((data) => data.source === 'Greenroom')
            : fileSizeData;

          setProjectFileSize(plotData);
        } catch {
          message.error(t('errormessages:projectMetaData:size:0'));
        }
        setIsProjectFileSizeLoading(false);
      }
    }

    fetchProjectFileSize();
  }, [currentProject]);

  const showFileActtivities = () => {
    const PermAnyFile = getProjectRolePermission(currentProject.permission, {
      zone: PanelKey.GREENROOM_HOME,
      resource: permissionResource.anyFile,
      operation: permissionOperation.copy,
    });

    if (PermAnyFile) {
      return true;
    } else {
      return getProjectRolePermission(currentProject.permission, {
        zone: PanelKey.GREENROOM_HOME,
        resource: permissionResource.ownFile,
        operation: permissionOperation.copy,
      });
    }
  };

  useEffect(() => {
    async function fetchProjectFileActivity() {
      if (currentProject?.id && rolePermissions.length) {
        const toMonth = moment().format(`YYYY-MM-DDTHH:mm:ss${tzOffset}`);
        const fromMonth = moment()
          .subtract(5, 'months')
          .startOf('month')
          .format(`YYYY-MM-DDTHH:mm:ss${tzOffset}`);

        const response = [];

        const activity = ['download', 'upload', 'delete'];

        let show = showFileActtivities();
        if (show) activity.push('copy');
        for (let act of activity) {
          const params = {
            from: fromMonth,
            to: toMonth,
            group_by: 'day',
            time_zone: tzOffset,
            type: act,
          };

          response.push(getProjectActivity(params, currentProject.code));
        }

        try {
          const activitiesResponse = await Promise.all(response);

          const activitiesResult = activitiesResponse.map((activity) => ({
            data: activity.data.data,
          }));
          const allActivities = {};
          activitiesResult.forEach((activityData, index) => {
            const dataKey = Object.keys(activityData)[0];
            const activityObject = activityData[dataKey];
            const data = Object.keys(activityObject).map(
              (activityObjectKey) => {
                return {
                  [activityObjectKey]: activityObject[activityObjectKey],
                };
              },
            );

            allActivities[activity[index]] = { data };
          });
          const result = {};
          for (let act in allActivities) {
            const data = allActivities[act].data.map((item) => {
              const key = Object.keys(item)[0];
              const date = moment(key, 'YYYY MM DD');
              const fullDate = date.format('dddd, MMMM Do YYYY');

              return {
                date: fullDate,
                day: parseInt(date.format('d')),
                week: date.format('w'),
                frequency: item[key],
              };
            });

            result[act] = data;
          }

          setProjectFileActivity(result);
        } catch {
          message.error(t('errormessages:projectMetaData:activity:0'));
        }
        setIsProjectFileActivityLoading(false);
      }
    }
    fetchProjectFileActivity();
  }, [currentProject, rolePermissions]);

  function sortProjectStats() {
    const stats = projectStats.map((item) => {
      const key = Object.keys(item)[0];
      return item[key];
    });

    const statMapping = [];
    for (let statsObj of stats) {
      const statKeys = Object.keys(statsObj);

      for (let stat of statKeys) {
        if (stat !== 'totalPerZone') {
          statMapping.push({ [stat]: statsObj[stat] });
        }
      }
    }

    return statMapping;
  }

  function appendProjectStats() {
    const statMapping = sortProjectStats();
    return statMapping.map((metaObj) => {
      const key = Object.keys(metaObj)[0];
      const attrs = getStatAttrs(key, metaObj[key]);
      return (
        <li className={styles[`meta__${attrs.class}`]}>
          <div>
            <span>{attrs.title}</span>
            <div className={styles['meta-stat']}>
              {attrs.icon}
              {key != 'totalCount' ? (
                <span>{attrs.stat}</span>
              ) : (
                <Tooltip placement="top" title={metaObj[key]}>
                  <span>{attrs.stat}</span>
                </Tooltip>
              )}
            </div>
          </div>
        </li>
      );
    });
  }

  return (
    <div className={styles.charts}>
      <Spin spinning={isProjectStatsLoading}>
        <ul className={styles['charts__meta']}>{appendProjectStats()}</ul>
      </Spin>

      <div className={styles['charts__graphs']}>
        <div className={styles['graphs__container']}>
          <h4 className={styles['graphs__title']}>Project File Size</h4>
          <Spin spinning={isProjectFileSizeLoading}>
            <StackedAreaPlot
              data={projectFileSize}
              xField={SAPDataField.xField}
              yField={SAPDataField.yField}
              seriesField={SAPDataField.seriesField}
              color={theme.projectCanvasChart.stackedAreaPlot}
              chartConfig={SAPConfig}
            />
          </Spin>
        </div>

        <div className={styles['graphs__container']}>
          <h4 className={styles['graphs__title']}>Project File Activity</h4>
          <Spin spinning={isProjectFileActivityLoading}>
            <HeatMapTabSwitcher
              downloadData={projectFileActivity.download}
              uploadData={projectFileActivity.upload}
              deleteData={projectFileActivity.delete}
              copyData={projectFileActivity.copy}
              dataMapping={heatMapDataField}
              role={showFileActtivities()}
            />
          </Spin>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Charts);
