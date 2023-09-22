/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { store } from '../../Redux/store';
import {
  datasetFileOps,
  datasetFileOperationsCreators,
} from '../../Redux/actions';
import {
  onImportFinish,
  onRenameFinish,
  onDeleteFinish,
  onTransferFinish,
} from '../../Views/Dataset/DatasetData/Components/DatasetDataExplorer/utility';
import { JOB_STATUS } from '../../Components/Layout/FilePanel/jobStatus';
import { capitalize } from 'lodash';

const updateDatasetExplorer = (data, existingFile) => {
  const { geid: datasetGeid } = store.getState().datasetInfo.basicInfo;
  if (existingFile.globalEntityId && datasetGeid) {
    const { treeData } = store.getState().datasetData;
    const payload = { ...existingFile, ...data };
    switch (data.actionType) {
      case datasetFileOps.import:
        onImportFinish(payload, treeData, datasetGeid);
        break;
      case datasetFileOps.rename:
        onRenameFinish(payload, treeData, datasetGeid);
        break;
      case datasetFileOps.delete:
        onDeleteFinish(payload, treeData, datasetGeid);
        break;
      case datasetFileOps.transfer:
        onTransferFinish(datasetGeid);
        break;
    }
  }
};

const datasetFileOpHandler = (data) => {
  if (data.actionType !== 'data_validate') {
    const action =
      data.actionType === datasetFileOps.transfer
        ? 'move'
        : data.actionType.replace('data_', '');

    const username = store.getState().username;

    const existingFile = store
      .getState()
      .datasetFileOperations[action].find(
        (dfo) =>
          dfo.jobId === data.jobId ||
          (dfo.operator === username &&
            dfo.datasetCode === data.containerCode &&
            data.targetNames[0].includes(dfo.name)),
      );

    const newData = { ...data };
    newData.name = newData.targetNames[0];
    delete newData.targetNames;

    if (existingFile) {
      store.dispatch(
        datasetFileOperationsCreators[`update${capitalize(action)}`](newData),
      );

      if (data.status === JOB_STATUS.SUCCEED) {
        setTimeout(() => {
          updateDatasetExplorer(data, existingFile);
        }, 5000);
      }
    } else {
      store.dispatch(
        datasetFileOperationsCreators[`set${capitalize(action)}`](newData),
      );
    }
  } else {
  }
};

export { datasetFileOpHandler };
