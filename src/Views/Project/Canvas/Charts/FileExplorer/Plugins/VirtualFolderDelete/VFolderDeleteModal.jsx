/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useEffect, useState } from 'react';
import { Modal, message } from 'antd';
import {
  deleteVirtualFolder,
  listAllVirtualFolder,
} from '../../../../../../../APIs';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentProjectTreeVFolder } from '../../../../../../../Redux/actions';
import { Collection } from '../../../../../../../Components/Icons';
import i18n from '../../../../../../../i18n';
import { InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './VirtualFolderDelete.module.scss';
const VFolderFilesDeleteModal = ({
  visible,
  setVisible,
  panelKey,
  removePanel,
}) => {
  const project = useSelector((state) => state.project);
  const username = useSelector((state) => state.username);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [vfolders, setVFolders] = useState([]);
  const dispatch = useDispatch();
  const vfolderName = panelKey.split('-').slice(1).join('-');
  const vfolder = vfolders.find((v) => v.name === vfolderName);
  function closeModal() {
    setVisible(false);
  }
  function updateVFolder(vfolders) {
    const vfoldersNodes = vfolders.map((folder) => {
      return {
        title: folder.name,
        key: 'vfolder-' + folder.name,
        icon: <Collection width={14} style={{ color: '#1b90fe' }} />,
        disabled: false,
        children: null,
        geid: folder.id,
      };
    });
    dispatch(setCurrentProjectTreeVFolder(vfoldersNodes));
    removePanel(panelKey);
  }
  async function handleOk() {
    if (vfolder) {
      setConfirmLoading(true);
      try {
        await deleteVirtualFolder(vfolder.id);
      } catch (e) {
        message.error(
          `${i18n.t('errormessages:deleteVirtualFolder.default.0')}`,
          3,
        );
        setConfirmLoading(false);
        return;
      }
      message.success(`${i18n.t('success:virtualFolder.delete')}`, 3);
      setConfirmLoading(false);
      closeModal();
      updateVFolder(vfolders.filter((v) => v.id !== vfolder.id));
    }
  }
  const handleCancel = () => {
    closeModal();
  };
  useEffect(() => {
    async function loadVFolders() {
      const res = await listAllVirtualFolder(project.profile?.code, username);
      const virualFolders = res.data.result;
      setVFolders(virualFolders);
    }
    loadVFolders();
  }, []);

  return (
    <Modal
      width={460}
      centered
      title="Deletion"
      visible={visible}
      onOk={handleOk}
      okText="Delete"
      okButtonProps={{ icon: <DeleteOutlined /> }}
      onCancel={handleCancel}
      wrapClassName={styles.delete_vfolder_modal}
      confirmLoading={confirmLoading}
    >
      <div className={styles['folde-deletion-warning']}>
        <InfoCircleOutlined />
        <div>
          <p>
            Are you sure you would like to deleted this Collection? This cannot
            be undone
          </p>
          <p>
            <b>{vfolder ? vfolder.name : ''}</b>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default VFolderFilesDeleteModal;
