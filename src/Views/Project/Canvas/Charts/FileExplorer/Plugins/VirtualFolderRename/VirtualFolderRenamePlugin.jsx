/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { FontColorsOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

import {
  vFolderOperation,
  VIRTUAL_FOLDER_OPERATIONS,
} from '../../../../../../../Redux/actions';
import style from './index.module.scss';

function VirtualFolderRenamePlugin({ panelKey }) {
  const project = useSelector((state) => state.project);
  const virtualFolders = useSelector((state) => state.virtualFolders);
  const dispatch = useDispatch();

  const handleClick = () => {
    const selectedVFolder = project.tree.vfolders.find(
      (vFolder) => vFolder.key === panelKey,
    );
    dispatch(vFolderOperation.setVFolderOperationRename(selectedVFolder.geid));
  };

  const RenameTooltip = (
    <div className={style['vfolder-rename__tooltip']}>
      <span>
        <FontColorsOutlined />
        Rename Collection
      </span>
    </div>
  );

  return (
    <>
      <Button
        type="link"
        icon={<FontColorsOutlined />}
        style={{ marginRight: 8 }}
        onClick={handleClick}
      >
        Rename Collection
      </Button>
      {virtualFolders.operation === VIRTUAL_FOLDER_OPERATIONS.RENAME
        ? RenameTooltip
        : null}
    </>
  );
}
export default VirtualFolderRenamePlugin;
