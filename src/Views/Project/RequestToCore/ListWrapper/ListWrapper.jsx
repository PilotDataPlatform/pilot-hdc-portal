/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { List } from 'antd';
import styles from './ListWrapper.module.scss';

const ListWrapper = (props) => {
  const [selectedListIndex, setSelectedListIndex] = useState(0);
  const { data } = props;

  const onListClick = (e) => {
    setSelectedListIndex(parseInt(e.target.id));
  };

  return (
    <List
      size="large"
      bordered={false}
      dataSource={data}
      pagination={data.length > 10 ? {
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 10,
      } : null}
      renderItem={(item, index) => (
        <List.Item
          className={`${styles.list_item} ${
            selectedListIndex === index && styles.list_item_backgroundColor
          }`}
          id={index}
          style={{ cursor: 'pointer' }}
          onClick={onListClick}
        >
          {item}
        </List.Item>
      )}
    />
  );
};

export default ListWrapper;
