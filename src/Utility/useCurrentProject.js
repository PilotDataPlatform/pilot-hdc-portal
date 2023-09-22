/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { store } from '../Redux/store';
import _ from 'lodash';

function useCurrentProject() {
  const { containersPermission } = useSelector((state) => state);
  const { projectCode } = useParams();
  if (!projectCode) {
    return [undefined];
  }
  const currentProject = _.find(containersPermission, (item) => {
    return item.code === projectCode;
  });
  return [currentProject];
}

function withCurrentProject(WrappedComponent) {
  return function (props) {
    const [currentProject] = useCurrentProject();
    return <WrappedComponent {...props} currentProject={currentProject} />;
  };
}

export { useCurrentProject, withCurrentProject };
