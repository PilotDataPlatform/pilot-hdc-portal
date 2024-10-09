/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { Card, Tabs, DatePicker } from 'antd';
import { Today, All, LastSevenDays } from './Tabs';
import styles from '../index.module.scss';
const { TabPane } = Tabs;
export default function AllAnnouncement({ currentProject,indicator }) {
  const [dateString, setDateString] = useState('');
  const [currentTab, setCurrentTab] = useState('today');
  return (
    <Card title="All announcements">
      <Tabs
        className={styles.announcement_tabs}
        onChange={(key) => {
          setCurrentTab(key);
        }}
        style={{ margin: -18 }}
        activeKey={currentTab}
        tabBarExtraContent={
          currentTab === 'all' && (
            <DatePicker
              style={{
                margin: '10px 18px 0',
              }}
              onChange={(date, dateString) => {
                setDateString(dateString);
              }}
            />
          )
        }
      >
        <TabPane tab="Today" key="today">
          <Today indicator={indicator} currentProject={currentProject} />
        </TabPane>
        <TabPane tab="Last 7 days" key="lastSevenDays">
          <LastSevenDays indicator={indicator} currentProject={currentProject} />
        </TabPane>
        <TabPane tab="All" key="all">
          <All indicator={indicator} currentProject={currentProject} dateString={dateString} />
        </TabPane>
      </Tabs>
    </Card>
  );
}
