/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Card, Checkbox } from 'antd';
import styles from '../../index.module.scss';


export const useMatomoOptOut = () => {
  const [isOptedOut, setIsOptedOut] = useState(false);

  useEffect(() => {
    window._paq = window._paq || [];

    window._paq.push([
      function() {
        setIsOptedOut(this.isUserOptedOut());  // 'this' refers to the Matomo tracker instance here
      },
    ]);
  }, []);

  const handleOptOut = () => {
    window._paq = window._paq || [];
    window._paq.push(['optUserOut']);
    setIsOptedOut(true);
  };

  const handleOptIn = () => {
    window._paq = window._paq || [];
    window._paq.push(['forgetUserOptOut']);
    setIsOptedOut(false);
  };

  return { isOptedOut, handleOptOut, handleOptIn };
};

const WebAnalyticsPreferencesCard = () => {
  const { isOptedOut, handleOptOut, handleOptIn } = useMatomoOptOut();

  return (
    <Card
      title={'Web Analytics Preferences'}
      className={styles['user-profile__card']}
      style={{ marginBottom: '100px' }}
      bodyStyle={{ padding: '25px' }}
    >
      <p>
        This website uses Matomo, a web analytics service operated within the EBRAINS infrastructure, to collect aggregated statistics about platform usage and improve the service.
        Matomo may process information such as accessed pages, timestamps, browser and device information, anonymized IP addresses, approximate geolocation, and usage interactions.
        First-party cookies may be used to distinguish new and returning visitors. The collected data is used exclusively for operational analytics and service improvement purposes and is not used for advertising or cross-site tracking.
        If you don't wish to share this data, please click below to opt out.
        For more details, please review our <a href='https://object.hdc.ebrains.eu/public-resources/HDC-Privacy-Policy.pdf' target='_blank' rel='noreferrer'>Privacy Policy</a>.
      </p>
      <Checkbox style={{ marginTop: '12px' }} onClick={isOptedOut ? handleOptIn : handleOptOut} checked={!isOptedOut}>
        You are currently {isOptedOut ? ' opted out. Click here to opt in.' : ' opted in. Click here to opt out.'}
      </Checkbox>
    </Card>
  );
};

export default WebAnalyticsPreferencesCard;
