/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useEffect, useState, Suspense, useContext } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { authedRoutes } from './Routes';
import './Antd.less';
import './Portal.scss';
import { useSelector } from 'react-redux';
import { store } from './Redux/store';
import {
  setContainersPermissionCreator,
  setUserRoleCreator,
  setSuccessNum,
  updateDownloadItemCreator,
  setUsernameCreator,
  setEmailCreator,
  setIsReleaseNoteShownCreator,
  setUserLastLogin,
  fileActionSSEActions,
} from './Redux/actions';
import {
  generateDownloadLinkAPI,
  listUsersContainersPermission,
  attachManifest,
  getUserProfileAPI,
  getProjectManifestList,
  TaskStreamSSE,
  fileActionRouter,
  FileActionHandler,
  datasetFileOpHandler,
  getAllProjectFiles,
} from './APIs';
import {
  protectedRoutes,
  reduxActionWrapper,
  convertUTCDateToLocalDate,
  truncateFileName,
} from './Utility';
import { message, Modal, notification } from 'antd';
import Promise from 'bluebird';
import _ from 'lodash';
import moment from 'moment';
import { UploadQueueContext } from './Context';
import { namespace, ErrorMessager } from './ErrorMessages';
import { history } from './Routes';
import { tokenManager } from './Service/tokenManager';
import { useKeycloak } from '@react-keycloak/web';
import packageInfo from '../package.json';
import { Loading } from './Components/Layout/Loading';
import TermsOfUse from './Views/TermsOfUse/TermsOfUse';
import semver from 'semver';
import AccountDisabled from './Views/AccountDisabled/AccountDisabled';
import { JOB_STATUS } from './Components/Layout/FilePanel/jobStatus';
import { PORTAL_PREFIX } from './config';
import i18n from './i18n';
import camelcaseKeys from 'camelcase-keys';
import { timeConvertWithZulu } from './Utility';

history.listen(() => {
  Modal.destroyAll();
});

message.config({
  maxCount: 2,
  duration: 5,
});
const [
  setContainersPermissionDispatcher,
  setUserRoleDispatcher,
  setSuccessNumDispatcher,
  updateDownloadItemDispatch,
  setUsernameDispatcher,
  setUserLastLoginDispatcher,
  setEmailDispatcher,
  setIsReleaseNoteShownDispatcher,
  setUploadCommittingDispatcher,
] = reduxActionWrapper([
  setContainersPermissionCreator,
  setUserRoleCreator,
  setSuccessNum,
  updateDownloadItemCreator,
  setUsernameCreator,
  setUserLastLogin,
  setEmailCreator,
  setIsReleaseNoteShownCreator,
  fileActionSSEActions.setUploadCommitting,
]);

