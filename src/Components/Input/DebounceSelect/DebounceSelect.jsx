/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useRef, useMemo } from 'react';

import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';

export function DebounceSelect({ fetchApi, debounceTimeout = 800, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchApi(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchApi, debounceTimeout]);

  return (
    <Select
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={
        fetching ? <Spin size="small" /> : <span>Not Found</span>
      }
      {...props}
      options={options}
    />
  );
}
