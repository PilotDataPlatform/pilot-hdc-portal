/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useContext, useState } from 'react';
import { Button, Menu, Dropdown } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import FileExplorerContext from '../../FileExplorerContext';
import {
  fileExplorerTableActions,
  fileActionSSEActions,
  appendDownloadListCreator,
  setSuccessNum,
} from '../../../../Redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import {
  downloadFilesAPI,
  getZipContentAPI,
  getFileManifestAttrs,
} from '../../../../APIs';
import { useCurrentProject } from '../../../../Utility';
import { tokenManager } from '../../../../Service/tokenManager';
import { ErrorMessager, namespace } from '../../../../ErrorMessages';
import ZipPreviewModal from './ZipPreviewModal';
import _ from 'lodash';
import { checkSupportFormat } from '../../../../Utility';
export default function Action({ text, record }) {
  const dispatch = useDispatch();
  const fileExplorerContext = useContext(FileExplorerContext);
  const { username, successNum } = useSelector((state) => state);
  const { activeReq } = useSelector((state) => state.request2Core);
  const [currentProject] = useCurrentProject();
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [zipContent, setZipContent] = useState(null);
  const [currentDataset = {}] = useCurrentProject();
  const columnsDisplayCfg = fileExplorerContext.columnsDisplayCfg;
  function handlePreviewCancel(e) {
    setPreviewModalVisible(false);
  }
  async function updateManifest(record) {
    let attrsMap = await getFileManifestAttrs([record.geid]);
    attrsMap = attrsMap.data.result;
    const recordManifest = attrsMap[record.geid];
    if (!_.isEmpty(recordManifest)) {
      record['manifest'] = recordManifest;
      dispatch(
        fileExplorerTableActions.setPropertyRecord({
          geid: fileExplorerContext.reduxKey,
          param: record,
        }),
      );
    }
  }
  function openFileSider(record) {
    dispatch(
      fileExplorerTableActions.setPropertyRecord({
        geid: fileExplorerContext.reduxKey,
        param: record,
      }),
    );
    dispatch(
      fileExplorerTableActions.setSidePanelOpen({
        geid: fileExplorerContext.reduxKey,
        param: true,
      }),
    );
    updateManifest(record);
  }
  const hide4DeletedRecord =
    columnsDisplayCfg && columnsDisplayCfg.deleteIndicator && record.status.toLowerCase() === 'archived';
  const menu = (
    <Menu>
      <Menu.Item onClick={(e) => openFileSider(record)}>Properties</Menu.Item>
      {!hide4DeletedRecord && <Menu.Divider />}
      {!hide4DeletedRecord && (
        <Menu.Item
          onClick={async (e) => {
            let files = [
              {
                id: record.geid,
                fileName: record.fileName,
              },
            ];
            const sessionId = tokenManager.getLocalCookie('sessionId');
            downloadFilesAPI(
              fileExplorerContext.projectGeid,
              files,
              currentProject.code,
              username,
              'greenroom',
              activeReq.id,
              sessionId,
              {
                appendDownloadListCreator: (item) =>
                  dispatch(appendDownloadListCreator(item)),
                setDownloadCommitting: (payload) =>
                  dispatch(fileActionSSEActions.setDownloadCommitting(payload)),
              },
            )
              .then((res) => {
                if (res) {
                  const url = res;
                  window.open(url, '_blank');
                  setTimeout(() => {
                    dispatch(setSuccessNum(successNum + 1));
                  }, 3000);
                }
              })
              .catch((err) => {
                if (err.response) {
                  const errorMessager = new ErrorMessager(
                    namespace.project.files.downloadFilesAPI,
                  );
                  errorMessager.triggerMsg(err.response.status);
                }
                return;
              });
          }}
        >
          Download
        </Menu.Item>
      )}
      {record &&
        record.name &&
        checkSupportFormat(record.name) &&
        !hide4DeletedRecord && <Menu.Divider />}
      {record &&
        record.name &&
        checkSupportFormat(record.name) &&
        !hide4DeletedRecord && (
          <Menu.Item
            style={{ textAlign: 'center' }}
            onClick={async () => {
              const { geid } = record;
              const zipRes = await getZipContentAPI(
                geid,
                currentDataset && currentDataset.globalEntityId,
              );
              if (zipRes.status === 200 && zipRes.data) {
                setZipContent(zipRes.data.archive_preview);
              }
              setPreviewModalVisible(true);
            }}
          >
            Preview
          </Menu.Item>
        )}
      {record &&
        record.name &&
        checkSupportFormat(record.name) &&
        !hide4DeletedRecord && (
          <ZipPreviewModal
            record={record}
            zipContent={zipContent}
            visible={previewModalVisible}
            handlePreviewCancel={handlePreviewCancel}
          />
        )}
    </Menu>
  );
  return (
    <>
      <Dropdown overlay={menu} placement="bottomRight">
        <Button shape="circle">
          <MoreOutlined />
        </Button>
      </Dropdown>
    </>
  );
}
