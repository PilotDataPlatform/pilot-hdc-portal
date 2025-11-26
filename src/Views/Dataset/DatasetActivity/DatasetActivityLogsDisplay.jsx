/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Tag, Tooltip } from 'antd';
import {
  SyncOutlined,
  PlusOutlined,
  CloseOutlined,
  DownloadOutlined,
  ImportOutlined,
  EditOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  CheckOutlined,
  ExportOutlined,
  ClusterOutlined,
} from '@ant-design/icons';
import variables from '../../../Themes/constants.scss';

const datasetUpdateInfoDisplay = (caseType) => {
  let type;
  if (caseType === 'Dataset.Title') {
    type = 'Title';
  } else if (caseType === 'Dataset.License') {
    type = 'License';
  } else if (caseType === 'Dataset.Type') {
    type = 'Type';
  } else if (caseType === 'Dataset.Description') {
    type = 'Description';
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <SyncOutlined
        style={{ color: variables.primaryColor1, marginRight: '10px' }}
      />
      <p style={{ margin: '0px' }}>Updated Dataset {type}</p>
    </div>
  );
};

const networkOriginIcon = (networkOrigin) => {
  return (
    <Tooltip title={`Network: ${networkOrigin}`} overlayInnerStyle={{ textAlign: 'center' }}>
      <ClusterOutlined style={{ borderBottom: '1px dotted #999' }} />
    </Tooltip>
  );
};

const datasetDownloadInfoDisplay = (details) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <DownloadOutlined
        style={{ color: variables.primaryColor1, marginRight: '10px' }}
      />
      {details.version ? (
        <p style={{ margin: '0px' }}>Version <span style={{ fontWeight: 600 }}>{details.version}</span> was downloaded ({networkOriginIcon(details.networkOrigin)})</p>
      ) : (
        <p style={{ margin: '0px' }}>The current contents were downloaded ({networkOriginIcon(details.networkOrigin)})</p>
      )}
    </div>
  );
};

const datasetVersionInfoDisplay = (details) => {
  return (
    <div>
      <p
        style={{
          fontWeight: 'bold',
          color: variables.primaryColor1,
          margin: '0px 0px 0px 23px',
        }}
      >
        Version {details.version}
      </p>
    </div>
  );
};

const datasetSharingRequestUpdateInfoDisplay = (details) => {
  const request = details.changes[0];

  let icon;
  if (request.status === 'sent') {
    icon = (<ExportOutlined style={{ color: variables.primaryColor1, marginRight: '10px' }} />);
  } else if (request.status === 'accepted') {
    icon = (<CheckOutlined style={{ color: variables.primaryColor1, marginRight: '10px' }} />);
  } else if (request.status === 'declined') {
    icon = (<CloseOutlined style={{ color: variables.primaryColor1, marginRight: '10px' }} />);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {icon}
      <p style={{ margin: '0px' }}>
        <Tooltip title={`ID: ${request.sharingRequestId}`} overlayInnerStyle={{ width: '340px', textAlign: 'center' }}>
          <span style={{ borderBottom: '1px dotted #999' }}>The sharing request</span>
        </Tooltip>
        {` of version `}
        <span style={{ fontWeight: 600 }}>{details.version}</span>
        {` with the project `}
        <span style={{ fontWeight: 600 }}>{request.projectCode}</span>
        {` was ${request.status}`}
      </p>
    </div>
  );
};

const datasetCreateInfoDisplay = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <PlusOutlined
        style={{ color: variables.primaryColor1, marginRight: '10px' }}
      />
      <p style={{ margin: '0px' }}>Created a Dataset</p>
    </div>
  );
};

const spaceCreateInfoDisplay = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <PlusOutlined
        style={{ color: variables.primaryColor1, marginRight: '10px' }}
      />
      <p style={{ margin: '0px' }}>Created a KG space</p>
    </div>
  );
};

