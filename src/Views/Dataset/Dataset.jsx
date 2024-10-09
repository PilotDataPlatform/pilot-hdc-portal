/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useEffect } from 'react';
import { StandardLayout } from '../../Components/Layout';
import DatasetContent from './DatasetContent/DatasetContent';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addVisitCount } from '../../APIs';
import { getKGSpace } from '../../APIs';
import { setKgSpaceBind } from '../../Redux/actions';
function Dataset(props) {
  const dispatch = useDispatch();
  useEffect(() => {
    const datasetCode = props.match?.params?.datasetCode;
    addVisitCount(datasetCode, 'dataset');
    async function initKGSpaces() {
      try {
        const res = await getKGSpace(datasetCode);
        dispatch(setKgSpaceBind(res.data));
      } catch (e) {
        dispatch(setKgSpaceBind(false));
      }
    }
    initKGSpaces();
    return () => {
      setKgSpaceBind(null);
    };
  }, []);
  return (
    <StandardLayout leftMargin={false}>
      <DatasetContent />
    </StandardLayout>
  );
}

export default withRouter(Dataset);
