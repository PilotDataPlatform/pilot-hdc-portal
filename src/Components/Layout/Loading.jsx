/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Spin } from 'antd';
function Loading() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Spin
        style={{
          position: 'absolute',
          top: '50%',
          left: ' 50%',
          transform: 'translate(-50%, -50%)',
        }}
        tip="Loading..."
      ></Spin>
    </div>
  );
}

export { Loading };
