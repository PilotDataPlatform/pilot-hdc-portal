/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FileExplorerContext from '../../../../../Components/FileExplorer/FileExplorerContext';
import { fileExplorerTableActions } from '../../../../../Redux/actions';
import { Button, Modal, Input, message } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  FolderOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import styles from './Widget.module.scss';
import {
  reviewAllRequestFiles,
  reviewSelectedRequestFiles,
} from '../../../../../APIs';
import {
  fileNameOrPathDisplay,
  useCurrentProject,
  randomTxt,
} from '../../../../../Utility';
import { tokenManager } from '../../../../../Service/tokenManager';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
export function Widget() {
  const { t } = useTranslation(['errormessages', 'success']);
  const { status, activeReq } = useSelector((state) => state.request2Core);
  const fileExplorerContext = useContext(FileExplorerContext);
  const { reduxKey, initDataSource } = fileExplorerContext;
  const [currentDataset] = useCurrentProject();
  const projectCode = currentDataset?.code;
  const permission = currentDataset?.permission;
  const dispatch = useDispatch();
  const fileExplorerTableState = useSelector(
    (state) => state.fileExplorerTable,
  );

  if (!fileExplorerTableState[reduxKey]) {
    dispatch(fileExplorerTableActions.setAdd({ geid: reduxKey }));
  }
  const { selection } = fileExplorerTableState[reduxKey] || {};
  const [approveSelModal, setApproveSelModal] = useState(false);
  const [approveAllModal, setApproveAllModal] = useState(false);
  const [denySelModal, setDenySelModal] = useState(false);
  const [denyAllModal, setDenyAllModal] = useState(false);
  const [validationModal, setValidationModal] = useState(false);
  const [validationParams, setValidationParams] = useState(null);
  const sessionId = tokenManager.getLocalCookie('sessionId');
  const [codeRandom, setCodeRandom] = React.useState('');
  const [codeInput, setCodeInput] = React.useState('');
  const [codeNotValid, setCodeNotValid] = React.useState(false);
  useEffect(() => {
    setCodeRandom(randomTxt(5));
  }, [approveSelModal, denySelModal]);
  const parentGeid = useSelector((state) => {
    const routes = state.fileExplorer.folderRouting['greenroom-home'];
    const parentFolder = routes?.length && routes[routes.length - 1];
    return parentFolder?.globalEntityId || '';
  });
  const filesPathDisplay = () => {
    return validationParams.selectedItems.map((el) => {
      if (el.nodeLabel.includes('Folder')) {
        return (
          <p className={styles.file_path_display + ' file-item'}>
            <FolderOutlined className={styles.icon} />{' '}
            <span className={styles.file_name}>
              {fileNameOrPathDisplay(el.name)}
            </span>
          </p>
        );
      } else {
        return (
          <p className={styles.file_path_display + ' file-item'}>
            <FileImageOutlined className={styles.icon} />{' '}
            <span className={styles.file_name}>
              {fileNameOrPathDisplay(el.name)}
            </span>
          </p>
        );
      }
    });
  };
  const approveOrDeny = async function (action, all) {
    let res;
    if (all) {
      res = await reviewAllRequestFiles(
        projectCode,
        initDataSource.value.id,
        action === 'approve' ? 'approved' : 'denied',
        sessionId,
      );
    } else {
      res = await reviewSelectedRequestFiles(
        projectCode,
        initDataSource.value.id,
        selection.filter((v) => !!v).map((v) => v.geid),
        action === 'approve' ? 'approved' : 'denied',
        sessionId,
        parentGeid,
      );
    }

    if (
      res.data.result &&
      (res.data.result.approved || res.data.result.denied) &&
      selection.filter((v) => !!v).find((v) => v.nodeLabel.includes('Folder'))
    ) {
      setValidationParams({
        showSelection: !all,
        selectedItems: _.cloneDeep(selection),
        action,
        approved: res.data.result.approved,
        denied: res.data.result.denied,
      });
      setValidationModal(true);
    } else {
      if (action === 'approve') {
        message.success(t('success:reviewRequestFiles.approve.0'));
      } else {
        message.success(t('success:reviewRequestFiles.deny.0'));
      }
    }
    dispatch(fileExplorerTableActions.refreshTable({ geid: reduxKey }));
    dispatch(
      fileExplorerTableActions.setSelections({ geid: reduxKey, param: [] }),
    );
  };
  if (permission !== 'admin' || status === 'complete') {
    return null;
  }
  const codeValidateWidget = (
    <>
      <p style={{ marginBottom: '8px' }}>
        Please input the code: <b className={styles.no_select}>{codeRandom}</b>{' '}
        to confirm{' '}
        {codeNotValid === true && (
          <span style={{ color: '#FF6D72', fontStyle: 'italic' }}>
            *Enter code
          </span>
        )}
      </p>
      <Input
        style={{ borderRadius: '6px', marginBottom: '20px' }}
        placeholder="Enter Code"
        value={codeInput}
        onChange={(e) => {
          setCodeInput(e.target.value);
          if (e.target.value === codeRandom) {
            setCodeNotValid(false);
          }
        }}
      />
    </>
  );
  return (
    <>
      {selection && selection.length ? (
        <Button
          className={styles['accept-icon']}
          type="link"
          icon={<CheckOutlined />}
          onClick={() => {
            setApproveSelModal(true);
          }}
        >
          Approve Selected
        </Button>
      ) : null}
      {selection && selection.length ? (
        <Button
          className={styles['deny-icon']}
          type="link"
          icon={<CloseOutlined />}
          onClick={() => {
            setDenySelModal(true);
          }}
        >
          Deny Selected
        </Button>
      ) : null}
      <Modal
        title="Confirmation"
        width={450}
        visible={approveSelModal}
        wrapClassName={styles.approve_modal + ' global-modal-wrapper'}
        destroyOnClose={true}
        onOk={() => {
          if (codeRandom !== codeInput) {
            setCodeNotValid(true);
          } else {
            setCodeNotValid(false);
            setApproveSelModal(false);
            approveOrDeny('approve', false);
          }
        }}
        cancelButtonProps={{
          className: 'cancel-btn',
        }}
        onCancel={() => {
          setApproveSelModal(false);
        }}
        afterClose={() => {
          setCodeNotValid(false);
          setCodeInput('');
        }}
        okButtonProps={{
          icon: <CheckOutlined />,
          className: 'approve-btn',
        }}
        okText="Approve"
      >
        <p>
          Are you sure you want to <b>Approve</b> the selected{' '}
          {selection.length}{' '}
          {selection.length > 1 ? 'files/folders' : 'file/folder'} to copy to{' '}
          <em>{'Core/' + activeReq.destinationPath}</em>
        </p>
        {codeValidateWidget}
      </Modal>
      <Modal
        title="Confirmation"
        width={450}
        visible={denySelModal}
        destroyOnClose={true}
        wrapClassName={styles.deny_modal + ' global-modal-wrapper'}
        onOk={() => {
          if (codeRandom !== codeInput) {
            setCodeNotValid(true);
          } else {
            setCodeNotValid(false);
            setDenySelModal(false);
            approveOrDeny('deny', false);
          }
        }}
        cancelButtonProps={{
          className: 'cancel-btn',
        }}
        onCancel={() => {
          setDenySelModal(false);
        }}
        afterClose={() => {
          setCodeNotValid(false);
          setCodeInput('');
        }}
        okButtonProps={{
          className: 'deny-btn',
          icon: <CloseOutlined />,
        }}
        okText="Deny"
      >
        <p>
          Are you sure you want to <b>Deny</b> the selected {selection.length}{' '}
          {selection.length > 1 ? 'files/folders' : 'file/folder'} to copy to{' '}
          <em>{'Core/' + activeReq.destinationPath}</em>
        </p>
        {codeValidateWidget}
      </Modal>
      <Modal
        title="Action Confirmation"
        width={540}
        visible={validationModal}
        destroyOnClose={true}
        wrapClassName={styles.validation_modal + ' global-modal-wrapper'}
        onOk={() => {
          setValidationModal(false);
        }}
        cancelButtonProps={{ style: { display: 'none' } }}
        onCancel={() => {
          setValidationModal(false);
        }}
      >
        <div className="validation-content">
          {validationParams && validationParams.showSelection ? (
            <div className="list-sel">
              <h4>
                {validationParams.action === 'approve' ? 'Approved' : 'Denied'}{' '}
                files/folders
              </h4>
              {filesPathDisplay()}
            </div>
          ) : null}
          <h4>The following files will be skipped</h4>
          {validationParams &&
          (validationParams.approved ||
            validationParams.denied ||
            validationParams.deleted) ? (
            <ul>
              {validationParams.approved ? (
                <li className="approve-item">
                  {validationParams.approved} File
                  {validationParams.approved > 1 ? 's' : null} Previously
                  Approved
                </li>
              ) : null}
              {validationParams.denied ? (
                <li className="deny-item">
                  {validationParams.denied} File
                  {validationParams.denied > 1 ? 's' : null} Previously Denied
                </li>
              ) : null}
              {validationParams.deleted ? (
                <li className="delete-item">
                  {validationParams.deleted} File
                  {validationParams.deleted > 1 ? 's' : null} Previously Deleted
                </li>
              ) : null}
            </ul>
          ) : (
            <p>*No files have been skipped</p>
          )}
        </div>
      </Modal>
    </>
  );
}
