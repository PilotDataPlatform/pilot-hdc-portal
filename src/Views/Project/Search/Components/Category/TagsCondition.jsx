/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Form } from 'antd';
const Option = Select.Option;

const defaultValues = (condition) => {
  if (condition.category === 'tags' && condition.keywords) {
    return condition.keywords
  } else {
    return []
  }
}

function TagsCondition({ condition, updateCondition, clearTrigger, form }) {
  useEffect(() => {
    if (clearTrigger) {
      form.resetFields(['tagsCondition', 'tagsKeyword']);
    }
  }, [clearTrigger]);
  const children = [];
  return (
    <>
      <Form.Item
        label="Condition"
        name="tagsCondition"
        style={{ width: '200px', marginRight: 18 }}
      >
        <Select defaultValue="contains" disabled showArrow={false}>
          <Option value="contain">Contains</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Keyword"
        name="tagsKeyword"
        initialValue={defaultValues(condition)}
        rules={[
          {
            required: true,
          },
        ]}
        style={{ flex: 1, display: 'inline-block' }}
      >
        <Select
          mode="tags"
          style={{ width: '100%' }}
          onChange={(value) => {
            updateCondition(condition.cid, {
              keywords: value,
            });
          }}
        >
          {children}
        </Select>
      </Form.Item>
    </>
  );
}

export default TagsCondition;
