/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useEffect, useState } from 'react';
import { Upload } from 'antd';
import styles from './index.module.scss';
import { DeleteOutlined, FolderOutlined } from '@ant-design/icons';
import _ from 'lodash';

const getFolderName = (fileList) => {
  if (!fileList?.length) {
    return null;
  }
  return fileList.at(-1).originFileObj.webkitRelativePath.split('/')[0];
};

export function UploadFolder(props) {
  if (!props.directory) {
    throw new TypeError('directory prop should be true');
  }
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    if (props.value?.fileList){
      setValue(props.value);
    }
  }, [props.value]);

  const onRemove = () => {
    props.onChange(undefined);
  };

  const folderName = getFolderName(value?.fileList);

  return (
    <>
      <Upload
        {...props}
        onChange={(info) => {
          const { fileList, file } = info;
          const newFolderName = getFolderName(fileList);
          const fileListFiltered = _.filter(fileList, (item) => {
            return item.originFileObj.webkitRelativePath.startsWith(
              newFolderName,
            );
          });
          info.fileList = fileListFiltered
          props.onChange(info);
          setValue(info);
        }}
        beforeUpload={(file) => {
          return false;
        }}
        showUploadList={false}
        value={value}
      />
      {folderName && (
        <div className={styles.folderItem}>
          <span>
            <FolderOutlined />
          </span>
          <span>{folderName}</span>

          <span
            onClick={() => {
              onRemove();
            }}
            style={{ float: 'right' }}
          >
            <DeleteOutlined />
          </span>
        </div>
      )}
    </>
  );
}
