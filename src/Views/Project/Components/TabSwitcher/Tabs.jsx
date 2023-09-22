/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';

import styles from '../index.module.scss';

function Tabs({ handleClick, tabName, currentTab, activeColor }) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (currentTab) {
      if (currentTab === tabName) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    }
  }, [currentTab]);

  return (
    <li
      onClick={handleClick}
      className={`${styles['tab-switcher__tabs']}`}
      style={isActive ? { backgroundColor: activeColor } : null}
    >
      {tabName}
    </li>
  );
}

export default Tabs;
