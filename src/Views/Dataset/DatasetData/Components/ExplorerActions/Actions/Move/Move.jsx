/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import styles from '../../ExplorerActions.module.scss';
import { EDIT_MODE } from '../../../../../../../Redux/Reducers/datasetData';
import { MoveStepOneModal } from './MoveStepOneModal';

export function Move() {
  const editorMode = useSelector((state) => state.datasetData.mode);
  const selectedData = useSelector((state) => state.datasetData.selectedData);
  const datasetInfo = useSelector((state) => state.datasetInfo.basicInfo);
  const moveCondition =
    selectedData.length !== 0 &&
    editorMode !== EDIT_MODE.EIDT_INDIVIDUAL &&
    !datasetInfo.bidsLoading;
  const [stepOneVisible, setStepOneVisible] = useState(false);

  return (
    <>
      <Button
        disabled={!moveCondition}
        className={ moveCondition && styles['button-enable'] }
        type="link"
        onClick={() => {
          setStepOneVisible(true);
        }}
        icon={<SwapOutlined />}
      >
        Move to
      </Button>
      <MoveStepOneModal
        stepOneVisible={stepOneVisible}
        setStepOneVisible={setStepOneVisible}
      />
    </>
  );
}
