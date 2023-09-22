/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { List, Empty, message } from 'antd';

import styles from '../../index.module.scss';
import BaseCard from './BaseCard';
import ProjectMemberListItem from '../ListItems/ProjectMemberListItem';
import { listUsersContainersPermission } from '../../../../APIs';

const ProjectMemberCard = ({ username, role }) => {
  const [userProjects, setUserProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserProjects = async () => {
      try {
        const params = {
          order_by: 'created_at',
          order_type: 'desc',
          is_all: true,
        };
        const projectsResponse = await listUsersContainersPermission(
          username,
          params,
        );
        setUserProjects(projectsResponse.data.results);
      } catch {
        message.error(
          "Something went wrong while retrieving user's project membership data",
        );
      }
    };

    if (role !== 'admin') {
      getUserProjects();
    }

    setIsLoading(false);
  }, [username, role]);

  if (role === 'admin') {
    return (
      <BaseCard
        title="Project Membership"
        className={styles['user-profile__card--project']}
      >
        <div className={styles['project__admin-role']}>
          <p>Platform Administrator does not take any Project Roles</p>
        </div>
      </BaseCard>
    );
  }

  if (!isLoading && !userProjects.length) {
    return (
      <BaseCard
        title="Project Membership"
        className={styles['user-profile__card--project']}
      >
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="User is not part of any projects"
        />
      </BaseCard>
    );
  }

  return (
    <BaseCard
      title="Project Membership"
      className={styles['user-profile__card--project']}
    >
      <List
        dataSource={userProjects}
        key="user-projects"
        loading={isLoading}
        renderItem={(project) => <ProjectMemberListItem project={project} />}
        pagination={
          !isLoading && {
            total: userProjects.length,
            showSizeChanger: true,
          }
        }
      />
    </BaseCard>
  );
};

export default ProjectMemberCard;