const datasetAddAndRemoveInfoDisplayHelper = (caseType, action, details) => {
  let displayInfo;
  let diffArr;
  if (caseType === 'Dataset.Authors' && action === 'ADD') {
    diffArr = details.to.filter((el) => !details.from.includes(el));
    if (diffArr.length > 1) {
      displayInfo = 'Added Dataset Authors:' + ' ';
    } else {
      displayInfo = 'Added a Dataset Author:' + ' ';
    }
  } else if (caseType === 'Dataset.Authors' && action === 'REMOVE') {
    diffArr = details.from.filter((el) => !details.to.includes(el));
    if (diffArr.length > 1) {
      displayInfo = 'Deleted Dataset Authors:' + ' ';
    } else {
      displayInfo = 'Deleted a Dataset Author:' + ' ';
    }
  } else if (caseType === 'Dataset.Tags' && action === 'ADD') {
    diffArr = details.to.filter((el) => !details.from.includes(el));
    if (diffArr.length > 1) {
      displayInfo = 'Added Dataset Tags:' + ' ';
    } else {
      displayInfo = 'Added a Dataset Tag:' + ' ';
    }
  } else if (caseType === 'Dataset.Tags' && action === 'REMOVE') {
    diffArr = details.from.filter((el) => !details.to.includes(el));
    if (diffArr.length > 1) {
      displayInfo = 'Deleted Dataset Tags:' + ' ';
    } else {
      displayInfo = 'Deleted a Dataset Tag:' + ' ';
    }
  } else if (caseType === 'Dataset.Modality' && action === 'ADD') {
    diffArr = details.to.filter((el) => !details.from.includes(el));
    if (diffArr.length > 1) {
      displayInfo = 'Added Dataset Modalities:' + ' ';
    } else {
      displayInfo = 'Added a Dataset Modality:' + ' ';
    }
  } else if (caseType === 'Dataset.Modality' && action === 'REMOVE') {
    diffArr = details.from.filter((el) => !details.to.includes(el));
    if (diffArr.length > 1) {
      displayInfo = 'Deleted Dataset Modalities:' + ' ';
    } else {
      displayInfo = 'Deleted a Dataset Modality:' + ' ';
    }
  } else if (caseType === 'Dataset.CollectionMethod' && action === 'ADD') {
    diffArr = details.to.filter((el) => !details.from.includes(el));
    if (diffArr.length > 1) {
      displayInfo = 'Added Dataset Collection Methods:' + ' ';
    } else {
      displayInfo = 'Added a Dataset Collection Method:' + ' ';
    }
  } else if (caseType === 'Dataset.CollectionMethod' && action === 'REMOVE') {
    diffArr = details.from.filter((el) => !details.to.includes(el));
    if (diffArr.length > 1) {
      displayInfo = 'Deleted Dataset Collection Methods:' + ' ';
    } else {
      displayInfo = 'Deleted a Dataset Collection Method:' + ' ';
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {action === 'ADD' ? (
        <PlusOutlined
          style={{ color: variables.primaryColor1, marginRight: '10px' }}
        />
      ) : (
        <CloseOutlined style={{ color: '#FF6D72', marginRight: '10px' }} />
      )}
      <p style={{ margin: '0px' }}>
        {displayInfo}
        {caseType === 'Dataset.Tags' ? (
          diffArr.map((el) => <Tag style={{ marginRight: '5px' }}>{el}</Tag>)
        ) : (
          <span style={{ fontWeight: 600 }}>
            {diffArr.join(', ').length > 80 ? (
              <Tooltip title={diffArr.join(', ')}>{`${diffArr
                .join(', ')
                .slice(0, 80)}....`}</Tooltip>
            ) : (
              diffArr.join(', ')
            )}
          </span>
        )}
      </p>
    </div>
  );
};

const datasetAddAndRemoveInfoDisplay = (caseType, action, details) => {
  if (caseType === 'Dataset.Authors') {
    if (
      action === 'ADD' &&
      details.hasOwnProperty('from') &&
      details.hasOwnProperty('to')
    ) {
      return datasetAddAndRemoveInfoDisplayHelper(
        'Dataset.Authors',
        'ADD',
        details,
      );
    } else if (
      action === 'REMOVE' &&
      details.hasOwnProperty('from') &&
      details.hasOwnProperty('to')
    ) {
      return datasetAddAndRemoveInfoDisplayHelper(
        'Dataset.Authors',
        'REMOVE',
        details,
      );
    }
  } else if (caseType === 'Dataset.Tags') {
    if (
      action === 'ADD' &&
      details.hasOwnProperty('from') &&
      details.hasOwnProperty('to')
    ) {
      return datasetAddAndRemoveInfoDisplayHelper(
        'Dataset.Tags',
        'ADD',
        details,
      );
    } else if (
      action === 'REMOVE' &&
      details.hasOwnProperty('from') &&
      details.hasOwnProperty('to')
    ) {
      return datasetAddAndRemoveInfoDisplayHelper(
        'Dataset.Tags',
        'REMOVE',
        details,
      );
    }
  } else if (caseType === 'Dataset.Modality') {
    if (
      action === 'ADD' &&
      details.hasOwnProperty('from') &&
      details.hasOwnProperty('to')
    ) {
      return datasetAddAndRemoveInfoDisplayHelper(
        'Dataset.Modality',
        'ADD',
        details,
      );
    } else if (
      action === 'REMOVE' &&
      details.hasOwnProperty('from') &&
      details.hasOwnProperty('to')
    ) {
      return datasetAddAndRemoveInfoDisplayHelper(
        'Dataset.Modality',
        'REMOVE',
        details,
      );
    }
  } else if (caseType === 'Dataset.CollectionMethod') {
    if (
      action === 'ADD' &&
      details.hasOwnProperty('from') &&
      details.hasOwnProperty('to')
    ) {
      return datasetAddAndRemoveInfoDisplayHelper(
        'Dataset.CollectionMethod',
        'ADD',
        details,
      );
    } else if (
      action === 'REMOVE' &&
      details.hasOwnProperty('from') &&
      details.hasOwnProperty('to')
    ) {
      return datasetAddAndRemoveInfoDisplayHelper(
        'Dataset.CollectionMethod',
        'REMOVE',
        details,
      );
    }
  }
};

const fileInfoDisplayHelper = (details) => {
  let addFiles;
  addFiles = details.sourceList.map(
    (el) => el.split('/')[el.split('/').length - 1],
  );
  return addFiles.join(', ').length > 60 ? (
    <Tooltip title={addFiles.join(', ')}>{`${addFiles
      .join(', ')
      .slice(0, 60)}...`}</Tooltip>
  ) : (
    addFiles.join(', ')
  );
};

const schemaInfoDisplay = {
  schemaCreateInfoDisplay: (details) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <PlusOutlined
          style={{ color: variables.primaryColor1, marginRight: '10px' }}
        />
        <p style={{ margin: '0px' }}>
          Created a schema in HDC:{' '}
          <span style={{ fontWeight: 600 }}>
            {details.targetName.length > 40 ? (
              <Tooltip title={details.targetName}>{`${details.targetName.slice(
                0,
                40,
              )}...`}</Tooltip>
            ) : (
              details.targetName
            )}
          </span>
        </p>
      </div>
    );
  },
  schemaRemoveInfoDisplay: (details) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <CloseOutlined
          style={{ color: variables.primaryColorLight3, marginRight: '10px' }}
        />
        <p style={{ margin: '0px' }}>
          Deleted a schema in HDC:{' '}
          <span style={{ fontWeight: 600 }}>
            {details.targetName.length > 40 ? (
              <Tooltip title={details.targetName}>{`${details.targetName.slice(
                0,
                40,
              )}...`}</Tooltip>
            ) : (
              details.targetName
            )}
          </span>
        </p>
      </div>
    );
  },
  schemaUpdateInfoDisplay: (details) => {
    let properties = details.changes.map((e) => e.property);

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <SyncOutlined
          style={{ color: variables.primaryColorLight1, marginRight: '10px' }}
        />
        <p style={{ margin: '0px' }}>
          Updated a schema in HDC:{' '}
          <span style={{ fontWeight: 600 }}>
            {details.targetName.length > 40 ? (
              <Tooltip title={details.targetName}>{`${details.targetName.slice(
                0,
                40,
              )}...`}</Tooltip>
            ) : (
              details.targetName
            )}
          </span>
        </p>
      </div>
    );
  },
  schemaUploadKGInfoDisplay: (details) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <CloudUploadOutlined
          style={{ color: variables.primaryColor1, marginRight: '10px' }}
        />
        <p style={{ margin: '0px' }}>
          Uploaded a schema to KG:{' '}
          <span style={{ fontWeight: 600 }}>
            {details.targetName.length > 40 ? (
              <Tooltip title={details.targetName}>{`${details.targetName.slice(
                0,
                40,
              )}...`}</Tooltip>
            ) : (
              details.targetName
            )}
          </span>
        </p>
      </div>
    );
  },
  schemaDownloadKGInfoDisplay: (details) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <CloudDownloadOutlined
          style={{ color: variables.primaryColor1, marginRight: '10px' }}
        />
        <p style={{ margin: '0px' }}>
          Downloaded a schema from KG:{' '}
          <span style={{ fontWeight: 600 }}>
            {details.targetName.length > 40 ? (
              <Tooltip title={details.targetName}>{`${details.targetName.slice(
                0,
                40,
              )}...`}</Tooltip>
            ) : (
              details.targetName
            )}
          </span>
        </p>
      </div>
    );
  },
  schemaDeleteKGInfoDisplay: (details) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <CloseOutlined
          style={{ color: variables.primaryColorLight3, marginRight: '10px' }}
        />
        <p style={{ margin: '0px' }}>
          Deleted a schema in KG:{' '}
          <span style={{ fontWeight: 600 }}>
            {details.targetName.length > 40 ? (
              <Tooltip title={details.targetName}>{`${details.targetName.slice(
                0,
                40,
              )}...`}</Tooltip>
            ) : (
              details.targetName
            )}
          </span>
        </p>
      </div>
    );
  },
  schemaRefreshKGInfoDisplay: (details) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <SyncOutlined
          style={{ color: variables.primaryColorLight1, marginRight: '10px' }}
        />
        <p style={{ margin: '0px' }}>
          Updated a schema from KG:{' '}
          <span style={{ fontWeight: 600 }}>
            {details.targetName.length > 40 ? (
              <Tooltip title={details.targetName}>{`${details.targetName.slice(
                0,
                40,
              )}...`}</Tooltip>
            ) : (
              details.targetName
            )}
          </span>
        </p>
      </div>
    );
  },
};

