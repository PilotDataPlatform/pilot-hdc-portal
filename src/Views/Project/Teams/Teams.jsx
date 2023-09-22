/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  PageHeader,
  Layout,
  Menu,
  Dropdown,
  Button,
  Tabs,
  message,
  Row,
  Col,
  Modal,
  Space,
  Divider,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  DownOutlined,
  PlusOutlined,
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import AddUserModal from './Components/AddUserModal';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  broadcastChangeRole,
  broadcastRemoveUser,
  changeUserRoleInDatasetAPI,
  removeUserFromDatasetApi,
  updateUserStatusAPI,
} from '../../../APIs';
import {
  objectKeysToSnakeCase,
  objectKeysToCamelCase,
  partialString,
  getProjectPermissionRoles,
} from '../../../Utility';
import { namespace, ErrorMessager } from '../../../ErrorMessages';
import { withCurrentProject, formatRole } from '../../../Utility';
import TableWrapper from '../../../Components/Table/TableWrapper';
import { withTranslation } from 'react-i18next';
import InvitationTable from '../../../Components/Table/InvitationTable';
import CanvasPageHeader from '../Canvas/PageHeader/CanvasPageHeader';
import styles from './index.module.scss';
import i18n from '../../../i18n';
import { KEYCLOAK_REALM } from '../../../config';
import { omit } from 'lodash';
import MemberProfileModal from './Components/MemberProfileModal';
const { Content } = Layout;
const { TabPane } = Tabs;

