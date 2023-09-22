/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Tag, Input, Select, message, Checkbox, Form } from 'antd';
import { MANIFEST_ATTR_TYPE } from '../../../manifest.values';
import { addNewAttrToManifest } from '../../../../../../../APIs';
import { useCurrentProject, trimString } from '../../../../../../../Utility';
import {
  validateAttributeName,
  validateAttrValue,
} from '../../Utils/FormatValidators';
import styles from '../../../../index.module.scss';
import i18n from '../../../../../../../i18n';
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
const { Option } = Select;
function AttrAddBar(props) {
  const manifestItem = props.manifestItem;
  const [attrName, setAttrName] = useState(null);
  const [type, setType] = useState(MANIFEST_ATTR_TYPE.MULTIPLE_CHOICE);
  const [value, setValue] = useState(null);
  const [currentDataset] = useCurrentProject();
  const [loading, setLoading] = useState(false);
  const [errorMsg4Val, setErrorMsg4Val] = useState(null);
  const [errorMsg4Name, setErrorMsg4Name] = useState(null);
  return (
    <tr>
      <td>
        <Form.Item
          {...(errorMsg4Name && {
            validateStatus: 'error',
            help: errorMsg4Name,
          })}
        >
          <Input
            value={attrName}
            onChange={(e) => {
              setAttrName(e.target.value);
              const { valid, err } = validateAttributeName(
                e.target.value,
                manifestItem.attributes,
              );
              if (!valid) {
                setErrorMsg4Name(err);
                return;
              }
              setErrorMsg4Name(null);
            }}
          />
        </Form.Item>
      </td>
      <td>
        <Select
          defaultValue="Multiple Choice"
          onChange={(e) => {
            setType(e);
          }}
          style={{ width: '100%' }}
        >
          {Object.keys(MANIFEST_ATTR_TYPE).map((mkey) => {
            return (
              <Option key={mkey} value={MANIFEST_ATTR_TYPE[mkey]}>
                {attrType(MANIFEST_ATTR_TYPE[mkey])}
              </Option>
            );
          })}
        </Select>
      </td>
      <td>
        {type === MANIFEST_ATTR_TYPE.MULTIPLE_CHOICE ? (
          <Form.Item
            {...(errorMsg4Val && {
              validateStatus: 'error',
              help: errorMsg4Val,
            })}
          >
            <Select
              mode="tags"
              defaultValue={[]}
              onChange={(value) => {
                setValue(value);
                for (let vitem of value) {
                  let { valid, err } = validateAttrValue(vitem);
                  if (!valid) {
                    setErrorMsg4Val(err);
                    return;
                  }
                }
                setErrorMsg4Val(null);
              }}
              className={styles.custom_select_tag}
              tagRender={(props) => {
                const { label } = props;
                const { valid } = validateAttrValue(label);
                return (
                  <Tag {...props} color={valid ? 'default' : 'error'}>
                    {label}
                  </Tag>
                );
              }}
            ></Select>
          </Form.Item>
        ) : null}
        {type === MANIFEST_ATTR_TYPE.TEXT ? (
          <p>Value will be text or numeric entry (max. 100 characters)</p>
        ) : null}
      </td>
      <td>
        <Checkbox defaultChecked={true} disabled />
      </td>
      <td>
        <Button
          style={{
            border: 0,
            outline: 0,
            color: '#5B8C00',
            boxShadow: 'none',
            background: 'none',
          }}
          icon={<CheckOutlined />}
          loading={loading}
          onClick={async (e) => {
            const { valid, err } = validateAttributeName(
              attrName,
              manifestItem.attributes,
            );
            if (!valid) {
              message.error(err);
              return;
            }
            if (errorMsg4Val) {
              message.error(
                `${i18n.t(
                  'formErrorMessages:manifestSettings.attributeValue.error',
                )}`,
              );
              return;
            }
            if (
              type === MANIFEST_ATTR_TYPE.MULTIPLE_CHOICE &&
              (!value || value.length === 0)
            ) {
              message.error(
                `${i18n.t(
                  'formErrorMessages:manifestSettings.attributeValue.multipleChoice.empty',
                )}`,
              );
              return;
            }
            setLoading(true);
            let newAttrObj;
            if (type === MANIFEST_ATTR_TYPE.MULTIPLE_CHOICE) {
              newAttrObj = {
                name: trimString(attrName),
                optional: true,
                type: type,
                options: value ? value : [],
              };
            }
            if (type === MANIFEST_ATTR_TYPE.TEXT) {
              newAttrObj = {
                name: trimString(attrName),
                optional: true,
                type: type,
              };
            }
            const attributes = [newAttrObj];
            await addNewAttrToManifest(
              manifestItem.id,
              manifestItem.name,
              currentDataset.code,
              attributes,
            );
            await props.loadManifest();
            setLoading(false);
            props.setEditMode('default');
          }}
        ></Button>
        <Button
          style={{
            border: 0,
            outline: 0,
            color: '#FF6D72',
            boxShadow: 'none',
            background: 'none',
          }}
          icon={<CloseOutlined />}
          onClick={() => {
            setAttrName(null);
            setValue(null);
            setType(MANIFEST_ATTR_TYPE.MULTIPLE_CHOICE);
            setErrorMsg4Val(null);
            props.setEditMode('default');
          }}
        ></Button>
      </td>
    </tr>
  );
}

export default AttrAddBar;
