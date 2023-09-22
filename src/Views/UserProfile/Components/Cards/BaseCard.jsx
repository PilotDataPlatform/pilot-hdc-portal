/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Card } from 'antd';

import styles from '../../index.module.scss';

function BaseCard ({ title, extra, className, children }) {
  return (
    <Card
      title={title}
      extra={extra}
      className={className ? className : styles['user-profile__card']}
    >
      { children }
    </Card>
  );
}

export default BaseCard;