const schemaTemplateInfoDisplay = {
  schemaTemplateCreateInfoDisplay: (details) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <PlusOutlined
          style={{ color: variables.primaryColor1, marginRight: '10px' }}
        />
        <p style={{ margin: '0px' }}>
          Added a Custom Schema Template:{' '}
          <span style={{ fontWeight: 600 }}>
            {details.targetName.length > 40 ? (
              <Tooltip title={details.targetName}>{`${details.targetName.slice(
                0,
                40,
              )}...`}</Tooltip>
            ) : (
              details.targetName
            )}
          </span>
        </p>
      </div>
    );
  },
};

const fileInfoDisplay = (caseType, action, details) => {
  if (caseType === 'File') {
    if (
      action === 'MOVE' &&
      details.hasOwnProperty('from') &&
      details.hasOwnProperty('to')
    ) {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ImportOutlined
            style={{ color: variables.primaryColor1, marginRight: '10px' }}
          />
          <p style={{ margin: '0px' }}>
            Moved a file/folder from:{' '}
            <span style={{ fontWeight: 600 }}>
              {details.from.length > 40 ? (
                <Tooltip title={details.from}>{`${details.from.slice(
                  0,
                  40,
                )}...`}</Tooltip>
              ) : (
                details.from
              )}
            </span>{' '}
            to{' '}
            <span style={{ fontWeight: 600 }}>
              {details.to.length > 40 ? (
                <Tooltip title={details.to}>{`${details.to.slice(
                  0,
                  40,
                )}...`}</Tooltip>
              ) : (
                details.to
              )}
            </span>
          </p>
        </div>
      );
    } else if (action === 'ADD') {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PlusOutlined
            style={{ color: variables.primaryColor1, marginRight: '10px' }}
          />
          <p style={{ margin: '0px' }}>
            {details.itemType != 'file'
              ? `Added folder(s): `
              : `Added file(s): `}
            {details.itemName}
            {` from Project `}
            <span style={{ fontWeight: 600 }}>{details.importedFrom}</span>
            {` `}({networkOriginIcon(details.networkOrigin)})
          </p>
        </div>
      );
    } else if (action === 'REMOVE' && details.hasOwnProperty('itemType')) {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CloseOutlined
            style={{ color: variables.primaryColorLight3, marginRight: '10px' }}
          />
          <p style={{ margin: '0px' }}>
            Deleted a file/folder:{' '}
            <span style={{ fontWeight: 600 }}>{details.itemName}</span>
          </p>
        </div>
      );
    } else if (action === 'DOWNLOAD' && details.hasOwnProperty('itemType')) {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DownloadOutlined
            style={{ color: variables.primaryColor1, marginRight: '10px' }}
          />
          <p style={{ margin: '0px' }}>
            File or folder <span style={{ fontWeight: 600 }}>{details.itemName}</span> was downloaded ({networkOriginIcon(details.networkOrigin)})
          </p>
        </div>
      );
    } else if (action === 'CREATE' && details.hasOwnProperty('itemName')) {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PlusOutlined
            style={{ color: variables.primaryColor1, marginRight: '10px' }}
          />
          <p style={{ margin: '0px' }}>
            Created a folder:{' '}
            <span style={{ fontWeight: 600 }}>{details.itemName}</span>
          </p>
        </div>
      );
    } else if (
      action === 'UPDATE' &&
      details.changes &&
      details.changes.length &&
      details.changes[0].hasOwnProperty('oldValue') &&
      details.changes[0].hasOwnProperty('newValue')
    ) {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EditOutlined
            style={{ color: variables.primaryColor1, marginRight: '10px' }}
          />
          <p style={{ margin: '0px' }}>
            {details.changes[0].itemProperty === 'name'
              ? `Renamed a file/folder from:${' '}`
              : `Moved a file/folder from:${' '}`}
            <span style={{ fontWeight: 600 }}>
              {details.changes[0].oldValue.length > 40 ? (
                <Tooltip
                  title={details.changes[0].oldValue}
                >{`${details.changes[0].oldValue.slice(0, 40)}...`}</Tooltip>
              ) : (
                details.changes[0].oldValue
              )}
            </span>{' '}
            to{' '}
            <span style={{ fontWeight: 600 }}>
              {details.changes[0].newValue.length > 40 ? (
                <Tooltip
                  title={details.changes[0].newValue}
                >{`${details.changes[0].newValue.slice(0, 40)}...`}</Tooltip>
              ) : (
                details.changes[0].newValue
              )}
            </span>
          </p>
        </div>
      );
    }
  }
};

