/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import styles from '../index.module.scss'

function TabNavigation ({ children }) {
  return (
    <ul className={styles['tab-switcher__navigation']}>
      { children }
    </ul>
  )
}

export default TabNavigation;
