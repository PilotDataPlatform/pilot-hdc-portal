/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Tag, Checkbox } from 'antd';
import styles from '../../../../index.module.scss';
import { MANIFEST_ATTR_TYPE } from '../../../manifest.values';
import AttrAddBar from './AttrAddBar';

function FileManifestExistentTable(props) {
  const mItem = props.mItem;
  const tableColumns = ['Attribute Name', 'Type', 'Value', 'Optional'];
  const [editMode, setEditMode] = useState('default');
  function attrType(type) {
    switch (type) {
      case MANIFEST_ATTR_TYPE.MULTIPLE_CHOICE:
        return 'Multiple Choice';
      case MANIFEST_ATTR_TYPE.TEXT:
        return 'Text';
      default: {
      }
    }
    return '';
  }
  return (
    <>
      <table className={styles.manifest_table}>
        <thead>
          <tr>
            <th style={{ width: 180 }}>Attribute Name</th>
            <th style={{ width: 180 }}>Type</th>
            <th>Value</th>
            <th style={{ width: 120 }}>Optional</th>
            <th style={{ width: 120 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mItem.attributes.map((item, index) => {
            return (
              <tr key={mItem.id + '-' + index}>
                <td>{item.name}</td>
                <td>{attrType(item.type)}</td>
                <td>
                  {item.value &&
                  item.type === MANIFEST_ATTR_TYPE.MULTIPLE_CHOICE
                    ? item.value.split(',').map((v, vInd) => {
                        return <Tag key={vInd}>{v}</Tag>;
                      })
                    : null}
                </td>
                <td>
                  <Checkbox defaultChecked={item.optional} disabled />
                </td>
                <td></td>
              </tr>
            );
          })}

          {editMode === 'add' ? (
            <AttrAddBar
              key="add-bar-end-step2"
              manifestItem={mItem}
              setEditMode={setEditMode}
              loadManifest={props.loadManifest}
              tableColumns={tableColumns}
            />
          ) : (
            <tr key="add-bar-end-step1">
              <td
                style={{
                  textAlign: 'center',
                }}
                colSpan={5}
              >
                <Button
                  className={styles.button}
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={(e) => {
                    setEditMode('add');
                  }}
                >
                  Add Attribute
                </Button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
export default FileManifestExistentTable;
