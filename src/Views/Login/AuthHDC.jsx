/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { Component } from 'react';
import { Col, Row, Button, Modal, notification, message } from 'antd';
import { ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import styles from './auth.module.scss';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  AddDatasetCreator,
  setUserListCreator,
  setTagsCreator,
  setMetadatasCreator,
  setContainersPermissionCreator,
  setUserRoleCreator,
  setIsLoginCreator,
  setUsernameCreator,
} from '../../Redux/actions';
import { login as keycloakLogin } from '../../Utility/keycloakActions';

import { tokenManager } from '../../Service/tokenManager';
import { PORTAL_PREFIX, PLATFORM } from '../../config';
import { xwikis } from '../../externalLinks';
import i18n from '../../i18n';
const { detect } = require('detect-browser');
const browser = detect();
const isSafari = browser?.name === 'safari';
const { confirm } = Modal;

class AuthHDC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookiesDrawer: false,
      notificationKey: null,
      btnLoading: false,
    };
  }
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  componentDidMount() {
    this.setTermsOfUse();
  }

  componentWillUnmount() {
    const key = this.state.notificationKey;
    notification.close(key);
  }

  setTermsOfUse = () => {
    const cookiesNotified = localStorage.getItem('cookies_notified');

    if (!cookiesNotified) {
      const closeNotification = () => {
        notification.close(key);
        localStorage.setItem('cookies_notified', true);
      };
      const key = `open${Date.now()}`;
      this.setState({ notificationKey: key });
      const btn = (
        <Button type="primary" size="small" onClick={closeNotification}>
          OK
        </Button>
      );

      notification.open({
        message: 'Cookies on this site',
        description: (
          <>
            <p>
              We use cookies to make your experience better by keeping your
              session information and login status. By using the {PLATFORM} you
              accept our use of cookies in accordance with our{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={xwikis.privacyPolicy}
              >
                Privacy Policy
              </a>
            </p>
          </>
        ),
        key,
        btn,
        duration: 0,
        onClose: closeNotification,
      });
    }
  };

  onFinish = async (values) => {
    try {
      await new Promise((resolve, reject) => {
        const { uploadList, allCookies } = this.props;
        const uploadingList = uploadList.filter(
          (item) => item.status === 'uploading',
        );
        if (
          uploadingList.length === 0 ||
          allCookies.username === values.username
        ) {
          resolve();
          return;
        }
        confirm({
          title: `Are you sure to log in as ${values.username}?`,
          icon: <ExclamationCircleOutlined />,
          content: `The file uploading is still in progress in another tab. Progress will be lost if you login as ${values.username}`,
          onOk() {
            resolve();
          },
          onCancel() {
            reject();
          },
        });
      });
    } catch (err) {
      return;
    }

    this.setState({ btnLoading: true });

    keycloakLogin().catch((err) => {
      if (err.response) {
        message.error(`${i18n.t('errormessages:login.default.0')}`);
        this.setState({ btnLoading: false });
      }
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  showDrawer = () => {
    this.setState({
      cookiesDrawer: true,
    });
  };
  onDrawerClose = () => {
    this.setState({
      cookiesDrawer: false,
    });
  };

  render() {
    if (tokenManager.getLocalCookie('sessionId')) {
      if (isSafari) {
        window.location.href = `${PORTAL_PREFIX}/landing`;
      } else {
        return <Redirect to="/landing" />;
      }
    }
    return (
      <>
        <div className={styles.container}>
          <div className={styles.header}>
            <span
              className={styles['header__login']}
              id="auth_login_btn"
              onClick={this.onFinish}
              loading={this.state.btnLoading}
            >
              <UserOutlined
                style={{
                  marginRight: 13,
                  strokeWidth: '30',
                  stroke: 'white',
                }}
              />
              Login
            </span>
          </div>
          <div class="cover">
            <div class="cover-left">
              <img src="/img/HDC-Logo.svg" alt="" />
              <h2>EBRAINS Services for Sensitive Data</h2>
              <span>In partnership with</span>
              <div class="cover-orgs">
                <div>
                  <img src="/img/ebrains.svg?v=2" alt="" />
                </div>
                <div>
                  <img src="/img/Human Brain Project-Logo.png" alt="" />
                </div>
              </div>
            </div>
            <img src="/img/HDC-TopBar-Graphics.svg" alt="" />
          </div>
          <div class="ebrains-wrap">
            <div class="ebrains">
              <img src="/img/ebrain-HDC.png" />
              <div>
                <h2>EBRAINS Services for Health Data in the Cloud</h2>
                <p>
                  The HealthDataCloud aims to provide EBRAINS services for
                  sensitive data. Our consortium comprises a mixture of existing
                  Human Brain Project (HBP)/EBRAINS infrastructure partners and
                  leading health data service providers that have recently
                  joined the HBP. The consortium is coordinated by Charité
                  University Medicine Berlin, Europe’s largest University
                  hospital. The foundation for the EBRAINS HealthDataCloud is an
                  existing GDPR compliant and EBRAINS interoperable
                  <a
                    href="https://vre.charite.de/vre/"
                    style={{ color: '#516674', fontWeight: 'bold' }}
                  >
                    Virtual Research Environment (VRE)
                  </a>
                  – located at the Charité - that provides a secure and scalable
                  data platform enabling multi-institutional research teams to
                  store, share and analyze complex multi-modal health datasets.
                </p>
                <div class="gdpr-note">
                  <img src="/img/GDPR-ready-Gold.svg" />
                  <div class="gdpr-note-text">
                    <h4>GDPR READY</h4>
                    <p>
                      The VRE has undergone a successful GDPR Service Readiness
                      Audit
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="objective">
            <h2>
              The EBRAINS HealthDataCloud addresses the design principles
              <br />
              and requirements of the EBRAINS Services for Sensitive Data
            </h2>
            <div class="objective-cards">
              <div class="objective-cards-card">
                <img src="/img/GDCPR-Compliant.svg" alt="" />
                <p>
                  Federated research data ecosystem that enables neuroscience
                  research consortia across Europe and beyond to collect,
                  process and share sensitive data with GDPR-compliance.
                </p>
              </div>
              <div class="objective-cards-card">
                <img src="/img/Interoperable.svg" alt="" />
                <p>
                  Interoperable with EBRAINS research infrastructure and
                  services, built upon FAIR data principles and open standards.
                </p>
              </div>
              <div class="objective-cards-card">
                <img src="/img/Security.svg" alt="" />
                <p>
                  Seamless access to high performance computing and analytics
                  using encryption and sandboxing for data protection.
                </p>
              </div>
              <div class="objective-cards-card">
                <img src="/img/Architecture.svg" alt="" />
                <p>
                  Built on a robust and proven system architecture that provides
                  agility and scalability to address evolving research data
                  needs.
                </p>
              </div>
            </div>
          </div>
          <div class="architecture">
            <div class="architecture-left">
              <a target="_blank" href="/img/HDC-Architecture.png">
                <img src="/img/HDC-Architecture.png" alt="" />
                <div>*Click to enlarge</div>
              </a>
            </div>
            <div class="architecture-right">
              <h2>HealthDataCloud Architecture</h2>
              <p>
                The EBRAINS HealthDataCloud is a federation of interoperable
                nodes including a central node deployed at EBRAINS RI and an
                expandable set of satellite nodes deployed at hospitals,
                research institutes and computing centres. Nodes generally share
                a common system architecture based on the Charité VRE, enabling
                research consortia to manage and process data while making data
                discoverable and shareable on the EBRAINS Knowledge Graph.
              </p>
            </div>
          </div>
          <div class="governance">
            <div class="governance-left">
              <h2>GDPR-compliant governance and data protection framework</h2>
              <p>
                The processing of personal health data requires a high degree of
                data protection to guarantee the privacy rights of natural
                persons under the European General Data Protection Regulation
                (GDPR). Privacy by design and by default is addressed by a
                coordinated network of governance and oversight mechanisms,
                technical and organizational measures, engagement of data
                protection and research ethics authorities, and communication
                and transparency with data subjects.
              </p>
            </div>
            <div class="governance-right">
              <a target="_blank" href="./img/Diagram-DataFramework.svg">
                <img src="/img/Diagram-DataFramework.svg" alt="" />
                <div>*Click to enlarge</div>
              </a>
            </div>
          </div>
          <div class="architecture2">
            <div class="architecture2-left">
              <a target="_blank" href="./img/ebrains-vre-coreservices.png">
                <img src="/img/ebrains-vre-coreservices.png" alt="" />
                <div>*Click to enlarge</div>
              </a>
            </div>
            <div class="architecture2-right">
              <h2>Interoperability of Core Services</h2>
              <p>
                The foundation for the EBRAINS HealthDataCloud is the
                GDPR-compliant and EBRAINS interoperable Virtual Research
                Environment (VRE), located at the Charité University Medicine
                Berlin, providing a secure and scalable data platform enabling
                multi-institutional research teams to store, share and analyze
                complex multi-modal health datasets. The VRE is an innovative
                project that co-designs a research platform for sensitive data
                in close interaction and continuous inclusion of the scientific
                community.
              </p>
            </div>
          </div>
          <div class="principles">
            <h2>FAIR Data Principles</h2>
            <p>
              HealthDataCloud services for sensitive data promote practices to
              ensure that data
              <br />
              are findable, accessible, interoperable and reusable.
            </p>
            <div class="principles-cards">
              <div class="principles-card">
                <img src="/img/principles/RobustTools.svg" alt="" />
                <p>Metadata capture, annotation and provenance tracking</p>
              </div>
              <div class="principles-card">
                <img src="/img/principles/Findability.svg" alt="" />
                <p>Advanced search tools and knowledge graph interface</p>
              </div>
              <div class="principles-card">
                <img src="/img/principles/OpenData.svg" alt="" />
                <p>Support for open data standards (e.g., OpenMINDS, BIDS)</p>
              </div>
              <div class="principles-card">
                <img src="/img/principles/OpenSource.svg" alt="" />
                <p>
                  Support for common open-source tools and services for
                  analytics and collaboration
                </p>
              </div>
              <div class="principles-card">
                <img src="/img/principles/Documentation.svg" alt="" />
                <p>
                  Reusable data protection compliance templates for typical data
                  processing and data sharing use cases
                </p>
              </div>
              <div class="principles-card">
                <img src="/img/principles/Templates.svg" alt="" />
                <p>
                  Interoperability with EBRAINS services and large-scale
                  computing centres
                </p>
              </div>
            </div>
          </div>

          <div class="member">
            <h2>Consortium Partner Organizations</h2>
            <div class="member-flex">
              <div class="member-flex-card card-1">
                <div class="left-photo">
                  <a href="https://www.charite.de/" target="_blank">
                    <img class="company-photo" src="/img/teams/charite.svg" />
                  </a>
                </div>
                <div class="right-des">
                  <div class="profile">Petra Ritter (Coordinator)</div>
                  <div class="profile-email">
                    <i>petra.ritter@charite.de</i>
                  </div>
                  <div class="profile">
                    Charité University Medicine Berlin (CHARITE) <br />
                    Germany
                  </div>
                </div>
              </div>
              <div class="member-flex-card card-2">
                <div class="left-photo">
                  <a href="https://www.indocresearch.org/" target="_blank">
                    <img class="company-photo" src="/img/teams/indoc.svg" />
                  </a>
                </div>
                <div class="right-des">
                  <div class="profile">Stephane Pollentier</div>
                  <div class="profile-email">
                    <i>spollentier@indocresearch.org</i>
                  </div>
                  <div class="profile">
                    Indoc Europe gGmbH (INDOC) <br />
                    Germany
                  </div>
                </div>
              </div>
              <div class="member-flex-card card-3">
                <div class="left-photo">
                  <a href="https://www.cscs.ch/" target="_blank">
                    <img class="company-photo" src="/img/teams/CSCS-logo.svg" />
                  </a>
                </div>
                <div class="right-des">
                  <div class="profile">Colin McMurtrie</div>
                  <div class="profile-email">
                    <i>colin.mcmurtrie@cscs.ch</i>
                  </div>
                  <div class="profile">
                    CSCS - Swiss National Supercomputing Centre
                    <br />
                    Switzerland
                  </div>
                </div>
              </div>
              <div class="member-flex-card card-4">
                <div class="left-photo">
                  <a
                    href="https://fz-juelich.de/portal/DE/Home/home_node.html"
                    target="_blank"
                  >
                    <img class="company-photo" src="/img/teams/julich.svg" />
                  </a>
                </div>
                <div class="right-des">
                  <div class="profile">Boris Orth</div>
                  <div class="profile-email">
                    <i>b.orth@fz-juelich.de</i>
                  </div>
                  <div class="profile">
                    Forschungszentrum Julich GmbH (JUELICH)
                    <br />
                    Germany
                  </div>
                </div>
              </div>
              <div class="member-flex-card card-5">
                <div class="left-photo">
                  <a href="https://www.bsc.es/" target="_blank">
                    <img class="company-photo" src="/img/teams/BSC.svg" />
                  </a>
                </div>
                <div class="right-des">
                  <div class="profile">Javier Bartolome</div>
                  <div class="profile-email">
                    <i>javier.bartolome@bsc.es</i>
                  </div>
                  <div class="profile">
                    Barcelona Supercomputing Center -<br />
                    Centro Nacional de Supercomputación (BSC-CNS)
                    <br />
                    Spain
                  </div>
                </div>
              </div>
              <div class="member-flex-card card-6">
                <div class="left-photo">
                  <a href="https://www.kth.se/" target="_blank">
                    <img class="company-photo" src="/img/teams/KTH.svg" />
                  </a>
                </div>
                <div class="right-des">
                  <div class="profile">Dirk Pleiter</div>
                  <div class="profile-email">
                    <i>pleiter@kth.se</i>
                  </div>
                  <div class="profile">
                    PDC Center for High Performance Computing
                    <br />
                    Sweden
                  </div>
                </div>
              </div>
              <div class="member-flex-card card-7">
                <div class="left-photo">
                  <a
                    href="https://oslo-universitetssykehus.no/"
                    target="_blank"
                  >
                    <img class="company-photo" src="/img/teams/OUH.svg" />
                  </a>
                </div>
                <div class="right-des">
                  <div class="profile">Ira Haraldsen</div>
                  <div class="profile-email">
                    <i>i.h.haraldsen@medisin.uio.no</i>
                  </div>
                  <div class="profile">
                    Oslo University Hospital (OUH) <br />
                    Norway
                  </div>
                </div>
              </div>
              <div class="member-flex-card card-8">
                <div class="left-photo">
                  <a href="http://www.athenarc.gr/" target="_blank">
                    <img class="company-photo" src="/img/teams/ATHENA.svg" />
                  </a>
                </div>
                <div class="right-des">
                  <div class="profile">Minos Garofalakis</div>
                  <div class="profile-email">
                    <i>minos@athenarc.gr</i>
                  </div>
                  <div class="profile">
                    ATHENA R.C., Management of Data Information, and Knowledge
                    (MaDgIK) Group at IMSI
                    <br />
                    Greece
                  </div>
                </div>
              </div>
              <div class="member-flex-card card-9">
                <div class="left-photo">
                  <a href="https://ethz.ch/de.html" target="_blank">
                    <img class="company-photo" src="/img/teams/ETH.svg" />
                  </a>
                </div>
                <div class="right-des">
                  <div class="profile">Bernd Rinn</div>
                  <div class="profile-email">
                    <i>brinn@ethz.ch</i>
                  </div>
                  <div class="profile">
                    Eidgenössische Technische Hochschule Zürich - Scientific IT
                    Services (ETHZ-SIS)
                    <br />
                    Switzerland
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div class="footer">
            <div class="footer-left">
              <span>Powered by EU-co-funded Human Brain Project</span>
              <div class="footer-images">
                <img src="/img/HDC-Logo-footer.svg" alt="" />
                <img src="/img/Human Brain Project-Logo.png" alt="" />
                <img src="/img/eu-co-funded.svg" alt="" />
              </div>
            </div>
            <div class="footer-note">
              <a
                target="_blank"
                href="https://www.brainsimulation.org/bsw/zwei/team-contact"
              >
                Imprint
              </a>
              <a target="_blank" href={xwikis.privacyPolicy}>
                Data Privacy Statement
              </a>
              <a target="_blank" href={xwikis.termsOfUse}>
                Terms of Use
              </a>
              <a
                target="_blank"
                href="https://xwiki.hdc.humanbrainproject.eu/bin/view/userguide/"
              >
                Documentation
              </a>
              <span>© 2023-2024 HealthDataCloud , All Rights Reserved</span>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(
  withCookies(
    connect((state) => ({ uploadList: state.uploadList }), {
      AddDatasetCreator,
      setUserListCreator,
      setTagsCreator,
      setMetadatasCreator,
      setContainersPermissionCreator,
      setUserRoleCreator,
      setIsLoginCreator,
      setUsernameCreator,
    })(AuthHDC),
  ),
);
