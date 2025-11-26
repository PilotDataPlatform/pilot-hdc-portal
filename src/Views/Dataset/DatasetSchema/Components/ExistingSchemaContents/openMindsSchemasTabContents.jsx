/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Button } from 'antd';
import { CloudUploadOutlined, CloudDownloadOutlined, CloudSyncOutlined } from '@ant-design/icons';
import { FileOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
import { timeConvertWithOffestValue } from '../../../../../Utility';
import { useSelector } from 'react-redux';

const OpenMindsSchemaTabContents = (props) => {
  const {
    setModalUploadVisibility,
    setModalDownloadVisibility,
    setModalSyncVisibility,
    schemaGeid,
    schemas,
    handleOnClick,
    schemaActionButtons,
    tabContentStyle,
    kgSchemaMeta,
  } = props;
  const { spaceBind } = useSelector((state) => state.kgSpaceList);

  return (
    <>
      <div className={styles.upload_btn}>
        <Button
          type='primary'
          icon={<CloudUploadOutlined />}
          onClick={() => setModalUploadVisibility(true)}
        >
          Upload Instances
        </Button>
        <Button
          type='primary'
          icon={<CloudDownloadOutlined />}
          onClick={() => setModalDownloadVisibility(true)}
        >
          Download Instances
        </Button>
        {spaceBind ? (
          <Button
            type='primary'
            icon={<CloudSyncOutlined />}
            onClick={() => setModalSyncVisibility(true)}
          >
            Sync All Instances
          </Button>) : null}
      </div>
      <div
        style={{
          maxHeight: 500,
          paddingTop: 44,
          overflow: 'auto',
          minWidth: 600,
        }}
      >
        {schemas.length
          ? schemas
            .filter((el) => !el.isDraft && el.standard === 'open_minds')
            .map((el) => {
              const kgMetaItem = kgSchemaMeta
                .sort((a, b) => {
                  return new Date(b.uploadedAt) - new Date(a.uploadedAt);
                })
                .find((v) => v.metadataId === el.geid);
              return (
                <div
                  style={
                    schemaGeid === el.geid
                      ? { ...tabContentStyle, backgroundColor: '#E6F5FF' }
                      : tabContentStyle
                  }
                  onClick={() => handleOnClick(el)}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginLeft: '20px',
                      width: 240,
                    }}
                  >
                    <FileOutlined style={{ marginRight: '20px' }} />{' '}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span
                          style={{
                            fontSize: '12px',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontWeight: '700',
                          }}
                        >{`${el.name}`}</span>
                      <span style={{ fontSize: '10px' }}>openMINDS</span>
                    </div>
                  </div>
                  {kgMetaItem ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginLeft: 20,
                        flex: '1',
                        flexDirection: 'column',
                      }}
                    >
                      {kgMetaItem.direction === 'KG' ?
                        <p style={{ fontSize: '10px', margin: 0 }}>
                          Transferred to KG Space on{' '}
                        </p> :
                        <p style={{ fontSize: '10px', margin: 0 }}>
                          Transferred from KG Space on{' '}
                        </p>}
                      <p style={{ fontSize: '10px', margin: 0 }}>
                        {timeConvertWithOffestValue(
                          kgMetaItem.uploadedAt,
                          'datetime',
                        )}
                      </p>
                    </div>
                  ) : null}

                  {schemaGeid === el.geid && schemaActionButtons(el)}
                </div>
              );
            })
          : null}
      </div>
    </>
  );
};

export default OpenMindsSchemaTabContents;
