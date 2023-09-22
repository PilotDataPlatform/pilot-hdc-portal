/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Row,
  Layout,
  PageHeader,
  Typography,
  Avatar,
  Tag,
  Tooltip,
} from 'antd';
import {
  UserOutlined,
  UpCircleOutlined,
  DownCircleOutlined,
} from '@ant-design/icons';
import {
  getUsersCountOnProjectAPI,
  getAdminsOnDatasetAPI,
} from '../../../../APIs';
import { objectKeysToCamelCase, getTags } from '../../../../Utility';
import { PLATFORM } from '../../../../config';
import styles from './index.module.scss';
import variables from '../../../../Themes/constants.scss';
import { mapProjectRoles } from '../../../UserProfile/utils';
const { Content } = Layout;
const { Paragraph } = Typography;
function ProjectItemCard({ item, currentRole, platformRole }) {
  const [pageHeaderExpand, setPageHeaderExpand] = useState(false);
  const [usersInfo, setUsersInfo] = useState(null);
  const [userListOnDataset, setUserListOnDataset] = useState(null);
  async function loadAdmin() {
    const users = await getAdminsOnDatasetAPI(item.globalEntityId);
    setUserListOnDataset(objectKeysToCamelCase(users.data.result));
  }
  async function loadUsersInfo() {
    const usersInfo = await getUsersCountOnProjectAPI(item.globalEntityId);
    if (usersInfo && usersInfo.data && usersInfo.data.result) {
      setUsersInfo(usersInfo.data.result);
    }
  }
  let userRole;
  if (platformRole === 'admin') {
    userRole = 'Platform Administrator';
  } else {
    userRole = mapProjectRoles(currentRole);
  }
  const administrators = usersInfo && usersInfo.admin;
  const contributors = usersInfo && usersInfo.contributor;
  const collaborators = usersInfo && usersInfo.collaborator;
  const adminsContent = (
    <div style={{ marginTop: -8 }}>
      <div
        style={{
          lineHeight: '16px',
          marginTop: 15,
          marginBottom: 10,
          fontSize: 15,
          whiteSpace: 'normal',
          wordBreak: 'break-all',
        }}
      >
        <span
          style={{
            color: variables.primaryColor1,
            fontSize: '14px',
            marginRight: '20px',
            fontWeight: 'normal',
          }}
        >
          Administrators
        </span>
        {userListOnDataset &&
          userListOnDataset.map((el, index) => (
            <a
              href={
                'mailto:' +
                el.email +
                `?subject=[${PLATFORM} Platform: ${item.name}]`
              }
              target="_blank"
              style={{ paddingRight: '5px' }}
              key={index}
            >
              <span
                style={{
                  color: variables.primaryColorLight1,
                  fontSize: '12px',
                  marginRight: '20px',
                  fontWeight: 'normal',
                }}
              >
                {`${el.firstName} ${el.lastName}`}
              </span>
            </a>
          ))}
      </div>
    </div>
  );
  const title = (
    <div>
      {currentRole ? (
        <Link to={`/project/${item.code}/canvas`}>
          {item.name.length > 40 ? (
            <Tooltip title={item.name}>
              <div style={{ marginTop: '-4px' }}>
                <span
                  style={{
                    maxWidth: '100%',
                    display: 'inline-block',
                    verticalAlign: 'bottom',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: variables.primaryColor1,
                    fontSize: '24px',
                  }}
                >
                  {item.name}
                </span>
              </div>
            </Tooltip>
          ) : (
            <div style={{ marginTop: '-4px' }}>
              <span
                style={{
                  maxWidth: '100%',
                  display: 'inline-block',
                  verticalAlign: 'bottom',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: variables.primaryColor1,
                  fontSize: '24px',
                }}
              >
                {item.name}
              </span>
            </div>
          )}
        </Link>
      ) : (
        <div style={{ marginTop: '-4px' }}>
          <span
            style={{
              maxWidth: '100%',
              display: 'inline-block',
              verticalAlign: 'bottom',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: variables.primaryColor1,
              fontSize: '24px',
            }}
          >
            {item.name}
          </span>
        </div>
      )}

      <div style={{ marginTop: '-8px' }}>
        <span
          style={{
            color: '#595959',
            fontSize: '14px',
            fontWeight: 'normal',
          }}
        >
          {`Project Code: ${item.code} `}
        </span>
        {userRole ? (
          <span
            style={{
              color: '#818181',
              fontSize: '14px',
              fontWeight: 'lighter',
            }}
          >
            {`/ Your role is ${userRole}`}
          </span>
        ) : null}
      </div>
      {currentRole && pageHeaderExpand ? adminsContent : null}
    </div>
  );

  const pageHeaderContent = (
    <Content>
      <Paragraph>
        <div style={{ height: 14, lineHeight: '14px', marginTop: -15 }}>
          <span
            style={{
              color: '#818181',
              fontSize: '14px',
            }}
          >
            Description
          </span>
        </div>
        {item.description ? (
          <div>
            <p
              style={{
                color: '#595959',
                fontSize: '14px',
                marginTop: 4,
                lineHeight: '20px',
                wordBreak: 'break-all',
              }}
            >
              {item.description}
            </p>
          </div>
        ) : (
          <div>
            <p
              style={{
                color: '#595959',
                fontSize: '14px',
                marginTop: 4,
                lineHeight: '20px',
              }}
            >
              There is no description for this project.
            </p>
          </div>
        )}
      </Paragraph>
    </Content>
  );

  const tagsContent = (
    <div style={{ width: 290, flex: '0 0 290px' }}>
      {currentRole === 'admin' && pageHeaderExpand && usersInfo ? (
        <div style={{ marginTop: '2px', textAlign: 'right', marginRight: 44 }}>
          <div style={{ textAlign: 'right' }}>
            <UserOutlined style={{ fontSize: '22px', color: '#1C5388' }} />
          </div>
          <div style={{ height: 35, lineHeight: '35px' }}>
            <span
              style={{
                color: '#818181',
                fontSize: '15px',
                verticalAlign: 'middle',
                fontWeight: 300,
              }}
            >
              Administrators
            </span>
            <span
              style={{
                color: variables.primaryColor1,
                fontSize: '24px',
                fontWeight: 'bold',
                verticalAlign: 'middle',
                marginLeft: 17,
              }}
            >
              {administrators ? administrators : 0}
            </span>
          </div>
          <div style={{ height: 35, lineHeight: '35px' }}>
            <span
              style={{
                color: '#818181',
                fontSize: '15px',
                verticalAlign: 'middle',
                fontWeight: 300,
              }}
            >
              Contributors
            </span>
            <span
              style={{
                color: variables.primaryColor1,
                fontSize: '24px',
                fontWeight: 'bold',
                verticalAlign: 'middle',
                marginLeft: 17,
              }}
            >
              {contributors ? contributors : 0}
            </span>
          </div>
          <div style={{ height: 35, lineHeight: '35px', marginBottom: '5px' }}>
            <span
              style={{
                color: '#818181',
                fontSize: '15px',
                verticalAlign: 'middle',
                fontWeight: 300,
              }}
            >
              Collaborators
            </span>
            <span
              style={{
                color: variables.primaryColor1,
                fontSize: '24px',
                fontWeight: 'bold',
                verticalAlign: 'middle',
                marginLeft: 17,
              }}
            >
              {collaborators ? collaborators : 0}
            </span>
          </div>
        </div>
      ) : (
        <div style={{ height: '26px' }}></div>
      )}
      <div
        style={{
          display: 'block',
          marginRight: '44px',
          lineHeight: '35px',
          textAlign: 'right',
          maxWidth: '600px',
        }}
      >
        {item.tags && getTags(item.tags)}
      </div>
    </div>
  );

  const showTagsContent = (role, expand) => {
    if (currentRole !== 'admin' && expand) {
      return (
        <div>
          <div style={{ height: '50px' }}></div>
          {tagsContent}
        </div>
      );
    } else {
      return tagsContent;
    }
  };
  const avatar = item.imageUrl ? (
    <Avatar
      shape="circle"
      src={item.imageUrl}
      style={{
        border: variables.primaryColorDark1,

        borderWidth: '1px',
        width: 42,
        height: 42,
        background: variables.primaryColor1,
      }}
    ></Avatar>
  ) : (
    <Avatar
      shape="circle"
      style={{
        border: variables.primaryColorDark1,

        borderWidth: '1px',
        width: 42,
        height: 42,
        paddingTop: 4,
        background: variables.primaryColor1,
      }}
    >
      <span
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          verticalAlign: 'middle',
        }}
      >
        {item.name ? item.name.charAt(0) : ''}
      </span>
    </Avatar>
  );

  return (
    <div
      style={{
        position: 'relative',
        marginBottom: 20,
        boxShadow: '0 1px 7px #0000001A',
        borderRadius: 8,
      }}
    >
      <Content
        style={{
          backgroundColor: currentRole ? '#ffffff' : '#F0F0F0',
          paddingTop: 19,
          paddingBottom: 13,
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            paddingLeft: 18,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {currentRole ? (
              <Link to={`/project/${item.code}/canvas`}>
                <div
                  style={{
                    padding: '8px 0 0 0',
                    marginLeft: 8,
                  }}
                >
                  {avatar}
                </div>
              </Link>
            ) : (
              <div
                style={{
                  padding: '8px 0 0 0',
                  marginLeft: 8,
                }}
              >
                {avatar}
              </div>
            )}

            <div style={{ paddingLeft: 15, flex: 1, overflow: 'hidden' }}>
              <PageHeader
                ghost={true}
                style={{
                  padding: '0px 0px 0px 0px',
                }}
                title={title}
              >
                {pageHeaderExpand && pageHeaderContent}
              </PageHeader>
            </div>
          </div>
          {showTagsContent(currentRole, pageHeaderExpand)}
        </div>
      </Content>
      <div style={{ position: 'absolute', right: 10, bottom: -10 }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 22,
            height: 22,
            borderRadius: '50%',
            backgroundColor: 'white',
            zIndex: 1,
          }}
        ></div>
        {pageHeaderExpand ? (
          <UpCircleOutlined
            onClick={() => {
              setPageHeaderExpand(false);
            }}
            className={styles['expend-icon']}
          />
        ) : (
          <DownCircleOutlined
            onClick={() => {
              if (currentRole && !userListOnDataset) {
                loadAdmin();
              }
              if (currentRole && currentRole === 'admin' && !usersInfo) {
                loadUsersInfo();
              }
              setPageHeaderExpand(true);
            }}
            className={styles['expend-icon']}
          />
        )}
      </div>
    </div>
  );
}
export default ProjectItemCard;
