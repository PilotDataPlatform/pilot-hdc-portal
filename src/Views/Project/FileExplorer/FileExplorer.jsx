/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useEffect } from 'react';
import BasicCard from '../../../Components/Cards/BasicCard';
import FileExplorer from '../Canvas/Charts/FileExplorer/FileExplorer';
import CanvasPageHeader from '../Canvas/PageHeader/CanvasPageHeader';
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.module.scss';
import { canvasPageActions } from '../../../Redux/actions';
import { PanelKey } from '../Canvas/Charts/FileExplorer/RawTableValues';
const FileExplorerView = () => {
  const dispatch = useDispatch();
  const roles = useSelector((state) => state.rolePermissions.roles);
  useEffect(() => {
    return () => {
      dispatch(
        canvasPageActions.setCanvasPage({
          page: PanelKey.GREENROOM_HOME,
        }),
      );
    };
  }, []);
  return (
    <div className={styles['fileExplorer__container']}>
      <CanvasPageHeader variant="fileExplorer" />
      <div className={styles['fileExplorer__card']}>
        <BasicCard
          title="File Explorer"
          loading={!roles || !roles.length}
          content={<FileExplorer />}
          draggable={false}
          style={{ minHeight: '835px' }}
        />
      </div>
    </div>
  );
};

export default FileExplorerView;
