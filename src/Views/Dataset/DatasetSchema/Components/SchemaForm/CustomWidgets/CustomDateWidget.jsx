/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import dayjs from 'dayjs';

import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import generatePicker from 'antd/lib/date-picker/generatePicker';

const DatePicker = generatePicker(dayjsGenerateConfig);
const DATE_PICKER_STYLE = {
  width: '100%',
};

const CustomDateWidget = ({
  disabled,
  formContext,
  id,
  onBlur,
  onChange,
  onFocus,
  placeholder,
  readonly,
  value,
}) => {
  const { readonlyAsDisabled = true } = formContext;

  const handleChange = (nextValue) => {
    if (nextValue === null) {
      onChange(undefined);
    } else {
      onChange(nextValue && nextValue.format('YYYY-MM-DD'));
    }
  };

  const handleBlur = () => onBlur(id, value);

  const handleFocus = () => onFocus(id, value);

  const getPopupContainer = (node) => node.parentNode;

  return (
    <DatePicker
      disabled={disabled || (readonlyAsDisabled && readonly)}
      getPopupContainer={getPopupContainer}
      id={id}
      name={id}
      onBlur={!readonly ? handleBlur : undefined}
      onChange={!readonly ? handleChange : undefined}
      onFocus={!readonly ? handleFocus : undefined}
      placeholder={placeholder}
      showTime={false}
      style={DATE_PICKER_STYLE}
      value={value && dayjs(value)}
    />
  );
};

export default CustomDateWidget;
