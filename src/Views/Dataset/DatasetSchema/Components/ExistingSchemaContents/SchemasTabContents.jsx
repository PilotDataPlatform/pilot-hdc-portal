/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Spin, Space } from 'antd';
import { FileOutlined, LoadingOutlined } from '@ant-design/icons';
import styles from './index.module.scss';

const SchemasTabContents = (props) => {
  const {
    setSchemaGeid,
    schemaGeid,
    schemas,
    handleOnClick,
    schemaActionButtons,
    tabContentStyle,
  } = props;

  return (
    <div style={{ height: '100%', minHeight: '400px' }}>
      {schemas.length ? (
        schemas
          .filter((el) => !el.isDraft && el.standard === 'default')
          .map((el) => (
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
                  <span style={{ fontSize: '10px' }}>
                    {el.systemDefined ? 'Default' : 'Custom'}
                  </span>
                </div>
              </div>
              {schemaGeid === el.geid && schemaActionButtons(el)}
            </div>
          ))
      ) : (
        <Spin
          indicator={<LoadingOutlined />}
          className={styles.loading_icon}
          size="large"
        />
      )}
    </div>
  );
};

export default SchemasTabContents;
