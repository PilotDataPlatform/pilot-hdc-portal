/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, message, Button, Tooltip } from 'antd';
import styles from './index.module.scss';
import SchemasTabContents from './SchemasTabContents';
import OpenMindsSchemaTabContents from './openMindsSchemasTabContents';
import UploadSchemaModal from './UploadSchemaModal/UploadSchemaModal';
import {
  deleteDatasetSchemaData,
  getDatasetSchemaListAPI,
  getKGMetaListAPI,
  transferMetaToKG,
} from '../../../../../APIs';
import {
  DeleteOutlined,
  FileOutlined,
  EyeOutlined,
  ToTopOutlined,
} from '@ant-design/icons';
import { ESSENTIAL_SCHEMA_NAME } from '../../GlobalDefinition';
import { schemaTemplatesActions } from '../../../../../Redux/actions';
import { useTranslation } from 'react-i18next';
import { PLATFORM } from '../../../../../config';
import { isJson } from '../../../../../Utility/common';

const { TabPane } = Tabs;

export function ExistingSchemaContents(props) {
  const [schemaGeid, setSchemaGeid] = useState('');
  const [modalVisibility, setModalVisibility] = useState(false);
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
  const { t } = useTranslation(['errormessages', 'success']);

  useEffect(() => {
    setSchemaGeid(defaultSchemaActiveKey);
  }, [defaultSchemaActiveKey]);

  const handleTransferKG = async (item) => {
    try {
      const spaceId = spaceBind.name;
      const selSchema = schemas.find((s) => s.geid === item.geid);
      if (spaceId) {
        if (!selSchema.content['@type']) {
          message.error(t('errormessages:transferToKG.type.0'));
          return;
        }
        await transferMetaToKG(spaceId, item.geid, selSchema.content);
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
      const openMindsSchema = schemas.filter(
        (v) => v.standard === 'open_minds',
      );
      const schemaIds = openMindsSchema.map((v) => {
        return {
          id: v.geid,
        };
      });
      const resMeta = await getKGMetaListAPI(schemaIds);
      dispatch(
        schemaTemplatesActions.updateKgSchemaMetaList(resMeta.data.metadata),
      );
    } catch (error) {
      message.error(t('errormessages:kgSchemaMetaList.default.0'));
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

  const deleteSchema = async (item) => {
    setDelLoading(true);
    try {
      const res = await deleteDatasetSchemaData(
        datasetInfo.geid,
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

  const schemaActionButtons = (item) => (
    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
      {spaceBind ? (
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
              deleteSchema(item);
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
        openMINDS Schemas
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
            setModalVisibility={setModalVisibility}
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
        visibility={modalVisibility}
        setModalVisibility={setModalVisibility}
      />
    </div>
  );
}
