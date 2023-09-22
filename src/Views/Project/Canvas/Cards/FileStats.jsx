/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import {
  HomeOutlined,
  PaperClipOutlined,
  CloudServerOutlined,
} from '@ant-design/icons';
import { convertLargeNumToAbbreviated } from '../../../../Utility/convertLargeNumToAbbreviated';
import { listAllVirtualFolder, getProjectStatistics } from '../../../../APIs';
import { message, Spin } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';
import {
  useCurrentProject,
  curTimeZoneOffset,
  getProjectRolePermission,
  permissionResource,
  permissionOperation,
} from '../../../../Utility';
import { canvasPageActions } from '../../../../Redux/actions';
import { useDispatch } from 'react-redux';
import { history } from '../../../../Routes';
import { PanelKey } from '../Charts/FileExplorer/RawTableValues';
function FileStats(props) {
  const { t } = useTranslation(['errormessages']);
  const [greenRoomCount, setGreenRoomCount] = useState(0);
  const [coreCount, setCoreCount] = useState(0);
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProject] = useCurrentProject();
  const tzOffset = curTimeZoneOffset();
  const dispatch = useDispatch();

  useEffect(() => {
    async function getCollections() {
      if (getProjectRolePermission(currentProject?.permission, {
        zone: PanelKey.CORE,
        operation: permissionOperation.view,
        resource: [permissionResource.ownFile, permissionResource.anyFile]
      })) {
        try {
          const collections = await listAllVirtualFolder(
            currentProject.code,
            props.username,
          );
  
          setCollections(collections.data.result);
        } catch {
          message.error(t('errormessages:projectMetaData.statistics.0'));
        }
      }
    }
    async function getStats() {
      const params = { time_zone: tzOffset };
      try {
        const statsResults = await getProjectStatistics(
          params,
          currentProject.code,
        );
        const totalPerZone = statsResults.data.files.totalPerZone;
        setGreenRoomCount(totalPerZone.greenroom ?? 0);
        setCoreCount(totalPerZone.core ?? null);
        getCollections();
      } catch {
        message.error(t('errormessages:projectMetaData.statistics.0'));
      }
      setIsLoading(false);
    }
    if (currentProject) {
      getStats();
    }
  }, [currentProject, props.successNum]);

  const goToPage = (page) => {
    if (page === 'collection') {
      if (collections.length > 0) {
        dispatch(
          canvasPageActions.setCanvasPage({
            page: page,
            name: collections.length > 0 ? collections[0].name : '',
            id: collections.length > 0 ? collections[0].id : '',
          }),
        );
        history.push(`/project/${currentProject.code}/data`);
      }
    } else {
      dispatch(
        canvasPageActions.setCanvasPage({
          page: page,
        }),
      );
      history.push(`/project/${currentProject.code}/data`);
    }
  };

  return currentProject ? (
    isLoading ? (
      <Spin spinning={isLoading} style={{ width: '100%', marginTop: '32px' }} />
    ) : (
      <div style={{ flexDirection: 'column', display: 'flex', minWidth: 130 }}>
        <div
          className={styles['shortcut--greenhome']}
          onClick={() => goToPage(PanelKey.GREENROOM_HOME)}
        >
          <span className={styles['icon-column']}>
            <HomeOutlined className={styles['icon--greenhome']} />
          </span>
          <span className={styles['file-font']}>Green Room</span>
          <span className={styles['file-number ']}>
            Files{' '}
            {greenRoomCount !== null
              ? convertLargeNumToAbbreviated(greenRoomCount)
              : 0}
          </span>
        </div>
        {getProjectRolePermission(currentProject.permission, {
          zone: 'core',
          resource: [permissionResource.ownFile, permissionResource.anyFile],
          operation: permissionOperation.view,
        }) ? (
          <div
            className={styles['shortcut--core']}
            onClick={() => goToPage(PanelKey.CORE_HOME)}
          >
            <span className={styles['icon-column']}>
              <CloudServerOutlined className={styles['icon--core']} />
            </span>
            <span className={styles['file-font']}>Core</span>
            <span className={styles['file-number ']}>
              Files {coreCount !== null ? coreCount : 0}
            </span>
          </div>
        ) : null}
        {getProjectRolePermission(currentProject.permission, {
          zone: 'core',
          resource: permissionResource.ownFile,
          operation: permissionOperation.view,
        }) ? (
          <div
            className={styles['shortcut--collections']}
            onClick={() => goToPage('collection')}
          >
            <span className={styles['icon-column']}>
              <PaperClipOutlined
                className={styles['icon--collection']}
                style={{
                  cursor: collections.length === 0 ? '' : 'pointer',
                  opacity: collections.length === 0 ? 0.5 : 1,
                }}
              />
            </span>
            <span
              className={styles['file-font']}
              style={{ opacity: collections.length === 0 ? 0.5 : 1 }}
            >
              <span
                className={styles['collections-num']}
                style={{
                  opacity: collections.length === 0 ? 0.5 : 1,
                }}
              >
                {collections.length}
              </span>{' '}
              Collections
            </span>
            <span style={{ color: 'transparent' }}>File</span>
          </div>
        ) : null}
      </div>
    )
  ) : null;
}

export default connect(
  (state) => ({
    containersPermission: state.containersPermission,
    datasetList: state.datasetList,
    successNum: state.successNum,
    username: state.username,
    role: state.role,
    canvasPage: state.canvasPage,
  }),
  { setCanvasPage: canvasPageActions.setCanvasPage },
)(withRouter(FileStats));
