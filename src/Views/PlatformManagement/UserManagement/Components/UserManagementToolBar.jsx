/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { withRouter } from 'react-router-dom';
import { MailOutlined } from '@ant-design/icons';
import CreateEmailModal from '../../../Components/Modals/CreateEmailModal';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import {
  setPersonalDatasetIdCreator,
  setContainersPermissionCreator,
} from '../../../Redux/actions';
import styles from '../index.module.scss';
const { Sider } = Layout;

function UserManagementToolBar(props) {
  const [isCreateEmailModalShown, toggleCreateEmailModal] = useState(false);

  return (
    <>
      <Sider collapsed={true} reverseArrow={true} trigger={null} theme="light">
        <Menu
          defaultSelectedKeys={['dashboard']}
          mode="inline"
          className={styles.upperMenu}
        >
          {props.role === 'admin' && (
            <Menu.Item
              key="dataset"
              onClick={() => {
                toggleCreateEmailModal(true);
              }}
            >
              <MailOutlined />
              <span>Send Email</span>
            </Menu.Item>
          )}
        </Menu>
      </Sider>

      <CreateEmailModal
        visible={isCreateEmailModalShown}
        setVisble={toggleCreateEmailModal}
      ></CreateEmailModal>
    </>
  );
}

export default connect(
  (state) => ({ personalDatasetId: state.personalDatasetId, role: state.role }),
  { setContainersPermissionCreator, setPersonalDatasetIdCreator },
)(withRouter(withCookies(UserManagementToolBar)));
