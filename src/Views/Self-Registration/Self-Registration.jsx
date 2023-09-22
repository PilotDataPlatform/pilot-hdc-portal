/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Form, Input, message, Button, Card, Spin } from 'antd';
import {
  checkIsUserExistAPI,
  GetUserInviteHashAPI,
  UserSelfRegistrationAPI,
} from '../../APIs';
import { UserAddOutlined, CheckOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';
import AppFooter from '../../Components/Layout/Footer';

export default function SelfRegistration() {
  const { invitationHash } = useParams();
  const [userInfo, setUserInfo] = useState({});
  const [validatingStatus, setValidatingStatus] = useState('');
  const { t } = useTranslation([
    'success',
    'formErrorMessages',
    'errormessages',
  ]);
  const [form] = Form.useForm();
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);
  const [loadingUserErrorMsg, setLoadingUserErrorMsg] = useState('');
  const [loadingSelfRegistration, setLoadingSelfRegistration] = useState(false);
  const [isRegistrationSuccessful, setIsRegistrationSuccessful] =
    useState(false);

  const submitForm = async (values) => {
    const { firstName, lastName, username, password } = values;
    setLoadingSelfRegistration(true);
    try {
      const data = { firstName, lastName, username, password };
      await UserSelfRegistrationAPI(invitationHash, data);
      setIsRegistrationSuccessful(true);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 409) {
          message.error(
            `${t(`errormessages:selfRegistration.409.0`)} ${username} ${t(
              `errormessages:selfRegistration.409.1`,
            )}`,
          );
        } else {
          message.error(
            t(`errormessages:selfRegistration.${err.response.status}.0`),
          );
        }
      } else {
        message.error(t(`errormessages:selfRegistration.default.0`));
      }
    }
    setLoadingSelfRegistration(false);
  };

  useEffect(() => {
    const getUserRegistrationInfo = async () => {
      setLoadingUserInfo(true);
      try {
        const response = await GetUserInviteHashAPI(invitationHash);
        setUserInfo(response.data.result);
      } catch (err) {
        if (err.response) {
          const errorMessage = t(
            `errormessages:parseInviteHashAPI.${err.response.status}.0`,
          );
          message.error(errorMessage);
          setLoadingUserErrorMsg(errorMessage);
        } else {
          message.error(t('errormessages:parseInviteHashAPI.default.0'));
          setLoadingUserErrorMsg(
            t('errormessages:parseInviteHashAPI.default.0'),
          );
        }
      }
      setLoadingUserInfo(false);
    };
    getUserRegistrationInfo();
  }, []);

  const onPasswordChange = (e) => {
    form.setFieldsValue(e.target.value);
    const confirmPassword = form.getFieldValue('confirmPassword');

    if (!confirmPassword || e.target.value === confirmPassword) {
      form.validateFields(['confirmPassword'], () => Promise.resolve());
    } else if (confirmPassword && e.target.value !== confirmPassword) {
      form.validateFields(['confirmPassword'], () => Promise.reject());
    }
  };

  const showRegistrationMessage = () => {
    if (loadingUserErrorMsg) {
      return loadingUserErrorMsg;
    }
    if (userInfo?.platformRole === 'admin') {
      return (
        <>
          Invited into PILOT as <strong>Platform Administrator</strong>
        </>
      );
    }
    if (!userInfo?.projectCode) {
      return 'Invited into Pilot as Platform user without Project membership yet';
    }
    if (userInfo?.projectCode && userInfo?.projectRole) {
      return `Invited into Pilot as Project ${userInfo?.projectRole}`;
    }
  };

  const RegistrationSuccessful = ({ className }) => (
    <div className={className}>
      <p>
        <CheckOutlined /> Registration Successful
      </p>
      <p>You will receive an email confirmation with a login link.</p>
    </div>
  );

  return (
    <div className={styles.registration}>
      <Layout.Header className={styles['registration__header']}>
        <img src={require('../../Images/pilot-Logo-White.svg').default} />
        <p>Register</p>
      </Layout.Header>
      <Card
        className={styles['registration__card']}
        title={
          <>
            PILOT invitation
            <Button
              icon={<UserAddOutlined />}
              className={styles['card__register-button']}
              htmlType="submit"
              onClick={() => form.submit()}
              loading={loadingSelfRegistration}
              disabled={isRegistrationSuccessful}
            >
              Register
            </Button>
          </>
        }
      >
        {isRegistrationSuccessful ? (
          <RegistrationSuccessful
            className={styles['registration__message-successful']}
          />
        ) : (
          <>
            <div className={styles['registration__message']}>
              {loadingUserInfo ? <Spin /> : <p>{showRegistrationMessage()}</p>}
            </div>
            <Form
              form={form}
              onFinish={submitForm}
              colon={false}
              labelCol={{ span: 5, offset: 1 }}
              wrapperCol={{ span: 14, offset: 0 }}
              size="small"
            >
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: t(
                      'formErrorMessages:selfRegister.firstName.empty',
                    ),
                    whitespace: true,
                  },
                  {
                    pattern: new RegExp(/^[a-zA-Z0-9]{1,20}$/g),
                    message: t(
                      'formErrorMessages:selfRegister.firstName.valid',
                    ),
                  },
                ]}
              >
                <Input placeholder="Enter First Name" />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  {
                    required: true,
                    message: t('formErrorMessages:selfRegister.lastName.empty'),
                    whitespace: true,
                  },
                  {
                    pattern: new RegExp(/^[a-zA-Z0-9]{1,20}$/g),
                    message: t('formErrorMessages:selfRegister.lastName.valid'),
                  },
                ]}
              >
                <Input placeholder="Enter Last Name" />
              </Form.Item>
              <Form.Item
                label="Username"
                name="username"
                validateStatus={validatingStatus}
                rules={[
                  {
                    required: true,
                    message: t('formErrorMessages:common.username.empty'),
                  },
                  ({ getFieldValue }) => ({
                    validator: async (rule, value) => {
                      if (!value?.length) {
                        setValidatingStatus('error');
                        return;
                      }

                      setValidatingStatus('validating');
                      try {
                        const re = /^[a-z0-9]{6,20}$/;

                        if (re.test(value)) {
                          await checkIsUserExistAPI(value, invitationHash);
                          setValidatingStatus('error');
                          return Promise.reject('The username has been taken');
                        }

                        setValidatingStatus('error');
                        return Promise.reject(
                          t('formErrorMessages:common.username.valid'),
                        );
                      } catch {
                        setValidatingStatus('success');
                        return Promise.resolve();
                      }
                    },
                  }),
                ]}
              >
                <Input placeholder="Enter Username" />
              </Form.Item>
              <Form.Item label="Email">
                <Input value={userInfo.email ?? ''} readonly id="user-email" />
              </Form.Item>
              <Form.Item
                className={styles['registration__password']}
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: t('formErrorMessages:common.password.empty'),
                    whitespace: true,
                  },
                  {
                    pattern: new RegExp(
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_!%&/()=?*+#,.;])[A-Za-z\d-_!%&/()=?*+#,.;]{11,30}$/g,
                    ),
                    message: t('formErrorMessages:common.password.valid'),
                  },
                ]}
              >
                <Input
                  type="password"
                  onChange={onPasswordChange}
                  placeholder="Enter Password"
                />
              </Form.Item>
              <Form.Item
                className={styles['registration__confirm-password']}
                name="confirmPassword"
                label="Confirm password"
                rules={[
                  {
                    required: true,
                    message: t(
                      'formErrorMessages:common.confirmPassword.empty',
                    ),
                  },

                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        t('formErrorMessages:common.confirmPassword.valid'),
                      );
                    },
                  }),
                ]}
              >
                <Input type="password" placeholder="Verify Password" />
              </Form.Item>
            </Form>
          </>
        )}
      </Card>

      <div className={styles['registration__pilot-logo']}>
        <img
          src={require('../../Images/Pilot-icon-gradient.png')}
          alt="pilot logo in blue gradient"
        />
      </div>

      <Layout.Footer className={styles['registration__footer']}>
        <p>© HealthDataCloud Consortium 2022. All rights reserved</p>
      </Layout.Footer>
    </div>
  );
}
