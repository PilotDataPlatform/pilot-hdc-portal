/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StandardLayout } from '../../Components/Layout';
import { message } from 'antd';
import { projectRoutes as routes } from '../../Routes/index';
import {
  withRouter,
  Switch,
  Route,
  Redirect,
  useLocation,
} from 'react-router-dom';
import ToolBar from './Components/ToolBar';
import {
  getUserOnProjectAPI,
  getProjectInfoAPI,
  addVisitCount,
  getRolesAndPermissions,
  getResumableJobs,
} from '../../APIs';
import { connect } from 'react-redux';
import { protectedRoutes } from '../../Utility';
import roleMap from '../../Utility/project-roles.json';
import {
  setCurrentProjectProfile,
  setCurrentProjectSystemTags,
  setFolderRouting,
  clearCurrentProject,
  rolePermissionsActions,
  setResumeListCreator,
  setUploadListCreator,
} from '../../Redux/actions';
import i18n from '../../i18n';
import { JOB_STATUS } from '../../Components/Layout/FilePanel/jobStatus';

import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

function Project(props) {
  const { pathname } = useLocation();
  const project = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const { params } = props.match;
  const {
    match: { path },
    containersPermission,
    role,
  } = props;
  const containerDetails =
    containersPermission &&
    _.find(containersPermission, (item) => {
      return item.code === params.projectCode;
    });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    async function initResumableUploadJobs(projectCode) {
      const res = await getResumableJobs(projectCode);
      if (res && res.data.result) {
        dispatch(setResumeListCreator(res.data.result));
        const resumeUploadList = res.data.result.map((resumeJob) => {
          return {
            actionType: 'data_upload',
            status: JOB_STATUS.RUNNING,
            progress: null,
            targetNames: [resumeJob.objectPath],
            projectCode: projectCode,
            createdTime: Date.now(),
            jobId: uuidv4(),
            resumed: true,
          };
        });
        dispatch(setUploadListCreator(resumeUploadList));
      }
    }

    if (params.projectCode && containerDetails) {
      getProjectInfoAPI(containerDetails.id).then((res) => {
        if (res.status === 200 && res.data && res.data.code === 200) {
          const currentDataset = res.data.result;
          dispatch(setCurrentProjectProfile(currentDataset));
          dispatch(
            setCurrentProjectSystemTags({
              tags: currentDataset && currentDataset.systemTags,
            }),
          );
        }
      });
    }
    if (params.projectCode && containerDetails) {
      initResumableUploadJobs(params.projectCode);
    }
  }, [containerDetails]);

  useEffect(() => {
    async function fetchRolesAndPerms() {
      const res = await getRolesAndPermissions({
        projectCode: params.projectCode,
        pageSize: 100,
      });

      if (res?.data?.result) {
        dispatch(rolePermissionsActions.setRoles(res.data.result));
      }
    }
    fetchRolesAndPerms();
    addVisitCount(params.projectCode, 'project');
    return () => {
      dispatch(setFolderRouting({}));
      dispatch(clearCurrentProject());
      sessionStorage.removeItem('pathIdMap');
    };
  }, []);

  const [userListOnDataset, setUserListOnDataset] = useState(null);

  const rolesDetail = [];
  for (const key in roleMap) {
    rolesDetail.push({
      value: roleMap[key] && roleMap[key].value,
      label: roleMap[key] && roleMap[key].label,
      description: roleMap[key] && roleMap[key].description,
    });
  }

  const config = {
    observationVars: [params.projectCode, containersPermission, role],
    initFunc: () => {
      if (containersPermission !== null && role !== null) {
        const isAccess =
          role === 'admin' ||
          _.some(containersPermission, (item) => {
            return item.code === params.projectCode;
          });

        if (!isAccess) {
          message.error(
            `${i18n.t('errormessages:projectContainersPermission.default.0')}`,
            3,
          );
          window.setTimeout(() => {
            props.history.push('/landing');
          }, 1000);
          return;
        }
      }
    },
  };
  return (
    <StandardLayout {...config} leftContent={<ToolBar />} leftMargin overflow>
      <Switch>
        {routes.map((item) => (
          <Route
            exact={item.exact || false}
            path={path + item.path}
            key={item.path}
            render={(props) => {
              if (!params.projectCode) {
                throw new Error(`projectCode undefined`);
              }
              let res = protectedRoutes(
                item.protectedType,
                true,
                params.projectCode,
                containersPermission,
                role,
              );
              if (res === '403') {
                return <Redirect to="/error/403" />;
              } else if (res === '404') {
                return <Redirect to="/error/404" />;
              } else {
                return (
                  <item.component
                    userListOnDataset={userListOnDataset}
                    containerDetails={containerDetails}
                    getUserOnProjectAPI={getUserOnProjectAPI}
                    setUserListOnDataset={setUserListOnDataset}
                    rolesDetail={rolesDetail}
                  />
                );
              }
            }}
          ></Route>
        ))}
        <Redirect to="/error/404" />
      </Switch>
    </StandardLayout>
  );
}

export default connect((state) => ({
  containersPermission: state.containersPermission,
  role: state.role,
  datasetList: state.datasetList,
}))(withRouter(Project));
