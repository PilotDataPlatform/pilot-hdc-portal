/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip, List, Progress, Card, Tabs, Popover, Badge } from 'antd';
import Icon, {
  CloseOutlined,
  SyncOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  RestOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { orderBy } from 'lodash';
import styles from '../index.module.scss';
import {
  displayName,
  InProgressListItem,
  ChunkUploadedItem,
  FailedListItem,
  CompletedListItem,
  ResumedUploadListItem,
} from './FilePanelListItem';
import {
  setUploadListCreator,
  setDownloadListCreator,
  setCopy2CoreList,
  setMovedToBinList,
  fileActionSSEActions,
  setPanelVisibility,
} from '../../../Redux/actions';
import {
  useIsMount,
  getProjectRolePermission,
  permissionOperation,
  permissionResource,
} from '../../../Utility';
import { JOB_STATUS } from './jobStatus';
import { clearSessionHistory } from '../../../APIs';

const { TabPane } = Tabs;

function FilePanel(props) {
  const uploadListGlobal = useSelector((state) => state.uploadList);
  const opened = useSelector((state) => state.panelActiveKey);
  let downloadList = useSelector((state) => state.downloadList);
  let copy2CoreList = useSelector((state) => state.copy2CoreList);
  let movedToBinFileList = useSelector((state) => state.movedToBinFileList);
  const projectCode = props.projectCode;
  const uploadList = uploadListGlobal.filter(
    (el) => el.projectCode === projectCode,
  );

  downloadList = downloadList.filter((el) => el.projectCode === projectCode);
  downloadList = orderBy(downloadList, ['updatedTime'], ['desc']);

  movedToBinFileList = movedToBinFileList.filter(
    (el) => el.projectCode === projectCode,
  );
  movedToBinFileList = orderBy(movedToBinFileList, ['updatedTime'], ['desc']);

  const dispatch = useDispatch();
  const isMount = useIsMount();

  useEffect(() => {
    if (isMount) {
    }
  }, [uploadList.length, downloadList.length, copy2CoreList.length]);

  const clearTabPane = () => {
    dispatch(setUploadListCreator([]));
    dispatch(setDownloadListCreator([]));
    dispatch(setMovedToBinList([]));
    dispatch(setCopy2CoreList([]));
  };

  const handleClearSessionStorage = async () => {
    await clearSessionHistory();
    clearTabPane();
  };

  const getNumFilesByJobStatus = (arr, status, copyTag) => {
    const filteredFiles = arr.filter(
      (el) => el.status === status && (copyTag ? el.copyTag === copyTag : true),
    );

    return filteredFiles.reduce(
      (totalNum, currentFile) => currentFile.targetNames.length + totalNum,
      0,
    );
  };

  let uploadHeader = `You haven't uploaded any files yet!`;
  const totalUploadNum = uploadList.reduce(
    (totalNum, currentFile) => currentFile.targetNames.length + totalNum,
    0,
  );
  const waitingUploadNum = getNumFilesByJobStatus(
    uploadList,
    JOB_STATUS.WAITING,
  );
  const runningUploadNum = getNumFilesByJobStatus(
    uploadList,
    JOB_STATUS.RUNNING,
  );

  if (totalUploadNum > 0) {
    uploadHeader = `${
      totalUploadNum - waitingUploadNum
    }/${totalUploadNum} files are uploading.`;

    if (totalUploadNum === 1) {
      uploadHeader = `${
        totalUploadNum - waitingUploadNum
      }/${totalUploadNum} file is uploading.`;
    }
  }

  if (waitingUploadNum === 0 && runningUploadNum === 0) {
    const failedUploadNum = getNumFilesByJobStatus(
      uploadList,
      JOB_STATUS.FAILED,
    );
    const successUploadNum = getNumFilesByJobStatus(
      uploadList,
      JOB_STATUS.SUCCEED,
    );

    if (totalUploadNum === 0 && failedUploadNum > 0) {
      if (totalUploadNum - successUploadNum > 1) {
        uploadHeader = `${
          totalUploadNum - successUploadNum
        } files are being uploaded.`;

        if (failedUploadNum > 0)
          uploadHeader = `${
            totalUploadNum - successUploadNum - failedUploadNum
          } files are being uploaded. ${failedUploadNum} files failed.`;
      } else {
        uploadHeader = `${
          totalUploadNum - successUploadNum
        } file is being uploaded.`;

        if (failedUploadNum > 0)
          uploadHeader = `${
            totalUploadNum - successUploadNum - failedUploadNum
          } file is being uploaded. ${failedUploadNum} files failed.`;
      }
    }

    if (failedUploadNum + successUploadNum === totalUploadNum) {
      let suceessLetters = `${successUploadNum} files uploaded successfully.`;
      let failLetters = `${failedUploadNum} files failed.`;

      if (successUploadNum === 1)
        suceessLetters = `${successUploadNum} file uploaded successfully.`;
      if (failedUploadNum === 1)
        failLetters = `${failedUploadNum} file failed.`;
      uploadHeader = `${suceessLetters}${failLetters}`;
    }
  }

  let downloadHeader = `You haven't downloaded any files yet!`;
  const runningDownloadNum = getNumFilesByJobStatus(
    downloadList,
    JOB_STATUS.RUNNING,
  );
  const successDownloadNum = getNumFilesByJobStatus(
    downloadList,
    JOB_STATUS.SUCCEED,
  );

  if (runningDownloadNum > 0)
    downloadHeader = `${runningDownloadNum} file is being downloaded.`;
  if (runningDownloadNum > 1)
    downloadHeader = `${runningDownloadNum} files are being downloaded.`;

  if (successDownloadNum > 0)
    downloadHeader = `${successDownloadNum} file downloaded successfully.`;
  if (successDownloadNum > 1)
    downloadHeader = `${successDownloadNum} files downloaded successfully.`;

  if (runningDownloadNum && successDownloadNum) {
    downloadHeader = `${runningDownloadNum} ${
      runningDownloadNum === 1 ? 'file is' : 'files are'
    } being downloaded ${successDownloadNum}  ${
      successDownloadNum === 1 ? 'file is' : 'files are'
    } downloaded successfully.`;
  }
  let defaultKey = ['upload'];
  if (runningDownloadNum && runningDownloadNum > 0) defaultKey = ['download'];
  if (runningUploadNum > 0) defaultKey = ['upload'];
  copy2CoreList = copy2CoreList.filter(
    (item) => item.projectCode === projectCode,
  );

  const title = (
    <div>
      <span className={styles.fileStatusTitle}>File Status</span>
      <span
        style={{
          marginLeft: '20px',
          marginRight: '20px',
          color: '#595959',
          fontWeight: 'lighter',
        }}
      >
        |
      </span>
      <CloseOutlined
        className={styles.closeIcon}
        onClick={handleClearSessionStorage}
      />
      <span className={styles.clearSessionHistory}>Clear Session History</span>
    </div>
  );

  const tabTitle = (tabName) => {
    switch (tabName) {
      case 'progress':
        return (
          <span className={styles.tabTitle}>
            <SyncOutlined />
            <span className={styles.tabName}>In Progress</span>
          </span>
        );
      case 'upload':
        return (
          <span className={styles.tabTitle}>
            <CloudUploadOutlined />
            <span className={styles.tabName}>Uploaded</span>
          </span>
        );
      case 'download':
        return (
          <span className={styles.tabTitle}>
            <DownloadOutlined />
            <span className={styles.tabName}>Downloaded</span>
          </span>
        );
      case 'approved':
        return (
          <span className={styles.tabTitle}>
            <CheckOutlined />
            <span className={styles.tabName}>Approved</span>
          </span>
        );
      case 'trashBin':
        return (
          <span className={styles.tabTitle}>
            <RestOutlined />
            <span className={styles.tabName}>Trash Bin</span>
          </span>
        );
      default:
        return null;
    }
  };

  const listItemTitle = (item, fileName, tabName) => {
    if (item.hasOwnProperty('actionType')) {
      if (
        item.status !== JOB_STATUS.SUCCEED &&
        item.status !== JOB_STATUS.FAILED &&
        item.status !== JOB_STATUS.CHUNK_UPLOADED &&
        tabName === 'progress'
      ) {
        if (item.actionType === 'data_transfer') {
          return (
            <InProgressListItem
              action={item.actionType}
              name={displayName(fileName)}
              iconClass="icons__sized"
            />
          );
        } else if (item.actionType === 'data_upload') {
          if (item.resumed) {
            return (
              <ResumedUploadListItem
                action={item.actionType}
                name={displayName(fileName)}
                progress={item.progress}
              />
            );
          }
          return (
            <InProgressListItem
              action={item.actionType}
              name={displayName(fileName)}
              waiting={item.progress ? false : true}
            />
          );
        } else {
          return (
            <InProgressListItem
              action={item.actionType}
              name={displayName(fileName)}
              iconClass={
                item.actionType === 'data_delete' ? 'icons__sized' : null
              }
            />
          );
        }
      }
      if (item.status === JOB_STATUS.CHUNK_UPLOADED) {
        return (
          <span>
            <ChunkUploadedItem name={fileName} action={item.actionType} />
          </span>
        );
      }
      if (item.status === JOB_STATUS.FAILED && tabName === 'progress') {
        if (item.actionType === 'data_transfer') {
          return <FailedListItem action={item.actionType} name={fileName} />;
        } else {
          return <FailedListItem action={item.actionType} name={fileName} />;
        }
      }

      if (item.status === JOB_STATUS.SUCCEED) {
        if (tabName === 'upload') {
          return (
            <span>
              <CompletedListItem name={fileName} />
            </span>
          );
        }
        if (tabName === 'download') {
          return (
            <span>
              <CompletedListItem name={fileName} />
            </span>
          );
        }
        if (tabName === 'approved') {
          return (
            <span>
              <CompletedListItem name={fileName} />
            </span>
          );
        }
        if (tabName === 'trashBin') {
          return (
            <span>
              {
                <Tooltip title="file delete">
                  <RestOutlined className={styles['icons__success-delete']} />
                </Tooltip>
              }
              <span className={styles.fileName}>{displayName(fileName)}</span>
            </span>
          );
        }
      }
      if (item.status === JOB_STATUS.FAILED) {
        if (tabName === 'upload') {
          return <CompletedListItem name={fileName} status="fail" />;
        }
        if (tabName === 'approved') {
          return (
            <span>
              <CompletedListItem name={fileName} status="fail" />
              <span className={styles.slash}>/</span>
              <span style={{ fontStyle: 'Italic', color: '#A5B0B6' }}>
                {item.copyTag}
              </span>
            </span>
          );
        }
        if (tabName === 'trashBin') {
          return (
            <span>
              {
                <Tooltip title="failed to delete file">
                  <CloseOutlined className={styles['icons_fail-delete']} />
                </Tooltip>
              }
              <span className={styles.fileName}>{displayName(fileName)}</span>
            </span>
          );
        }
      } else {
        return null;
      }
    }
  };

  let inProgressList;
  let approvedList = copy2CoreList.map((el) => ({
    ...el,
    copyTag: 'Copied to Core',
  }));
  const allFileList = [
    ...uploadList,
    ...downloadList,
    ...approvedList,
    ...movedToBinFileList,
  ];
  inProgressList = allFileList.filter(
    (el) => el.status !== JOB_STATUS.SUCCEED && el.status !== JOB_STATUS.FAILED,
  );
  inProgressList = orderBy(inProgressList, ['createdTime'], ['desc']);
  const uploadCompleteList = uploadList.filter(
    (el) => el.status === JOB_STATUS.SUCCEED || el.status === JOB_STATUS.FAILED,
  );
  let approvedEndList = approvedList.filter(
    (el) => el.status === JOB_STATUS.SUCCEED || el.status === JOB_STATUS.FAILED,
  );
  approvedEndList = orderBy(approvedEndList, ['updatedTime'], ['desc']);
  const downloadSuccessList = downloadList.filter(
    (el) => el.status === JOB_STATUS.SUCCEED,
  );
  const deletedEndList = movedToBinFileList.filter(
    (el) => el.status === JOB_STATUS.SUCCEED || el.status === JOB_STATUS.FAILED,
  );

  const filePanelStatus = (allFileList) => {
    if (allFileList.length === 0) {
      return '';
    }
    const failedFilesNum = getNumFilesByJobStatus(
      allFileList,
      JOB_STATUS.FAILED,
    );
    if (failedFilesNum > 0) {
      return 'error';
    } else {
      return 'success';
    }
  };

  const uploadSuccessNum = getNumFilesByJobStatus(
    uploadList,
    JOB_STATUS.SUCCEED,
  );
  const uploadFailureNum = getNumFilesByJobStatus(
    uploadList,
    JOB_STATUS.FAILED,
  );
  const approvedSuccessNum = getNumFilesByJobStatus(
    approvedList,
    JOB_STATUS.SUCCEED,
  );
  const approvedToCoreNum = getNumFilesByJobStatus(
    approvedList,
    JOB_STATUS.SUCCEED,
    'Copied to Core',
  );
  const approvedFailureNum = getNumFilesByJobStatus(
    approvedList,
    JOB_STATUS.FAILED,
  );
  const deletedSuccessNum = getNumFilesByJobStatus(
    movedToBinFileList,
    JOB_STATUS.SUCCEED,
  );
  const deleteFailureNum = getNumFilesByJobStatus(
    movedToBinFileList,
    JOB_STATUS.FAILED,
  );

  const uploadSuccessTitle =
    uploadSuccessNum > 0 || uploadFailureNum > 0
      ? `${uploadSuccessNum} ${
          uploadSuccessNum > 1 ? `files` : `file`
        } uploaded sucessfully. ${uploadFailureNum} ${
          uploadFailureNum !== 1 ? `files` : `files`
        } failed. ${totalUploadNum - uploadSuccessNum - uploadFailureNum} ${
          totalUploadNum - uploadSuccessNum - uploadFailureNum > 1
            ? `files`
            : `file`
        } in progress.`
      : `You haven't uploaded any files yet!`;

  const approvedTitle =
    approvedSuccessNum > 0
      ? `${approvedToCoreNum} ${
          approvedToCoreNum > 1 ? `files` : `file`
        } copied to core. ${approvedFailureNum} ${
          approvedFailureNum !== 1 ? `files` : `file`
        } failed.`
      : `You haven't approved to copy any files to the Core yet!`;

  const deletedTitle =
    deletedSuccessNum > 0
      ? `${deletedSuccessNum} ${
          deletedSuccessNum > 1 ? `files` : `file`
        } deleted. ${deleteFailureNum} ${
          deleteFailureNum !== 1 ? `files` : `file`
        } failed.`
      : `You haven't deleted any files yet!`;

  const renderListItem = (item, tabName) => {
    return item.targetNames.map((fileName) => (
      <List.Item>
        <List.Item.Meta title={listItemTitle(item, fileName, tabName)} />
      </List.Item>
    ));
  };

  const content = (
    <Card className={styles.panelCard} title={title}>
      <Tabs className={styles.tab} tabPosition={'left'} tabBarGutter={1}>
        <TabPane tab={tabTitle('progress')} key="inProgress">
          <List
            className={styles.progress_list}
            size="small"
            dataSource={inProgressList}
            split={false}
            renderItem={(item) => {
              if (item.status !== JOB_STATUS.SUCCEED) {
                if (item.progress) {
                  return item.targetNames.map((fileName) => (
                    <List.Item>
                      <List.Item.Meta
                        title={listItemTitle(item, fileName, 'progress')}
                        description={
                          <>
                            {item.status === JOB_STATUS.UPLOADING &&
                              !item.resumed && (
                                <Progress
                                  status="active"
                                  percent={Math.floor(100 * item.progress)}
                                  size="small"
                                />
                              )}
                          </>
                        }
                      />
                    </List.Item>
                  ));
                } else {
                  return renderListItem(item, 'progress');
                }
              }
            }}
          />
        </TabPane>
        <TabPane tab={tabTitle('upload')} key="uploaded">
          <List
            className={styles.uploaded_list}
            size="small"
            header={
              <span className={styles.listHeader}>{uploadSuccessTitle}</span>
            }
            dataSource={uploadCompleteList}
            split={false}
            renderItem={(item) => renderListItem(item, 'upload')}
          />
        </TabPane>
        <TabPane tab={tabTitle('download')} key="downloaded">
          <List
            className={styles.downloaded_list}
            size="small"
            header={<span className={styles.listHeader}>{downloadHeader}</span>}
            split={false}
            dataSource={downloadSuccessList}
            renderItem={(item) => renderListItem(item, 'download')}
          />
        </TabPane>
        {getProjectRolePermission(props.projectRole, {
          zone: 'greenroom',
          operation: permissionOperation.copy,
          resource: permissionResource.ownFile,
        }) && (
          <TabPane tab={tabTitle('approved')} key="approved">
            <List
              className={styles.approved_list}
              size="small"
              header={
                <span className={styles.listHeader}>{approvedTitle}</span>
              }
              split={false}
              dataSource={approvedEndList}
              renderItem={(item) => renderListItem(item, 'approved')}
            />
          </TabPane>
        )}
        <TabPane tab={tabTitle('trashBin')} key="deleted">
          <List
            className={styles.deleted_list}
            size="small"
            header={<span className={styles.listHeader}>{deletedTitle}</span>}
            split={false}
            dataSource={deletedEndList}
            renderItem={(item) => renderListItem(item, 'trashBin')}
          />
        </TabPane>
      </Tabs>
    </Card>
  );

  return (
    <Tooltip title={'Files Panel'} placement="left">
      <Popover
        placement="bottomRight"
        content={content}
        trigger="click"
        open={opened}
        onOpenChange={(openFlag) => {
          dispatch(setPanelVisibility(openFlag));
        }}
        getPopupContainer={(trigger) => {
          return document.getElementById('global_site_header');
        }}
      >
        <div>
          <Badge className={styles.badge} status={filePanelStatus(allFileList)}>
            <Icon
              component={() => (
                <img
                  className="pic"
                  src={require('../../../Images/FilePanel.png')}
                />
              )}
            />
          </Badge>
        </div>
      </Popover>
    </Tooltip>
  );
}

export default FilePanel;
