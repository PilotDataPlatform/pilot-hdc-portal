/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CreateFolderModal from './CreateFolderModal';

function CreateFolderPlugin(props) {
  
  const [visible, setVisible] = useState(false);
  const hideModal = () => {
    setVisible(false);
  };
  return (
    <>
      <Button
        onClick={() => {
          setVisible(true);
        }}
        type="link"
        icon={<PlusOutlined />}
      >
        New Folder
      </Button>
      <CreateFolderModal {...props}  hideModal={hideModal} visible={visible} />
    </>
  );
}

export default CreateFolderPlugin;
