/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Menu, message } from 'antd';
import {
  TeamOutlined,
  SettingOutlined,
  SearchOutlined,
  PullRequestOutlined,
  CompassOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import GreenRoomUploader from './GreenRoomUploader';
import { connect, useSelector } from 'react-redux';
import _ from 'lodash';
import style from './index.module.scss';
import {
  useCurrentProject,
  getProjectRolePermission,
  permissionOperation,
  permissionResource,
} from '../../../Utility';
import AnnouncementButton from './AnnouncementButton';
import RequestAccessModal from './requestAccessModal';
import {
  getResourceRequestsAPI,
  getWorkbenchInfo,
  listAllCopyRequests,
} from '../../../APIs';
import { useTranslation } from 'react-i18next';
import variables from '../../../Themes/constants.scss';
import {
  XWIKI,
  SUPERSET_SUBDOMAIN,
  SUPERSET_SUBDOMAIN_BASE,
} from '../../../config';
import { PanelKey } from '../Canvas/Charts/FileExplorer/RawTableValues';
import i18n from '../../../i18n';

const DashboardSelected = () => {
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 17 16"
      width="16"
    >
      <rect
        id="Rectangle_262"
        fill={variables.primaryColor1}
        data-name="Rectangle 262"
        width="5"
        height="7"
        rx="1"
      />
      <rect
        id="Rectangle_263"
        data-name="Rectangle 263"
        fill={variables.primaryColor1}
        x="11"
        y="9"
        width="6"
        height="7"
        rx="1"
      />
      <rect
        id="Rectangle_264"
        data-name="Rectangle 264"
        fill={variables.primaryColor1}
        x="7"
        width="10"
        height="7"
        rx="1"
      />
      <rect
        id="Rectangle_265"
        data-name="Rectangle 265"
        fill={variables.primaryColor1}
        y="9"
        width="9"
        height="7"
        rx="1"
      />
    </svg>
  );
};

