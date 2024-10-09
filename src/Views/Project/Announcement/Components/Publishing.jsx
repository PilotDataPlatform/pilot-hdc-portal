/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { Input, Form, Button, Card, message } from 'antd';
import { NotificationOutlined } from '@ant-design/icons';
import { addAnnouncementApi } from '../../../../APIs';
import { trimString } from '../../../../Utility';
import styles from '../index.module.scss';
import i18n from '../../../../i18n';
const { TextArea } = Input;
const MAX_LENGTH = 250;
export default function Publishing({ currentProject, setIndicator }) {
  const [form] = Form.useForm();
  const [announcementDraft, setAnnouncementDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const onFinish = async () => {
    setLoading(true);
    try {
      await form.validateFields();
      const { announcement } = form.getFieldsValue();
      try {
        await addAnnouncementApi({
          projectCode: currentProject?.code,
          content: trimString(announcement),
        });

        message.success(`${i18n.t('success:announcement.default.0')}`, 3);
        form.resetFields();
        setIndicator(
          new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        );
      } catch (err) {
        message.error(
          `${i18n.t('errormessages:announcement.publishErr.0')}`,
          3,
        );
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  const updateDatasetInfo = (value) => {
    setAnnouncementDraft(value);
  };
  return (
    <Card
      title="Create new announcement"
      style={{ width: '100%', height: 300 }}
    >
      <Form
        onFinish={onFinish}
        form={form}
        className={styles.announcement_publish_form}
      >
        <Form.Item
          rules={[
            {
              validator(rule, value) {
                if (!value) {
                  return Promise.reject('The announcement should not be empty');
                }
                if (
                  trimString(value).length < 1 ||
                  trimString(value).length > MAX_LENGTH
                ) {
                  return Promise.reject(
                    `The announcement length should be 1-${MAX_LENGTH}`,
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
          name="announcement"
        >
          <div>
            <TextArea
              rows={5}
              onChange={(e) => updateDatasetInfo(e.target.value)}
              maxLength={MAX_LENGTH}
            />
            <span style={{ float: 'right', fontSize: 12, marginTop: 5 }}>{`${
              announcementDraft ? trimString(announcementDraft).length : 0
            }/${MAX_LENGTH}`}</span>
          </div>
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            loading={loading}
            htmlType="submit"
            type="primary"
            style={{ float: 'right', borderRadius: 5 }}
            icon={<NotificationOutlined />}
          >
            Publish
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
