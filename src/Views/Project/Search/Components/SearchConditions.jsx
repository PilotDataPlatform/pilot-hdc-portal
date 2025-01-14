/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Form } from 'antd';
import styles from '../index.module.scss';
import { v4 as uuidv4 } from 'uuid';
import FileNameCondition from './Category/FileNameCondition';
import UploadedByCondition from './Category/UploadedByCondition';
import UploadTimeCondition from './Category/UploadTimeCondition';
import FileSizeCondition from './Category/FileSizeCondition';
import TagsCondition from './Category/TagsCondition';
import FileAttributeCondition from './Category/FileAttributeCondition';
import ConditionRowTemplate from './ConditionRowTemplate';
import { getProjectManifestList } from '../../../../APIs';
import { useCurrentProject } from '../../../../Utility';
import _ from 'lodash';

function SearchConditions(props) {
  const [form] = Form.useForm();

  const conditions = props.conditions;
  const [currentDataset = {}] = useCurrentProject();

  useEffect(() => {
    props.setConditions([{ cid: uuidv4() }]);
  }, []);
  function addCondition() {
    props.setConditions([...conditions, { cid: uuidv4() }]);
  }
  function removeCondition(removeId) {
    props.setConditions(conditions.filter((c) => c.cid !== removeId));
  }
  function clearCondition(clearId) {
    const ind = conditions.map((c) => c.cid).indexOf(clearId);
    const newConditions = [...conditions];
    newConditions[ind] = { cid: uuidv4() };
    props.setConditions(newConditions);
  }
  function updateCondition(cId, params) {
    const ind = conditions.map((c) => c.cid).indexOf(cId);
    const newConditions = [...conditions];
    newConditions[ind] = { ...conditions[ind], ...params };
    props.setConditions(newConditions);
  }
  function renderConditionBar(condition, clearTrigger, form, setClearTrigger) {
    switch (condition.category) {
      case 'file_name':
        return (
          <FileNameCondition
            condition={condition}
            clearTrigger={clearTrigger}
            updateCondition={updateCondition}
            form={form}
          />
        );
      case 'uploader':
        return (
          <UploadedByCondition
            condition={condition}
            clearTrigger={clearTrigger}
            updateCondition={updateCondition}
            form={form}
          />
        );
      case 'time_created':
        return (
          <UploadTimeCondition
            condition={condition}
            clearTrigger={clearTrigger}
            updateCondition={updateCondition}
            form={form}
          />
        );
      case 'file_size':
        return (
          <FileSizeCondition
            condition={condition}
            clearTrigger={clearTrigger}
            setClearTrigger={setClearTrigger}
            updateCondition={updateCondition}
            form={form}
          />
        );
      case 'tags':
        return (
          <TagsCondition
            condition={condition}
            clearTrigger={clearTrigger}
            updateCondition={updateCondition}
            form={form}
          />
        );
      case 'attributes':
        return (
          <FileAttributeCondition
            condition={condition}
            clearTrigger={clearTrigger}
            updateCondition={updateCondition}
            form={form}
            attributeList={props.attributeList}
            setAttributeList={props.setAttributeList}
          />
        );
      default:
        return null;
    }
  }

  const validateMessages = {
    required: '${label} is required!',
  };

  const submitForm = () => {
    const page = 1;
    const pageSize = 10;

    props.setPage(page);
    props.setPageSize(pageSize);
    props.searchFiles({ page, page_size: pageSize });
    props.setSearchConditions(_.cloneDeep(props.conditions));
  };

  return (
    <div style={{ padding: '10px 25px', borderBottom: '1px solid #f1f1f1' }}>
      <Form
        form={form}
        layout="vertical"
        validateMessages={validateMessages}
        className={styles.search_conditions}
        onFinish={submitForm}
      >
        {conditions.length
          ? conditions.map((condition, ind) => {
              const last = ind === conditions.length - 1;
              return (
                <ConditionRowTemplate
                  key={'condition' + ind}
                  conditions={conditions}
                  cid={condition.cid}
                  addCondition={addCondition}
                  removeCondition={removeCondition}
                  updateCondition={updateCondition}
                  clearCondition={clearCondition}
                  last={last}
                  barRender={(
                    condition,
                    clearTrigger,
                    form,
                    setClearTrigger,
                  ) => {
                    return renderConditionBar(
                      condition,
                      clearTrigger,
                      form,
                      setClearTrigger,
                    );
                  }}
                  form={form}
                  permission={props.permission}
                />
              );
            })
          : null}
      </Form>
    </div>
  );
}
export default SearchConditions;
