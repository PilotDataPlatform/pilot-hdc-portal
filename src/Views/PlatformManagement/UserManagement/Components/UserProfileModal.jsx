/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { getUserProfileAPI } from '../../../../APIs';
import { Modal, Layout, message } from 'antd';
import { timeConvert, partialString } from '../../../../Utility';
import MemberProfileCard from '../../../UserProfile/Components/Cards/MemberProfileCard';
import ProjectMemberCard from '../../../UserProfile/Components/Cards/ProjectMemberCard';
import RecentActivitiesCard from '../../../UserProfile/Components/Cards/RecentActivitiesCard';
import RecentActivitiesItem from '../../../UserProfile/Components/ListItems/RecentActivitiesItem';
import styles from './UserProfileModal.module.scss';
import { useSelector } from 'react-redux';
import i18n from '../../../../i18n';
const { Content } = Layout;
function UserProfileModal(props) {
  const [userProfile, setUserProfile] = useState({});
  const hideMask = false;
  useEffect(() => {
    const getUserProfile = async () => {
      if (props.record) {
        setUserProfile({});
        try {
          const profileResponse = await getUserProfileAPI(
            props.record.username,
          );
          setUserProfile(profileResponse.data.result);
        } catch {
          message.error(
            `${i18n.t('errormessages:userProfileAPI.default.0')}`,
            3,
          );
        }
      }
    };
    getUserProfile();
  }, [props.record]);
  return (
    <Modal
      className={styles['profile-modal']}
      title="Profile"
      width={'98%'}
      footer={null}
      style={{ top: 15 }}
      visible={props.visible}
      onCancel={props.onCancel}
      maskClosable={true}
      getContainer={() => {
        return document.querySelector('#platform-management-section');
      }}
      maskStyle={
        hideMask
          ? { display: 'none' }
          : {
              background: 'rgb(89 89 89 / 25%)',
              'backdrop-filter': 'blur(12px)',
              top: '80px',
              zIndex: 500,
            }
      }
    >
      {props.record ? (
        <Content className={styles['user-profile__container']}>
          <div className={styles['user-profile__container-left']}>
            <div style={{ marginBottom: 12 }}>
              <MemberProfileCard userProfile={userProfile} showAccountStatus />
            </div>
            <div className={styles['user-profile__projects-area']}>
              <ProjectMemberCard
                username={props.record.username}
                role={props.record.role}
              />
            </div>
          </div>
          <div className={styles['user-profile__container-right']}>
            <RecentActivitiesCard userId={userProfile.id} />
          </div>
        </Content>
      ) : null}
    </Modal>
  );
}

export default UserProfileModal;
