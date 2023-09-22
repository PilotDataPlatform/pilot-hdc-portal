/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { Component, createRef } from 'react';
import { Layout, Menu, Button, Modal, Alert, Badge, message } from 'antd';
import styles from './index.module.scss';
import { PORTAL_PREFIX } from '../../config';
import {
  ContainerOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  ControlOutlined,
  DeploymentUnitOutlined,
  BellOutlined,
  PoweroffOutlined,
  ProjectOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { useSelector } from 'react-redux';

import {
  cleanDatasetCreator,
  userLogoutCreator,
  setUploadListCreator,
  notificationActions,
  bellNotificationActions,
} from '../../Redux/actions';
import { connect } from 'react-redux';
import ResetPasswordModal from '../Modals/ResetPasswordModal';
import SupportDrawer from '../Tools/SupportDrawer';
import { UploadQueueContext } from '../../Context';
import { logout, convertUTCDateToLocalDate } from '../../Utility';
import FilePanel from './FilePanel/FilePanel';
import {
  getFilteredNotifications,
  postUnsubscribeNotifications,
} from '../../APIs/index';
import { BellNotifications, BannerNotifications } from '../Notifications';
import UpcomingMaintenanceModal from '../Modals/UpcomingMaintenanceModal';
import { tokenManager } from '../../Service/tokenManager';
import { BRANDING_PREFIX } from '../../config';
import { JOB_STATUS } from './FilePanel/jobStatus';
import i18n from '../../i18n';

const { confirm } = Modal;
const { Header } = Layout;
const SubMenu = Menu.SubMenu;
let modal;
class AppHeader extends Component {
  static contextType = UploadQueueContext;
  constructor(props) {
    super(props);
    this.state = {
      shakeClass: '',
      show: false,
      modalVisible: false,
      loading: false,
      showNotifications: [],
      drawer: false,
      selectedKeys: [],
      projectId: '',
      projectRole: '',
      projectCode: '',
      showBellNotifications: false,
      clickbell: false,
      notificationModalVisible: false,
      modalBellNotification: {},
      bellNotificationSetting: {},
    };
  }

  componentDidMount = async () => {
    const { params, path } = this.props.match;
    if (params.projectCode) {
      const projectRole = this.props.containersPermission.filter(
        (el) => el.code == params.projectCode,
      )[0].permission;
      const projectCode = this.props.containersPermission.filter(
        (el) => el.code == params.projectCode,
      )[0].code;
      this.setState({ projectRole, projectCode });
    }
    this.setState({ projectId: params.projectCode });
    if (path === '/landing') {
      this.updatedSelectedKeys('clear');
      this.updatedSelectedKeys('add', 'bridge');
    } else if (path === '/projects' || params?.projectCode) {
      this.updatedSelectedKeys('clear');
      this.updatedSelectedKeys('add', 'uploader');
    } else if (path === '/users') {
      this.updatedSelectedKeys('clear');
      this.updatedSelectedKeys('add', 'users');
    } else if (path === '/datasets' || path.startsWith('/dataset')) {
      this.updatedSelectedKeys('clear');
      this.updatedSelectedKeys('add', 'datasets');
    }
    this.getNotificationsForUser();
  };

  logout = async () => {
    modal = confirm({
      title: 'Are you sure you want to log out?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          By clicking on "OK", you will be logged out on all the opened tabs.{' '}
          <br />
          Any ongoing file activities progress will be lost.
        </>
      ),
      onOk() {
        doLogout();
      },
      onCancel() {
        console.log('Cancel');
      },
    });

    const doLogout = () => {
      logout();
    };
  };

  handleCancel = () => {
    this.setState({ modalVisible: false });
  };

  shakeStatus = () => {
    this.setState(
      {
        shakeClass: '',
      },
      () => {
        this.setState({
          shakeClass: 'animate__animated animate__shakeX',
        });
      },
    );
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.activeBellNotification != prevProps.activeBellNotification) {
      this.setState({
        showBellNotifications: this.props.activeBellNotification.openModal,
        bellNotificationSetting: this.props.activeBellNotification,
      });
    }
    if (
      prevProps.uploadIndicator !== this.props.uploadIndicator ||
      prevProps.downloadList !== this.props.downloadList
    ) {
      this.shakeStatus();
      let status =
        this.props.uploadIndicator + this.props.downloadList.length > 0;

      this.setState({ show: status });
    }

    if (
      (prevProps.downloadList !== this.props.downloadList ||
        prevProps.uploadList) !== this.props.uploadList
    ) {
      let loading =
        this.props.uploadList.filter(
          (item) => item.status === JOB_STATUS.RUNNING,
        ).length +
          this.props.downloadList.length >
        0;
      this.setState({ loading: loading });
    }

    if (
      prevProps.uploadList &&
      this.props.uploadList &&
      this.props.uploadList.length !== prevProps.uploadList.length
    ) {
    }

    if (prevProps.notificationList !== this.props.notificationList) {
      this.getNotificationsForUser();
    }
  }
  showDrawer = () => {
    this.setState({
      drawer: true,
    });
  };
  onClose = () => {
    this.setState({
      drawer: false,
    });
  };

  updatedSelectedKeys = (action, key) => {
    const selectedKeys = this.state.selectedKeys;
    let newKeys = [];
    if (action === 'remove') {
      newKeys = selectedKeys.filter((item) => item !== key);
    } else if (action === 'clear') {
      newKeys = [];
    } else if (action === 'add') {
      selectedKeys.push(key);
      newKeys = selectedKeys;
    }

    this.setState({
      selectedKeys: newKeys,
    });
  };

  toggleBellNotification = (isClose) => {
    if (isClose == true) {
      this.setState({ showBellNotifications: isClose });
    } else {
      this.setState((prevState) => ({
        showBellNotifications: !prevState.showBellNotifications,
      }));
    }
  };

  openNotificationModal = (id, dataset) => {
    const notificationItem = dataset.find((v) => v.id === id);
    this.setState({ modalBellNotification: notificationItem });
    this.setState({ notificationModalVisible: true });
  };

  closeNotificationModal = () => {
    this.setState({ notificationModalVisible: false });
  };

  removeBannerNotification = (id) => {
    const filteredNotifications = this.props.userNotifications.filter(
      (notification) => notification.id !== id,
    );
    this.props.setUserNotifications(filteredNotifications);
  };

  getNotificationsForUser = async () => {
    if (this.props.user.status !== 'pending') {
      try {
        const res = await getFilteredNotifications(this.props.username);
        let filteredNotifications = res.data.result;

        const cookieNotifications = tokenManager.getLocalCookie(
          'closedNotifications',
        );
        if (cookieNotifications) {
          filteredNotifications = filteredNotifications.filter(
            (notification) => !cookieNotifications.includes(notification.id),
          );
        }

        this.props.setUserNotifications(filteredNotifications);
      } catch (e) {
        message.error(i18n.t('errormessages:getNotification.default.0'));
      }
    }
  };

  closeNotificationPerm = async (id) => {
    try {
      await postUnsubscribeNotifications(this.props.username, id);
    } catch (e) {
      message.error(
        i18n.t('errormessages:postUnsubscribeNotifications.default.0'),
      );
    }
    this.removeBannerNotification(id);
  };

  closeNotificationSession = (id) => {
    const currentCookie = tokenManager.getLocalCookie('closedNotifications');
    const newCookie = currentCookie ? [...currentCookie, id] : [id];

    tokenManager.setLocalCookies({ closedNotifications: newCookie });
    this.removeBannerNotification(id);
  };

  render() {
    const username = this.props.username;
    const withoutRedDot = (
      <div className={styles.user_management}>
        <ControlOutlined />
        Platform Management
      </div>
    );

    return (
      <Header id="global_site_header">
        <Menu mode="horizontal">
          <Menu
            className={styles['header__menu--left']}
            mode="horizontal"
            selectedKeys={this.state.selectedKeys}
          >
            <Menu.Item key="logo">
              <a href={BRANDING_PREFIX}>
                <img
                  src={PORTAL_PREFIX + '/platform-logo.svg'}
                  alt="indoc-icon"
                  style={{ width: '8rem', marginTop: 0 }}
                />
              </a>
            </Menu.Item>
            <Menu.Item key="bridge">
              <Link to="/landing">
                <ProjectOutlined /> Dashboard
              </Link>
            </Menu.Item>
            {!this.props.unauthorized && (
              <Menu.Item key="uploader">
                <Link to="/projects">
                  <ContainerOutlined /> Projects
                </Link>
              </Menu.Item>
            )}
            {!this.props.unauthorized && (
              <Menu.Item key="datasets">
                <Link to="/datasets">
                  <DeploymentUnitOutlined /> Datasets
                </Link>
              </Menu.Item>
            )}

            {this.props.role === 'admin' && !this.props.unauthorized ? (
              <Menu.Item key="users">
                <Link to="/users">{withoutRedDot}</Link>
              </Menu.Item>
            ) : null}
          </Menu>

          <Menu
            className={styles['header__menu--right']}
            mode="horizontal"
            triggerSubMenuAction="click"
            selectable={false}
          >
            <SubMenu
              key="user"
              title={
                <span id="header_username">
                  <UserOutlined />
                  {username || 'Error'}
                </span>
              }
              id="header_user_menu"
              popupOffset={[-8, 9]}
              popupClassName={styles['header_user_menu_popup']}
            >
              <Menu.Item key="userProfile">
                <Link id="header_user_profile" to="/user-profile">
                  <UserOutlined />
                  <span>Account</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="logout">
                <Button id="header_logout" type="link" onClick={this.logout}>
                  <PoweroffOutlined />
                  <span>Logout</span>
                </Button>
              </Menu.Item>
            </SubMenu>
            <Menu.Item
              key="support"
              style={{ float: 'right' }}
              onClick={this.showDrawer}
            >
              Support
            </Menu.Item>
            {this.props.match.params.projectCode && (
              <Menu.Item
                style={{ padding: '5px 2px 0px 2px', marginRight: '1.2rem' }}
              >
                <FilePanel
                  className={styles.filePanel}
                  projectRole={this.state.projectRole}
                  projectCode={this.state.projectCode}
                />
              </Menu.Item>
            )}
            <Menu.Item
              key="bell-notificiation"
              id="bell-notificiation"
              style={{
                float: 'right',
                color: '#FF8B18',
                position: 'relative',
                paddingTop: '0.7rem',
                lineHeight: '5.9rem',
              }}
              onClick={() => {
                this.toggleBellNotification();
              }}
            >
              <BellOutlined />
            </Menu.Item>
          </Menu>
        </Menu>
        <BellNotifications
          visible={this.state.showBellNotifications}
          data={this.props.notificationList}
          openNotificationModal={this.openNotificationModal}
          setting={this.state.bellNotificationSetting}
          user={this.props.username}
        />
        <BannerNotifications
          data={this.props.userNotifications}
          openModal={this.openNotificationModal}
          closeNotificationPerm={this.closeNotificationPerm}
          closeNotificationSession={this.closeNotificationSession}
        />
        <ResetPasswordModal
          visible={this.state.modalVisible}
          username={username || 'Error'}
          handleCancel={this.handleCancel}
        />
        <SupportDrawer onClose={this.onClose} open={this.state.drawer} />
        <UpcomingMaintenanceModal
          visible={this.state.notificationModalVisible}
          onOk={this.closeNotificationModal}
          onCancel={this.closeNotificationModal}
          data={this.state.modalBellNotification}
        />
      </Header>
    );
  }

  cleanUploadList = () => {
    this.props.setUploadListCreator([]);
  };
}

export default connect(
  (state) => ({
    role: state.role,
    uploadList: state.uploadList,
    downloadList: state.downloadList,
    uploadIndicator: state.newUploadIndicator,
    isLogin: state.isLogin,
    username: state.username,
    containersPermission: state.containersPermission,
    userNotifications: state.notifications.userNotifications,
    notificationList: state.notifications.notificationList,
    user: state.user,
    activeBellNotification: state.bellNotificationReducer.actives,
  }),
  {
    cleanDatasetCreator,
    userLogoutCreator,
    setUploadListCreator,
    setUserNotifications: notificationActions.setUserNotifications,
    setActiveBellNotification:
      bellNotificationActions.setActiveBellNotification,
  },
)(withCookies(withRouter(AppHeader)));
