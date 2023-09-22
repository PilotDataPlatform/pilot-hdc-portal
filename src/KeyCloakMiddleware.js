/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */

import Portal from './Portal';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { authedRoutes, unAuthedRoutes, basename } from './Routes';
import { history } from './Routes';
import { Modal, message, Button, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { Loading } from './Components/Layout/Loading';
import { useSelector } from 'react-redux';
import {
  setIsLoginCreator,
  setIsKeycloakReady,
  setUserStatus,
  fileActionSSEActions,
} from './Redux/actions';
import { ReactKeycloakProvider as KeycloakProvider } from '@react-keycloak/web';
import { keycloak } from './Service/keycloak';
import { store } from './Redux/store';
import { broadcastAction } from './Utility';
import { logout, refresh } from './Utility';
import { broadcastManager } from './Service/broadcastManager';
import { tokenManager } from './Service/tokenManager';
import ExpirationNotification from './Components/Modals/ExpirationNotification';
import { useIdleTimer } from 'react-idle-timer';
import { tokenTimer } from './Service/keycloak';
import { actionType, debouncedBroadcastAction } from './Utility';
import { Suspense } from 'react';
import { getUserstatusAPI } from './APIs';
import ReleaseNoteModal from './Components/Modals/RelaseNoteModal';
import packageInfo from '../package.json';
import { v4 as uuidv4 } from 'uuid';

const { pathToRegexp } = require('path-to-regexp');
let isSessionMax = false;
const getIsSessionMax = () => isSessionMax;
const { detect } = require('detect-browser');
const browser = detect();
function toKeycloakPromise(promise) {
  promise.__proto__ = KeycloakPromise.prototype;
  return promise;
}

function KeycloakPromise(executor) {
  return toKeycloakPromise(new Promise(executor));
}

KeycloakPromise.prototype = Object.create(Promise.prototype);
KeycloakPromise.prototype.constructor = KeycloakPromise;

KeycloakPromise.prototype.success = function (callback) {
  var promise = this.then(function handleSuccess(value) {
    callback(value);
  });

  return toKeycloakPromise(promise);
};

KeycloakPromise.prototype.error = function (callback) {
  var promise = this.catch(function handleError(error) {
    callback(error);
  });

  return toKeycloakPromise(promise);
};
function createPromise() {
  var p = {
    setSuccess: function (result) {
      p.resolve(result);
    },

    setError: function (result) {
      p.reject(result);
    },
  };
  p.promise = new KeycloakPromise(function (resolve, reject) {
    p.resolve = resolve;
    p.reject = reject;
  });
  return p;
}
const MyCustomAdapter = {
  login: function (options) {
    const url = keycloak.createLoginUrl(options);
    let pathname = window.location.pathname;
    pathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    if (
      isUnauthedRoute(window.location.pathname) &&
      options &&
      options.prompt
    ) {
      return createPromise().promise;
    }
    window.location.replace(url);
    return createPromise().promise;
  },

  logout: function (options) {
    window.location.replace(keycloak.createLogoutUrl(options));
    return createPromise().promise;
  },

  register: function (options) {
    window.location.replace(keycloak.createRegisterUrl(options));
    return createPromise().promise;
  },

  accountManagement: function () {
    var accountUrl = keycloak.createAccountUrl();
    if (typeof accountUrl !== 'undefined') {
      window.location.href = accountUrl;
    } else {
      throw 'Not supported by the OIDC server';
    }
    return createPromise().promise;
  },

  redirectUri: function (options, encodeHash) {
    if (arguments.length === 1) {
      encodeHash = true;
    }
    if (options && options.redirectUri) {
      return options.redirectUri;
    } else if (keycloak.redirectUri) {
      return keycloak.redirectUri;
    } else {
      return window.location.href;
    }
  },
};

document.addEventListener('visibilitychange', (event) => {
  if (document.visibilityState == 'visible') {
    keycloak
      .updateToken(-1)
      .then(function (refreshed) {
        if (refreshed) {
          console.log('Token was successfully refreshed');
        } else {
          console.log('Token is still valid');
        }
      })
      .catch(function () {
        console.log('Failed to refresh the token, or the session has expired');
      });
  }
});
const initOptions =
  browser?.name === 'safari'
    ? {}
    : { checkLoginIframe: false, adapter: MyCustomAdapter };

const checkRefreshInterval = 60;
let refreshTokenLifeTime = 30 * 60;
const idleTimeout = 60 * 4;
const defaultTimeToClose = 10;
let intervalId;

function KeyCloakMiddleware() {
  const isKeycloakReady = useSelector((state) => state.isKeycloakReady);
  const isReleaseNoteShown = useSelector((state) => state.isReleaseNoteShown);
  const [isRefrshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [timeToClose, setTimeToClose] = useState(defaultTimeToClose);
  const onEvent = (event, error) => {
    switch (event) {
      case 'onReady': {
        console.log('onReady');
        if (!keycloak.authenticated) {
          tokenManager.clearCookies();
        }
        store.dispatch(setIsLoginCreator(keycloak.authenticated));
        store.dispatch(setIsKeycloakReady(true));
        break;
      }
      case 'onAuthError': {
        break;
      }
      case 'onAuthLogout': {
        console.log('onAuthLogout');
        window.location.reload();
        break;
      }
      case 'onAuthRefreshError': {
        console.error('onRefresh error');
        break;
      }
      case 'onAuthSuccess': {
        getUserstatusAPI()
          .then((res) => {
            if (!tokenManager.getLocalCookie('sessionId')) {
              const sourceId = uuidv4();
              tokenManager.setLocalCookies({
                sessionId: `${keycloak?.tokenParsed.preferred_username}-${sourceId}`,
              });
            }

            store.dispatch(setUserStatus(res.data.result.status));
          })
          .catch((error) => console.log(error.response));
        break;
      }
      case 'onAuthRefreshSuccess': {
        if (
          keycloak.refreshTokenParsed.exp - keycloak.refreshTokenParsed.iat <
          refreshTokenLifeTime
        ) {
          isSessionMax = true;
        } else {
          isSessionMax = false;
        }
        if (isModalOpen) {
          setIsRefreshed(true);
        }
        if (!isSessionMax) {
          intervalId = window.setInterval(() => {
            setTimeToClose((preTimeToClose) => {
              if (preTimeToClose <= 0) {
                closeNotification();
                clearInterval(intervalId);
              }
              return preTimeToClose - 1;
            });
          }, 1000);
        }
        break;
      }
      default: {
      }
    }
  };
  useEffect(() => {
    tokenTimer.addListener(openNotifConfig);
    tokenTimer.addListener(refreshConfig);
    tokenTimer.addListener(logoutConfig);

    broadcastManager.addListener('logout', (msg, channelNamespace) => {
      if (keycloak.authenticated) {
        logout();
      }
    });
    broadcastManager.addListener('refresh', () => {
      broadcastAction();
    });

    if (keycloak?.refreshTokenParsed) {
      const timeRemain = tokenTimer.getRefreshRemainTime();
      if (
        keycloak &&
        keycloak.refreshTokenParsed &&
        keycloak.refreshTokenParsed.exp - keycloak.refreshTokenParsed.iat <
          refreshTokenLifeTime
      ) {
        isSessionMax = true;
      } else {
        isSessionMax = false;
      }
      if (timeRemain > 0 && timeRemain < refreshTokenLifeTime - 2 * 60) {
        openNotification();
      }
    }
    return () => {};
  }, []);

  const openNotification = () => {
    if (!isModalOpen) {
      setIsModalOpen(true);
    }
  };

  const closeNotification = () => {
    setIsModalOpen(false);
    setIsRefreshed(false);
    setTimeToClose(defaultTimeToClose);
    clearInterval(intervalId);
  };

  const handleOnActive = () => {
    if (keycloak.authenticated) {
      setIsRefreshing(true);
      refresh().finally(() => {
        setIsRefreshing(false);
      });
    }
  };

  const openNotifConfig = {
    condition: (timeRemain, accessTimeRemain, lastTimeRemain) => {
      const tokenAutoRefresh = store.getState().tokenAutoRefresh;
      return (
        timeRemain >= 0 &&
        timeRemain <= refreshTokenLifeTime - 2 * 60 &&
        !tokenAutoRefresh &&
        (isIdle() || isSessionMax)
      );
    },
    func: openNotification,
  };

  const { isIdle } = useIdleTimer({
    timeout: 1000 * idleTimeout,
    onActive: handleOnActive,
    onAction: (e) => {
      if (e.type !== actionType) {
        debouncedBroadcastAction();
      }
    },
    debounce: 500,
  });

  const refreshConfig = {
    condition: (timeRemain, accessTimeRemain, lastTimeRemain) => {
      return (
        timeRemain < refreshTokenLifeTime &&
        timeRemain > 0 &&
        (timeRemain % checkRefreshInterval === 0 ||
          lastTimeRemain - timeRemain >= 10)
      );
    },
    func: () => {
      const tokenAutoRefresh = store.getState().tokenAutoRefresh;
      if (!isIdle() || tokenAutoRefresh) {
        refresh()
          .then((isRefresh) => {
            if (!isRefresh) {
              message.error('Failed to refresh token');
              console.log('fail to refresh token');
            } else {
              tokenTimer.resetLastTimeRemain();
            }
          })
          .catch(() => {
            message.error('Error:Failed to refresh token');
          });
      }
    },
  };

  const logoutConfig = {
    condition: (timeRemain, accessTimeRemain, lastTimeRemain) => {
      return (
        (timeRemain <= 0 || accessTimeRemain <= 0) &&
        !!keycloak.refreshTokenParsed
      );
    },
    func() {
      console.log('calling logout');
      window.onbeforeunload = () => {};
      logout();
    },
  };
  return (
    <KeycloakProvider
      onEvent={onEvent}
      initOptions={initOptions}
      autoRefreshToken={false}
      authClient={keycloak}
    >
      <Suspense fallback={<Loading />}>
        <>
          <Spin spinning={isRefrshing} tip="reconnecting">
            <Router history={history} forceRefresh={false}>
              <Switch>
                {authedRoutes.map((item) => (
                  <Route
                    path={item.path}
                    key={item.path}
                    exact={item.exact || false}
                    render={(props) => {
                      if (isKeycloakReady) {
                        return <Portal />;
                      } else {
                        return <Loading />;
                      }
                    }}
                  ></Route>
                ))}
                {unAuthedRoutes.map((item) => (
                  <Route
                    path={item.path}
                    key={item.path}
                    exact={item.exact || false}
                    render={(props) => {
                      return <item.component />;
                    }}
                  ></Route>
                ))}
                <Route
                  path="/"
                  render={(props) => {
                    if (props.location.pathname === '/') {
                      return <Redirect to="/login" />;
                    } else {
                      return <Redirect to="/404" />;
                    }
                  }}
                ></Route>
              </Switch>
            </Router>
          </Spin>
          <Modal
            title={'Session Expiring'}
            closable={false}
            footer={[
              <Button key="submit" type="primary" onClick={closeNotification}>
                Continue {isRefreshed && !isSessionMax && `(${timeToClose})`}
              </Button>,
            ]}
            visible={isModalOpen}
          >
            <ExpirationNotification
              isRefreshed={isRefreshed}
              getIsSessionMax={getIsSessionMax}
            />
          </Modal>
          <ReleaseNoteModal
            visible={isReleaseNoteShown}
            currentVersion={packageInfo.version}
          />
        </>
      </Suspense>
    </KeycloakProvider>
  );
}

export default KeyCloakMiddleware;

function isUnauthedRoute(url) {
  if (url === '/' || url === '') {
    return true;
  }
  return unAuthedRoutes.some((route) => {
    const pathRaw = route.path;
    const path =
      basename + (pathRaw.endsWith('/') ? pathRaw.slice(0, -1) : pathRaw);
    const regexp = pathToRegexp(path);
    return Boolean(regexp.exec(url));
  });
}
