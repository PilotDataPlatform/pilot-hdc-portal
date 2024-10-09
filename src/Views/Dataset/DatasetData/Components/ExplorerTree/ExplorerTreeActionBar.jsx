/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import {
  FileOutlined,
  FolderOutlined,
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  DownloadOutlined,
  CloseOutlined,
  SaveOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Input, Button, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { EDIT_MODE } from '../../../../../Redux/Reducers/datasetData';
import {
  downloadDatasetFiles,
  checkDatasetDownloadStatusAPI,
  renameFileApi,
} from '../../../../../APIs';
import {
  datasetDataActions,
  datasetFileOperationsCreators,
} from '../../../../../Redux/actions';
import { tokenManager } from '../../../../../Service/tokenManager';
import _ from 'lodash';
import { ExplorerTreeDeleteModal } from './ExplorerTreeDeleteModal';
import { useTranslation } from 'react-i18next';
import { getFileSize } from '../../../../../Utility';
import { API_PATH, DOWNLOAD_PREFIX_V1 } from '../../../../../config';
import i18n from '../../../../../i18n';
import { JOB_STATUS } from '../../../../../Components/Layout/FilePanel/jobStatus';
export default function ExplorerTreeActionBar({
  title,
  nodeKey,
  isLeaf,
  createBy,
  fileSize,
  labels,
}) {
  const username = useSelector((state) => state.username);
  const editorMode = useSelector((state) => state.datasetData.mode);
  const [downloading, setDownloading] = useState(false);
  const [downloadHash, setDownloadHash] = useState(null);
  const selectedData = useSelector((state) => state.datasetData.selectedData);
  const treeData = useSelector((state) => state.datasetData.treeData);
  const hightLighted = useSelector((state) => state.datasetData.hightLighted);
  const datasetInfo = useSelector((state) => state.datasetInfo.basicInfo);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const titleArr = title.split('.');
  const titleNameWithoutFormat =
    titleArr.length > 1 ? titleArr.slice(0, titleArr.length - 1) : titleArr[0];
  const format =
    isLeaf && titleArr.length > 1 ? titleArr[titleArr.length - 1] : null;
  const [nodeName, setNodeName] = useState(
    isLeaf ? titleNameWithoutFormat : title,
  );
  const { t } = useTranslation(['errormessages', 'success']);
  const datasetGeid = datasetInfo.geid;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const supportFormats = ['tsv', 'csv', 'json', 'txt', 'yml', 'yaml', 'log'];
  const previewNode = () => {
    const fileFormat =
      supportFormats.indexOf(format) !== -1 ? format.toLowerCase() : null;
    dispatch(
      datasetDataActions.setPreviewFile({
        type: fileFormat,
        geid: nodeKey,
        name: title,
        size: fileSize,
      }),
    );
  };
  const downloadNode = async () => {
    const sessionId = tokenManager.getLocalCookie('sessionId');
    let res;
    setDownloading(true);
    try {
      res = await downloadDatasetFiles(
        datasetInfo.code,
        [{ id: nodeKey }],
        username,
        sessionId,
      );
    } catch (e) {
      if (e.response.status === 400) {
        message.error(t('errormessages:datasetDownloadFile.empty.0'));
      } else {
        message.error(t('errormessages:datasetDownloadFile.default.0'));
      }

      setDownloading(false);
      return;
    }
    if (res?.data?.result?.payload?.hashCode) {
      setDownloadHash(res.data?.result?.payload?.hashCode);
    } else {
      message.error(t('errormessages:datasetDownloadFile.default.0'));
      setDownloading(false);
    }
  };
  useEffect(() => {
    const checkDownload = async (timer) => {
      const res = await checkDatasetDownloadStatusAPI(downloadHash);
      const { status } = res.data.result;
      if (status === 'SUCCEED') {
        setDownloadHash(null);
        setDownloading(false);
        clearInterval(timer);
        if (downloadHash) {
          const url = API_PATH + DOWNLOAD_PREFIX_V1 + '/' + downloadHash;
          window.open(url, '_blank');
        } else {
          message.error(t('errormessages:datasetDownloadFile.default.0'));
        }
      }
    };
    if (downloadHash) {
      const timer = setInterval(() => {
        checkDownload(timer);
      }, 2 * 1000);
      checkDownload(timer);
    }
  }, [downloadHash]);
  function updateTreeInfo(list, key, newInfo) {
    return list.map((node) => {
      if (node.key === key) {
        return { ...node, ...newInfo };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeInfo(node.children, key, newInfo),
        };
      }
      return node;
    });
  }

  const editNode = () => {
    const newSelectedData = selectedData.filter((v) => v !== nodeKey);
    dispatch(datasetDataActions.setSelectedData(newSelectedData));
    dispatch(datasetDataActions.setMode(EDIT_MODE.EIDT_INDIVIDUAL));
    const newTreeData = updateTreeInfo(_.cloneDeep(treeData), nodeKey, {
      disabled: true,
    });
    dispatch(datasetDataActions.setTreeData(newTreeData));
  };

  const deleteNode = () => {
    setDeleteVisible(true);
  };
  const cancelEdit = () => {
    dispatch(datasetDataActions.setMode(EDIT_MODE.DISPLAY));
    setNodeName(isLeaf ? titleNameWithoutFormat : title);
  };

  const onSave = async () => {
    setLoading(true);

    if (labels.includes('Folder')) {
      const reg = new RegExp(/[\\/:?*<>|”]/);
      if (reg.test(nodeName)) {
        message.error(t('errormessages:datasetSaveFile.default.0'));
        setLoading(false);
        return;
      }

      if (nodeName.length > 20 || nodeName.length === 0) {
        message.error(t('errormessages:datasetSaveFile.lengthErr.0'));
        setLoading(false);
        return;
      }
    }

    const sessionId = tokenManager.getLocalCookie('sessionId');
    try {
      const res = await renameFileApi(
        datasetGeid,
        nodeKey,
        format ? nodeName + '.' + format : nodeName,
        username,
        sessionId,
      );

      if (!res.data.result.ignored?.length) {
        const [renamedFile] = res.data.result.processing;
        dispatch(
          datasetFileOperationsCreators.setRename({
            globalEntityId: renamedFile.id,
            datasetCode: renamedFile.containerCode,
            name: renamedFile.name,
            fileSize: renamedFile.size,
            operator: username,
            status: JOB_STATUS.WAITING,
          }),
        );
        message.success(`${i18n.t('success:renameFile.default.0')}`);
      }

      cancelEdit();
    } catch (error) {
      message.error(`${i18n.t('errormessages:datasetRenameFile.default.0')}`);
    } finally {
      setLoading(false);
    }
  };

  const explorerTreeDeleteModalProps = {
    deleteVisible,
    setDeleteVisible,
    datasetGeid,
    nodeKey,
    username,
    title,
  };

  return (
    <>
      <div className={'tree-node-custom-title'}>
        {!isLeaf ? (
          <FolderOutlined className="node-icon" />
        ) : (
          <FileOutlined className="node-icon" />
        )}
        {editorMode === EDIT_MODE.EIDT_INDIVIDUAL &&
        nodeKey === hightLighted ? (
          <div
            className="rename-bar"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Input
              value={nodeName}
              onChange={(e) => {
                setNodeName(e.target.value);
              }}
              className="rename-input"
            />
            {format ? `.${format}` : null}
            <Button
              type="primary"
              icon={<SaveOutlined />}
              className="rename-save-btn"
              onClick={onSave}
              loading={loading}
            >
              Save
            </Button>
            <CloseOutlined
              className="rename-close-btn"
              onClick={(e) => cancelEdit()}
            />
          </div>
        ) : (
          <>
            <span className="node-name">{title}</span>
            <span className="uploader">{createBy ? 'by ' + createBy : ''}</span>
            <span className="size">
              {fileSize ? getFileSize(fileSize) : ''}
            </span>
            <div
              className="actions-bar"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <EyeOutlined
                onClick={(e) => {
                  previewNode();
                }}
              />
              {downloading ? (
                <LoadingOutlined />
              ) : (
                <DownloadOutlined
                  onClick={(e) => {
                    downloadNode();
                  }}
                />
              )}
              <EditOutlined
                onClick={(e) => {
                  editNode();
                }}
              />
              <DeleteOutlined
                onClick={(e) => {
                  deleteNode();
                }}
              />
            </div>
          </>
        )}
      </div>
      <ExplorerTreeDeleteModal {...explorerTreeDeleteModalProps} />
    </>
  );
}
