/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import {Button, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  SyncOutlined,
} from '@ant-design/icons';
import { preValidateBids } from '../../../../../../../APIs';
import { datasetInfoCreators } from '../../../../../../../Redux/actions';
import i18n from '../../../../../../../i18n';


export default function ValidateButton(props) {
  const dispatch = useDispatch();
  const basicInfo = useSelector((state) => state.datasetInfo.basicInfo);
  const treeData = useSelector((state) => state.datasetData.treeData);

  const openMessagePanel = async () => {
    if (treeData.length === 0) {
      message.error(
        `${i18n.t('errormessages:bidsValidateButton.noFileErr.0')}`,
        3,
      );
      return;
    }

    if (!basicInfo['bidsLoading']) {
      await preValidateBids(basicInfo.code);
      message.info(`${i18n.t('success:bidsValidateButton.wait.0')}`, 3);
    }

    basicInfo['bidsLoading'] = true;
    dispatch(datasetInfoCreators.setBasicInfo(basicInfo));
  };

  return (
    <Button
      icon={<SyncOutlined spin={basicInfo.bidsLoading} />}
      style={{ height: 28, margin: '3px 10px 3px 5px', borderRadius: 5 }}
      onClick={openMessagePanel}
    >
      <span>Validate BIDS</span>
    </Button>
  );
}
