/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { CloudDownloadOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { Modal, Button, message } from 'antd';
import styles from './syncSchemaModal.module.scss';
import {
  getDatasetSchemaListAPI,
  getKGMetaListAPI, bulkRefreshMetaFromKG, bulkUpdateMetaToKG,
} from '../../../../../../APIs';
import { useSelector, useDispatch } from 'react-redux';
import { schemaTemplatesActions } from '../../../../../../Redux/actions';
import variables from '../../../../../../Themes/constants.scss';
import { useTranslation } from 'react-i18next';

const SyncSchemaModal = (props) => {
  const { visibility, setModalSyncVisibility, schemaIds } = props;
  const { geid } = useSelector((state) => state.datasetInfo.basicInfo);
  const { username } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { t } = useTranslation(['errormessages', 'success']);

  const closeModal = () => {
    setModalSyncVisibility(false);
  };

  const bulkRefreshMetadata = async () => {
    try {
      await bulkRefreshMetaFromKG(geid, username);
      closeModal();
      message.success(t('success:bulkRefreshFromKG.default.0'));
      const res = await getDatasetSchemaListAPI(geid);
      dispatch(schemaTemplatesActions.updateDefaultSchemaList(res.data.result));
      const resMeta = await getKGMetaListAPI(schemaIds);
      dispatch(schemaTemplatesActions.updateKgSchemaMetaList(resMeta.data.metadata));
    } catch (error) {
      message.error(t('errormessages:bulkRefreshFromKG.default.0'));
    }
  };

  const bulkUpdateMetadata = async () => {
    try {
      await bulkUpdateMetaToKG(geid, username);
      closeModal();
      message.success(t('success:bulkUpdateToKG.default.0'));
      const res = await getDatasetSchemaListAPI(geid);
      dispatch(schemaTemplatesActions.updateDefaultSchemaList(res.data.result));
      const resMeta = await getKGMetaListAPI(schemaIds);
      dispatch(schemaTemplatesActions.updateKgSchemaMetaList(resMeta.data.metadata));
    } catch (error) {
      message.error(t('errormessages:bulkUpdateToKG.default.0'));
    }
  };

  return (
    <>
      {' '}
      <Modal
        className={styles.upload_schema_modal}
        title={
          <p style={{ color: variables.primaryColor1, margin: '0px' }}>
            Sync all openMINDS Instances for this dataset
          </p>
        }
        width={600}
        visible={visibility}
        maskClosable={false}
        centered={true}
        closable={false}
        footer={[
          <div>
            <Button
              className={styles.footer_cancel_btn}
              onClick={closeModal}
            >
              Cancel
            </Button>
          </div>,
        ]}
        onCancel={closeModal}
      >
        <div className={styles['top']}>
          <span className={styles['description']}>
            Select a direction for the syncing:
          </span>
        </div>
        <div className={styles['top']}>
          <Button
            className={styles.footer_sync_btn}
            type='primary'
            icon={<CloudUploadOutlined />}
            onClick={bulkUpdateMetadata}
            disabled={schemaIds.length <= 1}
          >
            Upload all Instances to KG
          </Button>
          <Button
            className={styles.footer_sync_btn}
            type='primary'
            icon={<CloudDownloadOutlined />}
            onClick={bulkRefreshMetadata}
            disabled={schemaIds.length <= 1}
          >
            Update all Instances from KG
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default SyncSchemaModal;
