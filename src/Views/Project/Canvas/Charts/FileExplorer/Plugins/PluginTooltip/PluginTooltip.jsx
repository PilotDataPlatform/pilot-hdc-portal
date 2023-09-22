/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { LeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import styles from './index.module.scss';

function PluginTooltip({ leftOffset, selected, backButton, actionButton }) {
  const { onClick: backOnClick } = backButton;
  const {
    onClick: actionOnClick,
    text: actionText,
    icon: actionIcon,
    disabled: actionDisabled,
  } = actionButton;

  return (
    <div
      className={styles['plugin-tooltip']}
      style={{
        left: leftOffset,
      }}
    >
      <button
        className={styles['plugin-tooltip__back-button']}
        onClick={backOnClick}
      >
        <LeftOutlined /> <span>Back</span>
      </button>
      <div className={styles['plugin-tooltip__action-button-container']}>
        {selected ? <span>{selected}</span> : null}
        <Button
          className={styles['plugin-tooltip__action-button']}
          type="primary"
          ghost
          onClick={actionOnClick}
          disabled={actionDisabled ?? false}
          icon={actionIcon}
        >
          {actionText}
        </Button>
      </div>
    </div>
  );
}

export default PluginTooltip;
