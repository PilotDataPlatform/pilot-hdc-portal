/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Select, Form } from 'antd';
import { withRouter } from 'react-router-dom';
const leven = require('leven');
const { Option } = Select;

function FolderInput(props) {
  const [value, setValue] = useState('');
  const [basePath, setBasePath] = useState('');
  const [folders, setFolders] = useState([]);
  const [lastFolder, setLastFolder] = useState('');

  const handleSearch = (value) => {
    if (!value.length) return;
    const pathArr = value.split('/');
    if (pathArr[0] === '') {
      pathArr.shift();
    }
    const basePathArr = pathArr.slice(0, pathArr.length - 1);
    const newBasePath = '/' + basePathArr.join('/');
    const lastFolder = pathArr[pathArr.length - 1];
    if (newBasePath !== basePath) {
      setBasePath(newBasePath);
      const folders = getFoldersApi(newBasePath);
      setFolders(folders);
    }

    setLastFolder(lastFolder);
  };

  const getFoldersApi = (basePath) => {
    return ['', 'a', 'b', 'c'];
  };

  const handleChange = (value) => {
    setValue(value);
    props.getFolderPath(value);
  };

  const generateOptions = (lastFolder) => {
    const sortedFolders = folders.sort((a, b) => {
      return leven(a, lastFolder) - leven(b, lastFolder);
    });

    return sortedFolders.map((item) => (
      <Option
        value={basePath + (basePath.length > 1 ? '/' : '') + item}
        key={basePath + (basePath.length > 1 ? '/' : '') + item}
      >
        {basePath + (basePath.length > 1 ? '/' : '') + item}
      </Option>
    ));
  };
  return (
    <Form.Item label="Folder">
      <Select
        style={{ width: '100%' }}
        onSearch={handleSearch}
        onChange={handleChange}
        showArrow={false}
        placeholder={'type in path'}
        showSearch
        filterOption={false}
      >
        {generateOptions(lastFolder)}
      </Select>
    </Form.Item>
  );
}

export default withRouter(FolderInput);
