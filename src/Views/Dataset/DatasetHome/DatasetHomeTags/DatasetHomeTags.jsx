/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useEffect, useState } from 'react';
import { Skeleton, Form, Tag, message } from 'antd';
import { CardExtra } from '../Components/CardExtra/CardExtra';
import { TagsInput } from '../Components/TagsInput/TagsInput';
import { DatasetCard as Card } from '../../Components/DatasetCard/DatasetCard';
import { validators } from '../../../DatasetLandingPage/Components/CreateDatasetPanel/createDatasetValidators';
import { useSelector } from 'react-redux';
export default function DatasetHomeTags(props) {
  const [form] = Form.useForm();
  const {
    loading,
    hasInit,
    basicInfo: { geid, tags },
  } = useSelector((state) => state.datasetInfo);

  useEffect(() => {
    if (hasInit) {
      form.setFieldsValue({ tags });
    }
  }, [hasInit, geid]);

  return (
    <Card title="Tags">
      <Skeleton loading={loading}>
        {' '}
        <Form form={form}>
          <Form.Item rules={validators.tags} name="tags">
            {tags?.map((tag) => (
              <Tag>{tag}</Tag>
            ))}
          </Form.Item>
        </Form>
      </Skeleton>
    </Card>
  );
}
