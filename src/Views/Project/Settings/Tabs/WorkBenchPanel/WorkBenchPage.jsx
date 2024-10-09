/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import styles from '../../index.module.scss';
import { Button, message, Spin } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useCurrentProject } from '../../../../../Utility';
import {
  getWorkbenchInfo,
  getProjectVMs,
  testWorkbenchDeploy,
} from '../../../../../APIs';
import WorkbenchDeployModal from './WorkbenchDeployModal';
import WorkbenchWarningModal from './WorkbenchWarningModal';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import { RobotOutlined } from '@ant-design/icons';
import CSSCustomProperties from '../../../../../Themes/Components/Project/Settings/project_setting_workbench.module.css';

const mapStateToProps = (state) => {
  return {
    platformRole: state.role,
    containersPermission: state.containersPermission,
    project: state.project,
  };
};
const deployedInfo = (
  platformRole,
  workbenchInfo,
  currentProject,
  setShowModal,
  setShowWarnModal,
  setWorkbench,
  workbench,
) => {
  const projectRole = currentProject.permission;
  if (platformRole === 'admin') {
    if (workbenchInfo.deployed === false) {
      return (
        <>
          <div className={styles['workbench-info-button']}>
            <Button
              icon={<RocketOutlined />}
              onClick={async () => {
                setWorkbench(workbench);
                try {
                  await testWorkbenchDeploy(currentProject.code, workbench);
                  setShowModal(true);
                } catch (error) {
                  setShowWarnModal(true);
                  console.log('catch', error, error.response);
                  if (error.response.status === 404) {
                    setShowWarnModal(true);
                  }
                }
              }}
            >
              Complete Deployment
            </Button>
          </div>
          <p>Not yet deployed</p>
        </>
      );
    } else if (workbenchInfo.deployed === true) {
      const deployByUsername =
        workbenchInfo.deployByUsername.charAt(0).toUpperCase() +
        workbenchInfo.deployByUsername.slice(1);
      const deployedAt = moment(workbenchInfo.deployedAt).format('YYYY-MM-DD');
      return (
        <>
          <div className={styles['workbench-info-status']}>
            <img
              alt="Approved"
              src={require('../../../../../Images/Approved.png')}
            />
          </div>
          <p>
            Deployed for project on {deployedAt} <br />
            By: {deployByUsername}
          </p>
        </>
      );
    } else {
      return null;
    }
  } else {
    if (projectRole === 'admin') {
      if (workbenchInfo.deployed === false) {
        return (
          <>
            <div className={styles['workbench-info-status']}>
              <img
                alt="Fail"
                src={require('../../../../../Images/Fail-X.png')}
              />
            </div>
            <p>Not Deployed for the Project</p>
          </>
        );
      } else if (workbenchInfo.deployed === true) {
        const deployByUsername =
          workbenchInfo.deployByUsername.charAt(0).toUpperCase() +
          workbenchInfo.deployByUsername.slice(1);
        const deployedAt = moment(workbenchInfo.deployedAt).format(
          'YYYY-MM-DD',
        );
        return (
          <>
            <div className={styles['workbench-info-status']}>
              <img
                alt="Approved"
                src={require('../../../../../Images/Approved.png')}
              />
            </div>
            <p>
              Deployed for project on {deployedAt}
              <br />
              By: {deployByUsername}
            </p>
          </>
        );
      } else {
        return null;
      }
    }
  }
};

