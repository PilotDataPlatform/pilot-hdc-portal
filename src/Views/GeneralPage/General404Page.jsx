/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Result, Button, Layout } from 'antd';
import { withRouter } from 'react-router-dom';
import { BRANDING_PREFIX } from '../../config';
const { Content } = Layout;
function General404Page(props) {
  return (
    <Content style={{ marginTop: 50 }}>
      <Result
        status="404"
        style={{ height: '93vh' }}
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <a  href={BRANDING_PREFIX}>
            <Button type="primary">Back Home</Button>
          </a>
        }
      />
    </Content>
  );
}

export default withRouter(General404Page);
