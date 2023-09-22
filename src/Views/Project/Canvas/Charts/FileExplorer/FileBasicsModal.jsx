/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Modal, Button } from 'antd';

import FileBasics from './FileBasics';

function FileBasicsModal(props) {
  const { record } = props;
  return (
    <>
      <Modal
        title="General"
        visible={props.visible}
        onOk={props.handleOk}
        onCancel={props.handleOk}
        footer={[
          <Button key="back" onClick={props.handleOk}>
            OK
          </Button>,
        ]}
      >
        <FileBasics pid={props.projectId} record={record} />
      </Modal>
    </>
  );
}

export default FileBasicsModal;
