/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';

import { Pagination, Select } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import styles from './index.module.scss';

const { Option } = Select;

const Pages = (props) => {
  const { current, pageSize } = props;

  return (
    <span>
      {current}/{Math.ceil(props.total / (pageSize == 0 ? 1 : pageSize))}
    </span>
  );
};

const CustomPagination = (props) => {
  const [pageSize, setPageSize] = useState(props.defaultSize);
  const [current, setCurrent] = useState(props.defaultPage);

  let pageSizeArr = [10, 20, 30, 50];

  const calcPageSize = () => {
    return Math.ceil(props.total / pageSize);
  };

  const changePageSize = (value) => {
    let info = { cur: 1, pageSize: value };
    props.onChange(info);
    setPageSize(value);
    setCurrent(1);
  };

  const goToPreview = () => {
    if (current > 1) {
      let info = { cur: current - 1, pageSize: pageSize };
      props.onChange(info);
      setCurrent(current - 1);
    }
  };

  const goToNext = () => {
    let totalPage = calcPageSize();
    if (current < totalPage) {
      let info = { cur: current + 1, pageSize: pageSize };
      props.onChange(info);
      setCurrent(current + 1);
    }
  };

  return (
    <div className={styles['pagination']}>
      {props.showPageSize ? (
        <>
          <div className={styles['page-text']}>Per Page</div>
          <Select
            defaultValue="10"
            style={{ width: '6.9rem' }}
            onChange={changePageSize}
          >
            {pageSizeArr.map((v) => (
              <Option value={v}>{v}</Option>
            ))}
          </Select>
        </>
      ) : null}
      {props.total && props.total > 0 ? (
        <div className={styles['page']}>
          <LeftOutlined
            className={styles['icon']}
            style={{ marginRight: '1rem' }}
            onClick={goToPreview}
          />
          <Pages {...props} current={current} pageSize={pageSize} />
          <RightOutlined
            className={styles['icon']}
            style={{ marginLeft: '1rem' }}
            onClick={goToNext}
          />
        </div>
      ) : null}
    </div>
  );
};

export default CustomPagination;