function Portal(props) {
  const {
    downloadList,
    successNum,
    containersPermission,
    role,
    user,
    fileActionSSE,
    datasetFileOperations,
  } = useSelector((state) => state);
  const [manifestList, setManifestList] = useState([]);
  const userStatus = user.status;
  const { keycloak } = useKeycloak();
  const q = useContext(UploadQueueContext);

  const sessionId = tokenManager.getLocalCookie('sessionId');

  useEffect(() => {
    const username = keycloak?.tokenParsed.preferred_username;
    async function initUser() {
      console.log('keycloak token', keycloak?.tokenParsed);
      setUsernameDispatcher(username);
      if (userStatus === 'active') {
        try {
          const user = await getUserProfileAPI(username);
          if (user.data.result.attributes.lastLogin) {
            const lastLogin = user.data.result.attributes.lastLogin;

            setUserLastLoginDispatcher(timeConvertWithZulu(lastLogin, 'text'));
          }
        } catch {
          message.error(`${i18n.t('errormessages:userProfileAPI.default.0')}`);
        }
      }

      if (keycloak?.tokenParsed.email) {
        setEmailDispatcher(keycloak?.tokenParsed.email);
      }
    }
    if (keycloak?.tokenParsed) {
      initUser();
    }

    if (userStatus === 'active') {
      initApis(username);
    }
  }, [userStatus]);

  useEffect(() => {
    let handleFileAction;
    let events;

    tokenManager.setServerCookies({ AUTH: keycloak.token });

    (async () => {
      if (sessionId && userStatus === 'active') {
        handleFileAction = new FileActionHandler();
        events = new EventSource(TaskStreamSSE(sessionId), {
          withCredentials: true,
          heartbeatTimeout: 120 * 1000,
        });

        const attachManifestToUpload = async (sseUpload) => {
          const username = keycloak?.tokenParsed.preferred_username;

          const { isUploadCommitting } = store.getState().fileActionSSE;

          const uploadList = store.getState().uploadList;
          const existingUpload = uploadList.find(
            (upload) => upload.jobId === sseUpload.jobId,
          );

          if (isUploadCommitting && existingUpload) {
            if (sseUpload.status === JOB_STATUS.SUCCEED) {
              message.success(
                `${i18n.t('success:fileUpload.0')} ${truncateFileName(
                  sseUpload.targetNames[0],
                )} ${i18n.t('success:fileUpload.1')}`,
              );

              const uploadFileManifest = store.getState().uploadFileManifest;
              const manifestItem = uploadFileManifest.find((x) => {
                const fileNameFromPath = x.files[0];
                return sseUpload.targetNames.includes(
                  fileNameFromPath.normalize(),
                );
              });

              if (manifestItem?.manifestId) {
                try {
                  const projectFiles = await (async function () {
                    const page = 0;
                    const pageSize = 1000;

                    const parentPath = sseUpload.targetNames[0]
                      .split('/')
                      .slice(0, -1)
                      .join('/');
                    const params = {
                      page,
                      pageSize,
                      projectCode: sseUpload.projectCode,
                      parentPath,
                      zone: 'greenroom',
                    };

                    async function fetchProjectFilesFromGreenroom(
                      page,
                      pageLimit,
                      results = [],
                    ) {
                      const res = await getAllProjectFiles({ ...params, page });
                      results = [...results, ...res.data.result];

                      if (res.data.total - pageLimit > 0) {
                        return await fetchProjectFilesFromGreenroom(
                          page + 1,
                          pageLimit + pageSize,
                          results,
                        );
                      }
                      return results;
                    }

                    return await fetchProjectFilesFromGreenroom(page, pageSize);
                  })();

                  const sseUploadFile = projectFiles.find(
                    (file) =>
                      file.containerCode === sseUpload.projectCode &&
                      file.owner === username &&
                      sseUpload.targetNames[0] ===
                        `${file.parentPath}/${file.name}`,
                  );
                  manifestItem.geid = sseUploadFile.id;

                  const manifests = await getProjectManifestList(
                    sseUpload.projectCode,
                  );
                  const manifestTPL = manifests.data.result.find(
                    (man) => man.id === manifestItem.manifestId,
                  );

                  for (let tplAttr of manifestTPL.attributes) {
                    const keyName = tplAttr.name;
                    if (
                      tplAttr.optional &&
                      typeof manifestItem.attributes[keyName] === 'undefined'
                    ) {
                      manifestItem.attributes[keyName] = '';
                    }
                  }

                  await attachManifest(
                    sseUpload.projectCode,
                    manifestItem.manifestId,
                    [manifestItem.geid],
                    manifestItem.attributes,
                  );
                } catch {
                  message.error(
                    `${i18n.t('errormessages:attachManifest.default.0')}`,
                  );
                }
              }

              const successNum = store.getState().successNum;
              setSuccessNumDispatcher(successNum + 1);

              const remainingUploads =
                uploadList.filter(
                  (upload) =>
                    upload.status !== JOB_STATUS.SUCCEED &&
                    upload.status !== JOB_STATUS.FAILED,
                ).length - 1;
              if (
                remainingUploads < 1 &&
                (sseUpload.status === JOB_STATUS.SUCCEED ||
                  sseUpload.status === JOB_STATUS.FAILED)
              ) {
                setUploadCommittingDispatcher(false);
              }
            } else if (sseUpload.status === JOB_STATUS.FAILED) {
              message.error(
                `${i18n.t(
                  'errormessages:processingFile.default.0',
                )} ${truncateFileName(sseUpload.targetNames[0])} ${i18n.t(
                  'errormessages:processingFile.default.1',
                )}`,
              );
            }
          }
        };

        events.onerror = (error) => {
          console.log(error);
          console.log(events);
          setTimeout(() => {
            console.log(events);
            if (events?.readyState === 2) {
              // message.error(i18n.t('errormessages:taskStream.default.0'));
            }
          }, 30 * 1000);
        };

        events.onmessage = (e) => {
          const parsed = JSON.parse(e.data);
          const data = camelcaseKeys(parsed);

          console.log(data);

          switch (data.containerType) {
            case 'project':
              fileActionRouter(data, handleFileAction, {
                upload: attachManifestToUpload,
              });
              break;
            case 'dataset':
              datasetFileOpHandler(data);
          }
        };
      }
    })();

    return () => {
      events?.close();
      handleFileAction?.unsubscribeStore();
    };
  }, [sessionId, userStatus]);

  useEffect(() => {
    const versionNumLocal = localStorage.getItem('version');
    const isLatest =
      semver.valid(versionNumLocal) &&
      semver.eq(packageInfo.version, versionNumLocal);

    if (!isLatest && keycloak.authenticated) {
      const args = {
        message: (
          <>
            <img
              alt="release note"
              width={30}
              src={PORTAL_PREFIX + '/Rocket.svg'}
            ></img>{' '}
            <b>{' Release ' + packageInfo.version}</b>
          </>
        ),
        description: (
          <span
            onClick={() => {
              setIsReleaseNoteShownDispatcher(true);
              notification.close('releaseNote');
              localStorage.setItem('version', packageInfo.version);
            }}
            style={{ cursor: 'pointer' }}
          >
            <u style={{ marginLeft: 34 }}>
              Click here to view the release notes
            </u>
          </span>
        ),
        duration: 0,
        onClose: () => {
          localStorage.setItem('version', packageInfo.version);
        },
        key: 'releaseNote',
      };
      notification.open(args);
    }
  }, [keycloak.authenticated]);

  const debounceCheckPendingDownloads = _.debounce(
    async () => {
      const runningDownloadList = downloadList.filter(
        (el) => el.status === JOB_STATUS.RUNNING,
      );

      if (fileActionSSE.isDownloadCommitting && runningDownloadList.length) {
        const checkDownloadPromises = runningDownloadList.map((item) => {
          if (item.payload?.hashCode) {
            return generateDownloadLinkAPI(
              item.jobId,
              item.payload.hashCode,
              item.namespace,
              updateDownloadItemDispatch,
              setSuccessNumDispatcher,
              successNum,
            );
          }
        });

        await Promise.allSettled(checkDownloadPromises);
      }
    },
    3000,
    { leading: false, trailing: true, maxWait: 15 * 1000 },
  );

  useEffect(() => {
    debounceCheckPendingDownloads();
  }, [downloadList]);

  async function loadManifest(curProjectCode) {
    const manifests = await getProjectManifestList(curProjectCode);
    const rawManifests = manifests.data.result;
    setManifestList(rawManifests);
  }

  const initApis = async (username) => {
    try {
      const params = {
        order_by: 'created_at',
        order_type: 'desc',
        is_all: true,
      };

      const {
        data: { results: containersPermission, role },
      } = await listUsersContainersPermission(username, params);
      setUserRoleDispatcher(role);
      setContainersPermissionDispatcher(containersPermission);
      const pathname = props.location.pathname;
      const isInProject = pathname.includes('project');
      let currentProject;
      if (isInProject) {
        const pathArray = pathname.split('/');
        const currentProjectId = pathArray[pathArray.length - 2];

        currentProject =
          containersPermission &&
          containersPermission.find((el) => el.code === currentProjectId);
      }

      if (currentProject) {
        loadManifest(currentProject.code);
      }
    } catch (err) {
      if (err.response) {
        const errorMessager = new ErrorMessager(
          namespace.common.listUsersContainersPermission,
        );
        errorMessager.triggerMsg(err.response.status);
      }
    }
  };

  switch (userStatus) {
    case 'pending': {
      return <TermsOfUse />;
    }
    case 'disabled': {
      return <AccountDisabled />;
    }

    default: {
      return (
        <>
          <Suspense fallback={null}>
            <Switch>
              {authedRoutes.map((item) => (
                <Route
                  path={item.path}
                  key={item.path}
                  exact={item.exact || false}
                  render={(props) => {
                    if (!keycloak.authenticated) {
                      window.location.href =
                        window.location.origin + PORTAL_PREFIX;
                      return null;
                    }
                    if (!containersPermission) {
                      return <Loading />;
                    }
                    let res = protectedRoutes(
                      item.protectedType,
                      keycloak.authenticated,
                      props.match.params.projectCode,
                      containersPermission,
                      role,
                    );
                    if (res === '403') {
                      return <Redirect to="/error/403" />;
                    } else if (res === '404') {
                      return <Redirect to="/error/404" />;
                    } else if (res) {
                      return <item.component />;
                    } else {
                      window.location.href =
                        window.location.origin + PORTAL_PREFIX;
                      return null;
                    }
                  }}
                ></Route>
              ))}
            </Switch>
          </Suspense>
        </>
      );
    }
  }
}

export default withRouter(Portal);
