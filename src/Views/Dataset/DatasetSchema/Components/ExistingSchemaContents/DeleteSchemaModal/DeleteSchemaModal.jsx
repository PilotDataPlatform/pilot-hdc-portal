/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Modal, Button } from 'antd';
import styles from './deleteSchemaModal.module.scss';
import { deleteMetaFromKG, getKGMetaListAPI } from '../../../../../../APIs';
import variables from '../../../../../../Themes/constants.scss';
import { schemaTemplatesActions } from '../../../../../../Redux/actions';
import { useDispatch, useSelector } from 'react-redux';

const DeleteSchemaModal = (props) => {
  const { visibility, setModalDeleteVisibility, datasetGeid, schemaIds, item, metaItem, deleteSchema } = props;
  const dispatch = useDispatch();
  const { username } = useSelector((state) => state);
  const closeModal = () => {
    setModalDeleteVisibility(false);
  };

  const handleDeleteFromPilot = async () => {
    await deleteSchema(item, datasetGeid);
    closeModal();
  }

  const handleDeleteFromKG = async (kgInstanceId) => {
    await deleteMetaFromKG(kgInstanceId, username);
    try {
      const resMeta = await getKGMetaListAPI(schemaIds);
      dispatch(
        schemaTemplatesActions.updateKgSchemaMetaList(resMeta.data.metadata),
      );
    } catch (e) {}
    closeModal();
  }

  const handleDeleteFromBoth = async(kgInstanceId) => {
    await handleDeleteFromPilot();
    await handleDeleteFromKG(kgInstanceId);
  }

  return (
    <>
      {' '}
      <Modal
        className={styles.delete_schema_modal}
        title={
          <p style={{ color: variables.primaryColor1, margin: '0px' }}>
            Delete openMINDS Schema
          </p>
        }
        width={600}
        open={visibility}
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
          <div>
            <span className={styles['description']}>
              You've selected the following instance:
            </span>
            <span>
              <h3>{item?.name ? item.name : ''}</h3>
            </span>
            <span className={styles['annotation']}>
              Please use the buttons below to specify where the selected metadata instance should be deleted, or click on "Cancel" to return. Be aware that deleted instance can not be restored.
            </span>
          </div>
        </div>
        <div className={styles['button-row']}>
          <div>
            <Button
              className={styles['button']}
              type='primary'
              icon={<DeleteOutlined />}
              onClick={async () => {
                await handleDeleteFromPilot();
              }}

            >
              Delete in HDC
            </Button>
          </div>
          <div>
              <Button
                className={styles['button']}
                type="primary"
                icon={<DeleteOutlined />}
                onClick={async () => {
                  await handleDeleteFromKG(metaItem.kgInstanceId);
                }}
              >
                Delete in KG
              </Button>
          </div>
          <div>
              <Button
                className={styles['button']}
                type="primary"
                icon={<DeleteOutlined />}
                onClick={async () => {
                  await handleDeleteFromBoth(metaItem.kgInstanceId);
                }}
              >
                Delete in both
              </Button>
          </div>
          </div>
      </Modal>
    </>
  );
};

export default DeleteSchemaModal;
