/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { tokenTimer } from '../../Service/keycloak';

const getText = (accTimeRemain, isRefreshed) => {
  if (isRefreshed) {
    return 'Your session is now refreshed!';
  } else {
    return (
      <>
        {' '}
        <span>If no more actions, Your session will expire in </span>{' '}
        <b>{accTimeRemain > 0 ? accTimeRemain : 0}</b>s{' '}
      </>
    );
  }
};

function ExpirationNotification({ getIsSessionMax, isRefreshed }) {
  const [timeRemain, setTimeRemain] = useState(
    tokenTimer.getRefreshRemainTime(),
  );
  const [accTimeRemain, setAccTimeRemain] = useState(
    tokenTimer.getAccessRemainTime(),
  );
  const [isSessionMax, setIsSessionMax] = useState(getIsSessionMax());
  useEffect(() => {
    const condition = () => true;
    tokenTimer.addListener({
      func: () => {
        setIsSessionMax(getIsSessionMax());
        setTimeRemain(tokenTimer.getRefreshRemainTime());
        setAccTimeRemain(tokenTimer.getAccessRemainTime());
      },
      condition,
    });
  }, []);
  const text = isSessionMax
    ? `You are reaching the max allowed session time in ${
        timeRemain > 0 ? timeRemain : 0
      }`
    : getText(accTimeRemain, isRefreshed);
  return <>{text}</>;
}

export default ExpirationNotification;
