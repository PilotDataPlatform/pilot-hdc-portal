/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Modal, Button, message, Input } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useCurrentProject } from '../../../Utility';
import 'antd/dist/antd.css';
import styles from './index.module.scss';
import {
  createResourceRequestAPI,
  getUserAnnouncementApi,
} from '../../../APIs';
const { TextArea } = Input;
const RequestAccessModal = (props) => {
  const [showConfirmationConetnt, toggleShowConfirmationContent] =
    useState(false);
  const [userGeid, setUserGeid] = useState(null);
  const [connectGuacamole, setConnectGuacamole] = useState(false);
  const [connectSuperSet, setConnectSuperSet] = useState(false);
  const [reqNote, setReqNote] = useState('');
  const MSG_MAX_LIMIT = 100;
  let [currentProject] = useCurrentProject();

  useEffect(() => {
    const getUserGeid = async () => {
      const res = await getUserAnnouncementApi(props.username);
      if (res.data.result) {
        setUserGeid(res.data.result.id);
      }
    };

    getUserGeid();
  }, [props.username]);

  const createResourceRequest = async () => {
    let requestFor;
    if (props.requestItem === 'Superset') {
      requestFor = 'SuperSet';
    } else {
      requestFor = 'Guacamole';
    }
    if (userGeid) {
      try {
        if (requestFor === 'Guacamole') {
          setConnectGuacamole(true);
        }
        if (requestFor === 'SuperSet') {
          setConnectSuperSet(true);
        }
        await createResourceRequestAPI({
          userId: userGeid,
          projectId: props.projectGeid,
          requestFor,
          message: reqNote,
        });
        toggleShowConfirmationContent(true);
      } catch (error) {
        if (error.response.data.code === 409) {
          const errorMessage = 'Already requested, please wait for approval.';
          message.info(errorMessage);
        } else {
          const errorMessage = 'Failed to request access!';
          message.info(errorMessage);
        }
      }
    }
  };

  const requestAccessTitle = 'Request Access';
  const requestAccessConetnt = (
    <div className={styles.content}>
      <p style={{ color: '#595959', fontSize: '14px' }}>
        Request permission for accessing:
      </p>
      <p style={{ color: '#595959', fontSize: '16px', fontWeight: '600' }}>
        {props.requestItem}
      </p>
      {props.requestItem === 'Guacamole' ? (
        <div className={styles.request_note}>
          <TextArea
            showCount
            maxLength={MSG_MAX_LIMIT}
            style={{ height: 95 }}
            onChange={(e) => {
              setReqNote(e.target.value);
            }}
          />
          <span className={styles.request_note__length}>{`${
            reqNote.length ? reqNote.length : 0
          }/${MSG_MAX_LIMIT}`}</span>
        </div>
      ) : null}
      <div className={styles.modal_content_button}>
        <Button
          style={{ border: 'none', marginRight: '26px', fontWeight: '600' }}
          onClick={() => {
            props.toggleRequestModal(false);
            setTimeout(() => {
              toggleShowConfirmationContent(false);
            }, 500);
          }}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          style={{ borderRadius: '8px', width: '137px' }}
          onClick={() => {
            createResourceRequest();
          }}
        >
          <ArrowRightOutlined /> Send Request
        </Button>
      </div>
    </div>
  );

  const requestConfirmationTitle = 'Request Confirmation';
  const requestConfirmationContent = (
    <div className={styles.content}>
      <p style={{ color: '#595959', fontSize: '14px' }}>
        A request has been sent. <br />
        You will be emailed once granted access to
      </p>
      <p style={{ color: '#595959', fontSize: '16px', fontWeight: '600' }}>
        {props.requestItem}
      </p>
      <div style={{ marginTop: '30px', paddingBottom: '30px' }}>
        <Button
          type="primary"
          style={{ borderRadius: '8px', width: '75px' }}
          onClick={() => {
            props.toggleRequestModal(false);
            setTimeout(() => {
              toggleShowConfirmationContent(false);
            }, 500);
          }}
        >
          OK
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      className={styles.request_modal}
      title={
        showConfirmationConetnt ? requestConfirmationTitle : requestAccessTitle
      }
      visible={props.showRequestModal}
      onCancel={() => {
        props.toggleRequestModal(false);
        setTimeout(() => {
          toggleShowConfirmationContent(false);
        }, 500);
      }}
      maskClosable={false}
      centered={true}
      footer={null}
    >
      <div style={{ position: 'relative' }}>
        {showConfirmationConetnt
          ? requestConfirmationContent
          : requestAccessConetnt}
      </div>
    </Modal>
  );
};

export default RequestAccessModal;
