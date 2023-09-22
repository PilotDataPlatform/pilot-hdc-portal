/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
import { createSubFolderApi } from '../../../../../../../APIs';
import { PanelKey } from '../../RawTableValues';
import { namespace, ErrorMessager } from '../../../../../../../ErrorMessages';
import i18n from '../../../../../../../i18n';
import { trimString, useCurrentProject } from '../../../../../../../Utility';

export default function CreateFolderModal(props) {
  const {
    visible,
    hideModal,
    refresh,
    currentRouting,
    projectCode,
    uploader,
    panelKey,
  } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentDataset = {}] = useCurrentProject();
  const submit = () => {
    setLoading(true);
    form
      .validateFields()
      .then((values) => {
        const { folderName } = values;
        const zone = getZone(panelKey);
        createSubFolderApi(
          trimString(folderName),
          currentRouting.map((r) => r.name).join('/'),
          projectCode,
          uploader,
          zone,
          currentDataset.globalEntityId,
        )
          .then((res) => {
            if (res.status === 409) {
              message.error(`${i18n.t('errormessages:createFolder.409.0')}`);
            }
            if (res.status === 200) {
              message.success(`${i18n.t('success:createFolder')}`);
              refresh();
              hideModal();
              form.resetFields(['folderName']);
            }
          })
          .catch((err) => {
            if (err.response) {
              const errorMessager = new ErrorMessager(
                namespace.fileExplorer.createFolder,
              );
              errorMessager.triggerMsg(err.response.status);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  return (
    <Modal
      visible={visible}
      title="Create a Folder"
      className={styles['create-folder-modal']}
      onCancel={() => {
        hideModal();
        form.resetFields(['folderName']);
      }}
      maskClosable={false}
      footer={[
        <Button
          disabled={loading}
          onClick={() => {
            hideModal();
            form.resetFields(['folderName']);
          }}
          type="link"
        >
          Cancel
        </Button>,
        <Button
          loading={loading}
          type="primary"
          icon={<PlusOutlined />}
          onClick={submit}
        >
          Create
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="folderName"
          label="Folder Name"
          rules={[
            {
              required: true,
              validator: (rule, value) => {
                const collection = value ? trimString(value) : null;
                if (!collection) {
                  return Promise.reject(
                    'Folder name should be 1 ~ 20 characters',
                  );
                }
                const isLengthValid =
                  collection.length >= 1 && collection.length <= 20;
                if (!isLengthValid) {
                  return Promise.reject(
                    'Folder name should be 1 ~ 20 characters',
                  );
                } else {
                  const specialChars = [
                    '\\',
                    '/',
                    ':',
                    '?',
                    '*',
                    '<',
                    '>',
                    '|',
                    '"',
                    "'",
                  ];
                  for (let char of specialChars) {
                    if (collection.indexOf(char) !== -1) {
                      return Promise.reject(
                        `Folder name can not contain any of the following character ${specialChars.join(
                          ' ',
                        )}`,
                      );
                    }
                  }
                  if (!currentRouting || currentRouting.length === 0) {
                    const reserved = ['raw', 'logs', 'trash', 'workdir'];
                    if (reserved.indexOf(collection.toLowerCase()) !== -1) {
                      return Promise.reject(
                        `Following folder name is reserved: ${reserved.join(
                          ' ',
                        )}`,
                      );
                    }
                  }

                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          <Input placeholder="Enter your folder name"></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
}

function getZone(panelKey) {
  if (panelKey === PanelKey.CORE_HOME || panelKey === PanelKey.CORE) {
    return 'Core';
  }
  if (panelKey === PanelKey.GREENROOM_HOME || panelKey === PanelKey.GREENROOM) {
    return 'greenroom';
  }
  throw new Error('The panel key is incorrect');
}
