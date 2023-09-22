/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { StarFilled, StarOutlined } from '@ant-design/icons';

import styles from './index.module.scss';
import { useEffect } from 'react';

const StarButton = ({
  className = 'star-button',
  onChange,
  disabled,
  outline,
}) => {
  const [isOutlineStyle, setIsOutlineStyle] = useState(!!outline);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsOutlineStyle(outline);
  }, [outline]);

  const handleClick = async (e) => {
    setLoading(true);
    const outlineRes = await onChange(e, { outline: isOutlineStyle });
    setLoading(false);
    setIsOutlineStyle(outlineRes);
  };

  const StarIcon = () => (isOutlineStyle ? <StarOutlined /> : <StarFilled />);
  const buttonClass = isOutlineStyle
    ? styles[`${className}--outline`]
    : styles[className];
  return (
    <button
      className={buttonClass}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      <StarIcon />
    </button>
  );
};
export default StarButton;
