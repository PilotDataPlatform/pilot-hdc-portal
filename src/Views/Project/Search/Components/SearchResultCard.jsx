/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import moment from 'moment';
import { Tag, Tooltip } from 'antd';
import { FileOutlined, FolderOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import styles from '../index.module.scss';
import { getHighlightedText, getFileSize } from '../../../../Utility';
import _ from 'lodash';
function SearchResultCard({ record, searchConditions }) {
  const { fileAttributesTemplates } = useSelector((state) => state.project);
  const attributeConditions = searchConditions.find(
    (el) => el.category === 'attributes',
  );
  const attributeList = attributeConditions
    ? attributeConditions.attributes
    : [];

  const fileType = record.type;
  let attributes = record.attributes;
  const tags = record.tags;
  const location = record.parentPath
    ? record.parentPath + '/' + record.name
    : record.name;
  const uploadTime = moment(record.createdTime).format('YYYY-MM-DD HH:mm:ss');
  if (attributes && !Array.isArray(attributes)) {
    let attrArrFormat = [];
    for (let attrKey in attributes) {
      if (attributes.hasOwnProperty(attrKey)) {
        attrArrFormat.push({ name: attrKey, value: attributes[attrKey] });
      }
    }
    attributes = attrArrFormat;
  }
  const templateName = record.templateId
    ? fileAttributesTemplates.find((t) => t.id === record.templateId)?.name
    : null;
  const hightLightTemplateName = (name) => {
    if (
      searchConditions.find((el) => el.category === 'attributes') &&
      searchConditions.find((el) => el.category === 'attributes')['name']
    ) {
      return getHighlightedText(
        templateName,
        searchConditions.find((el) => el.category === 'attributes')['name'],
      );
    } else {
      return <p>{name}</p>;
    }
  };

  const displayFileType = (fileType) => {
    if (fileType === 'file') {
      return (
        <div>
          <span className="file-name-row-lable">File Name:</span>
          <FileOutlined style={{ marginRight: '10px' }} />
        </div>
      );
    } else if (fileType === 'folder') {
      return (
        <div>
          <span className="folder-name-row-lable">Folder Name:</span>
          <FolderOutlined style={{ marginRight: '10px' }} />
        </div>
      );
    }
  };

  return (
    <div className={styles.search_result_card}>
      <div className="search-item-left">
        <div className={styles.search_item_header}>
          <div
            style={{
              width: '25%',
              display: 'flex',
              whiteSpace: 'nowrap',
              marginRight: '10px',
            }}
          >
            {displayFileType(fileType)}
            {searchConditions.find((el) => el.category === 'file_name') &&
            searchConditions.find((el) => el.category === 'file_name')[
              'keywords'
            ] ? (
              getHighlightedText(
                record.name,
                searchConditions.find((el) => el.category === 'file_name')[
                  'keywords'
                ],
              )
            ) : (
              <>
                {record.name.length > 10 ? (
                  <Tooltip title={record.name}>
                    <span className="file-name-val">
                      {record.name.replace(/\s/g, '\u00a0')}
                    </span>
                  </Tooltip>
                ) : (
                  <span className="file-name-val">
                    {record.name.replace(/\s/g, '\u00a0')}
                  </span>
                )}
              </>
            )}
          </div>
          <div style={{ width: '22%', whiteSpace: 'nowrap', display: 'flex' }}>
            <span className="time-label">Uploaded Time:</span>
            <span className="file-name-val">
              {uploadTime.length > 10 ? (
                <Tooltip title={uploadTime}>
                  <span className="file-name-val">{uploadTime}</span>
                </Tooltip>
              ) : (
                <span className="file-name-val">{uploadTime}</span>
              )}
            </span>
          </div>
          <div style={{ width: '20%', whiteSpace: 'nowrap' }}>
            <span className="uploader-label">Uploaded By:</span>
            {searchConditions.find((el) => el.category === 'uploader') &&
            searchConditions.find((el) => el.category === 'uploader')[
              'keywords'
            ] ? (
              getHighlightedText(
                record.owner,
                searchConditions
                  .find((el) => el.category === 'uploader')
                  ['keywords'].toLowerCase(),
              )
            ) : (
              <>
                <span className="file-name-val">{record.owner}</span>
              </>
            )}
          </div>
          {fileType === 'file' ? (
            <div style={{ flex: 1, whiteSpace: 'nowrap' }}>
              <span className="size-label">File Size:</span>
              <span className="file-name-val">
                {record.size ? getFileSize(record.size) : 0}
              </span>
            </div>
          ) : null}
        </div>

        {templateName && attributes && attributes.length ? (
          <div className="manifest-row">
            <span className="row-label_FileAttribute">File Attribute:</span>
            <ul className="manifest-val">
              <li style={{ display: 'flex', flexDirection: 'column' }}>
                <h4>Template Name</h4>
                {hightLightTemplateName(templateName)}
              </li>
              <li>
                <h4>Attribute Name</h4>
                {attributes.map((el) => {
                  const attributeNameList = attributeList
                    .filter((attribute) => attribute.name)
                    .map((attribute) => attribute.name);
                  if (attributeNameList.includes(el.name)) {
                    return (
                      <p>
                        <b>{el.name}</b>
                      </p>
                    );
                  } else {
                    return <p>{el.name}</p>;
                  }
                })}
              </li>
              <li>
                <h4>Value</h4>
                {attributes.map((el) => {
                  const searchCondition = attributeList.find(
                    (attribute) => attribute.name === el.name,
                  );
                  if (searchCondition && searchCondition.value) {
                    if (searchCondition.type === 'multiple_choice') {
                      if (searchCondition.value.includes(el.value)) {
                        return (
                          <p>
                            <b>{el.value}</b>
                          </p>
                        );
                      } else {
                        return <p>{el.value}</p>;
                      }
                    }
                    if (searchCondition.type === 'text') {
                      return (
                        <p>
                          {getHighlightedText(el.value, searchCondition.value)}
                        </p>
                      );
                    }
                    return <p>{el.value}</p>;
                  } else {
                    return <p>{el.value}</p>;
                  }
                })}
              </li>
            </ul>
          </div>
        ) : (
          <div className="manifest-row"></div>
        )}

        {tags && tags.length ? (
          <div className="tags-row">
            <span className="row-label">Tags:</span>
            <div className="tags-val">
              {tags.map((el) => {
                const searchedTag = searchConditions.find(
                  (el) => el.category === 'tags',
                );
                if (
                  searchedTag &&
                  searchedTag.keywords &&
                  searchedTag.keywords.includes(el)
                ) {
                  return <Tag className="highlight">{el}</Tag>;
                }
                return <Tag>{el}</Tag>;
              })}
            </div>
          </div>
        ) : (
          <div className="tags-row"></div>
        )}
      </div>
      <div className={styles.search_item_right}>
        <span>
          Location:{' '}
          {location.length > 30 ? (
            <Tooltip title={location}>
              <b>{location}</b>
            </Tooltip>
          ) : (
            <b>{location}</b>
          )}
        </span>
      </div>
    </div>
  );
}

export default SearchResultCard;