const ToolBar = ({
  location: { pathname },
  match: { params },
  containersPermission,
  role,
  project,
  username,
  rolesPermissionsList,
}) => {
  const { t } = useTranslation(['errormessages', 'success']);
  const [isShown, toggleModal] = useState(false);
  const [showRequestRedDot, setShowRequestRedDot] = useState(false);
  const iconSelected = pathname ? pathname.split('/')[3] : null;
  const [showRequestModal, toggleRequestModal] = useState(false);
  const [requestItem, setRequestItem] = useState('');
  const [guacamolePending, setGuacamolePending] = useState(true);
  const [guacamoleDeployed, setGuacamoleDeployed] = useState('');
  const [supersetDeployed, setSupersetDeployed] = useState('');
  const [jupyterhubDeployed, setJupyterhubDeployed] = useState('');
  const [lowerIcon, setLowerIcon] = useState('');
  const projectRole = containersPermission.filter(
    (el) => el.code == params.projectCode,
  )[0].permission;
  const adminPermission = role === 'admin' || projectRole === 'admin';
  let [currentProject] = useCurrentProject();
  const projectCode = currentProject?.code;
  const getWorkbenchInformation = async () => {
    try {
      const res = await getWorkbenchInfo(currentProject?.globalEntityId);
      const workbenchKeys = Object.keys(res.data.result);
      if (workbenchKeys.length > 0) {
        if (workbenchKeys.includes('guacamole')) {
          setGuacamoleDeployed(true);
        } else {
          setGuacamoleDeployed(false);
        }
        if (workbenchKeys.includes('superset')) {
          setSupersetDeployed(true);
        } else {
          setSupersetDeployed(false);
        }
        if (workbenchKeys.includes('jupyterhub')) {
          setJupyterhubDeployed(true);
        } else {
          setJupyterhubDeployed(false);
        }
      } else {
        setGuacamoleDeployed(false);
        setSupersetDeployed(false);
        setJupyterhubDeployed(false);
      }
    } catch (error) {
      message.error(t('errormessages:projectWorkench.getWorkbench.default.0'));
    }
  };

  useEffect(() => {
    if (currentProject?.permission !== 'contributor') getWorkbenchInformation();
  }, [project.workbenchDeployedCounter]);

  useEffect(() => {
    const getResourceRequests = async () => {
      const res = await getResourceRequestsAPI({
        projectCode: currentProject.code,
        username: username,
        orderBy: 'requested_at',
        orderType: 'desc',
      });
      const { result } = res.data;
      if (result && result.length > 0) {
        const guacamoleRequests = result.filter(
          (el) => el.requestedFor === 'Guacamole',
        );
        if (guacamoleRequests.length > 0) {
          if (currentProject) {
            const currentProjectRequest = guacamoleRequests.filter(
              (el) => el.project.code === currentProject.code,
            );
            if (currentProjectRequest.length === 0) {
              setGuacamolePending(true);
            }
            if (currentProjectRequest.length > 0) {
              setGuacamolePending(!currentProjectRequest[0].isCompleted);
            }
          }
        }
      }
    };

    const requestToCorePendingCheck = async () => {
      const res = await listAllCopyRequests(projectCode, 'pending', 0, 10);
      if (res.data.result.length) {
        const requestToCoreTimeRecord = new Date(
          localStorage.getItem('requestToCoreTimeRecord'),
        );
        const latestRequestToCoreTime = new Date(
          res.data.result[0].submittedAt,
        );
        if (latestRequestToCoreTime > requestToCoreTimeRecord) {
          setShowRequestRedDot(true);
        }
      }
    };
    const requestVMPendingCheck = async () => {
      const res = await getResourceRequestsAPI({
        page: 0,
        pageSize: 10,
        orderBy: 'requested_at',
        orderType: 'desc',
        projectCode: projectCode,
      });
      if (res.data.result.length) {
        const requestVMTimeRecord = localStorage.getItem('requestVMTimeRecord')
          ? JSON.parse(localStorage.getItem('requestVMTimeRecord'))
          : null;
        if (requestVMTimeRecord && requestVMTimeRecord[projectCode]) {
          const lastVMTimeRecord = new Date(requestVMTimeRecord[projectCode]);
          const latestRequestToCoreTime = new Date(
            res.data.result[0].requestedAt,
          );
          if (latestRequestToCoreTime > lastVMTimeRecord) {
            setShowRequestRedDot(true);
          }
        } else {
          setShowRequestRedDot(true);
        }
      }
    };
    if (role !== 'admin') {
      getResourceRequests();
    }
    if (currentProject?.permission === 'admin') {
      requestToCorePendingCheck();
      requestVMPendingCheck();
    }
  }, [params.projectCode]);

  const superSet = (projectRole, supersetDeployed) => {
    if (projectRole === 'contributor') {
      return null;
    }
    let supersetUrl;
    if (SUPERSET_SUBDOMAIN === 'true') {
      supersetUrl = `https://${currentProject?.code}-superset.${SUPERSET_SUBDOMAIN_BASE}`;
    } else {
      supersetUrl = `/bi/${currentProject?.code}/superset/welcome`;
    }
    if (supersetDeployed) {
      return (
        <Menu.Item
          key="superset"
          onClick={(e) => {
            setLowerIcon(e);
          }}
        >
          <a href={supersetUrl} target="_blank">
            <span role="img" className="anticon">
              <img
                className={style['superset-img']}
                src={require('../../../Images/SuperSet.svg').default}
              />
            </span>
            <span>Superset</span>
          </a>
        </Menu.Item>
      );
    } else if (supersetDeployed === false) {
      return (
        <Menu.Item
          key="superset"
          onClick={() => {
            message.info(`${i18n.t('errormessages:superSet.default.0')}`);
          }}
        >
          <span role="img" className="anticon">
            <img
              className={style['superset-img']}
              src={require('../../../Images/SuperSet.svg').default}
            />
          </span>
          <span>Superset</span>
        </Menu.Item>
      );
    } else {
      return null;
    }
  };

  const guacamole = (
    platFormRole,
    projectRole,
    guacamoleDeployed,
    guacamolePending,
  ) => {
    if (projectRole === 'contributor') {
      return null;
    }
    if (guacamoleDeployed === true) {
      if (platFormRole === 'admin' || !guacamolePending) {
        return (
          <Menu.Item
            key="guacamole"
            onClick={(e) => {
              setLowerIcon(e);
            }}
          >
            <a
              href={`/workbench/${currentProject?.code}/guacamole/`}
              target="_blank"
            >
              <span role="img" className="anticon">
                <img
                  className={style['guacamole-img']}
                  src={require('../../../Images/Guacamole.svg').default}
                />
              </span>
              <span>Guacamole</span>
            </a>
          </Menu.Item>
        );
      } else {
        return (
          <Menu.Item
            key="guacamole"
            onClick={(e) => {
              setRequestItem('Guacamole');
              toggleRequestModal(true);
              setLowerIcon(e);
            }}
          >
            <span role="img" className="anticon">
              <img
                className={style['guacamole-img']}
                src={require('../../../Images/Guacamole.svg').default}
              />
            </span>
            <span>Guacamole</span>
          </Menu.Item>
        );
      }
    } else if (guacamoleDeployed === false) {
      return (
        <Menu.Item
          key="guacamole"
          onClick={() => {
            message.info(`${i18n.t('errormessages:guacamole.default.0')}`);
          }}
        >
          <span role="img" className="anticon">
            <img
              className={style['guacamole-img']}
              src={require('../../../Images/Guacamole.svg').default}
            />
          </span>
          <span>Guacamole</span>
        </Menu.Item>
      );
    } else {
      return null;
    }
  };

  const jupyterhub = (projectRole, jupyterhubDeployed) => {
    if (projectRole === 'contributor') {
      return null;
    }
    if (jupyterhubDeployed === true) {
      return (
        <Menu.Item
          key="jupyter"
          onClick={(e) => {
            setLowerIcon(e);
          }}
        >
          <a href={`/workbench/${currentProject?.code}/j/`} target="_blank">
            <span role="img" className="anticon">
              <img
                className={style['jupyter-img']}
                src={require('../../../Images/Jupyter.svg').default}
              />
            </span>
            <span>Jupyterhub</span>
          </a>
        </Menu.Item>
      );
    } else if (jupyterhubDeployed === false) {
      return (
        <Menu.Item
          key="jupyter"
          onClick={() => {
            message.info(`${i18n.t('errormessages:jupyterhub.default.0')}`);
          }}
        >
          <span role="img" className="anticon">
            <img
              className={style['jupyter-img']}
              src={require('../../../Images/Jupyter.svg').default}
            />
          </span>
          <span>Jupyterhub</span>
        </Menu.Item>
      );
    } else {
      return null;
    }
  };

  const handleRequestToCoreOnClick = () => {
    setShowRequestRedDot(false);
  };

  if (!rolesPermissionsList) {
    return null;
  }
  return (
    <>
      <Menu
        id="side-bar"
        mode="inline"
        selectedKeys={[pathname.split('/')[3]]}
        className={style.upperMenu}
      >
        <div
          className={
            iconSelected === 'canvas'
              ? style['menu-spacing__after-selected']
              : style['no-radius']
          }
        ></div>
        <Menu.Item key="canvas" style={{ position: 'relative' }}>
          <Link to="canvas">
            {iconSelected === 'canvas' ? (
              <span role="img" className="anticon icon-dashboard">
                <DashboardSelected
                  style={{
                    marginLeft: -17,
                  }}
                />
              </span>
            ) : (
              <span role="img" className="anticon icon-dashboard">
                <img
                  style={{ width: 17, marginLeft: -17 }}
                  src={require('../../../Images/Dashboard.svg').default}
                  className="tooltip-dashboard"
                />
              </span>
            )}
            <span>Canvas</span>
          </Link>
        </Menu.Item>
        <div
          className={
            iconSelected === 'canvas'
              ? style['menu-spacing__prev-selected']
              : iconSelected === 'data'
              ? style['menu-spacing__after-selected']
              : style['no-radius']
          }
        ></div>
        <Menu.Item key="data">
          <Link to="data">
            <CompassOutlined />
            <span>File Explorer</span>
          </Link>
        </Menu.Item>
        <div
          className={
            iconSelected === 'data'
              ? style['menu-spacing__prev-selected']
              : iconSelected === 'search'
              ? style['menu-spacing__after-selected']
              : style['no-radius']
          }
        ></div>
        <div className={iconSelected === 'data' ? style['space'] : ''}></div>
        <Menu.Item key="search">
          <Link to="search">
            <SearchOutlined />
            <span>Search</span>
          </Link>
        </Menu.Item>

        <div
          className={
            iconSelected === 'search'
              ? style['menu-spacing__prev-selected']
              : iconSelected === 'announcement'
              ? style['menu-spacing__after-selected']
              : style['no-radius']
          }
        ></div>
        <Menu.Item title={null} key="announcement" data-menu="announcement">
          <AnnouncementButton currentProject={currentProject} />
        </Menu.Item>
        <div
          className={
            iconSelected === 'announcement'
              ? style['menu-spacing__prev-selected']
              : iconSelected === 'teams'
              ? style['menu-spacing__after-selected']
              : style['no-radius']
          }
        ></div>
        {adminPermission && (
          <Menu.Item key="teams">
            <Link to="teams">
              <TeamOutlined />
              <span>Members</span>
            </Link>
          </Menu.Item>
        )}
        {adminPermission && (
          <div
            className={
              iconSelected === 'teams'
                ? style['menu-spacing__prev-selected']
                : iconSelected === 'settings'
                ? style['menu-spacing__after-selected']
                : style['no-radius']
            }
          ></div>
        )}

        {adminPermission && (
          <Menu.Item key="settings">
            <Link to="settings">
              <SettingOutlined />
              <span>Settings</span>
            </Link>
          </Menu.Item>
        )}
        {adminPermission && (
          <div
            className={
              iconSelected === 'settings'
                ? style['menu-spacing__prev-selected']
                : iconSelected === 'request'
                ? style['menu-spacing__after-selected--request']
                : style['no-radius']
            }
          ></div>
        )}
        {(adminPermission ||
          getProjectRolePermission(projectRole, {
            zone: PanelKey.GREENROOM_HOME,
            operation: permissionOperation.create,
            resource: permissionResource.copyReqAny,
          }) ||
          getProjectRolePermission(projectRole, {
            zone: PanelKey.GREENROOM_HOME,
            operation: permissionOperation.create,
            resource: permissionResource.copyReqOwn,
          })) && (
          <Menu.Item key="request" onClick={handleRequestToCoreOnClick}>
            <Link to="request">
              <div className={style['request-icon']}>
                <PullRequestOutlined />
                {showRequestRedDot ? (
                  <div className="request-icon__dot"></div>
                ) : null}
              </div>
              <span>Requests</span>
            </Link>
          </Menu.Item>
        )}
        {(adminPermission ||
          getProjectRolePermission(projectRole, {
            zone: PanelKey.GREENROOM_HOME,
            operation: permissionOperation.create,
            resource: permissionResource.copyReqAny,
          }) ||
          getProjectRolePermission(projectRole, {
            zone: PanelKey.GREENROOM_HOME,
            operation: permissionOperation.create,
            resource: permissionResource.copyReqOwn,
          })) && (
          <div
            className={
              iconSelected === 'request'
                ? style['menu-spacing__prev-selected--request']
                : style['no-radius']
            }
          ></div>
        )}
      </Menu>

      <Menu
        mode="inline"
        className={style.lowerMenu}
        selectedKeys={[pathname.split('/')[3]]}
      >
        {superSet(currentProject?.permission, supersetDeployed)}
        <div>
          <div className={style.temp}></div>
          <div
            className={
              lowerIcon === 'superset'
                ? style['radius']
                : style['radius-bottom']
            }
          ></div>
        </div>
        {guacamole(
          role,
          currentProject?.permission,
          guacamoleDeployed,
          guacamolePending,
        )}{' '}
        <div>
          <div className={style.temp}></div>
          <div
            className={
              lowerIcon === 'guacamole'
                ? style['radius']
                : style['radius-bottom']
            }
          ></div>
        </div>
        {jupyterhub(currentProject?.permission, jupyterhubDeployed)}
        <Menu.Item key="xwiki" onClick={(e) => setLowerIcon(e)}>
          <a
            href={`https://${XWIKI}/bin/view/projectpages/${currentProject?.code}`}
            target="_blank"
          >
            <span role="img" className="anticon">
              <img
                className={style['xwiki-img']}
                src={require('../../../Images/XWIKI.svg').default}
              />
            </span>
            <span>XWiki</span>
          </a>
        </Menu.Item>
      </Menu>
      <GreenRoomUploader
        isShown={isShown}
        cancel={() => {
          toggleModal(false);
        }}
      />
      <RequestAccessModal
        showRequestModal={showRequestModal}
        requestItem={requestItem}
        toggleRequestModal={toggleRequestModal}
        username={username && username}
        projectGeid={project && project.profile && project.profile.id}
      />
    </>
  );
};

export default connect((state) => ({
  containersPermission: state.containersPermission,
  role: state.role,
  project: state.project,
  username: state.username,
  rolesPermissionsList: state.rolePermissions.roles,
}))(withRouter(ToolBar));
