/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';

import Input from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';

const INPUT_STYLE = {
  width: '100%',
};

const CustomTextWidget = ({
  disabled,
  formContext,
  id,
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

  const handleNumberChange = (nextValue) => {
    if (nextValue === null) {
      onChange(undefined);
    } else {
      onChange(nextValue);
    }
  };

  const handleTextChange = ({ target }) =>
    onChange(target.value === '' ? options.emptyValue : target.value);

  const handleBlur = ({ target }) => onBlur(id, target.value);

  const handleFocus = ({ target }) => onFocus(id, target.value);

  return schema.type === 'number' || schema.type === 'integer' ? (
    <InputNumber
      disabled={disabled || (readonlyAsDisabled && readonly)}
      id={id}
      name={id}
      onBlur={!readonly ? handleBlur : undefined}
      onChange={!readonly ? handleNumberChange : undefined}
      onFocus={!readonly ? handleFocus : undefined}
      placeholder={placeholder}
      style={INPUT_STYLE}
      type="number"
      value={value}
    />
  ) : (
    <Input
      disabled={disabled || (readonlyAsDisabled && readonly)}
      id={id}
      name={id}
      onBlur={!readonly ? handleBlur : undefined}
      onChange={!readonly ? handleTextChange : undefined}
      onFocus={!readonly ? handleFocus : undefined}
      placeholder={placeholder}
      style={INPUT_STYLE}
      type={options.inputType || 'text'}
      value={value}
    />
  );
};

export default CustomTextWidget;
