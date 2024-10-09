/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { Layout, Button, Space } from 'antd';
import styles from './index.module.scss';
import TermsOfUseModal from '../Modals/TermsOfUseModal';
import { setIsReleaseNoteShownCreator } from '../../Redux/actions';
import { useDispatch } from 'react-redux';
import packageInfo from '../../../package.json';
import { xwikis } from '../../externalLinks';
const { Footer } = Layout;

function AppFooter(props) {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const showModal = () => {
    setModal(true);
  };
  const handleOk = () => {
    setModal(false);
  };
  return (
    <Footer
      className={
        props.leftContent
          ? styles['footer--leftContent']
          : props.theme == 'dark'
          ? styles['footer--dark']
          : styles.footer
      }
    >
      <Space className={styles.menu}>
        <a
          target="_blank"
          rel="noreferrer"
          href={xwikis.termsOfUse}
          style={{
            fontSize: '80%',
            height: '32px',
            lineHeight: '32px',
            display: 'block',
            marginTop: -3,
            marginRight: 20,
          }}
        >
          Terms of Use
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '80%',
            height: '32px',
            lineHeight: '32px',
            display: 'block',
            marginTop: -3,
          }}
          href={xwikis.privacyPolicy}
        >
          Privacy Policy
        </a>
      </Space>
      <small className={styles.copyright}>
        <Button
          onClick={() => {
            dispatch(setIsReleaseNoteShownCreator(true));
          }}
          style={{ paddingRight: 0 }}
          type="link"
        >
          <small className={styles.copyright}>
            {' '}
            Pilot HDC Version {packageInfo.displayVersion}
          </small>
        </Button>{' '}
        © 2022-2024, Indoc Systems Inc.
      </small>{' '}
      <TermsOfUseModal
        visible={modal}
        handleOk={handleOk}
        handleCancel={handleOk}
      />
    </Footer>
  );
}

export default AppFooter;