const WorkBenchPage = (props) => {
  const { t } = useTranslation(['errormessages', 'success']);
  const [guacamoleInfo, setGuacamoleInfo] = useState({
    deployed: '',
    deployedAt: '',
    deployByUsername: '',
  });
  const [supersetInfo, setSupersetInfo] = useState({
    deployed: '',
    deployedAt: '',
    deployByUsername: '',
  });
  const [jupyterhubInfo, setJupyterhubInfo] = useState({
    deployed: '',
    deployedAt: '',
    deployByUsername: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [showWarnModal, setShowWarnModal] = useState(false);
  const [workbench, setWorkbench] = useState('');
  const [projectVM, setProjectVM] = useState([]);
  const [currentProject] = useCurrentProject();

  const getWorkbenchInformation = async () => {
    try {
      const res = await getWorkbenchInfo(currentProject?.globalEntityId);
      const workbenchKeys = Object.keys(res.data.result);
      if (workbenchKeys.length > 0) {
        if (workbenchKeys.includes('guacamole')) {
          setGuacamoleInfo({ ...res.data.result['guacamole'], deployed: true });
        } else {
          setGuacamoleInfo({
            ...guacamoleInfo,
            deployed: false,
          });
        }
        if (workbenchKeys.includes('superset')) {
          setSupersetInfo({ ...res.data.result['superset'], deployed: true });
        } else {
          setSupersetInfo({
            ...supersetInfo,
            deployed: false,
          });
        }
        if (workbenchKeys.includes('jupyterhub')) {
          setJupyterhubInfo({
            ...res.data.result['jupyterhub'],
            deployed: true,
          });
        } else {
          setJupyterhubInfo({
            ...jupyterhubInfo,
            deployed: false,
          });
        }
      } else {
        setGuacamoleInfo({
          ...guacamoleInfo,
          deployed: false,
        });
        setSupersetInfo({
          ...supersetInfo,
          deployed: false,
        });
        setJupyterhubInfo({
          ...jupyterhubInfo,
          deployed: false,
        });
      }
    } catch (error) {
      message.error(t('errormessages:projectWorkench.getWorkbench.default.0'));
    }
  };

  const fetchProjectVM = async () => {
    try {
      const response = await getProjectVMs(currentProject.code);
      setProjectVM(response.data.result);
    } catch (error) {}
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const closeWarnModal = () => {
    setShowWarnModal(false);
  };

  const appendVMList = () => (
    <ul className={styles['guacamole__vm-list']}>
      {projectVM.map((vm) => (
        <li>
          <img
            alt="Approved"
            src={require('../../../../../Images/Approved.png')}
          />
          <span>{vm.name}</span>
        </li>
      ))}
    </ul>
  );

  useEffect(() => {
    getWorkbenchInformation();
  }, [props.project.workbenchDeployedCounter]);

  useEffect(() => {
    fetchProjectVM();
  }, []);
  return (
    <div
      className={
        styles.workBench +
        ' ' +
        CSSCustomProperties['project_setting_workbench']
      }
    >
      <div className={styles.guacamole}>
        <div className={styles.workbench_icon}>
          <img
            src={require('../../../../../Images/Guacamole-Blue.svg').default}
          />
        </div>
        <div className={styles.workbench_name}>
          <span>Guacamole</span>
        </div>
        <div className={styles.workbench_deploy_info}>
          {deployedInfo(
            props.platformRole,
            guacamoleInfo,
            currentProject,
            setShowModal,
            setShowWarnModal,
            setWorkbench,
            'Guacamole',
          )}
        </div>
        <div className={styles['guacamole__vm']}>
          {projectVM && projectVM.length ? (
            <>
              <RobotOutlined />
              {appendVMList()}
            </>
          ) : null}
        </div>
      </div>
      <div className={styles.superset}>
        <div className={styles.workbench_icon}>
          <img
            src={require('../../../../../Images/SuperSet-Blue.svg').default}
          />
        </div>
        <div className={styles.workbench_name}>
          <span>Superset</span>
        </div>
        <div className={styles.workbench_deploy_info}>
          {deployedInfo(
            props.platformRole,
            supersetInfo,
            currentProject,
            setShowModal,
            setShowWarnModal,
            setWorkbench,
            'Superset',
          )}
        </div>
      </div>
      <div className={styles.jupyterhub}>
        <div className={styles.workbench_icon}>
          <img
            src={require('../../../../../Images/Jupyter-Blue.svg').default}
          />
        </div>
        <div className={styles.workbench_name}>
          <span>Jupyterhub</span>
        </div>
        <div className={styles.workbench_deploy_info}>
          {deployedInfo(
            props.platformRole,
            jupyterhubInfo,
            currentProject,
            setShowModal,
            setShowWarnModal,
            setWorkbench,
            'Jupyterhub',
          )}
        </div>
      </div>
      <WorkbenchDeployModal
        showModal={showModal}
        workbench={workbench}
        closeModal={closeModal}
        projectGeid={currentProject?.globalEntityId}
      />
      <WorkbenchWarningModal
        showModal={showWarnModal}
        workbench={workbench}
        closeModal={closeWarnModal}
      />
    </div>
  );
};

export default connect(mapStateToProps, null)(withRouter(WorkBenchPage));
