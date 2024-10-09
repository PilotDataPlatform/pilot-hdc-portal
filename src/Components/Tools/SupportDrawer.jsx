/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { Button, Drawer, Divider, Typography, Anchor } from 'antd';
import { SwapOutlined, PauseOutlined } from '@ant-design/icons';
import SupportCollapse from './SupportCollapse';
import ContactUsForm from './ContactUsForm';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';
import { xwikis } from '../../externalLinks';
import _ from 'lodash';

const { Title } = Typography;
const { Link } = Anchor;

function SupportDrawer(props) {
  const [placement, setPlacement] = useState('right');
  const [width, setWidth] = useState(400);
  const { t } = useTranslation('support');
  const [isOpen, setIsOpen] = useState(true);
  const qaList = t('drawers', { returnObjects: true });
  useEffect(() => {
    function handleResize() {
      if (width > window.innerWidth) setWidth(window.innerWidth);
      props.onClose();
    }
    window.addEventListener(
      'resize',
      _.debounce(handleResize, 1000, { leading: false }),
    );
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [width]);

  function swapPosition() {
    if (placement === 'left') {
      setPlacement('right');
    } else {
      setPlacement('left');
    }
  }
  function mouseDown(e) {
    document.addEventListener('mousemove', mouseMove, true);
    document.addEventListener('mouseup', stopMove, true);
  }

  function mouseMove(e) {
    const windowWidth = window.innerWidth;
    const mouseX = e.clientX;
    let panelWidth;
    if (placement === 'right') {
      panelWidth = Math.min(windowWidth - mouseX, windowWidth - 20);
    } else {
      panelWidth = Math.min(mouseX, windowWidth - 20);
    }
    const minWidth = 280;
    panelWidth = Math.max(panelWidth, minWidth);

    setWidth(panelWidth);
  }

  function stopMove() {
    document.removeEventListener('mousemove', mouseMove, true);
    document.removeEventListener('mouseup', stopMove, true);
  }

  function getPosition() {
    if (placement === 'right') {
      return width - 32;
    } else {
      return -14;
    }
  }

  const rightArrow = (
    <svg
      onClick={() => {
        setIsOpen((state) => !state);
      }}
      viewBox="0 0 1024 1024"
      focusable="false"
      data-icon="caret-right"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      className={styles.arrow + ' ' + (isOpen && styles.active)}
    >
      <path d="M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z"></path>
    </svg>
  );

  return (
    <Drawer
      title="Support"
      id="support-drawer"
      className={styles['support-drawer']}
      placement={placement}
      onClose={props.onClose}
      open={props.open}
      mask={false}
      closable={true}
      width={width}
    >
      <Title level={4} id="toc">
        Contents
      </Title>
      <Anchor
        style={{ position: 'relative', overflow: 'hidden' }}
        affix={false}
      >
        <Link href="#user-guide" title="User Guide" />
        {rightArrow}
        <div style={{ paddingLeft: 15 }}>
          <Link href="#faq" title="FAQ">
            <div className={styles.subHeader + ' ' + (isOpen && styles.active)}>
              {qaList.map((qaItem) => {
                return (
                  <Link
                    href={`#${qaItem.title.replace(/\s+/g, '-').toLowerCase()}`}
                    title={qaItem.title}
                  />
                );
              })}
            </div>
          </Link>
        </div>
        <Link href="#contact-us" title="Contact Us" />
      </Anchor>
      <br />
      <Button
        onMouseDown={mouseDown}
        type="link"
        style={{
          position: 'absolute',
          top: '50%',
          right: `${getPosition()}px`,
          transform: 'translateY(-50%)',
          zIndex: '99',
          transition: 'none',
          cursor: 'ew-resize',
        }}
      >
        <PauseOutlined />
      </Button>
      <Button
        type={'link'}
        onClick={swapPosition}
        style={{ position: 'absolute', top: '12px', right: '36px' }}
      >
        <SwapOutlined />
      </Button>
      <Title level={4} id="user-guide">
        {t('userguide')}
      </Title>
      <p>{t('userguide_content')}</p>

      <Button type="primary" ghost>
        <a
          href="https://xwiki.hdc.humanbrainproject.eu/bin/view/userguide/"
          target="_blank"
        >
          User Guide
        </a>
      </Button>
      <Divider />
      <Title level={4} id="faq">
        {t('faq_title')}
      </Title>
      <SupportCollapse />
      <Divider />
      <ContactUsForm />
    </Drawer>
  );
}

export default SupportDrawer;
