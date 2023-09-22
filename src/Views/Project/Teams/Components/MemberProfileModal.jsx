/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { getUserProfileAPI } from '../../../../APIs';
import { Modal, Layout, message } from 'antd';
import {
  timeConvert,
  partialString,
  useCurrentProject,
} from '../../../../Utility';
import MemberProfileCard from '../../../UserProfile/Components/Cards/MemberProfileCard';
import ProjectMemberCard from '../../../UserProfile/Components/Cards/ProjectMemberCard';
import RecentActivitiesCard from '../../../UserProfile/Components/Cards/RecentActivitiesCard';
import RecentActivitiesItem from '../../../UserProfile/Components/ListItems/RecentActivitiesItem';
import styles from './MemberProfileModal.module.scss';
import { useSelector } from 'react-redux';
import i18n from '../../../../i18n';
const { Content } = Layout;
function MemberProfileModal(props) {
  const { username, role } = useSelector((state) => state);
  const [userProfile, setUserProfile] = useState({});
  const [currentProject] = useCurrentProject();
  const hideMask = false;
  useEffect(() => {
    const getUserProfile = async () => {
      if (props.curRecord) {
        console.log('current project', currentProject.code);
        try {
          const profileResponse = await getUserProfileAPI(
            props.curRecord.name,
            currentProject.code,
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
  }, [props.curRecord]);
  return (
    <Modal
      className={styles['profile-modal']}
      title="Member Profile"
      width={'80%'}
      footer={null}
      style={{ top: 30 }}
      visible={props.visible}
      onCancel={props.onCancel}
      getContainer={() => {
        return document.querySelector('#members-section');
      }}
      maskClosable={true}
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
      <Content className={styles['user-profile__container']}>
        <div className={styles['user-profile__container-left']}>
          <MemberProfileCard
            userProfile={userProfile}
            layout="vertical"
            title="User Information"
          />
        </div>
        <div className={styles['user-profile__container-right']}>
          <RecentActivitiesCard
            userId={userProfile.id}
            currentProject={currentProject}
          />
        </div>
      </Content>
    </Modal>
  );
}

export default MemberProfileModal;
