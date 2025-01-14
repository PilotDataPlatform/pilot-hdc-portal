/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useEffect } from 'react';
import { Layout } from 'antd';
import AppHeader from './Header';
import Footer from './Footer';
import LeftSider from './LeftSider';
import { withRouter, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './index.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { getAllNotifications } from '../../APIs';
import MaintenanceWarningModel from '../Modals/MaintenanceWarningModel';
import { notificationActions } from '../../Redux/actions';
import { mapToNewStructure } from '../../Utility/maintenance/maintenance';
const { Content } = Layout;
function StandardLayout(props) {
  const {
    observationVars = [],
    initFunc = () => {},
    leftContent,
    children,
    leftMargin = true,
    overflow = false,
  } = props;

  useEffect(() => {
    initFunc();
  }, [...observationVars]);
  const { updateNotificationTimes } = useSelector(
    (state) => state.notifications,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    async function initData() {
      const res = await getAllNotifications();
      let listData = res.data?.result;
      listData = listData.map(mapToNewStructure);
      if (listData && listData.length) {
        dispatch(notificationActions.setNotificationList(listData));
      }
    }
    initData();
  }, [updateNotificationTimes]);
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(
        notificationActions.setUpdateNotificationTimes(
          (updateNotificationTimes) => updateNotificationTimes + 1,
        ),
      );
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const layoutStyles = {
    marginLeft: leftMargin ? '30px' : 0,
    overflowX: !overflow ? 'hidden' : 'unset',
    overflowY: !overflow ? 'hidden' : 'unset',
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content>
        <Layout>
          <Layout
            style={layoutStyles}
            className={styles.layout_wrapper}
            id="layout-wrapper"
          >
            {children}
          </Layout>
          {leftContent && <LeftSider>{leftContent}</LeftSider>}
        </Layout>
      </Content>
      <MaintenanceWarningModel />
      <Footer leftContent={leftContent} />
    </Layout>
  );
}

export default withRouter(connect(null, null)(StandardLayout));
