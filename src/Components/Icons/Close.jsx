/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import Icon from '@ant-design/icons';
import React from 'react';

export default function CloseIcon(props) {
  return (
    <Icon
      component={() => (
        <svg
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 199.89"
          width={props.width}
          height={props.width}
          fill={props.color}
        >
          <defs>
            <style></style>
          </defs>
          <path
            id="Clear_History"
            class="cls-1"
            d="M117.22,99.99L196.12,21.16c4.74-4.74,4.74-12.43,0-17.17h0c-4.74-4.74-12.43-4.74-17.17,0L99.97,82.71,21.05,3.88C16.49-1.04,8.8-1.32,3.88,3.25-1.04,7.82-1.32,15.5,3.25,20.42c.2,.22,.41,.43,.63,.63h0L82.73,99.99,3.84,178.86c-4.74,4.74-4.74,12.43,0,17.17h0c4.76,4.76,12.47,4.76,17.23,0L99.99,117.16l78.94,78.85c4.58,4.92,12.28,5.19,17.2,.61,4.92-4.58,5.19-12.28,.61-17.2-.18-.2-.38-.39-.57-.58h0L117.22,99.99Z"
          />
        </svg>
      )}
      {...props}
    />
  );
}
