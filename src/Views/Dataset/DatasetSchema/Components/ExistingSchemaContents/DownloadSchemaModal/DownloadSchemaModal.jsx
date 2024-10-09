/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { CloudDownloadOutlined } from '@ant-design/icons';
import { Modal, Button, Input, message } from 'antd';
import styles from './downloadSchemaModal.module.scss';
import {
  getDatasetSchemaListAPI,
  downloadMetaFromKG,
  getKGMetaListAPI,
} from '../../../../../../APIs';
import { useSelector, useDispatch } from 'react-redux';
import { schemaTemplatesActions } from '../../../../../../Redux/actions';
import variables from '../../../../../../Themes/constants.scss';
import { useTranslation } from 'react-i18next';

const DownloadSchemaModal = (props) => {
  const { visibility, setModalDownloadVisibility, schemaIds } = props;
  const [UUIDInput, setUUIDInput] = React.useState('');
  const [showWarning, setShowWarning] = React.useState(false);
  const [FilenameInput, setFilenameInput] = React.useState('');
  const { geid } = useSelector((state) => state.datasetInfo.basicInfo);
  const { username } = useSelector((state) => state);
  const dispatch = useDispatch();
  const initialMetaList = useSelector((state) => state.schemaTemplatesInfo.kgSchemaMeta);
  const { t } = useTranslation(['errormessages', 'success']);

  const closeModal = () => {
    setModalDownloadVisibility(false);
    setUUIDInput('');
    setFilenameInput('');
  };

  const downloadMetadata = async () => {
    try {
      const newMeta = await downloadMetaFromKG(UUIDInput, geid, username, FilenameInput);
      closeModal();
      message.success(t('success:downloadFromKG.default.0'));
      const res = await getDatasetSchemaListAPI(geid);
      dispatch(schemaTemplatesActions.updateDefaultSchemaList(res.data.result));
      schemaIds.push({ 'id': newMeta.data.geid });
      const resMeta = await getKGMetaListAPI(schemaIds);
      dispatch(schemaTemplatesActions.updateKgSchemaMetaList(resMeta.data.metadata));
    } catch (error) {
      message.error(t('errormessages:downloadFromKG.default.0'));
    }
  };

  const checkMetaExists = (metaID) => {
    const isMetaPresent = initialMetaList.some((o) => o.kgInstanceId === metaID);
    setShowWarning(isMetaPresent);
  }

  return (
    <>
      {' '}
      <Modal
        className={styles.upload_schema_modal}
        title={
          <p style={{ color: variables.primaryColor1, margin: '0px' }}>
            Download openMINDS Instances from KG
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
            <Button
              className={styles.footer_upload_btn}
              type="primary"
              icon={<CloudDownloadOutlined />}
              disabled={UUIDInput.length === 0}
              onClick={downloadMetadata}
            >
              Download
            </Button>
          </div>,
        ]}
        onCancel={closeModal}
      >
        <div className={styles['top']}>
          <span className={styles['description']}>
            <h3>KG instance UUID:</h3>
          </span>
          <span className={styles['description']}>
            <Input
              style={{ borderRadius: '6px', marginBottom: '20px' }}
              placeholder="Enter KG UUID"
              value={UUIDInput}
              onChange={(e) => {
                setUUIDInput(e.target.value);
                checkMetaExists(e.target.value);
                }
              }
            />
          </span>
          {showWarning ? <span className={styles['error']}>
            Warning: An openMINDS instance with this UUID already exists in your HDC Dataset.
            <br/> Are you sure you want to download it again?
          </span> : null}
          <span className={styles['description']}>
            <h4>Filename in HDC Dataset (optional):</h4>
          </span>
          <span className={styles['description']}>
            <Input
              style={{ borderRadius: '6px', marginBottom: '20px' }}
              placeholder="Enter filename"
              value={FilenameInput}
              onChange={(e) => {
                setFilenameInput(e.target.value);
              }
              }
            />
          </span>
        </div>
      </Modal>
    </>
  );
};

export default DownloadSchemaModal;
