/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FileExplorerContext from '../../../../../Components/FileExplorer/FileExplorerContext';
import { fileExplorerTableActions } from '../../../../../Redux/actions';
import { Button } from 'antd';
import { PLUGIN_NAME } from './name';

export function Entry(props) {
  const fileExplorerContext = useContext(FileExplorerContext);
  const { reduxKey } = fileExplorerContext;
  const dispatch = useDispatch();
  const fileExplorerTableState = useSelector(
    (state) => state.fileExplorerTable,
  );
  if (!fileExplorerTableState[reduxKey]) {
    dispatch(fileExplorerTableActions.setAdd({ geid: reduxKey }));
  }
  useEffect(() => {
    dispatch(
      fileExplorerTableActions.setCurrentPlugin({
        geid: reduxKey,
        param: PLUGIN_NAME,
      }),
    );
  }, []);
  return null;
}
