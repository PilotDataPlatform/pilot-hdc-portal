/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useEffect, useState } from 'react';

import { PushpinOutlined } from '@ant-design/icons';
import styles from './index.module.scss';

const PinButton = ({
  className = 'pin-button',
  show = true,
  disabled,
  pinned,
  onChange,
}) => {
  const [isPinned, setIsPinned] = useState(pinned);

  useEffect(() => {
    setIsPinned(pinned);
  }, [pinned]);

  const handleClick = async (e) => {
    const isPinnedRes = await onChange(e, { pinStyle: isPinned });
    setIsPinned(isPinnedRes);
  };

  const buttonClass = isPinned
    ? styles[`${className}--pinned`]
    : show
    ? styles[className]
    : styles[`${className}--hide`];

  return (
    <button className={buttonClass} onClick={handleClick} disabled={disabled}>
      <PushpinOutlined />
    </button>
  );
};

export default PinButton;
