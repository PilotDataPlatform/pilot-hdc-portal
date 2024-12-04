/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Modal, Button, Select, Tooltip, Form, message, Checkbox } from 'antd';
import {
  ArrowRightOutlined,
  ExclamationCircleOutlined,
  FileOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import { useKeycloak } from '@react-keycloak/web';
import { capitalize } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { datasetFileOperationsCreators } from '../../../../../../../Redux/actions';
import styles from './index.module.scss';
import { addToDatasetsAPI } from '../../../../../../../APIs';
import { fetchMyDatasets } from '../../../../../../DatasetLandingPage/Components/MyDatasetList/fetchMyDatasets';
import i18n from '../../../../../../../i18n';
import variables from '../../../../../../../Themes/constants.scss';
import { tokenManager } from '../../../../../../../Service/tokenManager';
import { JOB_STATUS } from '../../../../../../../Components/Layout/FilePanel/jobStatus';
import { getProjectsWithAdminRole } from '../../../../../../../Utility/userProjects';

const { Option } = Select;

const DatasetsModal = (props) => {
  const { visible, setVisible, selectedRows } = props;
  const [BtnLoading, setBtnLoading] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState({});
  const [validateSelect, setValidateSelect] = useState(true);
  let [showOnlyMineDatasets, setShowOnlyMineDatasets] = useState(true);
  const [skippedFiles, setSkippedFiles] = useState([]);
  const [modalContentStep, setModalContentStep] = useState(1);
  const [form] = Form.useForm();
  const { keycloak } = useKeycloak();
  const userName = useSelector((state) => state.username);
  const currentProject = useSelector((state) => state.project);
  const { datasetList, datasetLoading } = useSelector((state) => ({
    datasetList: state.myDatasetList.datasets,
    datasetLoading: state.myDatasetList.loading,
  }));
  const dispatch = useDispatch();
  const currentProjectCode = currentProject.profile.code;

  const closeModal = () => {
    setVisible(false);
    setSelectedDataset({});
    setValidateSelect(true);
    setBtnLoading(false);
    setModalContentStep(1);
    form.resetFields(['datasetsSelection']);
  };

  useEffect(() => {
    if (visible) {
      const creator = showOnlyMineDatasets ? userName : null;
      fetchMyDatasets(creator, currentProjectCode, 1, 10000);
    }
  }, [visible, showOnlyMineDatasets, userName, currentProjectCode]);

  const addToDatasets = async () => {
    if (!Object.keys(selectedDataset).length) {
      setValidateSelect(false);
      return;
    }
    try {
      let payLoad = {};
      payLoad['source_list'] =
        selectedRows.length && selectedRows.map((el) => el.id || el.geid);
      payLoad['operator'] = userName;
      payLoad['project_geid'] = currentProject.profile.id;
      setBtnLoading(true);

      const sessionId = tokenManager.getLocalCookie('sessionId');
      const { datasetGeid, datasetCode } = selectedDataset;
      const res = await addToDatasetsAPI(datasetGeid, payLoad, sessionId);

      if (res.data.result.ignored.length) {
        setSkippedFiles(res.data.result.ignored);
        setBtnLoading(false);
        setModalContentStep(2);
      } else {
        res.data.result.processing.forEach((currentImport) => {
          dispatch(
            datasetFileOperationsCreators.setImport({
              globalEntityId: currentImport.id,
              datasetCode,
              name: currentImport.name,
              fileSize: currentImport.size,
              labels: ['Core', capitalize(currentImport.type)],
              operator: userName,
              status: JOB_STATUS.WAITING,
            }),
          );
        });

        message.success(`${i18n.t('success:addToDataset')}`);
        setBtnLoading(false);
        closeModal();
      }
    } catch (error) {
      if (error.message === 'Request failed with status code 403') {
        message.warning(`${i18n.t('errormessages:addToDataset.403.0')}`, 3);
        setBtnLoading(false);
      } else {
        message.error(`${i18n.t('errormessages:addToDataset.default.0')}`, 3);
        setBtnLoading(false);
      }
    }
  };

  const handleSelectChange = (value, option) => {
    const title = option.children.props
      ? option.children.props.title
      : option.children;
    const datasetCode = title.split('-')[0].trim();
    setSelectedDataset({ datasetGeid: value, datasetCode });
    setValidateSelect(true);
  };

  const modalFooters = (modalContentStep) => {
    switch (modalContentStep) {
      case 1:
        return (
          <Button
            type='primary'
            loading={BtnLoading}
            style={{ width: '180px', height: '30px', borderRadius: '6px' }}
            onClick={addToDatasets}
          >
            <ArrowRightOutlined /> Add to Dataset
          </Button>
        );
      case 2:
        return (
          <div>
            <Button
              type='primary'
              style={{ borderRadius: '6px' }}
              onClick={closeModal}
            >
              OK
            </Button>
          </div>
        );
    }
  };

  const userProjectsWithAdminRole = getProjectsWithAdminRole(keycloak?.tokenParsed);
  const isShowOnlyMineCheckboxAvailable = userProjectsWithAdminRole.length > 0;

  return (
    <Modal
      className={styles.dataset_modal}
      title={
        <p style={{ margin: '0px', color: variables.primaryColor1 }}>
          Add to Datasets
        </p>
      }
      visible={visible}
      centered={true}
      maskClosable={false}
      footer={[modalFooters(modalContentStep)]}
      onCancel={closeModal}
    >
      {modalContentStep === 1 && (
        <div>
          <p style={{ margin: '0px 0px 5px 0px', fontWeight: 'bold' }}>
            Select Dataset:
            {!validateSelect ? (
              <span
                style={{
                  marginLeft: '10px',
                  color: '#FF6D72',
                  fontStyle: 'italic',
                }}
              >
                *Please select a dataset
              </span>
            ) : null}
          </p>
          {isShowOnlyMineCheckboxAvailable ? (
            <p>
              <Checkbox
                defaultChecked={showOnlyMineDatasets}
                onChange={(e) => {
                  showOnlyMineDatasets = e.target.checked;
                  setShowOnlyMineDatasets(showOnlyMineDatasets);
                  const creator = showOnlyMineDatasets ? userName : null;
                  fetchMyDatasets(creator, currentProjectCode, 1, 10000);
                }}
              >
                Show only the Datasets I've created
              </Checkbox>
            </p>
          ) : null}
          <Form form={form}>
            <Form.Item name='datasetsSelection'>
              <Select
                className={styles.dateset_select}
                placeholder='Select Dataset'
                onChange={handleSelectChange}
                loading={datasetLoading}
              >
                {datasetList.length &&
                  datasetList.map((el) => {
                    const optText = `${el.code} - ${el.title}`;
                    return (
                      <Option key={el.globalEntityId} value={el.globalEntityId}>
                        {optText.length > 60 ? (
                          <Tooltip title={optText}>{`${optText.slice(
                            0,
                            60,
                          )}...`}</Tooltip>
                        ) : (
                          optText
                        )}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Form>
        </div>
      )}
      {modalContentStep === 2 && (
        <div style={{ display: 'flex' }}>
          <div style={{ width: '22px', margin: '0px 5px' }}>
            <ExclamationCircleOutlined
              style={{ color: variables.primaryColor5 }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ marginBottom: '5px' }}>
              The following file/folder already exist, will be skipped:
            </p>
            <ul
              style={{
                maxHeight: 70,
                overflowY: 'auto',
                paddingLeft: '10px',
                margin: '0px',
              }}
            >
              {skippedFiles &&
                skippedFiles.map((el, index) => (
                  <li
                    key={index}
                    style={{
                      fontWeight: 600,
                      maxWidth: '320px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {el.type === 'file' ? (
                      <FileOutlined style={{ marginRight: '5px' }} />
                    ) : (
                      <FolderOutlined style={{ marginRight: '5px' }} />
                    )}
                    {el.name.length > 40 ? (
                      <Tooltip title={el.name}>{`${el.name.slice(
                        0,
                        40,
                      )}...`}</Tooltip>
                    ) : (
                      el.name
                    )}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DatasetsModal;
