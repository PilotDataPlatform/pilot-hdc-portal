/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';

import { utils } from '@rjsf/core';
import Select from 'antd/lib/select';

const { asNumber, guessType } = utils;

const SELECT_STYLE = {
  width: '100%',
};

const nums = new Set(['number', 'integer']);

const processValue = (schema, value) => {
  const { type, items } = schema;

  if (value === '') {
    return undefined;
  } else if (type === 'array' && items && nums.has(items.type)) {
    return value.map(asNumber);
  } else if (type === 'boolean') {
    return value === 'true';
  } else if (type === 'number') {
    return asNumber(value);
  }

  if (schema.enum) {
    if (schema.enum.every((x) => guessType(x) === 'number')) {
      return asNumber(value);
    } else if (schema.enum.every((x) => guessType(x) === 'boolean')) {
      return value === 'true';
    }
  }

  return value;
};

const CustomSelectWidget = ({
  autofocus,
  disabled,
  formContext,
  id,
  multiple,
  onBlur,
  onChange,
  onFocus,
  options,
  placeholder,
  readonly,
  schema,
  value,
}) => {
  const { readonlyAsDisabled = true } = formContext;

  const { enumOptions, enumDisabled } = options;

  const handleChange = (nextValue) => onChange(processValue(schema, nextValue));

  const handleBlur = () => onBlur(id, processValue(schema, value));

  const handleFocus = () => onFocus(id, processValue(schema, value));

  const getPopupContainer = (node) => node.parentNode;

  const stringify = (currentValue) =>
    Array.isArray(currentValue) ? value.map(String) : String(value);

  return (
    <Select
      autoFocus={autofocus}
      disabled={disabled || (readonlyAsDisabled && readonly)}
      getPopupContainer={getPopupContainer}
      id={id}
      allowClear={
        typeof options.allowClear !== 'undefined' ? options.allowClear : true
      }
      mode={typeof multiple !== 'undefined' ? 'multiple' : undefined}
      name={id}
      onBlur={!readonly ? handleBlur : undefined}
      onChange={!readonly ? handleChange : undefined}
      onFocus={!readonly ? handleFocus : undefined}
      placeholder={placeholder}
      style={SELECT_STYLE}
      value={typeof value !== 'undefined' ? stringify(value) : undefined}
    >
      {enumOptions.map(({ value: optionValue, label: optionLabel }) => (
        <Select.Option
          disabled={enumDisabled && enumDisabled.indexOf(optionValue) !== -1}
          key={String(optionValue)}
          value={String(optionValue)}
        >
          {optionLabel}
        </Select.Option>
      ))}
    </Select>
  );
};

CustomSelectWidget.defaultProps = {
  formContext: {},
};

export default CustomSelectWidget;
