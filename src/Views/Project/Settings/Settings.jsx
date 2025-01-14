/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { message, Tabs, Row, Col, Layout, Card, Button } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  withCurrentProject,
  trimString,
  objectKeysToSnakeCase,
  objectKeysToCamelCase,
} from '../../../Utility';
import styles from './index.module.scss';
import GeneralInfo from './Tabs/GeneralInfo/GeneralInfo';
import FileManifest from './Tabs/FileManifest/FileManifest';
import WorkBenchPage from './Tabs/WorkBenchPanel/WorkBenchPage';
import CanvasPageHeader from '../Canvas/PageHeader/CanvasPageHeader';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { setContainersPermissionCreator } from '../../../Redux/actions';
import {
  updateDatasetInfoAPI,
  getProjectInfoAPI,
  getAdminsOnDatasetAPI,
} from '../../../APIs';
const { Content } = Layout;
const { TabPane } = Tabs;
function Settings(props) {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { containersPermission } = useSelector((state) => state);
  const { t } = useTranslation(['formErrorMessages']);
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [userListOnDataset, setUserListOnDataset] = useState(null);
  const [activateKey, setActivateKey] = useState('general_info');
  let { projectCode } = useParams();
  const [datasetUpdate, setDatasetUpdate] = useState(null);
  const curProject = props.currentProject;

  const saveDatasetInfo = () => {
    setIsSaving(true);
    if (
      !datasetUpdate['name'] ||
      trimString(datasetUpdate['name']).length === 0
    ) {
      message.error(t('formErrorMessages:project.card.save.name.empty'));
      setIsSaving(false);
      return;
    }

    if (datasetUpdate['name'] && datasetUpdate['name'].length > 100) {
      message.error(t('formErrorMessages:project.card.save.name.valid'));
      setIsSaving(false);
      return;
    }

    const tags = datasetUpdate['tags'];
    let isTagContainSpace = false;
    isTagContainSpace = tags && tags.filter((el) => (el + '').includes(' '));
    if (isTagContainSpace && isTagContainSpace.length) {
      message.error({
        content: `${t('formErrorMessages:project.card.update.tags.space')}`,
        style: { marginTop: '20vh' },
        duration: 5,
      });
      setIsSaving(false);
      return;
    }

    let isTagError = tags && tags.some((el) => el.length > 32);
    if (isTagError) {
      message.error(`${t('formErrorMessages:project.card.save.tags.valid')}`);
      setIsSaving(false);
      return;
    }

    if (datasetUpdate['description']) {
      datasetUpdate['description'] = trimString(datasetUpdate['description']);
    }
    if (
      datasetUpdate['description'] &&
      datasetUpdate['description'].length > 250
    ) {
      message.error(t('formErrorMessages:project.card.save.description.valid'));
      setIsSaving(false);
      return;
    }

    let data2Update = {};

    for (const key in datasetUpdate) {
      if (
        ![
          'created_at',
          'createdAt',
          'updated_at',
          'updatedAt',
          'code',
          'id',
          'imageUrl',
          'image_url',
        ].includes(key)
      ) {
        data2Update[key] = datasetUpdate[key];
      }
    }
    const updateContainerPremission = async (containersPermission) => {
      dispatch(setContainersPermissionCreator(containersPermission));
    };
    updateDatasetInfoAPI(
      curProject.globalEntityId,
      objectKeysToSnakeCase(data2Update),
    ).then((res) => {
      let newDataInfo = res.data.result;
      const newContainerPermission = containersPermission.map((el) => {
        if (el.code === curProject.code) {
          return {
            ...el,
            name: newDataInfo.name,
          };
        }
        return el;
      });
      updateContainerPremission(newContainerPermission);
      data2Update['imageUrl'] = newDataInfo['imageUrl'];
      setDatasetInfo(data2Update);
      setTimeout(() => {
        setEditMode(false);
        setIsSaving(false);
      }, 500);
    });
  };

  useEffect(() => {
    async function loadProject() {
      const res = await getProjectInfoAPI(props.currentProject.globalEntityId);
      if (res.status === 200 && res.data && res.data.code === 200) {
        const currentDataset = res.data.result;
        setDatasetInfo(currentDataset);
        setDatasetUpdate(currentDataset);
      }
      const users = await getAdminsOnDatasetAPI(curProject.globalEntityId);
      setUserListOnDataset(objectKeysToCamelCase(users.data.result));
    }
    loadProject();
  }, [projectCode]);

  const updateDatasetInfo = (field, value) => {
    if (field === 'tags') {
      let isTagInvalid = true;

      isTagInvalid = value && value.some((el) => el.includes(' '));

      if (isTagInvalid) {
        message.error(t('formErrorMessages:project.card.update.tags.space'));
      }

      isTagInvalid = value && value.some((el) => el.length > 32);

      if (isTagInvalid) {
        message.error(t('formErrorMessages:project.card.update.tags.valid'));
      }
    }

    if (field === 'name') {
      let isNameInvalid = value.length > 100;
      if (isNameInvalid) {
        message.error(t('formErrorMessages:project.card.update.name.valid'));
      }
    }

    setDatasetUpdate({ ...datasetUpdate, [field]: value });
  };
  const tabBarExtraContent = editMode ? (
    <>
      <Button
        loading={isSaving}
        onClick={saveDatasetInfo}
        style={{ marginRight: 10 }}
        className={styles.button}
        type="primary"
        icon={<SaveOutlined />}
      >
        Save
      </Button>
      <Button
        onClick={() => {
          setEditMode(false);
          setDatasetUpdate({ ...datasetInfo });
        }}
        type="link"
      >
        Cancel
      </Button>
    </>
  ) : (
    <Button
      style={{ color: '#595959' }}
      onClick={() => {
        setEditMode(true);
      }}
      type="link"
      icon={<EditOutlined />}
    >
      Edit
    </Button>
  );
  return (
    <>
      <Content className={'content'}>
        <CanvasPageHeader />
        <Card className={styles.card_wrapper} style={{ marginTop: '1.8rem' }}>
          <Tabs
            activeKey={activateKey}
            onChange={(activateKey) => setActivateKey(activateKey)}
            tabBarExtraContent={
              activateKey === 'general_info' && tabBarExtraContent
            }
            renderTabBar={(props, DefaultTabBar) => {
              return (
                <DefaultTabBar
                  className={styles.tabHeader}
                  {...props}
                  style={{ paddingLeft: 16 }}
                />
              );
            }}
            className={styles.custom_tabs}
          >
            <TabPane tab="General Information" key="general_info">
              <div style={{ backgroundColor: 'white' }}>
                <GeneralInfo
                  userListOnDataset={userListOnDataset}
                  updateDatasetInfo={updateDatasetInfo}
                  saveDatasetInfo={saveDatasetInfo}
                  editMode={editMode}
                  datasetInfo={datasetInfo}
                  setEditMode={setEditMode}
                  datasetUpdate={datasetUpdate}
                  setDatasetInfo={setDatasetInfo}
                />
              </div>
            </TabPane>
            <TabPane tab="File Attributes" key="file_manifest">
              <div style={{ backgroundColor: 'white' }}>
                <FileManifest />
              </div>
            </TabPane>
            <TabPane tab="Workbench" key="work_bench">
              <div style={{ backgroundColor: 'white' }}>
                <WorkBenchPage />
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </Content>
    </>
  );
}
export default withCurrentProject(Settings);
