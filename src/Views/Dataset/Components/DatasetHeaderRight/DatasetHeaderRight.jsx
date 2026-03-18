/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useEffect, useState, useRef } from 'react';
import { Button, Tooltip, message, Modal } from 'antd';
import styles from './DatasetHeaderRight.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { getFileSize, getTags } from '../../../../Utility';
import DatasetFilePanel from '../DatasetFilePanel/DatasetFilePanel';
import { RocketOutlined, DeleteOutlined } from '@ant-design/icons';
import PublishNewVersion from '../PublishNewVersion/PublishNewVersion';
import { createKGSpace, getKGSpace, deleteDatasetApi } from '../../../../APIs';
import { setKgSpaceBind } from '../../../../Redux/actions';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { getProjectsAndRoles } from '../../../../Utility/userProjects';
import { getWithExpiry, setWithExpiry } from '../../../../Utility';

export default function DatasetHeaderRight(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation(['errormessages', 'success']);
  const [newVersionModalVisibility, setNewVersionModalVisibility] =
    useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const {
    basicInfo: { size, totalFiles, tags, code, projectGeid, creator },
  } = useSelector((state) => state.datasetInfo);
  const datasetProjectCode = useSelector(
    (state) => state.datasetInfo.projectCode,
  );
  const { keycloak } = useKeycloak();
  const username = useSelector((state) => state.username);
  const userProjectsAndRoles = getProjectsAndRoles(keycloak?.tokenParsed);
  const isDatasetCreator = username === creator;
  const isAssociatedProjectAdmin =
    datasetProjectCode && userProjectsAndRoles[datasetProjectCode] === 'admin';
  const canDeleteDataset = isDatasetCreator || isAssociatedProjectAdmin;
  const [kgSpaceBtnLoading, setKgSpaceBtnLoading] = useState(false);
  const { spaceBind } = useSelector((state) => state.kgSpaceList);
  const spaceBindName = spaceBind ? 'collab-hdc-' + spaceBind.name : null;
  const creatingKey = 'collab-hdc-' + code + '-creating';
  const creatingStorage = getWithExpiry(creatingKey, true);
  const [creating, setCreating] = useState(creatingStorage);
  const [checkTriggerKey, setCheckTriggerKey] = useState(1);
  let checkKGTimer = useRef();
  const checkKGFun = async () => {
    const res = await getKGSpace(code);
    if (res.data) {
      dispatch(setKgSpaceBind(res.data));
      return true;
    } else {
      return false;
    }
  };
  useEffect(() => {
    return () => {
      clearInterval(checkKGTimer.current);
    };
  }, []);
  useEffect(() => {
    if (spaceBind === false && getWithExpiry(creatingKey, true)) {
      checkKGTimer.current = setInterval(async () => {
        const kgSpaceCreated = await checkKGFun();
        if (kgSpaceCreated) {
          clearInterval(checkKGTimer.current);
        }
      }, 10 * 1000);
    }
  }, [spaceBind, checkTriggerKey]);
  const createKG = async (e) => {
    if (kgSpaceBtnLoading) {
      return;
    }
    if (!projectGeid) {
      message.error(t('errormessages:createKGSpace.noProjectAssociation.0'));
      return;
    }
    setKgSpaceBtnLoading(true);
    message.warning(
      'Creating KG space can take some time. Please check back later.',
    );
    try {
      setCreating(true);
      setWithExpiry(creatingKey, true, 20 * 60 * 1000);
      await createKGSpace(code);
    } catch (e) {
      dispatch(setKgSpaceBind(false));
      dispatch(setCheckTriggerKey(checkTriggerKey + 1));
      setKgSpaceBtnLoading(false);
      return;
    }
    try {
      await checkKGFun();
    } catch (e) {}
    setKgSpaceBtnLoading(false);

    message.success(t('success:createKGSpace.default.0'));
  };

  const handleDeleteDataset = async () => {
    setDeleteLoading(true);
    try {
      await deleteDatasetApi(code);
      message.success(`Dataset ${code} has been deleted successfully.`);
      setDeleteModalVisible(false);
      history.push('/datasets');
    } catch (e) {
      message.error('Failed to delete the dataset. Please try again later.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className={styles['statistics-container']}>
          <Statistics label="Files">{totalFiles}</Statistics>
          <Statistics label="Size">{getFileSize(size)}</Statistics>
        </div>
        <div style={{ marginTop: '-10px' }}>
          <DatasetFilePanel />
        </div>
      </div>
      <div className={styles['tags-container']}>{getTags(tags)}</div>
      <div className={styles['header-btns-wrap']}>
        {spaceBind !== null ? (
          spaceBind === false ? (
            <Button type="primary" onClick={createKG} disabled={creating}>
              Create KG Space
            </Button>
          ) : (
            <span className={styles['kg-association']}>
              KG Space:{' '}
              <b>
                {spaceBindName.length > 30 ? (
                  <Tooltip title={spaceBindName}>
                    ...
                    {spaceBindName.split('-')[2]}
                  </Tooltip>
                ) : (
                  spaceBindName
                )}
              </b>
            </span>
          )
        ) : null}

        <Button
          icon={<RocketOutlined />}
          type="primary"
          onClick={() => setNewVersionModalVisibility(true)}
        >
          Release New Version
        </Button>
        {canDeleteDataset && (
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => setDeleteModalVisible(true)}
          >
            Delete Dataset
          </Button>
        )}
      </div>

      <PublishNewVersion
        newVersionModalVisibility={newVersionModalVisibility}
        setNewVersionModalVisibility={setNewVersionModalVisibility}
      />

      <Modal
        title="Delete Dataset"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            loading={deleteLoading}
            onClick={handleDeleteDataset}
          >
            Delete
          </Button>,
        ]}
      >
        <p>
          Are you sure you want to delete dataset <b>{code}</b>? This action cannot be
          undone.
        </p>
      </Modal>
    </>
  );
}

const Statistics = (props) => {
  const { label, children } = props;
  return (
    <span className={styles['statistics']}>
      <span className={styles['statistics-title']}>{label}</span>
      <span className={styles['statistics-value']}>{children}</span>
    </span>
  );
};
