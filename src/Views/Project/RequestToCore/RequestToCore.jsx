/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { Tabs, Layout, Card } from 'antd';
import React, { useState } from 'react';
import CopyDataToCoreRequest from './copyDataToCoreRequest';
import RequestTable from '../../../Components/Table/requestTable';
import DatasetSharingRequestTable from '../DatasetSharingRequest/DatasetSharingRequestTable';
import CanvasPageHeader from '../Canvas/PageHeader/CanvasPageHeader';
import styles from './RequestToCore.module.scss';
import { useCurrentProject } from '../../../Utility';
import { useEffect } from 'react';
import { getProjectVMs } from '../../../APIs';

const RequestToCore = (props) => {
  const [tab, setTab] = useState('copyDataToCore');
  const [currentProject] = useCurrentProject();
  const [vmReady, setVmReady] = useState(false);
  const onTabChange = (key) => {
    console.log(key);
  };
  useEffect(() => {
    async function initVMs() {
      try {
        const response = await getProjectVMs(currentProject.code);
        if (response.data.result && response.data.result.length) {
          setVmReady(true);
        }
      } catch {
        setVmReady(false);
      }
    }
    initVMs();
  }, []);

  const isProjectAdmin = currentProject && currentProject.permission === 'admin';

  return (
    <div className={styles['request-to-core__container']}>
      <CanvasPageHeader />
      <Card>
        <Tabs defaultActiveKey={tab} onChange={() => onTabChange}>
          <Tabs.TabPane tab='Copy Data To Core Request' key='copyDataToCore'>
            <CopyDataToCoreRequest />
          </Tabs.TabPane>
          {isProjectAdmin &&
          vmReady ? (
            <Tabs.TabPane tab='Guacamole VM Request' key='guacamole'>
              <RequestTable />
            </Tabs.TabPane>
          ) : null}
          {isProjectAdmin ? (
            <Tabs.TabPane tab='Dataset Sharing Requests' key='datasetSharingRequests'>
              <DatasetSharingRequestTable />
            </Tabs.TabPane>
          ) : null}
        </Tabs>
      </Card>
    </div>
  );
};

export default RequestToCore;
