/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
import { CloseOutlined, RollbackOutlined } from '@ant-design/icons';
import styles from './ResetPasswordModal.module.scss';
import { useTranslation } from 'react-i18next';
import { resetVMPasswordApi } from '../../APIs'

const ResetVMPasswordModal = (props) => {
  const username = props.username;
  const firstTime = props.passwordReset;
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState(null);
  const { t } = useTranslation(['tooltips', 'formErrorMessages', 'success', 'errormessages']);
  async function resetVMPassword(){
    try {
      const result = await resetVMPasswordApi(username);
      setStep(2)
      setPassword(result.data.password)
      localStorage.setItem('passwordAlreadyReset', 'true')
    } catch (e) {
      message.error(t('errormessages:resetVMPassword.default.0'))
    }

  }

  return (
    <Modal
      title={
        <div>
          <p
            style={{
              margin: 0,
              padding: '4px 20px 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {firstTime ? <b>Generate VM Password</b> : <b>VM Password Reset</b>}
            <CloseOutlined
              style={{ fontSize: 14 }}
              onClick={() => {
                props.handleCancel();
                setStep(1);
              }}
            />
          </p>
        </div>
      }
      className={styles.reset_pop_up}
      visible={props.visible}
      maskClosable={false}
      closable={false}
      destroyOnClose={true}
      footer={null}
    >
      <div style={{ margin: '35px 0 30px', textAlign: 'center' }}>
        {step === 1 ? <p style={{ textAlign: 'center', cursor: 'default', marginBottom: 4 }}>
          Press button below to generate a new VM password
        </p> : <div style={{ textAlign: 'center', cursor: 'default', marginBottom: 15 }}> Your new password is:
          <p style={{ fontWeight: 'bold', fontSize: 'large' }}> {password} </p>
          <p style={{ paddingBottom: 15}}> Please write it down before closing this window </p>
        </div>}
      </div>
      {step === 1 ? <div style={{ textAlign: 'center', paddingBottom: 15 }}>
        <Button
          type="link"
          style={{
            marginRight: 40,
            color: 'rgba(0,0,0,0.65)',
            fontWeight: 'bold',
          }}
          onClick={() => {
            props.handleCancel();
          }}
        >
          Cancel
        </Button>
          <Button
            style={{ borderRadius: 10, width: 200 }}
            type="primary"
            icon={<RollbackOutlined />}
            onClick={() => {resetVMPassword();}}

          >
            {firstTime ? <span>Generate VM Password</span> : <span>Reset VM Password</span> }
          </Button>
      </div> : null}
    </Modal>
  );
};

export default ResetVMPasswordModal;
