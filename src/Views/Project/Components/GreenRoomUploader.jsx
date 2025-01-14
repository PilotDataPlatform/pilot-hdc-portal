/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  Upload,
  Spin,
  message,
  Dropdown,
  Menu,
  Tooltip,
} from 'antd';
import {
  FolderOutlined,
  DownloadOutlined,
  FileImageOutlined,
  DownOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import {
  uploadStarter,
  useCurrentProject,
  getProjectRolePermission,
  permissionResource,
  permissionOperation,
} from '../../../Utility';
import { withRouter } from 'react-router-dom';
import { connect, useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { UploadQueueContext } from '../../../Context';
import { getProjectManifestList } from '../../../APIs';
import { validateTag } from '../../../Utility';
import { useTranslation } from 'react-i18next';
import UploaderManifest from './UploaderManifest';
import { validateForm } from '../../../Components/Form/Manifest/FormValidate';
import styles from './index.module.scss';
import { UploadFolder } from '../../../Components/Input';
import { setPanelVisibility } from '../../../Redux/actions';
const { Option } = Select;

const GreenRoomUploader = ({
  isShown: visible,
  cancel,
  fetch: fetchTree,
  panelKey,
  dispatchTriggerEvent,
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsloading] = useState(false);
  const [data, setData] = useState([]);
  const [value, setValue] = useState([]);
  const [fetching, setFetching] = useState(false);
  const { t } = useTranslation([
    'tooltips',
    'formErrorMessages',
    'errormessages',
  ]);
  const q = useContext(UploadQueueContext);
  const [currentDataset = {}] = useCurrentProject();
  const { username } = useSelector((state) => state);
  const project = useSelector((state) => state.project);
  const [manifestList, setManifestList] = useState([]);
  const [attrForm, setAttrForm] = useState({});
  const [selManifest, setSelManifest] = useState(null);
  const folderRef = useRef(null);
  const fileRef = useRef(null);
  const [isFiles, setIsFiles] = useState(false);
  const dispatch = useDispatch();
  const folderRouting = useSelector(
    (state) => state.fileExplorer && state.fileExplorer.folderRouting,
  );

  const [mode, setMode] = useState(null);
  const currentRouting =
    folderRouting[panelKey] &&
    folderRouting[panelKey].filter((r) => typeof r.folderLevel !== 'undefined');

  useEffect(() => {
    async function loadManifest() {
      const manifests = await getProjectManifestList(currentDataset.code);
      const rawManifests = manifests.data.result;
      setManifestList(rawManifests);
    }
    if (visible && currentDataset.code) {
      loadManifest();
    }
  }, [currentDataset.code, visible]);
  const containersPermission = useSelector(
    (state) => state.containersPermission,
  );

  const handleOk = () => {
    if (selManifest && isFiles) {
      const { valid, err } = validateForm(attrForm, selManifest);
      if (!valid) {
        message.error(err);
        return;
      }
    }

    form
      .validateFields()
      .then((values) => {
        setIsloading(true);

        let jobType = values.file ? 'AS_FILE' : 'AS_FOLDER';
        let fileList = values.file
          ? values.file.fileList
          : values.folder.fileList;
        fileList = _.cloneDeep(fileList);
        const filesWithZeroSize = fileList.filter((file) => file.size === 0);
        fileList = fileList.filter((file) => file.size > 0);

        if (filesWithZeroSize?.length) {
          for (let file of filesWithZeroSize) {
            message.error(
              `${file.name} ${t('errormessages:preUpload.emptyFile.0')}`,
            );
          }
        }

        let folderPath = null;
        let parentFolderId = null;
        if (currentRouting?.length) {
          const sortedRouting = currentRouting.sort((a, b) => {
            return a.folderLevel - b.folderLevel;
          });
          const folderNames = sortedRouting.map((v) => v.name);
          folderPath = folderNames.join('/');
          parentFolderId =
            sortedRouting[sortedRouting.length - 1].globalEntityId;
        }
        const data = Object.assign({}, values, {
          uploader: username,
          projectName: currentDataset.name,
          projectCode: currentDataset.code,
          fileList,
          jobType,
          folderPath,
          parentFolderId,
          manifest: selManifest
            ? {
                id: selManifest.id,
                attributes: attrForm,
              }
            : null,
        });

        if (fileList.length) {
          uploadStarter(data, q);
        }

        setSelManifest(null);
        form.resetFields();
        setIsFiles(false);
        cancel();
        setAttrForm({});
        setIsloading(false);
        dispatch(setPanelVisibility(true));
      })
      .catch((err) => {
        setIsloading(false);
      });
  };

  const props = {
    beforeUpload() {
      return false;
    },
  };

  function getCurrentFolder() {
    const folderNames = currentRouting
      .sort((a, b) => {
        return a.folderLevel - b.folderLevel;
      })
      .map((v) => v.name);
    const path = folderNames.join(' / ');
    if (path.length > 32) {
      let shortPath = '';
      for (let i = folderNames.length - 1; i >= 0; i--) {
        if (i === folderNames.length - 1 && folderNames[i].length > 27) {
          const shortenName = folderNames[i].slice(
            folderNames[i].length - 25,
            folderNames[i].length,
          );
          return (
            <Tooltip title={path}>
              {'Green Room / ... / ' + shortenName + '...'}
            </Tooltip>
          );
        }
        if ((folderNames[i] + ' / ' + shortPath).length > 30) {
          return (
            <Tooltip title={path}>{'Green Room / ... / ' + shortPath}</Tooltip>
          );
        }
        if (i === folderNames.length - 1) {
          shortPath = folderNames[i];
        } else {
          shortPath = folderNames[i] + ' / ' + shortPath;
        }
      }
      return <Tooltip title={path}>{'Green Room / ' + shortPath}</Tooltip>;
    } else {
      return 'Green Room / ' + path;
    }
  }
  const showTags = () => {
    const PermAnyFile = getProjectRolePermission(currentDataset.permission, {
      zone: panelKey,
      resource: permissionResource.anyFile,
      operation: permissionOperation.annotate,
    });
    if (PermAnyFile) {
      return true;
    } else {
      if (currentRouting != null) {
        if (currentRouting.length >= 1 && currentRouting[0].name === username) {
          return getProjectRolePermission(currentDataset.permission, {
            zone: panelKey,
            resource: permissionResource.ownFile,
            operation: permissionOperation.annotate,
          });
        }
      } else {
        return false;
      }
    }
  };
  const menu = (
    <Menu>
      <Menu.Item className={styles.uploadDropDown} key="1">
        <Button
          onClick={() => {
            fileRef.current.click();
            setMode('files');
          }}
        >
          <FileImageOutlined />
          Select Files
        </Button>
      </Menu.Item>
      <Menu.Item className={styles.uploadDropDown} key="2">
        <Button
          onClick={() => {
            folderRef.current.click();
            setMode('folder');
            setSelManifest(null);
            setAttrForm({});
          }}
          id="form_in_modal_select_file"
        >
          <FolderOutlined />
          Select Folder
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Modal
        visible={visible}
        title="Upload Files"
        onOk={handleOk}
        maskClosable={false}
        closable={false}
        onCancel={() => {
          cancel();
          setAttrForm({});
          setSelManifest(null);
          form.resetFields();
        }}
        className={styles.uploadModal}
        footer={[
          <Button
            className={styles.cancelButton}
            key="back"
            onClick={() => {
              cancel();
              setAttrForm({});
              setSelManifest(null);
              form.resetFields();
            }}
            type="link"
          >
            Cancel
          </Button>,
          <Button
            className={styles.uploadButton}
            id="file_upload_submit_btn"
            key="submit"
            type="primary"
            loading={isLoading}
            onClick={handleOk}
            icon={<CloudUploadOutlined />}
          >
            Upload
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: 'public',
          }}
          className={styles.uploadFormItem}
        >
          <Form.Item
            name="dataset"
            label="Project"
            initialValue={currentDataset && currentDataset.id}
            rules={[
              {
                required: true,
                message: 'Please select a project',
              },
            ]}
          >
            <Select
              disabled
              onChange={(value) => {
                console.log(value);
              }}
              style={{ width: '100%' }}
              className={styles.inputBorder}
            >
              {containersPermission &&
                containersPermission.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Dropdown overlay={menu}>
                <Button className={styles.uploadSelector}>
                  <DownloadOutlined /> Select <DownOutlined />
                </Button>
              </Dropdown>
              {mode && currentRouting?.length ? (
                <div style={{ marginLeft: 18 }}>
                  <p style={{ fontSize: 14, lineHeight: '20px', margin: 0 }}>
                    Selected {mode === 'folder' ? 'folder' : 'files'} will be
                    uploaded to folder:
                  </p>
                  <p style={{ fontSize: 14, lineHeight: '20px', margin: 0 }}>
                    {getCurrentFolder()}
                  </p>
                </div>
              ) : null}
            </div>
            <Form.Item
              noStyle
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    const fileList = value && value.fileList;
                    if (!fileList) {
                      return Promise.resolve();
                    }
                    if (!fileList.length) {
                      return Promise.resolve();
                    }
                    if (
                      fileList.length ===
                      _.uniqBy(fileList, (item) => item.name).length
                    ) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        t('formErrorMessages:project.upload.file.valid'),
                      );
                    }
                  },
                }),
              ]}
              name="file"
            >
              <Upload
                onChange={(value) => {
                  form.resetFields(['folder']);
                  setIsFiles(Boolean(value?.fileList?.length));
                }}
                multiple
                {...props}
              >
                <Button ref={fileRef}></Button>
              </Upload>
            </Form.Item>

            <Form.Item
              noStyle
              name="folder"
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    const fileFormItem = getFieldValue('file');
                    const fileList = value && value.fileList;
                    if (!(fileFormItem?.fileList?.length || fileList?.length)) {
                      return Promise.reject(
                        t('formErrorMessages:project.upload.file.empty'),
                      );
                    } else {
                      if (mode === 'folder') {
                        const folderName =
                          fileList[0].originFileObj.webkitRelativePath.split(
                            '/',
                          )[0];
                        if (!currentRouting || currentRouting.length === 0) {
                          const reserved = ['raw', 'logs', 'trash', 'workdir'];
                          if (
                            reserved.indexOf(folderName.toLowerCase()) !== -1
                          ) {
                            return Promise.reject(
                              t(
                                'formErrorMessages:project.upload.file.reservedwords',
                              ),
                            );
                          }
                        }
                      }

                      return Promise.resolve();
                    }
                  },
                }),
              ]}
            >
              <UploadFolder
                onChange={(value) => {
                  form.resetFields(['file']);
                  if (value) {
                    setIsFiles(false);
                  } else {
                    form.resetFields(['folder']);
                  }
                }}
                multiple
                {...props}
                directory
              >
                <Button style={{ display: 'none' }} ref={folderRef}></Button>
              </UploadFolder>
            </Form.Item>
          </Form.Item>
          {isFiles && showTags() && (
            <Form.Item
              name="tags"
              label="Tags"
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value) {
                      return Promise.resolve();
                    }
                    if (value.length > 10) {
                      return Promise.reject(
                        t('formErrorMessages:project.upload.tags.limit'),
                      );
                    }
                    const systemTags = project.manifest.tags;
                    let i;
                    for (i of value) {
                      if (systemTags.indexOf(i) !== -1) {
                        return Promise.reject(
                          t('formErrorMessages:project.upload.tags.systemtags'),
                        );
                      }
                      if (!validateTag(i)) {
                        return Promise.reject(
                          t('formErrorMessages:project.upload.tags.valid'),
                        );
                      }
                    }
                    value = value.map((i) => i.toLowerCase());

                    value = [...new Set(value)];

                    setValue(value);
                    setData([]);
                    setFetching(false);
                    form.setFieldsValue({ tags: value });

                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Select
                className={styles.inputBorder}
                mode="tags"
                value={value}
                notFoundContent={fetching ? <Spin size="small" /> : null}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                style={{ width: '100%' }}
                rendervalue={(selected) =>
                  selected.map((el) => el.toLowerCase())
                }
                placeholder="Add tags"
              >
                {data.map((d) => (
                  <Option key={d.value}>{d.text.toLowerCase()}</Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form>
        {isFiles && showTags() && manifestList && manifestList.length ? (
          <UploaderManifest
            selManifest={selManifest}
            setSelManifest={setSelManifest}
            attrForm={attrForm}
            setAttrForm={setAttrForm}
            manifestList={manifestList}
          />
        ) : null}
      </Modal>
    </div>
  );
};

export default withRouter(
  connect((state) => {
    const { tags, containersPermission, uploadList } = state;
    return { tags, containersPermission, uploadList };
  })(GreenRoomUploader),
);