class Teams extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddUserModalShown: false,
      userProfile: false,
      total: 0,
      users: [],
      recordInProcess: [],
      curRecord: null,
      searchText: [],
      searchedColumn: '',
      page: 0,
      pageSize: 10,
      order: 'desc',
      sortColumn: 'time_created',
      searchFilters: {},
      currentTab: 'users',
    };

    this.changeRole = this.changeRole.bind(this);
    this.confirmModal = this.confirmModal.bind(this);
    this.getUsers = this.getUsers.bind(this);
  }

  componentDidMount() {
    const data = {
      page: 0,
      pageSize: 10,
      orderBy: 'time_created',
      orderType: 'desc',
    };
    this.getUsers(data);
  }

  showAddUserModal = () => {
    this.setState({
      isAddUserModalShown: true,
    });
  };

  closeAddUserModal = () => {
    this.setState({
      isAddUserModalShown: false,
    });
  };

  getUsers(data = null) {
    if (!data) {
      data = {
        page: this.state.page,
        pageSize: this.state.pageSize,
        orderBy: this.state.orderBy || 'time_created',
        orderType: this.state.order,
      };

      if (
        Object.keys(this.state.searchFilters) &&
        Object.keys(this.state.searchFilters).length > 0
      ) {
        data['username'] = this.state.searchFilters['name'];
        data['email'] = this.state.searchFilters['email'];
      }
    }
    this.props
      .getUserOnProjectAPI(this.props.currentProject.globalEntityId, data)
      .then((res) => {
        const users = res.data.result.filter(
          (user) => user.projectStatus !== 'disable',
        );
        this.props.setUserListOnDataset(objectKeysToCamelCase(users));
        this.setState({
          total: res.data.total,
        });
      })
      .catch((err) => {
        if (err.response) {
          const errorMessager = new ErrorMessager(
            namespace.teams.getUsersOnDataset,
          );
          errorMessager.triggerMsg(err.response.status);
        }
      });
  }
  openUserSider(record) {
    this.setState({
      curRecord: record,
    });
    setTimeout(() => {
      this.setState({
        userProfile: true,
      });
    }, 500);
  }
  changeRole(name, oldRole, newRole) {
    const role = { oldRole, newRole };
    changeUserRoleInDatasetAPI(
      name,
      this.props.currentProject.globalEntityId,
      objectKeysToSnakeCase(role),
    )
      .then(async (result) => {
        await this.getUsers();
        await broadcastChangeRole(
          name,
          this.props.currentProject.globalEntityId,
          oldRole,
          newRole,
        );
        message.success(this.props.t('success:teams.roleUpdated'));
      })
      .catch((err) => {
        if (err.response) {
          if (err.response && err.response.status === 404) this.getUsers();
          const errorMessager = new ErrorMessager(
            namespace.teams.changeRoleInDataset,
          );
          errorMessager.triggerMsg(err.response.status, null, {
            name: name,
          });
        }
      });
  }

  removeUser = (username, role) => {
    removeUserFromDatasetApi(username, this.props.currentProject.globalEntityId)
      .then(async (res) => {
        await this.getUsers();
        await broadcastRemoveUser(
          username,
          this.props.currentProject.globalEntityId,
          role,
        );
        message.success(
          `${this.props.t(
            'success:teams.userRemoved.0',
          )} ${username} ${this.props.t('success:teams.userRemoved.1')}`,
        );
      })
      .catch((err) => {
        if (err.response) {
          if (err.response && err.response.status === 404) this.getUsers();
          const errorMessager = new ErrorMessager(
            namespace.teams.removeUserFromDataset,
          );
          errorMessager.triggerMsg(err.response.status, null, {
            username: username,
          });
        }
      });
  };

  restoreUser = (record, action) => {
    const { projectCode } = this.props.match.params;
    const { email } = record;
    const username = record.name;
    const inList = this.state.recordInProcess.find((item) => item === email);
    if (inList) {
      return;
    }
    Modal.warning({
      title: i18n.t('modals:updateStatusTime.title'),
      content: (
        <>
          <p>
            {`${i18n.t('modals:updateStatusTime.content.5')} ${username}
            ${i18n.t('modals:updateStatusTime.content.1')} restored${i18n.t(
              'modals:updateStatusTime.content.2',
            )}`}
          </p>
          <p>{i18n.t('modals:updateStatusTime.content.4')}</p>
        </>
      ),
    });
    this.setState({
      recordInProcess: [...this.state.recordInProcess, record.email],
    });
    updateUserStatusAPI({
      operationType: action,
      userRealm: KEYCLOAK_REALM,
      userGeid: null,
      userEmail: email,
      payload: {
        project_code: projectCode,
      },
    })
      .then(async (res) => {
        await this.getUsers();
        message.success(
          `${this.props.t(
            'success:teams.userRestored.0',
          )} ${username} ${this.props.t('success:teams.userRestored.1')}`,
        );
      })
      .catch((err) => {
        if (err.response) {
          if (err.response && err.response.status === 404) this.getUsers();
          const errorMessager = new ErrorMessager(
            namespace.teams.restoreUserFromDataset,
          );
          errorMessager.triggerMsg(err.response.status, null, {
            username: username,
          });
        }
      })
      .finally(() => {
        const removedList = this.state.recordInProcess.filter(
          (item) => item !== email,
        );
        this.setState({
          recordInProcess: removedList,
        });
      });
  };

  confirmModal(user, permission, action) {
    const _this = this;
    let content = '';
    if (action === 'delete') {
      content = `Are you sure you wish to remove user ${user} from this project?`;
    } else {
      content = `Are you sure you wish to change the role for user ${user} to ${formatRole(
        action,
      )}?`;
    }
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content,
      okText: 'OK',
      cancelText: 'Cancel',
      onOk() {
        if (action === 'delete') {
          _this.removeUser(user, permission);
        } else {
          _this.changeRole(user, permission, action);
        }
      },
    });
  }

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  handleReset = (clearFilters, dataIndex, confirm) => {
    clearFilters();
    let filters = this.state.searchText;
    filters = filters.filter((el) => el.key !== dataIndex);
    this.setState({ searchText: filters });
    confirm();
  };

  onChange = async (pagination, param2, param3) => {
    let order = 'asc';
    let filters = {
      page: this.state.page,
      pageSize: this.state.pageSize,
      orderBy: 'time_created',
      orderType: 'desc',
    };

    const startParams = {};

    if (param3 && param3.order !== 'ascend') order = 'desc';

    this.setState({ page: pagination.current - 1 });
    filters.page = pagination.current - 1;

    if (param3) {
      this.setState({ order: order });

      if (param3.columnKey) {
        filters.orderBy = param3.columnKey;
        this.setState({ sortColumn: param3.columnKey });
      }
      filters.orderType = order;
    }

    if (pagination.pageSize) {
      this.setState({ pageSize: pagination.pageSize });
      filters.pageSize = pagination.pageSize;
    }

    let searchText = [];

    if (param2.name && param2.name.length > 0) {
      searchText.push({
        key: 'name',
        value: param2.name[0],
      });

      startParams['name'] = param2.name[0];
    }

    if (param2.email && param2.email.length > 0) {
      searchText.push({
        value: param2.email[0],
        key: 'email',
      });

      startParams['email'] = param2.email[0];
    }

    this.setState({ searchText: searchText, searchFilters: startParams });

    if (Object.keys(startParams) && Object.keys(startParams).length > 0)
      filters['start_params'] = startParams;
    if (filters.start_params) {
      filters = {
        ...omit(filters, 'start_params'),
        username: filters?.start_params?.name,
        email: filters?.start_params?.email,
      };
    }
    this.getUsers(filters);
  };

  render() {
    const username = this.props.username;
    const { projectCode } = this.props.match.params;
    const projectAdmin =
      this.props.containersPermission &&
      this.props.containersPermission.some(
        (el) => el.code === projectCode && el.permission === 'admin',
      );
    let role = this.props.currentProject?.permission;
    const menu = (record, role) => {
      const roles = getProjectPermissionRoles();
      return (
        <Menu id="teams_role_dropdown">
          {roles?.map((el) => (
            <Menu.Item
              onClick={() => {
                this.confirmModal(record.name, record.permission, el.value);
              }}
              disabled={role === el.value}
              key={el.value}
            >
              {el.label}
            </Menu.Item>
          ))}
        </Menu>
      );
    };

    const columns = [
      {
        title: 'Username',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        searchKey: 'name',
        width: 200,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        sorter: true,
        searchKey: 'email',
      },
      {
        title: 'First Name',
        dataIndex: 'firstName',
        sorter: true,
        key: 'first_name',
        render: (text) => {
          if (text && text.length > 20) {
            return <span>{partialString(text, 20, false)}</span>;
          }
          return <span>{text}</span>;
        },
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
        sorter: true,
        key: 'last_name',
        render: (text) => {
          if (text && text.length > 20) {
            return <span>{partialString(text, 20, false)}</span>;
          }
          return <span>{text}</span>;
        },
      },
      {
        title: 'Role',
        dataIndex: 'permission',
        width: 170,
        key: 'role',
        render: (text) => {
          return formatRole(text);
        },
      },
      {
        title: '',
        key: 'changeRole',
        width: 140,
        render: (text, record) => {
          let isEnable = false;

          if (
            projectAdmin &&
            record.name !== username &&
            record.role !== 'admin'
          )
            isEnable = true;

          return (
            isEnable && (
              <Space>
                {record.projectStatus === 'hibernate' ? (
                  <a
                    onClick={() => {
                      this.restoreUser(record, 'restore');
                    }}
                  >
                    Restore access
                  </a>
                ) : (
                  <Dropdown
                    overlay={menu(record, record.permission)}
                    trigger={['click']}
                  >
                    <a
                      className="ant-dropdown-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      Change role <DownOutlined />
                    </a>
                  </Dropdown>
                )}
              </Space>
            )
          );
        },
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => {
          let isEnable = false;

          if (
            projectAdmin &&
            record.name !== username &&
            record.role !== 'admin'
          )
            isEnable = true;
          const menu = (
            <Menu>
              <Menu.Item onClick={(e) => this.openUserSider(record)}>
                Profile
              </Menu.Item>
              {username !== record.name && <Menu.Divider />}

              {isEnable && (
                <Menu.Item
                  style={{ color: 'red' }}
                  onClick={() =>
                    this.confirmModal(record.name, record.permission, 'delete')
                  }
                >
                  Delete
                </Menu.Item>
              )}
            </Menu>
          );
          return (
            <Dropdown overlay={menu} placement="bottomRight">
              <Button shape="circle">
                <MoreOutlined />
              </Button>
            </Dropdown>
          );
        },
      },
    ];

    function itemRender(route, params, routes, paths) {
      const index = routes.indexOf(route);
      if (index === 0) {
        return <Link to={route.path}>{route.breadcrumbName}</Link>;
      } else if (index === 1) {
        return (
          <span
            style={{
              maxWidth: 'calc(100% - 74px)',
              display: 'inline-block',
              verticalAlign: 'bottom',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <Link to={route.path}>{route.breadcrumbName}</Link>
          </span>
        );
      } else {
        return <>{route.breadcrumbName}</>;
      }
    }

    if (this.props.role === 'admin') {
      role = 'Platform Administrator';
    } else {
      role = 'Project Administrator';
    }

    return (
      <>
        <Content className={'content'} id="members-section">
          <CanvasPageHeader />
          <Row style={{ paddingBottom: '10px' }}>
            <Col
              span={24}
              style={{
                paddingTop: '10px',
                marginTop: '0.8rem',
              }}
            >
              <Card
                style={{
                  marginBottom: '20px',
                  borderRadius: 8,
                  boxShadow: '0px 1px 7px #0000001a',
                }}
                loading={
                  !this.props.rolePermissions ||
                  !this.props.rolePermissions.length
                }
              >
                <Tabs
                  onChange={(e) => {
                    this.setState({
                      currentTab: e,
                    });
                  }}
                  style={{ marginTop: -20 }}
                  className={styles.tab}
                >
                  <TabPane tab="Members" key="users">
                    <TableWrapper
                      dataSource={this.props.userListOnDataset}
                      columns={columns}
                      totalItem={this.state.total}
                      pageSize={this.state.pageSize}
                      page={this.state.page}
                      onChange={this.onChange}
                      handleReset={this.handleReset}
                      handleSearch={this.handleSearch}
                      setClassName={(record) => {
                        return record.projectStatus === 'hibernate'
                          ? 'disabled '
                          : ' ';
                      }}
                      tableKey="projectUsers"
                    />
                  </TabPane>
                  <TabPane tab="Invitations" key="invitations">
                    <InvitationTable
                      currentProject={this.props.currentProject}
                      tableKey="projectInvitations"
                    />
                  </TabPane>
                </Tabs>
                {this.state.currentTab == 'users' ? (
                  <Button
                    type="primary"
                    onClick={this.showAddUserModal}
                    className="mb-2"
                    icon={<PlusOutlined />}
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: 8,
                      borderRadius: 6,
                      padding: '0 20px',
                    }}
                  >
                    Add Member
                  </Button>
                ) : null}
              </Card>
            </Col>
          </Row>
        </Content>
        <AddUserModal
          closeAddUserModal={this.closeAddUserModal}
          isAddUserModalShown={this.state.isAddUserModalShown}
          getUsers={this.getUsers}
          containerDetails={this.props.containerDetails}
          rolesDetail={this.props.rolesDetail}
        ></AddUserModal>
        <MemberProfileModal
          curRecord={this.state.curRecord}
          visible={this.state.userProfile}
          onCancel={() => {
            this.setState({
              userProfile: false,
            });
          }}
        ></MemberProfileModal>
      </>
    );
  }
}

export default connect((state) => ({
  role: state.role,
  containersPermission: state.containersPermission,
  username: state.username,
  rolePermissions: state.rolePermissions.roles,
}))(withCurrentProject(withRouter(withTranslation('success')(Teams))));
