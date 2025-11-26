/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, message, Button, Tooltip } from 'antd';
import styles from './index.module.scss';
import SchemasTabContents from './SchemasTabContents';
import OpenMindsSchemaTabContents from './openMindsSchemasTabContents';
import UploadSchemaModal from './UploadSchemaModal/UploadSchemaModal';
import DownloadSchemaModal from './DownloadSchemaModal/DownloadSchemaModal';
import DeleteSchemaModal from './DeleteSchemaModal/DeleteSchemaModal';
import SyncSchemaModal from './SyncSchemaModal/SyncSchemaModal';
import {
  deleteDatasetSchemaData,
  getDatasetSchemaListAPI,
  getKGMetaListAPI,
  transferMetaToKG,
  refreshMetaFromKG,
} from '../../../../../APIs';
import {
  DeleteOutlined,
  EyeOutlined,
  ToTopOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { ESSENTIAL_SCHEMA_NAME } from '../../GlobalDefinition';
import { schemaTemplatesActions } from '../../../../../Redux/actions';
import { useTranslation } from 'react-i18next';
import { isJson } from '../../../../../Utility/common';

const { TabPane } = Tabs;

export function ExistingSchemaContents(props) {
  const [schemaGeid, setSchemaGeid] = useState('');
  const [currentItem, setCurrentItem] = useState(null);
  const [currentMetaItem, setCurrentMetaItem] = useState(null);
  const [modalUploadVisibility, setModalUploadVisibility] = useState(false);
  const [modalDownloadVisibility, setModalDownloadVisibility] = useState(false);
  const [modalDeleteVisibility, setModalDeleteVisibility] = useState(false);
  const [modalSyncVisibility, setModalSyncVisibility] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const datasetInfo = useSelector((state) => state.datasetInfo.basicInfo);
  const schemas = useSelector((state) => state.schemaTemplatesInfo.schemas);
  const kgSchemaMeta = useSelector(
    (state) => state.schemaTemplatesInfo.kgSchemaMeta,
  );
  const { spaceBind } = useSelector((state) => state.kgSpaceList);
  const defaultPanes = useSelector(
    (state) => state.schemaTemplatesInfo.defaultPanes,
  );
  const schemasTPLs = useSelector(
    (state) => state.schemaTemplatesInfo.schemaTPLs,
  );
  const defaultSchemaActiveKey = useSelector(
    (state) => state.schemaTemplatesInfo.defaultSchemaActiveKey,
  );
  const templateManagerMode = useSelector(
    (state) => state.schemaTemplatesInfo.templateManagerMode,
  );
  const dispatch = useDispatch();
  const { username } = useSelector((state) => state);
  const { t } = useTranslation(['errormessages', 'success']);

  useEffect(() => {
    setSchemaGeid(defaultSchemaActiveKey);
  }, [defaultSchemaActiveKey]);

  const openMindsSchema = schemas.filter(
        (v) => v.standard === 'open_minds',
      );
  const schemaIds = openMindsSchema.map((v) => {
        return {
          id: v.geid,
        };
      });

  const handleTransferKG = async (item) => {
    try {
      const spaceId = spaceBind.name;
      const selSchema = schemas.find((s) => s.geid === item.geid);
      if (spaceId) {
        if (!selSchema.content['@type']) {
          message.error(t('errormessages:transferToKG.type.0'));
          return;
        }
        await transferMetaToKG(spaceId, item.geid, datasetInfo.geid, username, item.name, selSchema.content);
      }
    } catch (e) {
      if (e.response?.data?.error?.details) {
        try {
          const responseErr = JSON.parse(e.response?.data?.error?.details);
          if (isJson(responseErr.error.details)) {
            const errContent = JSON.parse(responseErr.error.details);
            message.error(errContent?.error?.message);
          } else {
            message.error(responseErr.error.details);
          }
        } catch (e) {
          message.error(t('errormessages:transferToKG.default.0'));
        }
      } else {
        message.error(t('errormessages:transferToKG.default.0'));
      }

      return;
    }
    try {
      const resMeta = await getKGMetaListAPI(schemaIds);
      dispatch(
        schemaTemplatesActions.updateKgSchemaMetaList(resMeta.data.metadata),
      );
    } catch (error) {
      message.error(t('errormessages:kgSchemaMetaList.default.0'));
    }
  };

  const handleRefreshSchema = async (item) => {
    try {
      await refreshMetaFromKG(item.geid, username);
      message.success(t('success:refreshFromKG.default.0'));
      const resMeta = await getKGMetaListAPI(schemaIds);
      dispatch(
        schemaTemplatesActions.updateKgSchemaMetaList(resMeta.data.metadata),
      );
    } catch (error) {
      message.error(t('errormessages:refreshFromKG.default.0'));
    }
  };

  const handleEditSchema = (item) => {
    if (item.standard === 'open_minds') {
      dispatch(schemaTemplatesActions.setPreviewSchemaGeid(item.geid));
    } else {
      const schemaTPL = schemasTPLs.find((tpl) => tpl.geid === item.tplGeid);
      dispatch(
        schemaTemplatesActions.addDefaultOpenTab({
          title: schemaTPL.name,
          key: item.geid,
          tplKey: schemaTPL.geid,
          systemDefined: item.systemDefined,
          standard: item.standard,
        }),
      );
      dispatch(schemaTemplatesActions.setDefaultActiveKey(schemaTPL.geid));
    }
  };

  const handleOnClick = (item) => {
    if (!defaultSchemaActiveKey) {
      setSchemaGeid(item.geid);
    } else {
      setSchemaGeid(item.geid);
    }
  };

  const getDatasetSchemaList = async () => {
    try {
      const res = await getDatasetSchemaListAPI(datasetInfo.geid);
      dispatch(schemaTemplatesActions.updateDefaultSchemaList(res.data.result));
    } catch (error) {
      message.error(t('errormessages:datasetSchemaList.default.0'));
    }
  };

  const deleteSchema = async (item, datasetGeid) => {
    setDelLoading(true);
    try {
      await deleteDatasetSchemaData(
        datasetGeid,
        item.geid,
        item.name,
      );
      await getDatasetSchemaList();
      dispatch(schemaTemplatesActions.removeDefaultOpenTab(item.tplGeid));
      let newActiveKey;
      const newPanes = defaultPanes.filter((el) => el.key !== item.geid);
      if (newPanes.length === 0) {
        newActiveKey = '';
      } else {
        newActiveKey = newPanes[0].tplKey;
      }
      dispatch(schemaTemplatesActions.setDefaultActiveKey(newActiveKey));
    } catch (e) {}

    setDelLoading(false);
  };

    const deleteSchemaChoice = async (item) => {
      const kgMetaItem = kgSchemaMeta
                  .sort((a, b) => {
                    return new Date(b.uploadedAt) - new Date(a.uploadedAt);
                  })
                  .find((v) => v.metadataId === item.geid);
      setCurrentMetaItem(kgMetaItem);
      setCurrentItem(item);
      kgMetaItem ? setModalDeleteVisibility(true) : await deleteSchema(item, datasetInfo.geid);
  };

  const schemaActionButtons = (item) => (
    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
      {spaceBind && item.standard === 'open_minds' ? (
        <Tooltip title="Update from KG Space">
          <Button
            icon={<DownloadOutlined />}
            style={{ border: '0px', backgroundColor: '#E6F5FF' }}
            onClick={() => handleRefreshSchema(item)}
          />
        </Tooltip>
      ) : null}
      {spaceBind && item.standard === 'open_minds' ? (
        <Tooltip title="Transfer To KG Space">
          <Button
            icon={<ToTopOutlined />}
            style={{ border: '0px', backgroundColor: '#E6F5FF' }}
            onClick={() => handleTransferKG(item)}
          />
        </Tooltip>
      ) : null}
      <Tooltip title="View">
        <Button
          icon={<EyeOutlined />}
          style={{ border: '0px', backgroundColor: '#E6F5FF' }}
          disabled={templateManagerMode !== 'hide'}
          onClick={() => handleEditSchema(item)}
        />
      </Tooltip>
      {item.name === ESSENTIAL_SCHEMA_NAME ? (
        <div style={{ marginRight: '15px' }}></div>
      ) : (
        <Tooltip title="Delete">
          <Button
            icon={<DeleteOutlined />}
            loading={delLoading}
            onClick={(e) => {
              deleteSchemaChoice(item);
            }}
            style={{
              border: '0px',
              backgroundColor: '#E6F5FF',
              marginRight: '15px',
            }}
          />
        </Tooltip>
      )}
    </div>
  );

  const tabContentStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '44px',
    borderBottom: '1px solid #0000001A',
    cursor: 'pointer',
  };

  const schemasTabTitle = (
    <div>
      <p style={{ fontWeight: '600', color: '#222222', margin: '0px' }}>
        Default Schemas
      </p>
    </div>
  );

  const openMindsSchemasTabTitle = (
    <div>
      <p style={{ fontWeight: '600', color: '#222222', margin: '0px' }}>
        openMINDS Instances
      </p>
    </div>
  );

  const onTabSelChange = (activeKey) => {
    dispatch(schemaTemplatesActions.setSchemaTypes(activeKey));
  };
  return (
    <div
      style={{ height: '100%', position: 'relative' }}
      className={styles['tabs']}
    >
      <Tabs tabPosition={'left'} onChange={onTabSelChange}>
        <TabPane tab={schemasTabTitle} key="Default">
          <SchemasTabContents
            setSchemaGeid={setSchemaGeid}
            schemaGeid={schemaGeid}
            schemas={schemas}
            handleOnClick={handleOnClick}
            schemaActionButtons={schemaActionButtons}
            tabContentStyle={tabContentStyle}
          />
        </TabPane>
        <TabPane tab={openMindsSchemasTabTitle} key="OpenMinds">
          <OpenMindsSchemaTabContents
            setModalUploadVisibility={setModalUploadVisibility}
            setModalDownloadVisibility={setModalDownloadVisibility}
            setModalSyncVisibility={setModalSyncVisibility}
            schemaGeid={schemaGeid}
            schemas={schemas}
            kgSchemaMeta={kgSchemaMeta}
            handleOnClick={handleOnClick}
            schemaActionButtons={schemaActionButtons}
            tabContentStyle={tabContentStyle}
          />
        </TabPane>
      </Tabs>
      <UploadSchemaModal
        visibility={modalUploadVisibility}
        setModalUploadVisibility={setModalUploadVisibility}
      />
      <DownloadSchemaModal
        visibility={modalDownloadVisibility}
        setModalDownloadVisibility={setModalDownloadVisibility}
        schemaIds={schemaIds}
      />
      <SyncSchemaModal
        visibility={modalSyncVisibility}
        setModalSyncVisibility={setModalSyncVisibility}
        schemaIds={schemaIds}
      />
      <DeleteSchemaModal
        visibility={modalDeleteVisibility}
        setModalDeleteVisibility={setModalDeleteVisibility}
        schemaIds={schemaIds}
        datasetGeid={datasetInfo.geid}
        item={currentItem}
        metaItem={currentMetaItem}
        deleteSchema={deleteSchema}
      />
    </div>
  );
}
