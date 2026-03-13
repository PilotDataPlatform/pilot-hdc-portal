/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { Button } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import Copy2CentralNodeModal from './Copy2CentralNodeModal';

function Copy2CentralNodePlugin(props) {

  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setVisible(true);
        }}
        type='link'
        icon={<CloudUploadOutlined />}
      >
        Copy to Central Node
      </Button>
      <Copy2CentralNodeModal
        visible={visible}
        onClose={() => setVisible(false)}
        selectedRows={props.selectedRows}
      />
    </>
  );
}

export default Copy2CentralNodePlugin;
