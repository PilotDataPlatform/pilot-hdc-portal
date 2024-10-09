/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { StandardLayout } from '../../Components/Layout';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import LandingPageContent from './LandingPageContent/LandingPageContent';
import styles from './LandingPageContent/index.module.scss';

function LandingPageLayout(props) {
  const config = {
    observationVars: [],
    initFunc: () => {},
  };
  return (
    <StandardLayout className={styles.landingPageLayout}>
      <LandingPageContent />
    </StandardLayout>
  );
}

export default connect((state) => ({
  role: state.role,
}))(withRouter(LandingPageLayout));
