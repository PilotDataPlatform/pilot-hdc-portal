/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import NotificationList from './Components/NotificationList/NotificationList';
import NotificationPanel from './Components/NoticationInfo/NotificationInfoPanel';
import styles from './index.module.scss';
const Notifications = () => {
  return (
    <div className={styles.tab}>
      <Tabs defaultActiveKey="maintenance" tabPosition="left">
        <Tabs.TabPane tab="Maintenance" key="maintenance">
          <div className={styles.tab_content}>
            <div className={styles.tab_content_left_part}>
              <NotificationList />
            </div>
            <div className={styles.tab_content_right_part}>
              <NotificationPanel />
            </div>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Notifications;