const logsInfo = (activityType, detail) => {
  switch (detail.index) {
    case 'dataset':
      switch (activityType) {
        case 'create':
          return datasetCreateInfoDisplay();
        case 'download':
          return datasetDownloadInfoDisplay(detail);
        case 'release': {
          return datasetVersionInfoDisplay(detail);
        }
        case 'sharing_request_update': {
          return datasetSharingRequestUpdateInfoDisplay(detail);
        }
        case 'kg_create':
          return spaceCreateInfoDisplay();
        case 'schema_create':
          return schemaInfoDisplay.schemaCreateInfoDisplay(detail);
        case 'schema_delete':
          return schemaInfoDisplay.schemaRemoveInfoDisplay(detail);
        case 'schema_update':
          return schemaInfoDisplay.schemaUpdateInfoDisplay(detail);
        case 'template_create':
          return schemaTemplateInfoDisplay.schemaTemplateCreateInfoDisplay(
            detail,
          );
        case 'kg_metadata_delete':
          return schemaInfoDisplay.schemaDeleteKGInfoDisplay(detail);
        case 'kg_metadata_upload':
          return schemaInfoDisplay.schemaUploadKGInfoDisplay(detail);
        case 'kg_metadata_refresh':
          return schemaInfoDisplay.schemaRefreshKGInfoDisplay(detail);
        case 'kg_metadata_download':
          return schemaInfoDisplay.schemaDownloadKGInfoDisplay(detail);
      }
    case 'file':
      switch (activityType) {
        case 'create':
          return fileInfoDisplay('File', 'CREATE', detail);
        case 'import':
          return fileInfoDisplay('File', 'ADD', detail);
        case 'update':
          return fileInfoDisplay('File', 'UPDATE', detail);
        case 'delete':
          return fileInfoDisplay('File', 'REMOVE', detail);
        case 'download':
          return fileInfoDisplay('File', 'DOWNLOAD', detail);
      }

    default:
      return null;
  }
};

export default logsInfo;
