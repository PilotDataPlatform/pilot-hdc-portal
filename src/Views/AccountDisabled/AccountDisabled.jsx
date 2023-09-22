/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Layout } from 'antd';
import AppHeader from '../../Components/Layout/Header';
import { SUPPORT_EMAIL } from '../../config';

const { Content } = Layout;
function AccountDisabled() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader unauthorized />
      <Content
        style={{ margin: '15px 20px', background: 'white', borderRadius: 6 }}
      >
        <p
          style={{
            marginTop: '30vh',
            fontSize: 14,
            color: '#222222',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Your account has been disabled, please contact{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> if any
          questions.
        </p>
      </Content>
    </Layout>
  );
}

export default AccountDisabled;
