/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useSelector } from 'react-redux';

import styles from './index.module.scss';
import StandardLayout from '../../Components/Layout/StandardLayout';
import MemberProfileCard from './Components/Cards/MemberProfileCard';
import ProjectMemberCard from './Components/Cards/ProjectMemberCard';
import RecentActivitiesCard from './Components/Cards/RecentActivitiesCard';
import { getUserProfileAPI } from '../../APIs';
import i18n from '../../i18n';

const UserProfile = () => {
  const { username, role } = useSelector((state) => state);
  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const profileResponse = await getUserProfileAPI(username);
        setUserProfile(profileResponse.data.result);
      } catch {
        message.error(`${i18n.t('errormessages:userProfileAPI.default.0')}`, 3);
      }
    };
    getUserProfile();
  }, []);
  return (
    <StandardLayout>
      <div className={styles['user-profile']}>
        <div className={styles['user-profile__container']}>
          <div className={styles['user-profile__container-left']}>
            <MemberProfileCard
              userProfile={userProfile}
              showPasswordReset={true}
            />
            <ProjectMemberCard username={username} role={role} />
          </div>
          <div className={styles['user-profile__container-right']}>
            <RecentActivitiesCard userId={userProfile.id} />
          </div>
        </div>
      </div>
    </StandardLayout>
  );
};

export default UserProfile;
