/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Typography } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
const { Title } = Typography;
function Description(props) {
  const {
    containersPermission,
    match: {
      params: { projectCode },
    },
    content,
  } = props;
  const currentContainer =
    containersPermission &&
    containersPermission.find((ele) => {
      return ele.code === projectCode;
    });
  return (
    <>
      <Title level={3}>
        {currentContainer ? <>{currentContainer.name} </> : 'Not Available'}
      </Title>
      <p>{content} </p>
    </>
  );
}

export default connect((state) => ({
  containersPermission: state.containersPermission,
}))(withRouter(Description));
