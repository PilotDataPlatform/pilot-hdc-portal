/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Collapse,
  Progress,
  Spin,
  Typography,
  Select,
  Tag,
  Menu,
  Dropdown,
  Popover,
  Tooltip as Tip,
  Breadcrumb,
  message,
  Modal,
} from 'antd';
import { connect, useDispatch, useSelector } from 'react-redux';
import {
  CloudDownloadOutlined,
  UploadOutlined,
  SyncOutlined,
  MoreOutlined,
  CloseOutlined,
  FullscreenOutlined,
  PauseOutlined,
  FileOutlined,
  FolderOutlined,
  EllipsisOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { ErrorMessager, namespace } from '../../../../../ErrorMessages';
import {
  appendDownloadListCreator,
  setFolderRouting,
  setTableLayoutReset,
  fileActionSSEActions, addMovedToBinList, addDeletedFileList, setDeletedFileList,
} from '../../../../../Redux/actions';
import {
  downloadFilesAPI,
  fileLineageAPI,
  getZipContentAPI,
  getFileManifestAttrs,
  getProjectFiles,
  addUserFavourite,
  deleteUserFavourite, markFileForDeletion,
} from '../../../../../APIs';
import GreenRoomUploader from '../../../Components/GreenRoomUploader';
import FilesTable from './FilesTable';
import styles from './index.module.scss';
import {
  getFileSize,
  timeConvert,
  checkIsVirtualFolder,
  checkUserHomeFolder,
  checkRootFolder,
  checkGreenAndCore,
  useCurrentProject,
  convertToFileSizeInUnit,
  checkSupportFormat,
  getProjectRolePermission,
  permissionResource,
  permissionOperation,
} from '../../../../../Utility';
import variables from '../../../../../Themes/constants.scss';
import { setSuccessNum } from '../../../../../Redux/actions';
import LineageGraph from './LineageGraph';
import FileBasics from './FileBasics';
import FileBasicsModal from './FileBasicsModal';
import LineageGraphModal from './LineageGraphModal';
import DownloadModal from './DownloadModal';
import {
  DataSourceType,
  TABLE_STATE,
  SYSTEM_TAGS,
  PanelKey,
} from './RawTableValues';
import Copy2CorePlugin from './Plugins/Copy2Core/Copy2CorePlugin';
import VirtualFolderPlugin from './Plugins/VirtualFolders/VirtualFolderPlugin';
import VirtualFolderFilesDeletePlugin from './Plugins/VirtualFolderDeleteFiles/VirtualFolderFilesDeletePlugin';
import VirtualFolderDeletePlugin from './Plugins/VirtualFolderDelete/VirtualFolderDeletePlugin';
import VirtualFolderRenamePlugin from './Plugins/VirtualFolderRename/VirtualFolderRenamePlugin';
import ZipContentPlugin from './Plugins/ZipContent/ZipContentPlugin';
import DeleteFilesPlugin from './Plugins/DeleteFiles/DeleteFilesPlugin';
import ManifestManagementPlugin from './Plugins/ManifestManagement/ManifestManagementPlugin';
import AddTagsPlugin from './Plugins/AddTags/AddTagsPlugin';
import RequestToCorePlugin from './Plugins/RequestToCore/RequestToCorePlugin';
import DatasetsPlugin from './Plugins/Datasets/DatasetsPlugin';
import CreateFolderPlugin from './Plugins/CreateFolder/CreateFolderPlugin';
import { tokenManager } from '../../../../../Service/tokenManager';
import FileManifest from './FileManifest';
import i18n from '../../../../../i18n';
import { JOB_STATUS } from '../../../../../Components/Layout/FilePanel/jobStatus';
import { hideButton } from './hideButtons';
import StarButton from '../../../../../Components/Icons/Star';
const { Panel } = Collapse;
const { Title } = Typography;
const _ = require('lodash');

function RawTable(props) {
  const {
    panelKey,
    removePanel,
    geid,
    titleText,
    activePane,
    parentPath,
    selectedFileName,
  } = props;
  const dispatch = useDispatch();
  const ref = React.useRef(null);
  const [searchText, setSearchText] = useState(
    selectedFileName
      ? [
          {
            key: 'fileName',
            value: selectedFileName,
          },
        ]
      : [],
  );
  const [pendingFolderUpload, setPendingFolderUpload] = useState({});
  const [loading, setLoading] = useState(false);
  const [groupDownloadStatus] = useState({});
  let [rawFiles, setRawFiles] = useState({ data: [], total: 0 });
  const [reFreshing, setRefreshing] = useState(false);
  const [searchInput] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const [isShown, toggleModal] = useState(false);
  const [tableKey, setTableKey] = useState(0);
  const [value, setValue] = useState([]);
  const [sidepanel, setSidepanel] = useState(false);
  const [currentRecord, setCurrentRecord] = useState({});
  const [fileModalVisible, setFileModalVisible] = useState(false);
  const [lineageModalVisible, setLineageModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [downloadVisible, setDownloadVisible] = useState(false);

  const [tableLoading, setTableLoading] = useState(false);
  const [detailsPanelWidth, setDetailsPanelWidth] = useState(300);
  const [tableState, setTableState] = useState(TABLE_STATE.NORMAL);
  const [menuItems, setMenuItems] = useState(0);
  const [tableReady, setTableReady] = useState(false);
  const [showPlugins, setShowPlugins] = useState(true);
  const [currentProject] = useCurrentProject();
  const projectActivePanel = useSelector(
    (state) => state.project && state.project.tree && state.project.tree.active,
  );
  const [selectedRows, setSelectedFiles] = useState([]);
  const [selectedRowKeys, setSelectedFilesKeys] = useState([]);
  const folderRouting = useSelector(
    (state) => state.fileExplorer && state.fileExplorer.folderRouting,
  );
  const currentRouting = folderRouting[panelKey]
    ? folderRouting[panelKey].filter(
        (r) => typeof r.folderLevel !== 'undefined',
      )
    : folderRouting[panelKey];
  const movedToBinFileList = useSelector((state) => state.movedToBinFileList);
  const deletedFileList = useSelector((state) => state.deletedFileList);
  const rolesPermissionsList = useSelector(
    (state) => state.rolePermissions.roles,
  );
  const currentRecordNameSync = useRef(undefined);
  let permission = false;
  if (currentProject) permission = currentProject.permission;

  const updateFileManifest = (record, manifestIndex) => {
    const index = _.findIndex(rawFiles.data, (item) => item.key === record.key);

    if (manifestIndex >= rawFiles.data[index].manifest.length) {
      rawFiles.data[index].manifest.push(record.manifest[manifestIndex]);
    } else {
      rawFiles.data[index].manifest[manifestIndex].value =
        record.manifest[manifestIndex].value;
    }
    rawFiles.data[index].manifest.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0,
    );

    setRawFiles({ ...rawFiles, data: [...rawFiles.data] });
  };
  const isRootFolder =
    checkGreenAndCore(panelKey) &&
    currentRouting &&
    currentRouting.length === 0;

  const getParentPathAndId = () => {
    if (currentRouting && currentRouting.length) {
      return {
        parentPath: currentRouting.map((v) => v.name).join('/'),
      };
    } else {
      if (isVFolder) {
        return {
          parentId: geid,
        };
      }
      return {
        parentPath: null,
      };
    }
  };
  const currentRouteLength = 0 || currentRouting?.length;
  const actionBarRef = useRef(null);
  const moreActionRef = useRef(null);
  const isVFolder = checkIsVirtualFolder(panelKey);
  useEffect(() => {
    clearSelection();
  }, [currentRouteLength]);

  useEffect(() => {
    const debounced = _.debounce(() => {
      if (
        actionBarRef &&
        actionBarRef.current &&
        moreActionRef &&
        moreActionRef.current
      ) {
        const menuItems = hideButton(actionBarRef, moreActionRef);
        setMenuItems(menuItems);
      }
    }, 200);
    window.addEventListener('resize', debounced);
  }, []);
  const hasSelected = selectedRowKeys.length > 0;
  useEffect(() => {
    const menuItems = hideButton(actionBarRef, moreActionRef);
    setMenuItems(menuItems);
  }, [panelKey, hasSelected, props.type, permission, currentRouteLength]);

  useEffect(() => {
    if (
      rawFiles.data &&
      rawFiles.data.length &&
      currentRecord &&
      currentRecord.geid
    ) {
      const newRecord = rawFiles.data.find(
        (x) => x.geid === currentRecord.geid,
      );
      if (newRecord) {
        setCurrentRecord({ ...newRecord });
        currentRecordNameSync.current = newRecord.name;
      }
    }
  }, [rawFiles.data]);

  useEffect(() => {
    const items = document.cookie
          .split('; ')
          .filter(cookie => cookie.startsWith('record_'))
          .map(cookie => {
            const [key, rawValue] = cookie.split('=');
            const geid = key.replace('record_', '');
            const value = decodeURIComponent(rawValue);
            try {
              const { name, timestamp, project } = JSON.parse(value);
              return { geid, name, timestamp, project };
            } catch {
              return null;
            }
          })
          .filter(Boolean);
    dispatch(setDeletedFileList(items));
  }, [dispatch]);

  const getColumnWidth = (panelKey, isRootFolder, sidepanelOpen, columnKey) => {
    const OPEN_SIDE = {
      name: '65%',
      action: 100,
    };
    const TRASH = {
      name: undefined,
      owner: '17%',
      deleteTime: 120,
      originalLocation: 150,
      size: 100,
      action: 80,
    };
    const COLLECTION = {
      name: '25%',
      owner: '17%',
      createTime: 120,
      size: 100,
      action: 100,
    };
    const GREENROOM_CORE_NOMAL = {
      name: '25%',
      owner: '17%',
      createTime: 120,
      size: 100,
      action: 100,
    };
    const GREENROOM_CORE_ROOT = {
      name: '35%',
      owner: '35%',
      createTime: '25%',
    };
    if (sidepanelOpen) {
      return OPEN_SIDE[columnKey];
    }

    if (panelKey.includes('trash')) {
      return TRASH[columnKey];
    }
    if (panelKey.startsWith('vfolder-')) {
      return COLLECTION[columnKey];
    }
    if (checkGreenAndCore(panelKey)) {
      if (isRootFolder) {
        return GREENROOM_CORE_ROOT[columnKey];
      } else {
        return GREENROOM_CORE_NOMAL[columnKey];
      }
    }
  };
  const checkIsRecordPendingMoveToBin = (record) =>
    movedToBinFileList.find(
      (el) =>
        el.projectCode === currentProject.code &&
        el.targetNames.includes(record.fileName) &&
        el.status === JOB_STATUS.RUNNING,
    );

  const checkIsRecordDeleted = (record) => {
    return deletedFileList.some(el => el.geid === record.geid);
  };

  let columns = [
    !panelKey.includes('trash') &&
    rawFiles.data[0]?.displayPath
      ? {
          title: '',
          dataIndex: 'star',
          key: 'star',
          width: 20,
          render: (text, record) => {
            return (
              <div className={styles['file-explorer__fav-btn']}>
                <StarButton
                  outline={!record.favourite}
                  onChange={async (e, { outline }) => {
                    if (outline) {
                      const zone =
                        record.nodeLabel.indexOf('Greenroom') !== -1
                          ? 'greenroom'
                          : 'core';
                      await addUserFavourite({
                        id: record.geid,
                        user: props.username,
                        type: 'item',
                        container_code: currentProject?.code,
                        zone: zone,
                      });
                      return false;
                    } else {
                      await deleteUserFavourite({
                        id: record.geid,
                        user: props.username,
                        type: 'item',
                      });
                      return true;
                    }
                  }}
                />
              </div>
            );
          },
        }
      : {},
    {
      title: '',
      dataIndex: 'icon',
      key: 'icon',
      width: 20,
      render: (text, record) => {
        if (record.nodeLabel.indexOf('Folder') !== -1) {
          if (checkGreenAndCore(panelKey) && currentRouting?.length === 0) {
            return <UserOutlined style={{ float: 'none' }} />;
          } else {
            return <FolderOutlined style={{ float: 'none' }} />;
          }
        } else {
          return <FileOutlined style={{ float: 'none' }} />;
        }
      },
    },
    {
      title: 'Name',
      dataIndex: 'fileName',
      key: 'fileName',
      sorter: true,
      filteredValue:
        searchText &&
        searchText.length &&
        searchText.find((v) => v.key === 'fileName')
          ? [searchText.find((v) => v.key === 'fileName').value]
          : null,
      width: getColumnWidth(panelKey, isRootFolder, sidepanel, 'name'),
      searchKey: !panelKey.startsWith('vfolder-') ? 'name' : null,
      render: (text, record) => {
        let filename = text;
        if (!filename) {
          const fileArray = record.name && record.name.split('/');
          if (fileArray && fileArray.length)
            filename = fileArray[fileArray.length - 1];
        }
        let hasPopover = false;
        let popoverContent = '';
        if (filename && filename.length > 45) {
          hasPopover = true;
          popoverContent = filename;
        }
        if (tableState === TABLE_STATE.MANIFEST_APPLY && record.manifest) {
          hasPopover = true;
          popoverContent = filename + ' has an annotate attached';
        }
        return (
          <div
            style={{
              cursor:
                record.nodeLabel.indexOf('Folder') !== -1
                  ? 'pointer'
                  : 'default',
            }}
            onClick={(e) => {
              if (movedToBinFileList && checkIsRecordPendingMoveToBin(record)) {
                return;
              }
              if (record.nodeLabel.indexOf('Folder') !== -1) {
                dispatch(setTableLayoutReset(panelKey));
                refreshFiles({
                  parentPath: record.displayPath
                    ? record.displayPath + '/' + record.name
                    : record.name,
                  sourceType: 'folder',
                  node: { nodeLabel: record.nodeLabel },
                  resetTable: true,
                });
              }
            }}
          >
            {record.tags &&
            record.tags.indexOf(SYSTEM_TAGS['COPIED_TAG']) !== -1 &&
            tableState === TABLE_STATE.COPY_TO_CORE ? (
              <Tag color="default">{SYSTEM_TAGS['COPIED_TAG']}</Tag>
            ) : null}
            {movedToBinFileList && checkIsRecordPendingMoveToBin(record) ? (
              <Tag color="default">moving to the bin</Tag>
            ) : null}
            {deletedFileList && checkIsRecordDeleted(record)? (
              <Tag color="default">deleted</Tag>
            ) : null}
            {hasPopover ? (
              <Popover content={<span>{popoverContent}</span>}>
                {filename && filename.length > 45
                  ? `${filename.slice(0, 45)}...`
                  : filename}
              </Popover>
            ) : (
              <span>{filename}</span>
            )}
          </div>
        );
      },
    },
    {
      title: 'Added',
      dataIndex: 'owner',
      key: 'owner',
      filteredValue:
        searchText &&
        searchText.length &&
        searchText.find((v) => v.key === 'owner')
          ? [searchText.find((v) => v.key === 'owner').value]
          : null,
      sorter:
        !(projectActivePanel === 'greenroom-raw' &&
          ['collaborator', 'contributor'].includes(permission)),
      width: getColumnWidth(panelKey, isRootFolder, sidepanel, 'owner'),
      searchKey:
        (projectActivePanel &&
          projectActivePanel.startsWith('greenroom-') &&
          ['collaborator', 'contributor'].includes(permission)) ||
        panelKey.startsWith('vfolder-')
          ? null
          : 'owner',
      ellipsis: true,
    },
    !panelKey.includes('trash')
      ? {
          title: 'Created',
          dataIndex: 'createTime',
          key: 'createTime',
          sorter: true,
          width: getColumnWidth(
            panelKey,
            isRootFolder,
            sidepanel,
            'createTime',
          ),
          ellipsis: true,
          render: (text, record) => {
            return text && timeConvert(text, 'date');
          },
        }
      : {},
    panelKey.includes('trash')
      ? {
          title: 'Deleted Date',
          dataIndex: 'lastUpdatedTime',
          key: 'lastUpdatedTime',
          sorter: true,
          width: getColumnWidth(
            panelKey,
            isRootFolder,
            sidepanel,
            'deleteTime',
          ),
          ellipsis: true,
          render: (text, record) => {
            return text && timeConvert(text, 'date');
          },
        }
      : {},
    panelKey.includes('trash')
      ? {
          title: 'Original Location',
          dataIndex: 'nodeLabel',
          key: 'nodeLabel',
          render: (text, record) => {
            if (
              record.nodeLabel.indexOf('Greenroom') !== -1 ||
              record.nodeLabel.indexOf('greenroom') !== -1
            ) {
              return 'Green Room';
            } else if (record.nodeLabel.indexOf('Core') !== -1) {
              return 'Core';
            } else {
              return '';
            }
          },
          ellipsis: true,
          width: getColumnWidth(
            panelKey,
            isRootFolder,
            sidepanel,
            'originalLocation',
          ),
        }
      : {},
    (checkGreenAndCore(panelKey) && !isRootFolder) ||
    !checkGreenAndCore(panelKey)
      ? {
          title: 'Size',
          dataIndex: 'fileSize',
          key: 'fileSize',
          render: (text, record) => {
            if (
              record.nodeLabel.indexOf('Folder') !== -1 ||
              [undefined, null].includes(record.fileSize)
            ) {
              return '';
            }
            return getFileSize(text);
          },
          sorter: true,
          ellipsis: true,
          width: getColumnWidth(panelKey, isRootFolder, sidepanel, 'size'),
        }
      : {},
    (checkGreenAndCore(panelKey) && !isRootFolder) ||
    !checkGreenAndCore(panelKey)
      ? {
          title: 'Action',
          key: 'action',
          width: getColumnWidth(panelKey, isRootFolder, sidepanel, 'action'),
          render: (text, record) => {
            let file = record.name;
            let files = [
              {
                id: record.geid,
                fileName: record.fileName,
              },
            ];

            const checkDownloadPermissions = () => {
              const anyFile = getProjectRolePermission(permission, {
                zone: panelKey,
                resource: permissionResource.anyFile,
                operation: permissionOperation.download,
              });
              if (anyFile) {
                return true;
              } else if (
                currentRouting &&
                currentRouting[0]?.name === props.username
              ) {
                return getProjectRolePermission(permission, {
                  zone: panelKey,
                  resource: permissionResource.ownFile,
                  operation: permissionOperation.download,
                });
              }
            };


            const menu = (
              <Menu style={{ borderRadius: '6px' }}>
                <Menu.Item
                  disabled={
                    movedToBinFileList &&
                    checkIsRecordPendingMoveToBin(record) &&
                    checkIsRecordDeleted(record) &&
                    true
                  }
                  onClick={(e) => openFileSider(record)}
                >
                  Properties
                </Menu.Item>
                {panelKey.includes('trash') && (
                  <Menu.Divider />
                  )}
                {panelKey.includes('trash') && (
                <Menu.Item
                  onClick={(e) => deleteFile(record)}
                >
                  Delete
                </Menu.Item>
                )}
                {!panelKey.includes('trash') && checkDownloadPermissions() && (
                  <Menu.Divider />
                )}
                {!panelKey.includes('trash') && checkDownloadPermissions() && (
                  <Menu.Item
                    disabled={(movedToBinFileList && checkIsRecordPendingMoveToBin(record)) ||
                              (deletedFileList && checkIsRecordDeleted(record))
                    }
                    onClick={async (e) => {
                      setDownloadVisible(true);
                      const sessionId =
                        tokenManager.getLocalCookie('sessionId');

                      downloadFilesAPI(
                        props.projectId,
                        files,
                        currentProject.code,
                        props.username,
                        panelKey.startsWith('greenroom') ? 'greenroom' : 'Core',
                        null,
                        sessionId,
                        {
                          appendDownloadListCreator:
                            props.appendDownloadListCreator,
                          setDownloadCommitting: props.setDownloadCommitting,
                        },
                      )
                        .then((res) => {
                          if (res) {
                            const url = res;
                            window.open(url, '_blank');
                            setTimeout(() => {
                              dispatch(setSuccessNum(props.successNum + 1));
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
                {!panelKey.includes('trash') &&
                  record &&
                  record.name &&
                  checkSupportFormat(record.name) && <Menu.Divider />}
                {!panelKey.includes('trash') &&
                  record &&
                  record.name &&
                  checkSupportFormat(record.name) && (
                    <Menu.Item
                      style={{ textAlign: 'center' }}
                      onClick={async () => {
                        const { geid } = record;
                        const zipRes = await getZipContentAPI(
                          geid,
                          currentProject && currentProject.globalEntityId,
                        );
                        if (zipRes.status === 200)
                          record = {
                            ...record,
                            zipContent:
                              zipRes.data && zipRes.data.archive_preview,
                          };
                        setCurrentRecord(record);
                        currentRecordNameSync.current = record.name;
                        setPreviewModalVisible(true);
                      }}
                    >
                      Preview
                    </Menu.Item>
                  )}
              </Menu>
            );
            const isDeleted =
              (movedToBinFileList && checkIsRecordPendingMoveToBin(record)) ||
              (deletedFileList && checkIsRecordDeleted(record));
            return (
              <div className={styles['file-explorer__action-button']}>
                <Dropdown
                  trigger={['click', 'hover']}
                  overlay={menu}
                  placement="bottomRight"
                  disabled={isDeleted}
                >
                  <Button shape="circle">
                    <MoreOutlined />
                  </Button>
                </Dropdown>
              </div>
            );
          },
        }
      : {},
  ];

  columns = columns.filter((v) => Object.keys(v).length !== 0);
  if (sidepanel) {
    columns = columns.filter((v) => v.key === 'fileName' || v.key === 'action');
  }
  useEffect(() => {
    setPageLoading(false);
  }, [searchInput, props.projectId, props.rawData]);

  const datasetGeid = currentProject?.globalEntityId;
  async function fetchData() {
    if (currentRouting && currentRouting.length) {
      setRefreshing(true);
      await refreshFiles({
        parentPath: currentRouting.map((v) => v.name).join('/'),
        sourceType: 'folder',
        node: { nodeLabel: currentRouting[currentRouting.length - 1].labels },
        resetTable: true,
      });
      dispatch(setTableLayoutReset(panelKey));
      setRefreshing(false);
    } else {
      setRefreshing(true);

      const sourceTypePara = getSourceType();
      await refreshFiles({
        parentId: isVFolder ? geid : null,
        parentPath: null,
        sourceType: sourceTypePara,
        resetTable: true,
      });
      dispatch(setTableLayoutReset(panelKey));
      setRefreshing(false);
    }
  }

  const orderRouting =
    currentRouting &&
    currentRouting.sort((a, b) => {
      return a.folderLevel - b.folderLevel;
    });

  const getRecentUpload = () =>
    props.uploadList
      .filter(
        (uploadItem) =>
          uploadItem.status === 'success' && uploadItem.createdTime,
      )
      .at(-1);

  const checkRecentUploadPath = () => {
    const recentUpload = getRecentUpload();

    if (recentUpload) {
      const recentUploadFilePath = recentUpload.fileName
        .split('/')
        .slice(1, -1);
      const currentFileExplorerPath =
        orderRouting && orderRouting.length
          ? orderRouting.map((route) => route.name).slice(1)
          : [];
      return recentUploadFilePath.every((path) =>
        currentFileExplorerPath.find((uploadPath) => uploadPath === path),
      );
    } else {
      return true;
    }
  };

  useEffect(() => {
    const sameRouteAsRecentUpload = checkRecentUploadPath();
    if (
      panelKey === projectActivePanel &&
      datasetGeid &&
      tableReady &&
      sameRouteAsRecentUpload
    ) {
      fetchData();
    }
  }, [props.successNum, datasetGeid]);

  const createPendingUploadMap = (uploads) => {
    return uploads.reduce((totalUploads, currentUpload) => {
      const rootFolder = currentUpload.targetNames[0].split('/')[1];
      const isNewRootFolder = !Object.keys(totalUploads).find(
        (item) => item === rootFolder,
      );

      if (currentUpload.status === 'error') {
        return totalUploads;
      }

      if (isNewRootFolder) {
        totalUploads[rootFolder] = {
          files: [currentUpload],
          total: 1,
          firstUpload: true,
        };
      } else {
        const newFiles = [...totalUploads[rootFolder].files, currentUpload];
        totalUploads[rootFolder] = {
          files: newFiles,
          total: newFiles.length,
          firstUpload: true,
        };
      }

      return totalUploads;
    }, {});
  };

  const folderUploads = props.uploadList.filter(
    (uploadItem) => uploadItem.targetType === 'folder',
  );

  useEffect(() => {
    if (folderUploads.length > 0) {
      const newFolderUploads = createPendingUploadMap(folderUploads);

      setPendingFolderUpload({
        ...pendingFolderUpload,
        ...newFolderUploads,
      });
    }
  }, [folderUploads.length]);

  useEffect(() => {
    const currentPendingFolderUpload = { ...pendingFolderUpload };
    const reduxPendingUploads = createPendingUploadMap(
      folderUploads.filter((upload) => upload.status !== 'success'),
    );
    let refreshFileExplorer = false;
    const currentPendingFolders = Object.keys(currentPendingFolderUpload);

    const newPendingFolderUpload = currentPendingFolders.reduce(
      (totalPending, currentFolder) => {
        if (!reduxPendingUploads[currentFolder]?.total) {
          refreshFileExplorer = true;
          delete totalPending[currentFolder];
          return totalPending;
        }

        if (totalPending[currentFolder].firstUpload) {
          refreshFileExplorer = true;
          totalPending[currentFolder].firstUpload = false;
        }

        totalPending[currentFolder].files =
          reduxPendingUploads[currentFolder].files;
        return totalPending;
      },
      currentPendingFolderUpload,
    );
    setPendingFolderUpload(newPendingFolderUpload);

    if (refreshFileExplorer) fetchData();
  }, [props.successNum]);

  async function loadUserHomeNav() {
    await getProjectFiles(
      null,
      null,
      0,
      10,
      'name',
      'asc',
      { archived: false, name: props.username },
      'Greenroom',
      'project',
      null,
      PanelKey.GREENROOM_HOME,
      currentProject.code,
    );
  }
  async function firstTimeLoad() {
    let pathParam;
    let parentId;
    if (isVFolder) {
      pathParam = null;
      parentId = geid;
    } else {
      if (parentPath) {
        pathParam = parentPath;
      } else {
        if (checkUserHomeFolder(panelKey)) {
          pathParam = props.username;
        } else {
          pathParam = null;
        }
      }
    }
    const getSourceTypeParam = () => {
      if (checkIsVirtualFolder(panelKey)) {
        return 'collection';
      } else if (panelKey.toLowerCase().includes('trash')) {
        return 'trash';
      }
      if (checkRootFolder(panelKey)) {
        return 'project';
      } else {
        return 'folder';
      }
    };
    if (panelKey === PanelKey.GREENROOM_HOME) {
      await loadUserHomeNav();
    }
    await refreshFiles({
      parentId: parentId,
      parentPath: pathParam,
      sourceType: getSourceTypeParam(),
      resetTable: true,
      query: selectedFileName ? { name: selectedFileName } : {},
    });
  }
  useEffect(() => {
    setTableReady(true);
    firstTimeLoad();
  }, []);

  const onSelectChange = (selectedRowKeys, selectedRowsNew) => {
    setSelectedFilesKeys(selectedRowKeys);
    let tmpSelectedRows = selectedRows
      .concat(selectedRowsNew)
      .filter((item) => item !== undefined);
    let totalSelectedRows = selectedRowKeys.map(
      (key) => tmpSelectedRows.filter((item) => item.geid === key)[0],
    );
    setSelectedFiles(totalSelectedRows);
  };

  async function onPanelChange(keys) {}

  async function openFileSider(record) {
    setCurrentRecord(record);
    currentRecordNameSync.current = record.name;
    setSidepanel(true);
  }

async function deleteFile(record) {
    try {
      dispatch(addDeletedFileList(record));
      markFileForDeletion(record.geid, currentProject.code);
    } catch (error) {
      message.error('Failed to delete file.');
      console.log(error);
    }
}

  function closeFileSider() {
    setSidepanel(false);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => {
      if (tableState === TABLE_STATE.MANIFEST_APPLY) {
        if (record.manifest && record.manifest.length !== 0) {
          return {
            disabled: true,
          };
        }
      }
      if (movedToBinFileList) {
        // return {
        //     disabled: true,
        //   };

        const isDeleted =
              (movedToBinFileList && checkIsRecordPendingMoveToBin(record)) ||
              (deletedFileList && checkIsRecordDeleted(record));
        if (isDeleted) {
          return {
            disabled: true,
          };
        }
      }
    },
  };

  const downloadFiles = async () => {
    setDownloadVisible(true);
    setLoading(true);
    let files = [];
    selectedRows.forEach((file) => {
      files.push({
        id: file.geid,
        fileName: file.fileName,
      });
    });
    const sessionId = tokenManager.getLocalCookie('sessionId');
    downloadFilesAPI(
      props.projectId,
      files,
      currentProject.code,
      props.username,
      panelKey.startsWith('greenroom') ? 'greenroom' : 'Core',
      null,
      sessionId,
      {
        appendDownloadListCreator: props.appendDownloadListCreator,
        setDownloadCommitting: props.setDownloadCommitting,
      },
    )
      .then((res) => {
        if (res) {
          const url = res;
          window.open(url, '_blank');
          setTimeout(() => {
            dispatch(setSuccessNum(props.successNum + 1));
          }, 3000);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          const errorMessager = new ErrorMessager(
            namespace.project.files.downloadFilesAPI,
          );
          errorMessager.triggerMsg(err.response.status);
        }
        return;
      })
      .finally(() => {
        if (setLoading) {
          setLoading(false);
        }
      });
    clearSelection();
  };

  const onFold = (key) => {
    const data = [];

    for (let el of rawFiles.data) {
      if (el.key === key) el = { ...el, lineage: {} };

      data.push(el);
    }
    setRawFiles({
      ...rawFiles,
      data: data,
    });
  };

  function handleOk(e) {
    setFileModalVisible(false);
  }

  function handleLineageCancel(e) {
    setLineageModalVisible(false);
  }

  function handlePreviewCancel(e) {
    setPreviewModalVisible(false);
  }

  function mouseDown(e) {
    document.addEventListener('mousemove', mouseMove, true);
    document.addEventListener('mouseup', stopMove, true);
  }
  function clearSelection() {
    clearFilesSelection();
  }

  function mouseMove(e) {
    const mouseX = e.clientX;
    const parentX = ref.current.getClientRects()[0].x;
    const parentWidth = ref.current.getClientRects()[0].width;
    const delta = mouseX - parentX;
    const maxPanelwidth = 500;
    const panelWidth =
      parentWidth - delta > maxPanelwidth ? maxPanelwidth : parentWidth - delta;

    setDetailsPanelWidth(panelWidth);
  }

  function stopMove() {
    document.removeEventListener('mousemove', mouseMove, true);
    document.removeEventListener('mouseup', stopMove, true);
  }

  useEffect(() => {
    const debounce = _.debounce(
      () => {
        setDetailsPanelWidth(300);
      },
      1000,
      { leading: false },
    );
    window.addEventListener('resize', debounce);

    return () => window.removeEventListener('resize', debounce);
  }, []);

  function clearFilesSelection() {
    setSelectedFiles([]);
    setSelectedFilesKeys([]);
  }
  async function goRoot() {
    if (
      !getProjectRolePermission(permission, {
        zone: panelKey,
        resource: permissionResource.anyFile,
        operation: permissionOperation.view,
      }) &&
      panelKey.startsWith('greenroom')
    ) {
      return;
    }
    if (
      !getProjectRolePermission(permission, {
        zone: panelKey,
        resource: permissionResource.anyFile,
        operation: permissionOperation.view,
      }) &&
      panelKey.startsWith('core')
    ) {
      return;
    }
    let sourceType;
    const folderRoutingTemp = folderRouting || {};
    folderRoutingTemp[panelKey] = null;
    dispatch(setFolderRouting(folderRoutingTemp));
    dispatch(setTableLayoutReset(panelKey));
    const isVFolder = checkIsVirtualFolder(panelKey);

    if (isVFolder) {
      sourceType = 'collection';
    } else if (panelKey.toLowerCase().includes('trash')) {
      sourceType = 'trash';
    } else {
      sourceType = 'project';
    }

    await refreshFiles({
      parentId: isVFolder ? geid : null,
      parentPath: null,
      sourceType,
      resetTable: true,
    });
  }

  const getSourceType = () => {
    if (checkIsVirtualFolder(panelKey)) {
      return 'collection';
    } else if (panelKey.toLowerCase().includes('trash')) {
      return 'trash';
    }
    if (checkGreenAndCore(panelKey) && currentRouting?.length > 0) {
      return 'folder';
    } else {
      return 'project';
    }
  };

  async function refreshFiles(params) {
    let {
      parentPath,
      parentId,
      page = 0,
      pageSize = 10,
      orderBy = 'createTime',
      orderType = 'desc',
      query = {},
      partial,
      sourceType,
      resetTable = false,
      node = null,
    } = params;

    if (tableLoading) return;
    setTableLoading(true);
    let res;
    try {
      if (!partial) {
        partial = [];
        Object.keys(query).forEach((key) => {
          partial.push(mapColumnKey(key));
        });
      }
      res = await getProjectFiles(
        parentPath,
        parentId,
        page,
        pageSize,
        mapColumnKey(orderBy),
        orderType,
        mapQueryKeys(query),
        getZone(panelKey, permission, sourceType, node),
        sourceType,
        partial,
        panelKey,
        currentProject?.code,
      );
      res = await insertManifest(res);
      const { files, total } = resKeyConvert(res);

      setRawFiles({
        data: files,
        total: total,
      });
      updateFolderRouting(res);

      setShowPlugins(true);
    } catch (error) {
      setShowPlugins(false);
      console.error(error);
      if (error.response && error.response.status === 404) {
        message.error('No user folder found');
      } else {
        message.error(
          `${i18n.t('errormessages:rawTable.getFilesApi.default.0')}`,
        );
      }
    }
    setTableLoading(false);

    if (resetTable) setTableKey(tableKey + 1);
  }

  const plugins = [
    {
      condition: () => {
        if (!isRootFolder && checkGreenAndCore(panelKey)) {
          const PermAnyFile = getProjectRolePermission(permission, {
            zone: panelKey,
            resource: permissionResource.anyFile,
            operation: permissionOperation.view,
          });
          if (PermAnyFile) {
            return true;
          } else {
            if (currentRouting && currentRouting[0]?.name === props.username) {
              return getProjectRolePermission(permission, {
                zone: panelKey,
                resource: permissionResource.ownFile,
                operation: permissionOperation.view,
              });
            }
          }
        } else {
          return;
        }
      },
      elm: (
        <CreateFolderPlugin
          refresh={() => {
            !reFreshing && fetchData();
          }}
          currentRouting={currentRouting}
          projectCode={currentProject?.code}
          uploader={props.username}
          panelKey={panelKey}
        />
      ),
    },
    {
      condition: () => !hasSelected,
      elm: (
        <Button
          onClick={() => {
            !reFreshing && fetchData();
          }}
          type="link"
          icon={<SyncOutlined spin={reFreshing} />}
          style={{ marginRight: 8 }}
        >
          Refresh
        </Button>
      ),
    },
    {
      condition: () => {
        if (
          !isRootFolder &&
          !hasSelected &&
          (props.type === DataSourceType.GREENROOM_HOME ||
            props.type === DataSourceType.GREENROOM) &&
          currentRouting
        ) {
          const PermAnyFile = getProjectRolePermission(permission, {
            zone: panelKey,
            resource: permissionResource.anyFile,
            operation: permissionOperation.upload,
          });
          if (PermAnyFile) {
            return true;
          } else {
            if (currentRouting && currentRouting[0]?.name === props.username) {
              return getProjectRolePermission(permission, {
                zone: panelKey,
                resource: permissionResource.ownFile,
                operation: permissionOperation.upload,
              });
            }
          }
        } else {
          return false;
        }
      },
      elm: (
        <Button
          id="raw_table_upload"
          type="link"
          onClick={() => toggleModal(true)}
          icon={<UploadOutlined />}
          style={{ marginRight: 8 }}
        >
          Upload
        </Button>
      ),
    },
    {
      condition: () => {
        if (
          !isRootFolder &&
          !panelKey.includes('trash') &&
          hasSelected &&
          currentRouting
        ) {
          const PermAnyFile = getProjectRolePermission(permission, {
            zone: panelKey,
            resource: permissionResource.anyFile,
            operation: permissionOperation.download,
          });
          if (PermAnyFile) {
            return true;
          } else {
            if (currentRouting && currentRouting[0]?.name === props.username) {
              return getProjectRolePermission(permission, {
                zone: panelKey,
                resource: permissionResource.ownFile,
                operation: permissionOperation.download,
              });
            }
          }
        } else {
          return false;
        }
      },

      elm: (
        <Button
          onClick={downloadFiles}
          loading={loading}
          type="link"
          icon={<CloudDownloadOutlined />}
          style={{ marginRight: 8 }}
        >
          Download
        </Button>
      ),
    },
    {
      condition: () => {
        if (
          !isRootFolder &&
          (props.type === DataSourceType.GREENROOM_HOME ||
            props.type === DataSourceType.GREENROOM) &&
          currentRouting
        ) {
          const PermAnyFile = getProjectRolePermission(permission, {
            zone: panelKey,
            resource: permissionResource.anyFile,
            operation: permissionOperation.copy,
          });
          if (PermAnyFile) {
            return true;
          } else {
            if (currentRouting && currentRouting[0]?.name === props.username) {
              return getProjectRolePermission(permission, {
                zone: panelKey,
                resource: permissionResource.ownFile,
                operation: permissionOperation.copy,
              });
            }
          }
        } else {
          return false;
        }
      },

      elm: (
        <Copy2CorePlugin
          tableState={tableState}
          setTableState={setTableState}
          selectedRowKeys={selectedRowKeys}
          clearSelection={clearSelection}
          selectedRows={selectedRows}
          panelKey={panelKey}
        />
      ),
    },
    {
      condition: () =>
        !isRootFolder &&
        (props.type === DataSourceType.CORE_HOME ||
          props.type === DataSourceType.CORE) &&
        hasSelected,
      elm: (
        <VirtualFolderPlugin
          tableState={tableState}
          setTableState={setTableState}
          selectedRowKeys={selectedRowKeys}
          clearSelection={clearSelection}
          selectedRows={selectedRows}
          panelKey={panelKey}
        />
      ),
    },
    {
      condition: () => {
        if (
          !panelKey.includes('trash') &&
          (props.type === DataSourceType.CORE_VIRTUAL_FOLDER ||
            !isRootFolder) &&
          currentRouting
        ) {
          const PermAnyFile = getProjectRolePermission(permission, {
            zone: panelKey,
            resource: permissionResource.anyFile,
            operation: permissionOperation.annotate,
          });
          if (PermAnyFile) {
            return true;
          } else {
            if (currentRouting && currentRouting[0]?.name === props.username) {
              return getProjectRolePermission(permission, {
                zone: panelKey,
                resource: permissionResource.ownFile,
                operation: permissionOperation.annotate,
              });
            }
          }
        } else {
          return false;
        }
      },

      elm: (
        <AddTagsPlugin
          tableState={tableState}
          setTableState={setTableState}
          selectedRowKeys={selectedRowKeys}
          clearSelection={clearSelection}
          selectedRows={selectedRows}
          panelKey={panelKey}
        />
      ),
    },
    {
      condition: () => {
        if (
          !panelKey.includes('trash') &&
          (props.type === DataSourceType.CORE_VIRTUAL_FOLDER ||
            !isRootFolder) &&
          currentRouting
        ) {
          const PermAnyFile = getProjectRolePermission(permission, {
            zone: panelKey,
            resource: permissionResource.anyFile,
            operation: permissionOperation.annotate,
          });
          if (PermAnyFile) {
            return true;
          } else {
            if (currentRouting && currentRouting[0]?.name === props.username) {
              return getProjectRolePermission(permission, {
                zone: panelKey,
                resource: permissionResource.ownFile,
                operation: permissionOperation.annotate,
              });
            }
          }
        } else {
          return false;
        }
      },
      elm: (
        <ManifestManagementPlugin
          tableState={tableState}
          setTableState={setTableState}
          selectedRowKeys={selectedRowKeys}
          clearSelection={clearSelection}
          selectedRows={selectedRows}
          panelKey={panelKey}
        />
      ),
    },
    {
      condition: () =>
        !isRootFolder &&
        (props.type === DataSourceType.CORE_HOME ||
          props.type === DataSourceType.CORE) &&
        (permission === 'admin' || 'collaborator'),
      elm: (
        <DatasetsPlugin
          tableState={tableState}
          setTableState={setTableState}
          selectedRowKeys={selectedRowKeys}
          clearSelection={clearSelection}
          selectedRows={selectedRows}
          panelKey={panelKey}
        />
      ),
    },
    {
      condition: () =>
        props.type === DataSourceType.CORE_VIRTUAL_FOLDER &&
        !currentRouting?.length &&
        hasSelected,
      elm: (
        <VirtualFolderFilesDeletePlugin
          tableState={tableState}
          setTableState={setTableState}
          selectedRowKeys={selectedRowKeys}
          clearSelection={clearSelection}
          selectedRows={selectedRows}
          panelKey={panelKey}
        />
      ),
    },

    {
      condition: () => {
        if (
          props.type !== DataSourceType.CORE_VIRTUAL_FOLDER &&
          !panelKey.includes('trash') &&
          !isRootFolder &&
          hasSelected &&
          currentRouting
        ) {
          const PermAnyFile = getProjectRolePermission(permission, {
            zone: panelKey,
            resource: permissionResource.anyFile,
            operation: permissionOperation.delete,
          });

          if (PermAnyFile) {
            return true;
          } else {
            if (currentRouting && currentRouting[0]?.name === props.username) {
              return getProjectRolePermission(permission, {
                zone: panelKey,
                resource: permissionResource.ownFile,
                operation: permissionOperation.delete,
              });
            }
          }
        } else {
          return false;
        }
      },

      elm: (
        <DeleteFilesPlugin
          tableState={tableState}
          selectedRows={selectedRows}
          selectedRowKeys={selectedRowKeys}
          clearSelection={clearSelection}
          setTableState={setTableState}
          panelKey={panelKey}
          permission={permission}
        />
      ),
    },
    {
      condition: () => {
        if (
          !isRootFolder &&
          (props.type === DataSourceType.GREENROOM_HOME ||
            props.type === DataSourceType.GREENROOM) &&
          hasSelected &&
          currentRouting
        ) {
          const PermAnyFile = getProjectRolePermission(permission, {
            zone: panelKey,
            resource: permissionResource.copyReqAny,
            operation: permissionOperation.create,
          });

          if (PermAnyFile) {
            return true;
          } else {
            if (currentRouting && currentRouting[0]?.name === props.username) {
              return getProjectRolePermission(permission, {
                zone: panelKey,
                resource: permissionResource.copyReqOwn,
                operation: permissionOperation.create,
              });
            }
          }
        } else {
          return false;
        }
      },

      elm: (
        <RequestToCorePlugin
          tableState={tableState}
          setTableState={setTableState}
          selectedRowKeys={selectedRowKeys}
          clearSelection={clearSelection}
          selectedRows={selectedRows}
          panelKey={panelKey}
          currentRouting={currentRouting}
          orderRouting={orderRouting}
        />
      ),
    },
    {
      condition: () => {
        if (
          props.type === DataSourceType.CORE_VIRTUAL_FOLDER &&
          !currentRouting?.length &&
          !hasSelected &&
          currentRouting
        ) {
          return true;
        } else {
          return false;
        }
      },

      elm: (
        <VirtualFolderDeletePlugin
          tableState={tableState}
          setTableState={setTableState}
          selectedRowKeys={selectedRowKeys}
          clearSelection={clearSelection}
          selectedRows={selectedRows}
          panelKey={panelKey}
          removePanel={removePanel}
        />
      ),
    },
    {
      condition: () =>
        props.type === DataSourceType.CORE_VIRTUAL_FOLDER &&
        !currentRouting?.length &&
        !hasSelected,
      elm: <VirtualFolderRenamePlugin panelKey={panelKey} />,
    },
  ];

  const showFilePathBreadcrumb = () => {
    if (currentRouting?.length) {
      return (
        <>
          <Breadcrumb separator=">" className={`${styles.file_folder_path}`}>
            <Breadcrumb.Item
              style={{
                cursor: 'pointer',
              }}
              onClick={goRoot}
            >
              {checkIsVirtualFolder(panelKey)
                ? titleText
                : panelKey.toLowerCase().includes('trash')
                ? 'Trash'
                : panelKey.toLowerCase().includes('core')
                ? 'Core'
                : 'Green Room'}
            </Breadcrumb.Item>
            {currentRouting.length > 4 ? (
              <Breadcrumb.Item>...</Breadcrumb.Item>
            ) : null}
            {orderRouting
              .slice(checkIsVirtualFolder(panelKey) ? -1 : -3)
              .map((v, index) => {
                return (
                  <Breadcrumb.Item
                    key={'breadcrumb-' + index}
                    style={
                      index === orderRouting.length - 1
                        ? null
                        : { cursor: 'pointer' }
                    }
                    onClick={() => {
                      if (index === orderRouting.length - 1) {
                        return;
                      }
                      clearFilesSelection();
                      refreshFiles({
                        parentPath: v.displayPath
                          ? v.displayPath + '/' + v.name
                          : v.name,
                        sourceType: 'folder',
                        resetTable: true,
                        node: { nodeLabel: v.labels },
                      });
                      dispatch(setTableLayoutReset(panelKey));
                    }}
                  >
                    {v.name.length > 23 ? (
                      <Tip title={v.name}>{v.name.slice(0, 20) + '...'}</Tip>
                    ) : (
                      v.name
                    )}
                  </Breadcrumb.Item>
                );
              })}
          </Breadcrumb>
        </>
      );
    } else {
      return (
        <Breadcrumb
          style={{
            maxWidth: 500,
            display: 'inline-block',
            marginLeft: 10,
            marginRight: 30,
          }}
          className={styles.file_folder_path}
        >
          <Breadcrumb.Item onClick={goRoot}>
            {checkIsVirtualFolder(panelKey)
              ? titleText
              : panelKey.toLowerCase().includes('trash')
              ? 'Trash'
              : panelKey.toLowerCase().includes('core')
              ? 'Core'
              : 'Green Room'}
          </Breadcrumb.Item>
        </Breadcrumb>
      );
    }
  };

  const ToolTipsAndTable = (
    <div
      style={{
        position: 'relative',
        marginRight: '16px',
        borderRight: `1px solid ${variables.backgroundColor1}`,
      }}
    >
      <div
        className={`${styles.file_explore_actions} file_explorer_header_bar`}
        ref={actionBarRef}
      >
        {rolesPermissionsList && rolesPermissionsList.length && showPlugins
          ? plugins.map(({ condition, elm }) => {
              if (condition()) {
                return elm;
              } else {
                return null;
              }
            })
          : null}
        {rolesPermissionsList && rolesPermissionsList.length && showPlugins ? (
          <Dropdown
            overlayClassName={styles['drop-down']}
            overlay={
              <Menu className={styles[`show-menu-${menuItems}`]}>
                {plugins.map(({ condition, elm }, ind) => {
                  if (condition()) {
                    return <Menu.Item key={'menu-' + ind}>{elm}</Menu.Item>;
                  } else {
                    return null;
                  }
                })}
              </Menu>
            }
          >
            <Button
              ref={moreActionRef}
              type="link"
              icon={<EllipsisOutlined />}
            ></Button>
          </Dropdown>
        ) : null}

        {
          <div
            style={{
              float: 'right',
              marginRight: 40,
              marginTop: 4,
              display: `${hasSelected ? 'block' : 'none'}`,
            }}
          >
            <span>
              {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
            </span>
          </div>
        }
      </div>

      {showFilePathBreadcrumb()}
      {searchText &&
      searchText.length &&
      searchText.find((v) => v.key === 'fileName') ? (
        <div className={styles.search_file_area}>
          <span className={styles['search_file_area__label']}>
            Search name:
          </span>
          <Tag
            closable
            onClose={() => {
              setSearchText([]);
              fetchData();
            }}
          >
            {searchText.find((v) => v.key === 'fileName').value}
          </Tag>
        </div>
      ) : null}

      <FilesTable
        columns={columns}
        dataSource={rawFiles.data}
        totalItem={rawFiles.total}
        updateTable={refreshFiles}
        activePane={activePane}
        projectId={props.projectId}
        rowSelection={!panelKey.includes('trash') ? rowSelection : null}
        tableKey={tableKey}
        panelKey={panelKey}
        successNum={props.successNum}
        onFold={onFold}
        tags={value}
        selectedRecord={currentRecord}
        tableState={tableState}
        getParentPathAndId={getParentPathAndId}
        tableLoading={tableLoading}
        currentRouting={currentRouting}
        searchText={searchText}
        setSearchText={setSearchText}
      />
    </div>
  );

  return (
    <Spin spinning={pageLoading}>
      {Object.keys(groupDownloadStatus).length !== 0 && (
        <Collapse
          bordered={false}
          defaultActiveKey={['1']}
          style={{ marginBottom: '15px' }}
        >
          <Panel header="Group Download Status" key="1">
            {Object.keys(groupDownloadStatus).map((f) => (
              <span>
                {f}
                <Progress percent={groupDownloadStatus[f]} />
              </span>
            ))}
          </Panel>
        </Collapse>
      )}

      <div id="rawTable-sidePanel" style={{ display: 'flex' }} ref={ref}>
        {ToolTipsAndTable}
        {sidepanel && (
          <div
            style={{
              position: 'relative',
              paddingTop: '5px',
              paddingRight: '12px',
              minWidth: '215px',
              flex: `1 0 ${detailsPanelWidth}px`,
            }}
          >
            <Button
              onMouseDown={mouseDown}
              type="link"
              style={{
                position: 'absolute',
                top: '50%',
                left: `-31px`,
                transform: 'translateY(-50%)',
                transition: 'none',
                cursor: 'ew-resize',
              }}
            >
              <PauseOutlined />
            </Button>
            <div style={{ position: 'relative' }}>
              <CloseOutlined
                onClick={() => {
                  closeFileSider();
                  setCurrentRecord({});
                  currentRecordNameSync.current = undefined;
                }}
                style={{
                  zIndex: '99',
                  float: 'right',
                  marginTop: '11px',
                }}
              />
              <Title level={4} style={{ lineHeight: '1.9' }}>
                Properties
              </Title>
            </div>
            <Collapse defaultActiveKey={['1']} onChange={onPanelChange}>
              <Panel
                header="General"
                key="1"
                extra={
                  <Button
                    type="link"
                    onClick={(event) => {
                      setFileModalVisible(true);
                      event.stopPropagation();
                    }}
                    style={{ padding: 0, height: 'auto' }}
                  >
                    <FullscreenOutlined />
                  </Button>
                }
              >
                <FileBasics
                  panelKey={panelKey}
                  record={currentRecord}
                  pid={props.projectId}
                  role={permission}
                />
              </Panel>
              {currentRecord.nodeLabel.indexOf('Folder') === -1 ? (
                <Panel header="File Attributes" key="Manifest">
                  <FileManifest
                    updateFileManifest={updateFileManifest}
                    permission={permission}
                    currentRecord={currentRecord}
                  />
                </Panel>
              ) : null}
              {currentRecord.nodeLabel.indexOf('Folder') === -1 ? (
                <Panel
                  header={
                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        width: '80%',
                        whiteSpace: 'nowrap',
                        display: 'inline-block',
                      }}
                    >
                      Data Lineage Graph
                    </span>
                  }
                  key="2"
                  style={{ position: 'relative' }}
                >
                  <LineageGraph
                    record={currentRecord}
                    width={detailsPanelWidth - 70}
                    setLineageModalVisible={setLineageModalVisible}
                    showModalButton
                  />
                </Panel>
              ) : null}
            </Collapse>
          </div>
        )}
      </div>
      <DownloadModal
        visible={downloadVisible}
        setVisible={setDownloadVisible}
      />
      <GreenRoomUploader
        isShown={isShown}
        cancel={() => {
          toggleModal(false);
        }}
        panelKey={panelKey}
      />
      <FileBasicsModal
        visible={fileModalVisible}
        record={currentRecord}
        pid={props.projectId}
        handleOk={handleOk}
      />

      <LineageGraphModal
        visible={lineageModalVisible}
        record={currentRecord}
        handleLineageCancel={handleLineageCancel}
      />

      <ZipContentPlugin
        record={currentRecord}
        visible={previewModalVisible}
        handlePreviewCancel={handlePreviewCancel}
      />
    </Spin>
  );

  function updateFolderRouting(res) {
    const folderRoutingTemp = folderRouting || {};
    folderRoutingTemp[panelKey] = res.data?.result?.routing;
    dispatch(setFolderRouting(folderRoutingTemp));
  }

  async function insertManifest(res) {
    const geidsList = res.data.result.entities
      .filter((e) => e.attributes?.nodeLabel?.indexOf('Folder') === -1)
      .map((e) => e.geid);
    if (geidsList && geidsList.length) {
      let attrsMap = await getFileManifestAttrs(geidsList);
      attrsMap = attrsMap.data.result;
      res.data.result.entities = res.data.result.entities.map((entity) => {
        return {
          ...entity,
          manifest:
            attrsMap[entity.geid] && attrsMap[entity.geid].length
              ? attrsMap[entity.geid]
              : null,
        };
      });
    }

    return res;
  }
}

export default connect(
  (state) => ({
    uploadList: state.uploadList,
    role: state.role,
    username: state.username,
    containersPermission: state.containersPermission,
    successNum: state.successNum,
  }),
  {
    appendDownloadListCreator,
    setDownloadCommitting: fileActionSSEActions.setDownloadCommitting,
  },
)(RawTable);

const getZone = (panelKey, role, sourceType, node) => {
  if (panelKey.includes('trash')) {
    if (sourceType === 'Folder') {
      if (node.nodeLabel.indexOf('Core') !== -1) {
        return 'Core';
      } else {
        return 'Greenroom';
      }
    } else {
      return 'All';
    }
  }
  if (panelKey.startsWith('greenroom')) {
    return 'Greenroom';
  }
  if (panelKey.startsWith('core')) {
    return 'Core';
  }
  if (checkIsVirtualFolder(panelKey)) {
    return 'Core';
  }
  throw new TypeError('only greenroom, core and trash can use getZone');
};

function resKeyConvert(res) {
  const total = res.data?.result?.approximateCount;
  const result = res.data?.result?.entities;
  const files = result.map((item) => {
    return {
      ...item.attributes,
      name: item.attributes.fileName || item.geid,
      tags: item.labels,
      guid: item.guid,
      geid: item.geid,
      key: item.attributes.fileName || item.geid,
      manifest: item.manifest,
    };
  });
  return { files, total };
}

const mapColumnKey = (column) => {
  const columnMap = {
    createTime: 'created_time',
    fileName: 'name',
    owner: 'owner',
    fileSize: 'size',
    lastUpdatedTime: 'last_updated_time',
  };
  return columnMap[column] || column;
};

const mapQueryKeys = (query) => {
  let newQuery = {};
  Object.keys(query).forEach((oldKey) => {
    newQuery[mapColumnKey(oldKey)] = query[oldKey];
  });
  return newQuery;
};
