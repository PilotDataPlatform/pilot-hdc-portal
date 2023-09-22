/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Spin, Button } from 'antd';
import { UndoOutlined } from '@ant-design/icons';

import BaseCard from './BaseCard';
import MemberProfile from '../ListItems/MemberProfile';
import ResetPasswordModal from '../../../../Components/Modals/ResetPasswordModal';
import styles from '../../index.module.scss';

const MemberProfileCard = ({
  userProfile,
  showAccountStatus = false,
  showPasswordReset = false,
  layout = 'horizontal',
  title = 'User Profile',
}) => {
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const resetPasswordButton = (
    <Button
      type="link"
      onClick={() => {
        setShowResetPasswordModal({ modalVisible: true });
      }}
    >
      <UndoOutlined />
      <span>Reset Password</span>
    </Button>
  );
  const accountStatus = () => {
    const userStatus =
      userProfile.attributes?.status === 'active' ? 'active' : 'disabled';
    return (
      <span className={styles[`member__account-status--${userStatus}`]}>
        Account Status: <span>{userProfile.attributes?.status}</span>
      </span>
    );
  };
  const extraButton = showAccountStatus
    ? accountStatus()
    : showPasswordReset
    ? resetPasswordButton
    : null;

  useEffect(() => {
    if (userProfile.username) {
      setIsLoading(false);
    }
  }, [userProfile]);

  return (
    <BaseCard
      title={title}
      className={styles['user-profile__card--member']}
      extra={extraButton}
    >
      <Spin spinning={isLoading}>
        <MemberProfile user={userProfile} layout={layout} />
      </Spin>
      <ResetPasswordModal
        visible={showResetPasswordModal}
        handleCancel={() => setShowResetPasswordModal(false)}
      />
    </BaseCard>
  );
};

export default MemberProfileCard;
