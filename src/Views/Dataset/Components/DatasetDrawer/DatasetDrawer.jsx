/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Button, Drawer, Input, Modal, Table, Form, message } from 'antd';
import {
  getDatasetVersionsAPI,
  datasetDownloadReturnURLAPI,
  createDatasetSharingRequest,
} from '../../../../APIs';
import { useDispatch, useSelector } from 'react-redux';
import { DownloadOutlined, ExportOutlined } from '@ant-design/icons';
import { timeConvert } from '../../../../Utility';
import styles from './DatasetDrawer.module.scss';
import { namespace, ErrorMessager } from '../../../../ErrorMessages';
import variables from '../../../../Themes/constants.scss';
import _ from 'lodash';

const DatasetDrawer = ({ datasetDrawerVisibility, setDatasetDrawerVisibility }) => {
  const [isShareDatasetModalOpen, setIsShareDatasetModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItem, setTotalItem] = useState(0);
  const [datasetVersions, setDatasetVersions] = useState(0);
  const [sharingVersion, setSharingVersion] = useState();
  const { basicInfo, currentVersion, projectCode } = useSelector((state) => state.datasetInfo);
  const { containersPermission } = useSelector((state) => state);
  const currentProject = _.find(containersPermission, (item) => {
    return item.code === projectCode;
  });
  const isProjectAdmin = currentProject && currentProject.permission === 'admin';

  const downloadDataset = async (version) => {
    try {
      const res = await datasetDownloadReturnURLAPI(basicInfo.geid, version);
      if (res.data?.result?.source) {
        window.open(res.data.result.source, '_blank');
      }
    } catch (err) {
      if (err.response) {
        const errorMessager = new ErrorMessager(
          namespace.dataset.files.downloadFilesAPI,
        );
        errorMessager.triggerMsg(err.response.status);
      }
      return;
    }
  };

  const showShareDatasetModal = (datasetVersionId) => {
    setSharingVersion(datasetVersionId);
    setIsShareDatasetModalOpen(true);
  };

  const [shareDatasetForm] = Form.useForm();

  const submitShareDatasetModal = () => {
    shareDatasetForm
      .validateFields()
      .then((values) => createDatasetSharingRequest(sharingVersion, values.projectCode))
      .then(() => {
        setIsShareDatasetModalOpen(false);
        shareDatasetForm.resetFields();
        message.success('Dataset Version Sharing Request has been created.');
      })
      .catch((err) => {
        if (err.errorFields && err.errorFields.length > 0) return;

        if (err.response) {
          switch (err.response.status) {
            case 403: return message.error('No access to the source project.')
            case 404: return message.error('Project with such code is not found.')
            case 409: return message.error('Sharing of dataset version is not permitted within the same project.')
          }
        }
        return message.error('Unable to create a Dataset Version Sharing Request.');
      });
  };

  const cancelShareDatasetModel = () => {
    setIsShareDatasetModalOpen(false);
  };

  const columns = [
    {
      title: '',
      key: 'content',
      width: '80%',
      render: (item) => {
        return (
          <div
            style={
              Number(item.version) % 1 === 0
                ? {
                  display: 'flex',
                  padding: '24px',
                  backgroundColor: '#F0F0F0',
                }
                : {
                  display: 'flex',
                  padding: '24px',
                }
            }
          >
            <div
              style={{ marginTop: '-2px', marginRight: '3px', width: '35px' }}
            >
              <p
                style={{
                  margin: '0px',
                  fontSize: '16px',
                  color: variables.primaryColor1,
                  fontWeight: 'bold',
                }}
              >
                {item.version}
              </p>
            </div>
            <div style={{ width: '250px', marginRight: '30px' }}>
              <p style={{ margin: '0px' }}>
                <span style={{ marginRight: '3px' }}>-</span>
                {`${timeConvert(item.createdAt, 'datetime')} by ${
                  item.createdBy
                }`}
              </p>
              <p style={{ margin: '0px' }}>{item.notes}</p>
            </div>
            <div style={{ flex: '1', alignSelf: 'center' }}>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => {
                  downloadDataset(item.version);
                }}
                block
              >
                Download
              </Button>
              {isProjectAdmin ? (
                <>
                  <Button
                    icon={<ExportOutlined />}
                    onClick={() => {
                      showShareDatasetModal(item.id);
                    }}
                    block
                  >
                    Share
                  </Button>
                  <Modal
                    title='Creating a Dataset Version Sharing Request'
                    open={isShareDatasetModalOpen}
                    okText='Send'
                    cancelText='Cancel'
                    onCancel={cancelShareDatasetModel}
                    onOk={submitShareDatasetModal}
                  >
                    <Form form={shareDatasetForm} layout='vertical'>
                      <Form.Item
                        label='Project Code'
                        name='projectCode'
                        rules={[{ required: true, message: 'Please input the project code!' }]}
                      >
                        <Input placeholder='Enter a project code' />
                      </Form.Item>
                    </Form>
                  </Modal>
                </>
              ) : null}
            </div>
          </div>
        );
      },
    },
  ];

  const getDatasetVersions = async () => {
    const params = {
      page: currentPage - 1,
      page_size: pageSize,
      sort_order: 'desc',
      sort_by: 'created_at',
    };
    const res = await getDatasetVersionsAPI(basicInfo.geid, params);
    setDatasetVersions(res.data.result);
    setTotalItem(res.data.total);
  };

  useEffect(() => {
    if (datasetDrawerVisibility) {
      getDatasetVersions();
    }
  }, [
    basicInfo.geid,
    currentPage,
    currentVersion,
    pageSize,
    datasetDrawerVisibility,
  ]);

  const onTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <Drawer
      className={styles.dataset_drawer}
      title={
        <p
          style={{
            margin: '0px',
            fontSize: '16px',
            color: variables.primaryColor1,
          }}
        >
          Versions
        </p>
      }
      placement={'right'}
      closable={true}
      onClose={() => setDatasetDrawerVisibility(false)}
      visible={datasetDrawerVisibility}
      mask={false}
      key={'right'}
    >
      <Table
        className={styles.drawer_content_table}
        columns={columns}
        dataSource={datasetVersions}
        onChange={onTableChange}
        pagination={{
          current: currentPage,
          pageSize,
          total: totalItem,
          pageSizeOptions: [10, 20, 50],
          showSizeChanger: true,
        }}
        size='middle'
      />
    </Drawer>
  );
};

export default DatasetDrawer;
