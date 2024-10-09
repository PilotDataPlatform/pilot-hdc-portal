/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Form } from 'antd';
const Option = Select.Option;

const defaultKeyWords = (condition) => {
  if (condition.category === 'uploader' && condition.keywords) {
    return condition.keywords;
  } else {
    return '';
  }
};

function UploadedByCondition({
  condition,
  updateCondition,
  clearTrigger,
  form,
}) {
  useEffect(() => {
    if (clearTrigger) {
      form.resetFields(['uploadByCondition', 'uploadedByKeyword']);
    }
  }, [clearTrigger]);

  return (
    <>
      <Form.Item
        label="Condition"
        name="uploadByCondition"
        style={{ width: '200px', marginRight: 18 }}
      >
        <Select
          value={condition.condition}
          defaultValue="contain"
          onChange={(value) => {
            updateCondition(condition.cid, {
              condition: value,
            });
          }}
        >
          <Option value="contain">Contains</Option>
          <Option value="equal">Equals</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Keyword"
        name="uploadedByKeyword"
        initialValue={defaultKeyWords(condition)}
        onChange={(e) => {
          updateCondition(condition.cid, {
            keywords: e.target.value,
          });
        }}
        rules={[
          {
            required: true,
          },
        ]}
        style={{ flex: 1, display: 'inline-block' }}
      >
        <Input />
      </Form.Item>
    </>
  );
}

export default UploadedByCondition;
