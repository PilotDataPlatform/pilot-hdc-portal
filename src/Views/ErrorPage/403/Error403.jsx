/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Result, Button, Layout } from 'antd';
import { withRouter } from 'react-router-dom';
const { Content } = Layout;
function Error403(props) {
  return (
    <Content>
      <Result
        status="403"
        title="403"
        style={{ height: '93vh' }}
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button
            onClick={() => {
              props.history.push('/landing');
            }}
            type="primary"
          >
            Back Home
          </Button>
        }
      />
    </Content>
  );
}

export default withRouter(Error403);
