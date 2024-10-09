/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Form } from 'antd';
import { useSelector } from 'react-redux';
import {
  CloseCircleFilled,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
const Option = Select.Option;
function ConditionRowTemplate(props) {
  const { fileAttributesTemplates } = useSelector((state) => state.project);
  const conditions = props.conditions;
  const condition = conditions.find((c) => c.cid === props.cid);
  const last = props.last;
  const category = condition.category;
  const conditionBarRender = props.barRender;
  const [clearTrigger, setClearTrigger] = useState(1);
  const catesExist = conditions
    .filter((c) => c.category)
    .map((c) => c.category);

  const CATEGORY_MAP = [
    {
      label: 'File/Folder Name',
      value: 'file_name',
    },
    {
      label: 'Upload Time',
      value: 'time_created',
    },
    {
      label: 'File Size',
      value: 'file_size',
    },
    {
      label: 'Tags',
      value: 'tags',
    },
    {
      label: 'File Attribute',
      value: 'attributes',
    },
  ];
  if (props.permission === 'admin') {
    CATEGORY_MAP.splice(1, 0, {
      label: 'Uploaded By',
      value: 'uploader',
    });
  }

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ display: 'flex', flex: 1 }}>
        <Form.Item label="Category" style={{ width: '150px', marginRight: 18 }}>
          <Select
            value={category}
            onChange={(value) => {
              if (value === 'attributes') {
                if (fileAttributesTemplates.length > 0) {
                  props.updateCondition(condition.cid, {
                    category: value,
                    name: fileAttributesTemplates[0].name,
                    attributes: [],
                  });
                } else {
                  props.updateCondition(condition.cid, {
                    category: value,
                    name: '',
                    attributes: [],
                  });
                }
              } else if (['tags', 'uploader', 'file_name'].includes(value)) {
                props.updateCondition(condition.cid, {
                  category: value,
                  condition: 'contain',
                  keywords: '',
                });
              } else if (value === 'time_created') {
                props.updateCondition(condition.cid, {
                  category: value,
                  condition: 'between',
                  calendar: '',
                });
              } else if (value === 'file_size') {
                props.updateCondition(condition.cid, {
                  category: value,
                  condition: 'gte',
                  value: '',
                  value2: '',
                });
              } else {
                props.updateCondition(condition.cid, {
                  category: value,
                });
              }
            }}
          >
            {CATEGORY_MAP.map((cate) => (
              <Option
                key={cate.value}
                value={cate.value}
                disabled={catesExist.includes(cate.value)}
              >
                {cate.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {conditionBarRender(
          condition,
          clearTrigger,
          props.form,
          setClearTrigger,
        )}
      </div>
      <div
        style={{
          display: 'flex',
          paddingTop: 25,
          paddingLeft: 20,
          width: 208,
          whiteSpace: 'nowrap',
        }}
      >
        {last ? (
          <div
            style={{
              textAlign: 'right',
              display: 'flex',
              verticalAlign: 'middle',
            }}
          >
            {catesExist.length >= CATEGORY_MAP.length ? null : (
              <Button
                type="primary"
                disabled={category ? false : true}
                onClick={() => {
                  props.addCondition();
                }}
                icon={<PlusOutlined />}
                style={{ marginRight: 10, width: 40, borderRadius: 6 }}
              />
            )}
            <Form.Item>
              <Button
                type="primary"
                disabled={category ? false : true}
                htmlType="submit"
                icon={<SearchOutlined />}
                style={{ borderRadius: 6, width: 40 }}
              />
            </Form.Item>
            {conditions.length !== 1 ? (
              <CloseCircleFilled
                style={{
                  fontSize: 21,
                  cursor: 'pointer',
                  verticalAlign: 'middle',
                  marginLeft: 15,
                  padding: '5px 0px',
                  height: '25px',
                }}
                onClick={() => {
                  props.removeCondition(condition.cid);
                }}
              />
            ) : null}
          </div>
        ) : (
          <CloseCircleFilled
            style={{
              fontSize: 21,
              cursor: 'pointer',
              verticalAlign: 'middle',
              marginLeft: 6,
              padding: '5px 0px',
              height: '25px',
            }}
            onClick={() => {
              props.removeCondition(condition.cid);
            }}
          />
        )}
      </div>
    </div>
  );
}
export default ConditionRowTemplate;
