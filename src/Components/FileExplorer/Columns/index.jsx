/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { PluginColumnComponents } from '../Plugins';
import CreatedTimeDefault from './CreatedTime/CreatedTimeDefault';
import FileNameDefault from './FileName/FileNameDefault';
import LabelDefault from './Label/LabelDefult';
import OwnerDefault from './Owner/OwnerDefult';
import SizeDefault from './Size/SizeDefult';
import ReviewedByDefault from './ReviewedBy/ReviewedByDefault';
import ReviewedAtDefault from './ReviewedAt/ReviewedAtDefault';
import Action from './Action/Action';
export const ColumnDefaultComponents = {
  CreatedTimeDefault: CreatedTimeDefault,
  FileNameDefault: FileNameDefault,
  LabelDefault: LabelDefault,
  OwnerDefault: OwnerDefault,
  SizeDefault: SizeDefault,
  ReviewedAtDefault: ReviewedAtDefault,
  ReviewedByDefault: ReviewedByDefault,
};
export const COLUMN_COMP_IDS = {
  ...ColumnDefaultComponents,
  ...PluginColumnComponents,
};

export const DEFAULT_COLUMN_COMP_MAP = {
  createTime: 'CreatedTimeDefault',
  fileName: 'FileNameDefault',
  label: 'LabelDefault',
  owner: 'OwnerDefault',
  fileSize: 'SizeDefault',
  reviewedAt: 'ReviewedAtDefault',
  reviewedBy: 'ReviewedByDefault',
};

export function getColumnsResponsive() {}

export function getColumns(
  columns,
  columnsLayout,
  isSidePanelOpen,
  columnsComponentMap,
) {
  if (!columnsComponentMap) {
    return null;
  }
  const columsArr = columns.map((column) => {
    const componentID = columnsComponentMap[column.key];
    const RenderComponent = COLUMN_COMP_IDS[componentID];
    column.render = (text, record) => {
      return <RenderComponent text={text} record={record} />;
    };
    column.width = columnsLayout(isSidePanelOpen)[column.key];
    return column;
  });
  columsArr.push({
    title: 'Action',
    key: 'action',
    width: 100,
    sidePanelVisible: true,
    render: (text, record) => {
      return <Action text={text} record={record} />;
    },
  });
  return columsArr;
}
