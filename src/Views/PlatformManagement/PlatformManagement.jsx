/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import UserManagement from './UserManagement';
import Notifications from './Notifications';
import AppHeader from '../../Components/Layout/Header';
import Footer from '../../Components/Layout/Footer';
import { Tabs } from 'antd';
import { UserOutlined, BellOutlined } from '@ant-design/icons';
import { StandardLayout } from '../../Components/Layout';
import styles from './PlatformManagement.module.scss';

const PlatformManagement = () => {
  const [adminView, setAdminView] = useState(true);
  return (
    <StandardLayout leftMargin={false}>
      <div
        className={styles.platform_management}
        id="platform-management-section"
      >
        {adminView ? (
          <div className={styles.tabs}>
            <Tabs
              defaultActiveKey="userManagement"
              style={{ backgroundColor: 'white' }}
            >
              <Tabs.TabPane
                tab={
                  <span>
                    <UserOutlined />
                    User Management
                  </span>
                }
                key="userManagement"
              >
                <UserManagement
                  adminView={adminView}
                  setAdminView={setAdminView}
                />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={
                  <span>
                    <BellOutlined />
                    Notifications
                  </span>
                }
                key="notifications"
              >
                <Notifications />
              </Tabs.TabPane>
            </Tabs>
          </div>
        ) : (
          <Redirect to="/error/403" />
        )}
      </div>
    </StandardLayout>
  );
};

export default PlatformManagement;
