/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import {
  Form,
  Card,
  Input,
  Select,
  Button,
  Space,
  Row,
  Col,
  message,
  Tooltip,
} from 'antd';
import { useSelector } from 'react-redux';
import styles from './CreateDatasetPanel.module.scss';
import { createDatasetApi } from '../../../../APIs';
import { validators } from './createDatasetValidators';
import { modalityOptions } from './selectOptions';
import { fetchMyDatasets } from '../../Components/MyDatasetList/fetchMyDatasets';
import { useTranslation } from 'react-i18next';
import { useQueryParams } from '../../../../Utility';
import { FileAddOutlined, InfoCircleOutlined } from '@ant-design/icons';
const { Option } = Select;

export default function CreateDatasetPanel(props) {
  const { ACTIONS, action, setAction } = props;
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { username } = useSelector((state) => state);
  const { t } = useTranslation(['tooltips', 'errormessages', 'success']);
  const { page = 1, pageSize = 10 } = useQueryParams(['pageSize', 'page']);

  const onCancel = () => {
    setAction(ACTIONS.default);
  };

  const onSubmit = async () => {
    setSubmitting(true);
    try {
      const values = await form.validateFields();
      const {
        title,
        code,
        authors,
        type,
        modality,
        collectionMethod,
        license,
        tags,
        description,
      } = values;

      const res = await createDatasetApi(
        username,
        title,
        code,
        authors,
        type,
        modality,
        collectionMethod,
        license,
        tags,
        description,
      );
      setAction(ACTIONS.default);
      message.success(t('success:createDataset'));
      fetchMyDatasets(username, parseInt(page), parseInt(pageSize));
    } catch (error) {
      console.log(error);
      if (error.hasOwnProperty('errorFields')) return;

      if (error.response?.status === 409) {
        message.error(t('errormessages:createDataset.409.0'));
      } else {
        message.error(t('errormessages:createDataset.default.0'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const CollectionMethodLabel = () => (
    <>
      <span>
        Collection<br></br>Method
      </span>{' '}
    </>
  );

  return (
    <div className={styles['card']}>
      <Card>
        <Form form={form} colon={false} className={styles['form']}>
          <h2>Define Dataset</h2>
          <Form.Item
            rules={validators.title}
            name="title"
            label={
              <>
                Title{' '}
                <div className={styles['tooltip']}>
                  <Tooltip title={t('tooltips:create_dataset.dataset_name')}>
                    <InfoCircleOutlined />
                  </Tooltip>{' '}
                </div>
              </>
            }
            required
          >
            <Input
              className={styles['input']}
              placeholder="Enter title"
            ></Input>
          </Form.Item>
          <Row>
            {' '}
            <Col span={12}>
              <Form.Item
                required
                name="code"
                rules={validators.datasetCode}
                label={
                  <>
                    Dataset Code
                    <div className={styles['tooltip']}>
                      <Tooltip
                        title={t('tooltips:create_dataset.dataset_code')}
                      >
                        <InfoCircleOutlined />
                      </Tooltip>
                    </div>
                  </>
                }
              >
                <Input className={styles['input']}></Input>
              </Form.Item>
            </Col>{' '}
            <Col span={12}>
              <Form.Item
                name="authors"
                required
                rules={validators.authors}
                allowClear
                label={
                  <>
                    Authors
                    <div className={styles['tooltip']}>
                      <Tooltip title={t('tooltips:create_dataset.authors')}>
                        <InfoCircleOutlined />
                      </Tooltip>
                    </div>
                  </>
                }
              >
                <Select placeholder="Enter authors" mode="tags" />
              </Form.Item>
            </Col>{' '}
          </Row>

          <Form.Item
            valuePropName="checked"
            name="type"
            label={
              <>
                Dataset Type{' '}
                <div className={styles['tooltip']}>
                  <Tooltip title={t('tooltips:create_dataset.dataset_type')}>
                    <InfoCircleOutlined />
                  </Tooltip>
                </div>
              </>
            }
          >
            <Select defaultValue="GENERAL">
              <Select.Option value="GENERAL">GENERAL</Select.Option>
              <Select.Option value="BIDS">BIDS</Select.Option>
            </Select>
          </Form.Item>

          <div className={styles['spacing']}></div>

          <h2>Description</h2>
          <Form.Item
            className={styles.description_form_item}
            rules={validators.description}
            name="description"
            label={
              <>
                <p>Dataset Description</p>
                <div className={styles['tooltip']}>
                  <Tooltip title={t('tooltips:create_dataset.description')}>
                    <InfoCircleOutlined />
                  </Tooltip>
                </div>
              </>
            }
            required
          >
            <Input.TextArea
              className={styles['input']}
              placeholder="Enter description"
            ></Input.TextArea>
          </Form.Item>
          <Form.Item
            rules={validators.modality}
            name="modality"
            label={
              <>
                Modality
                <div className={styles['tooltip']}>
                  <Tooltip title={t('tooltips:create_dataset.modality')}>
                    <InfoCircleOutlined />
                  </Tooltip>
                </div>
              </>
            }
          >
            <Select
              mode="multiple"
              className={styles['select']}
              placeholder="Select Modality"
              allowClear
            >
              {modalityOptions.sort().map((value) => (
                <Option key={value} value={value}>
                  {value}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            className={styles['collection-method']}
            name="collectionMethod"
            rules={validators.collectionMethod}
            label={
              <>
                <CollectionMethodLabel />
                <div className={styles['tooltip']}>
                  <Tooltip
                    title={t('tooltips:create_dataset.collection_method')}
                  >
                    <InfoCircleOutlined />
                  </Tooltip>
                </div>
              </>
            }
          >
            <Select
              className={styles['select']}
              placeholder="Enter Collection Method"
              mode="tags"
              allowClear
            ></Select>
          </Form.Item>
          <Form.Item
            rules={validators.license}
            name="license"
            label={
              <>
                License
                <div className={styles['tooltip']}>
                  <Tooltip
                    title={
                      <p
                        dangerouslySetInnerHTML={{
                          __html: t('tooltips:create_dataset.license'),
                        }}
                      ></p>
                    }
                  >
                    <InfoCircleOutlined />
                  </Tooltip>
                </div>
              </>
            }
          >
            <Input
              className={styles['input']}
              placeholder="Enter License"
            ></Input>
          </Form.Item>

          <Form.Item
            rules={validators.tags}
            name="tags"
            label={
              <>
                Tags
                <div className={styles['tooltip']}>
                  <Tooltip title={t('tooltips:create_dataset.tags')}>
                    <InfoCircleOutlined />
                  </Tooltip>
                </div>
              </>
            }
          >
            <Select placeholder="Enter tag" mode="tags"></Select>
          </Form.Item>
        </Form>

        <div className={styles['button-group']}>
          <Space>
            <Button
              icon={<FileAddOutlined />}
              loading={submitting}
              onClick={onSubmit}
              type="primary"
            >
              Create
            </Button>
            <Button disabled={submitting} onClick={onCancel} type="link">
              {' '}
              Cancel
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
}
