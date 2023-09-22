/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Button, message } from 'antd';
import {
  withCurrentProject,
  toFixedNumber,
  useCurrentProject,
  getProjectRolePermission,
  permissionResource,
  permissionOperation,
} from '../../../Utility';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import SearchConditions from './Components/SearchConditions';
import SearchResultTable from './Components/SearchResultTable';
import { searchProjectFilesAPI, getProjectManifestList } from '../../../APIs';
import variables from '../../../Themes/constants.scss';
import { setCurrentProjectTPL } from '../../../Redux/actions';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';

function Search(props) {
  const { fileAttributesTemplates } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const [currentDataset = {}] = useCurrentProject();
  const { t } = useTranslation(['formErrorMessages']);
  const [conditions, setConditions] = useState([]);
  const [searchConditions, setSearchConditions] = useState([]);
  const [files, setFiles] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [greenRoomTotal, setGreenRoomTotal] = useState('');
  const [coreTotal, setCoreTotal] = useState('');
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [attributeList, setAttributeList] = useState([]);
  const permission = props.containerDetails.permission;
  const [conditionCompKey, setConditionCompKey] = useState(0);
  const roles = useSelector((state) => state.rolePermissions.roles);
  const permissionGrAny = getProjectRolePermission(permission, {
    zone: 'greenroom',
    operation: permissionOperation.view,
    resource: permissionResource.anyFile,
  });
  const permissionGrOwn = getProjectRolePermission(permission, {
    zone: 'greenroom',
    operation: permissionOperation.view,
    resource: permissionResource.ownFile,
  });
  const permissionCoreAny = getProjectRolePermission(permission, {
    zone: 'core',
    operation: permissionOperation.view,
    resource: permissionResource.anyFile,
  });
  const permissionCoreOwn = getProjectRolePermission(permission, {
    zone: 'core',
    operation: permissionOperation.view,
    resource: permissionResource.ownFile,
  });
  const grAccess = permissionGrAny || permissionGrOwn;
  const coreAccess = permissionCoreAny || permissionCoreOwn;
  useEffect(() => {
    if (roles && roles.length) {
      setFilters({ zone: grAccess ? 'greenroom' : 'core' });
    }
  }, [roles]);
  const queryTransformer = (condition) => {
    switch (condition.category) {
      case 'file_name':
        const name =
          condition.condition === 'contain'
            ? `%${condition.keywords}%`
            : condition.keywords;
        return { name };

      case 'uploader':
        const owner =
          condition.condition === 'contain'
            ? `%${condition.keywords}%`
            : condition.keywords;
        return { owner };

      case 'time_created':
        const [timeStart, timeEnd] = condition.calendar;
        return {
          created_time_start: moment.unix(timeStart).format(),
          created_time_end: moment.unix(timeEnd).format(),
        };

      case 'file_size':
        let fileSize = Number(condition.value);
        let fileSize2 = Number(condition.value2);
        if (condition.unit === 'kb') fileSize = fileSize * 1024;
        if (condition.unit === 'mb') fileSize = fileSize * 1024 * 1024;
        if (condition.unit === 'gb') fileSize = fileSize * 1024 * 1024 * 1024;

        if (fileSize2) {
          if (condition.unit === 'kb') fileSize2 = fileSize2 * 1024;
          if (condition.unit === 'mb') fileSize2 = fileSize2 * 1024 * 1024;
          if (condition.unit === 'gb')
            fileSize2 = fileSize2 * 1024 * 1024 * 1024;

          return {
            size_gte: toFixedNumber(fileSize),
            size_lte: toFixedNumber(fileSize2),
          };
        } else {
          return {
            [`size_${condition.condition}`]: toFixedNumber(fileSize),
          };
        }

      case 'tags':
        return { tags_all: condition.keywords.join(',') };

      case 'attributes':
        const containAttributes = attributeList.some((el) => el.name);
        const attributes = containAttributes
          ? attributeList
              ?.map((attr) => {
                return {
                  [attr.name]: attr.value,
                };
              })
              .reduce((params, attr) => ({ ...params, ...attr }), {})
          : {};
        return {
          template_id: fileAttributesTemplates.find(
            (t) => t.name === condition.name,
          ).id,
          attributes,
        };
    }
  };

  const searchFiles = async (pagination = { page, page_size: pageSize }) => {
    setLoading(true);
    const queryParams = conditions.reduce(
      (params, condition) => ({ ...params, ...queryTransformer(condition) }),
      {},
    );
    const greenroomQueryParams = {
      ...queryParams,
      zone: 'greenroom',
    };
    const coreQueryParams = {
      ...queryParams,
      zone: 'core',
    };
    try {
      let zoneResponse;
      if (grAccess) {
        const greenroomResponse = await searchProjectFilesAPI(
          { ...greenroomQueryParams, ...pagination },
          props.currentProject.code,
        );
        zoneResponse = greenroomResponse;
        setGreenRoomTotal(greenroomResponse.data.total);
      }
      if (coreAccess) {
        const coreResponse = await searchProjectFilesAPI(
          { ...coreQueryParams, ...pagination },
          props.currentProject.code,
        );
        zoneResponse = coreResponse;
        setCoreTotal(coreResponse.data.total);
      }
      const zoneResults = zoneResponse.data.result.map((file) => ({
        ...file,
        key: file.storage_id,
      }));
      setFiles(zoneResults);
    } catch {
      message.error(t('formErrorMessages:search:default:0'));
    }
    setLoading(false);
  };

  const onTableChange = (pagination) => {
    const page = pagination.current;
    const pageSize = pagination.pageSize;

    setPage(page);
    setPageSize(pageSize);

    const paginationParams = {
      page,
      page_size: pageSize,
    };

    searchFiles(paginationParams);
  };

  const resetConditions = () => {
    setConditions([{ cid: uuidv4() }]);
    setConditionCompKey(conditionCompKey + 1);
    setFilters({ zone: grAccess ? 'greenroom' : 'core' });
    setGreenRoomTotal('');
    setCoreTotal('');
    setFiles([]);
    setPage(0);
  };

  useEffect(() => {
    if (conditions[0]?.category) {
      searchFiles();
    }
  }, [filters]);

  useEffect(() => {
    getProjectManifestList(currentDataset.code).then((res) => {
      dispatch(setCurrentProjectTPL(res.data.result));
    });
  }, []);
  return (
    <>
      <div
        style={{
          margin: '17px 17px 0px 35px',
          borderRadius: 8,
          boxShadow: '0px 3px 6px #0000001A',
          background: 'white',
          letterSpacing: '0.2px',
          minHeight: '720px',
        }}
      >
        <div
          style={{
            borderBottom: '1px solid #f1f1f1',
            height: 45,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              color: variables.primaryColor1,
              fontSize: 16,
              fontWeight: 'bold',
              margin: '0px 0px 0px 20px',
            }}
          >
            Search
          </p>
          {grAccess || coreAccess ? (
            <Button
              type="primary"
              style={{
                marginRight: '20px',
                borderRadius: '6px',
                height: '30px',
                width: '70px',
                marginTop: '3px',
              }}
              onClick={() => resetConditions()}
            >
              Reset
            </Button>
          ) : null}
        </div>
        {grAccess || coreAccess ? (
          <>
            <SearchConditions
              key={conditionCompKey}
              conditions={conditions}
              setConditions={setConditions}
              searchFiles={searchFiles}
              permission={permission}
              attributeList={attributeList}
              setAttributeList={setAttributeList}
              searchConditions={searchConditions}
              setSearchConditions={setSearchConditions}
              setPage={setPage}
              setPageSize={setPageSize}
            />
            {roles && roles.length ? (
              <SearchResultTable
                files={files}
                page={page}
                setPage={setPage}
                greenRoomTotal={greenRoomTotal}
                coreTotal={coreTotal}
                onTableChange={onTableChange}
                pageSize={pageSize}
                setFilters={setFilters}
                filters={filters}
                loading={loading}
                attributeList={attributeList}
                searchConditions={searchConditions}
                grAccess={grAccess}
                coreAccess={coreAccess}
              />
            ) : null}
          </>
        ) : null}
      </div>
    </>
  );
}
export default withCurrentProject(Search);
