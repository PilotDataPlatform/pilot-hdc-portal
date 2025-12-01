/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Modal, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  addMovedToBinList,
  setPanelVisibility,
} from '../../../../../../../Redux/actions';
import { FILE_OPERATIONS } from '../../FileOperationValues';
import { tokenManager } from '../../../../../../../Service/tokenManager';
import { commitFileAction } from '../../../../../../../APIs';
import { useTranslation } from 'react-i18next';
import { DeleteModalFirstStep } from './DeleteModalFirstStep';
import { DeleteModalSecondStep } from './DeleteModalSecondStep';

const DeleteFilesModal = ({
  visible,
  setVisible,
  files,
  eraseSelect,
  panelKey,
  permission,
}) => {
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const project = useSelector((state) => state.project);
  const username = useSelector((state) => state.username);
  const [step, setStep] = React.useState(1);
  const [locked, setLocked] = React.useState([]);
  const { authorizedFilesToDelete, unauthorizedFilesToDelete } =
    getAuthorizedFilesToDelete(files, permission, username, panelKey);
  const parentGeid = useSelector((state) => {
    const routes = state.fileExplorer.folderRouting[panelKey];
    const parentFolder = routes?.length && routes[routes.length - 1];
    return parentFolder?.globalEntityId || '';
  });
  const { t } = useTranslation([
    'tooltips',
    'success',
    'formErrorMessages',
    'errormessages',
  ]);

  const dispatch = useDispatch();

  const sessionId = tokenManager.getLocalCookie('sessionId');

  const handleCancel = () => {
    setStep(1);
    setLocked([]);
    eraseSelect();
    setVisible(false);
  };

  const handleOk = async () => {
    if (step === 2) {
      handleCancel();
      return;
    }
    if (authorizedFilesToDelete && authorizedFilesToDelete.length === 0) {
      handleCancel();
      return;
    }

    setConfirmLoading(true);

    try {
      const res = await commitFileAction(
        {
          targets: authorizedFilesToDelete.map((file) => {
            return {
              id: file.geid,
            };
          }),
          source: parentGeid,
        },
        username,
        FILE_OPERATIONS.DELETE,
        project.profile.code,
        sessionId,
      );

      const result = res.data.operationInfo.map((resFile) => {
        const file = {
          ...resFile,
          zone: files[0].zone,
          createdTime: Date.now(),
        };
        file.projectCode = resFile.containerCode;
        delete file.containerCode;
        return file;
      });
      console.log(result);
      dispatch(addMovedToBinList(result));
      dispatch(setPanelVisibility(true));
      if (res.code === 202) {
        message.success(t('success:fileOperations.delete'));
      }
    } catch (err) {
      console.log(err.response.status);
      if (err.response.status === 403 || err.response.status === 400) {
        message.error(t('errormessages:fileOperations.unauthorizedDelete'));
      } else {
        message.error(t('errormessages:fileOperations.deleteErr'));
      }
    } finally {
      setConfirmLoading(false);
      handleCancel();
    }
  };

  const firstStepProps = {
    panelKey,
    authorizedFilesToDelete,
    unauthorizedFilesToDelete,
  };

  return (
    <Modal
      title="Move Files to Trash Bin"
      visible={visible}
      maskClosable={false}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      onOk={handleOk}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      {step === 1 && <DeleteModalFirstStep {...firstStepProps} />}
      {step === 2 && <DeleteModalSecondStep locked={locked} />}
    </Modal>
  );
};

export default DeleteFilesModal;

const getAuthorizedFilesToDelete = (files, permission, username, panelKey) => {
  let authorizedFilesToDelete = files;
  let unauthorizedFilesToDelete = [];

  return { authorizedFilesToDelete, unauthorizedFilesToDelete };
};
