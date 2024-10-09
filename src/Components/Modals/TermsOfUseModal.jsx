/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Modal } from 'antd';
import styles from './terms.module.scss';

function TermsOfUseModal(props) {
  return (
    <Modal
      title='Platform Terms of Use Agreement'
      visible={props.visible}
      onOk={props.handleOk}
      onCancel={props.handleCancel}
      width={'70%'}
      footer={props.footer}
      maskClosable={false}
      zIndex='1020'
      className={styles.terms_modal}
    >
      <div
        style={{ overflowY: 'scroll', height: '60vh' }}
        onScroll={props.handleScroll}
      >
        <div>
          <h1>HDC General Terms of Use</h1>
          <h5>Version 1.0</h5>
          <h2>Table of Contents</h2>
          <ol>
            <li><a href='#first'>1 Scope</a></li>
            <li><a href='#second'>2 Glossary</a></li>
            <li>
              <a href='#third'>3 Accessing the HDC</a>
              <ol>
                <li><a href='#third-one'>3.1 HDC User Account</a></li>
                <li><a href='#third-two'>3.2 Personal information we collect</a></li>
                <li><a href='#third-three'>3.3 HDC responsibilities</a></li>
              </ol>
            </li>
            <li><a href='#fourth'>4 Transferring Research Data to the HDC</a></li>
            <li>
              <a href='#fifth'>5 Accessing Data and Services on the HDC</a>
              <ol>
                <li><a href='#fifth-one'>5.1 Limitations of Use </a></li>
                <li><a href='#fifth-two'>5.2 Licensing</a></li>
                <li><a href='#fifth-three'>5.3 Citation</a></li>
              </ol>
            </li>
            <li><a href='#sixth'>6 Intellectual Property</a></li>
            <li><a href='#seventh'>7 Other policies and conditions that may apply to you</a></li>
            <li><a href='#eighth'>8 Termination and Liability</a></li>
            <li><a href='#ninth'>9 Disputes and Disagreements</a></li>
            <li><a href='#tenth'>10 Contact Us</a></li>
            <li><a href='#eleventh'>11 Imprint</a></li>
          </ol>
          <h4 className='ant-typography'>Version History</h4>
          <table className='version-table'>
            <thead>
              <tr>
                <td>Version</td>
                <td>Description</td>
                <td>Approval</td>
                <td>Date (yyyy-mm-dd)</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1.0</td>
                <td>Initial General Terms of Use</td>
                <td>Petra Ritter</td>
                <td>2023-03-03</td>
              </tr>
            </tbody>
          </table>
          <p>These General Terms of Use define the relationship between HDC service
            provider and you as you access and use the Health Data Cloud (HDC). The use of
            the HDC implies that you accept these terms and conditions. Additional terms of
            use may apply to the use of specific HDC services.</p>
          <h4 className='ant-typography' id='first'>1 Scope</h4>
          <p>These terms govern any use of the HDC, including access to content, services, tools, and products
            available in or through the HDC. </p>
          <h4 className='ant-typography' id='second'>2 Glossary</h4>
            <ul>
              <li><b>Controller</b><span> or </span><b>Data Controller</b><span> means a natural or legal person, public
          authority,   agency   or   other   body   which,   alone   or   jointly   with   others,
          determines the purposes and means of the processing of personal data
          (GDPR Art. 4(7))</span></li>
              <li><b>GDPR</b><span> means the General Data Protection Regulation </span></li>
              <li><b>Processor</b><span> or </span><b>Data Processor</b><span> means a natural or legal person, public
          authority, agency or other body which processes personal data on behalf of
          the controller (GDPR Art. 4(8))</span></li>
              <li><b>Pseudonymization</b><span> means the processing of User’s personal data in such a
          manner that the personal data can no longer be attributed to a specific data
          subject   without   the   use   of   additional   information,   provided   that   such
          additional information is kept separately and is subject to technical and
          organisational measures to ensure that the personal data are not attributed
          to an identified or identifiable natural person (GDPR Art. 4(5))</span></li>
              <li><b>Technical and Organizational Measures</b><span> means those measures aimed at
          protecting  personal  data   against   accidental   or   unlawful   destruction   or
          accidental loss, alteration, unauthorised disclosure or access, in particular
          where the processing involves the transmission of data over a network, and
          against all other unlawful forms of processing.</span></li>
              <li><b>User Account Information</b><span> means Personal information about the User for
          the purpose of providing a User Account on the HDC.</span></li>
              <li><b>User</b><span> means a user of the HDC.</span></li>
              <li><b>User’s Data</b><span> means data processed by the User via the Services.</span></li>
              <li><b>User’s Personal Data</b><span> means the personal data contained within the User’s
          data.</span></li>
              <li><b>Health Data Cloud (HDC)</b><span> means the dedicated storage and computing
          platform provided by the service provider within an IT infrastructure to store
          and process personal data for research purposes.</span></li>
              <li><b>HDC Administrator </b><span> means an employee of the service provider or its
          contracted partners tasked with oversight, operations, and/or maintenance of the HDC.</span></li>
              <li><b>HDC Core</b><span> means the data storage zone in which Users can store and
          process data that has been separated from the uploaded User’s Personal data
          stored in the Green Room.</span></li>
              <li><b>HDC Green Room</b><span> means the data storage zone in which Users can upload
          and process User’s data to pseudonymize and/or limit exposure of potentially
          sensitive information to those not authorized to view that information.</span></li>

            </ul>
          <h4 className='ant-typography' id='third'>3 Accessing the HDC</h4>
          <p>For additional information about how the HDC is accessed and used, please refer to the HDC Access Policy
            available at <a href='https://object.hdc.humanbrainproject.eu/public-resources/HDC-Access-Policy.pdf'
                            target='_blank'>https://object.hdc.humanbrainproject.eu/public-resources/HDC-Access-Policy.pdf</a>
          </p>
          <h5 id='third-one'>3.1 HDC User Account</h5>
          <p>Access to the HDC requires an HDC user account consisting of a username and
            password. You certify that the details of your identity provided to the HDC service
            provider in association with applying for an HDC user account are accurate</p>
          <p>You agree to keep details of your user account, including password, secret.Account credentials are not to
            be shared with anyone. You must inform HDC support immediately if you suspect any unauthorized use of or
            access to your password or account (hdc@humanbrainproject.eu)</p>
          <p>The HDC service provider and its sub-service providers will not be responsible if you
            or others suffer any harm or loss because you do not keep your account secure.</p>
          <h5 id='third-two'>3.2 Personal information we collect</h5>
          <p>When you access or use the HDC, we may collect and process your personal <b>User
            Account information</b>. The type of information collected depends on the services
            you are accessing or using. The purposes for processing categories of personal
            data collected and the legal basis for processing can be found in the HDC Privacy
            Policy available at <a
              href='https://object.hdc.humanbrainproject.eu/public-resources/HDC-Privacy-Policy.pdf'
              target='_blank'>https://object.hdc.humanbrainproject.eu/public-resources/HDC-Privacy-Policy.pdf</a></p>
          <h5 id='third-three'>3.3 HDC responsibilities</h5>
          <p>HDC service provider and its sub-service providers will take appropriate measures
            to ensure that the processing of your<b>User Account information</b> is done in a safe
            and secure manner and in accordance with applicable data protection law. All
            requests associated with your rights as a data subject related to user account
            information collected and processed in the HDC can be made to the Chraite Data
            Protection Officer by emailing: <a href='mailto:datenschutz@charite.de'>datenschutz@charite.de</a>.</p>

          <h4 className='ant-typography' id='forth'>4 Transferring Research Data to the HDC</h4>
          <p>The HDC allows you to transfer a copy of your research data for the purpose of
            storing and processing these data in the HDC. The data you transfer to the HDC will
            be associated with a HDC project. Other HDC users who have been authorized to
            access this project by a Project Administrator of the project will be able to access all
            or a subset of the data you transfer to the HDC, and all or a subset of data derived
            from the data you transfer to the HDC (e.g., the results of any processing
            conducted on the data you transfer to the HDC).</p>
          <p>In transferring data to the HDC, you accept the following terms:</p>
            <ol>
              <li>You agree to use the HDC only for the purpose of conducting scientific
                research or browsing publicly available content for personal interest and not
                for any other purpose including, without limitation any commercial purpose,
                without prior written consent of the HDC service provider.
              </li>
              <li>You have the legal authority to transfer and make available data in the
                HDC for dissemination and use within the HDC.
              </li>
              <li>The data that you transfer to the HDC were collected in compliance with
                GDPR as well as with ethical, scientific and/or industrial best practices and
                institutional guidelines.
              </li>
              <li>With respect to data on human subjects or participants, the data you
                upload to the HDC is limited to data that is necessary for and relevant to
                the specific purpose of data processing.
              </li>
              <li>You will follow and adhere to the Data Processing Agreement with the HDC
                service provider for the research project(s) of which you are a member.
              </li>
              <li>With respect to data on human subjects or participants, you will
                make best efforts to pseudonymize or anonymize such data before
                you transfer them to the HDC.
              </li>
              <li>If you are required and authorized to transfer identifiable data to the HDC,
                your will make best efforts to pseudonymize or anonymize the data within
                the HDC prior to further processing of these data in the HDC.
              </li>
              <li>You will make best efforts to ensure that data you transfer to the HDC does
                not contain viruses, worms, spyware, malware or any other similar malicious
                programs.
              </li>
              <li>You will not submit any information or materials into the HDC that infringe
                or are capable of infringing third party rights, are libellous, obscene,
                threatening or otherwise unlawful.
              </li>
              <li>You are solely and entirely responsible and liable for the data you transfer to
                the HDC. You are responsible for the confidentiality of any data processed,
                downloaded, or copied from the HDC.
              </li>
            </ol>
          <p>The HDC Access Review Committee may at its discretion review your compliance
            to these terms at any time. Non-compliant data may be removed from the HDC.</p>
          <h4 className='ant-typography' id='fifth'>5 Accessing Data and Services on the HDC</h4>
          <h5 id='fifth-one'>5.1 Limitations of Use</h5>
          <p>In using the HDC, you may access the data you have transferred to the HDC, or
            data shared with you by other HDC users. You may also access HDC features, such
            as data processing tools, data visualization interfaces, and high performance
            computing resources.</p>
          <p>In accessing such HDC data and features, you agree to the following terms.</p>
            <ol>
              <li>When accessing pseudonymized, anonymized or aggregated data on
                human subjects, you will not attempt to establish the identity of, or
                attempt to contact any of the data subjects, or perform any unlawful
                linkage of these data with any other information.
              </li>
              <li>You will not carry out any calculations, operations or transactions that may
                interrupt, destroy or restrict the functionality of the operation of the HDC or
                of any program, computer or means of telecommunications.
              </li>
              <li>You will not use the data for high-risk activities such as the operation of
                nuclear facilities, air traffic control, or life support systems, where the use
                or failure of HDC features could lead to death, personal injury, or environmental damage.
              </li>
              <li>You may not attempt to gain unauthorized access to HDC data or services,
                or to the underlying infrastructure, by any illegitimate means. You are
                required to promptly report any known or suspected illegitimate use or
                identified weakness to the HDC support team at
                <a href='mailto:hdc@humanbrainproject.eu'>hdc@humanbrainproject.eu</a>.
              </li>
              <li>You commit to comply with any additional rules and regulations imposed by
                your institution and your institutional review board in accessing and using
                data stored in the HDC.
              </li>
              <li>HDC service provider and its sub-service providers make no representations,
                warranties, or guarantees of any kind to the content or accuracy and quality
                of the data accessed in or through the HDC. Accessing and using data in the
                HDC is therefore at your own risk.
              </li>
              <li>HDC service provider and its sub-service providers offer no guarantees
                regarding reliability, functionality, or availability of HDC features. The HDC
                platform and/or its systems may be taken off-line at any time for
                maintenance, upgrades, or other purposes.
              </li>
              <li>HDC is not responsible in the case of loss of data.</li>
            </ol>
          <h5 id='fifth-two'>5.2 Licensing</h5>
          <p>Some data and software stored in or provided by the HDC may have explicit
            licensing conditions. You must follow the licensing conditions required by such
            data or software, including all restrictions on commercial use, requirements for
            attribution and requirements to share-alike.</p>
          <h5 id='fifth-three'>5.3 Citation</h5>
          <p>If you use content or services from HDC to advance a scientific publication you
            must follow the applicable citation requirements listed in the data or software
            licence, or otherwise published by the data or software provider.</p>
          <h4 className='ant-typography' id='sixth'>6 Intellectual Property</h4>
          <p>The content, organisation, graphics, design, compilation, magnetic recording,
            digital conversion and other matters related to the HDC are protected under
            applicable intellectual property rights (including but not limited to copyrights and
            trademarks) and other proprietary rights.</p>
          <p>Subject to statutory allowances, extracts of material from the HDC may be accessed, downloaded and printed
            for your personal and non-commercial use
            except where specified by the licences attached to the HDC resources and
            services.</p>
          <h4 className='ant-typography' id='seventh'>7 Other policies and conditions that may apply to you</h4>
          <p>Further HDC policies and conditions may apply to you and
            can be found at https://hdc.humanbrainproject.eu.</p>
          <h4 className='ant-typography' id='eighth'>8 Termination and Liability</h4>
          <p>The data and features available in the HDC are provided on an "as is" and "as
            available" basis. Please note that HDC features, and content may contain bugs,
            viruses, errors, problems or other limitations. To the extent permitted by law, HDC
            service provider and its sub-service providers exclude any warranties (whether
            expressed or implied) for the HDC platform and data. This includes, but is not
            limited to, the disclaimer of any implied warranties of merchantability and fitness
            for a particular purpose of the HDC or of any data stored in the HDC.</p>
          <p>Data stored in the HDC may contain advice, opinions, statements or other
            information by various authors or entities. Reliance upon any such advice,
            opinion, statement, or other information is at your own risk.</p>
          <p>HDC service provider and its sub-service providers disclaim, to the extent
            permitted by law, all liability and responsibility arising from any use of the HDC or
            of data stored in the HDC. In particular, but not as a limitation thereof, HDC service
            provider and its sub-service providers are not liable for any damages (including
            damages for loss of business, loss of profits, litigation, or the like), whether based
            on breach of contract, breach of warranty, tort (including negligence), product
            liability or otherwise, even if advised of the possibility of such damages. The
            acknowledgment of exclusion of liability is an essential condition for HDC service
            provider and its sub-service providers in granting access to the HDC and to data
            stored in the HDC. The HDC and its features and/or data stored in the HDC are
            provided to users with these limitations only.</p>
          <p>HDC service provider and its sub-service providers reserve the right to discontinue
            at any time, temporarily or permanently, your ability to access the HDC as well as
            to transfer data to the HDC and/or access data stored in the HDC with or without
            notice, at its sole discretion and for any reason whatsoever.</p>
          <p>HDC service provider and its sub-service providers also take no responsibility for
            any breach arising from non-compliance with these General Terms of Use by you.</p>
          <h4 className='ant-typography' id='ninth'>9 Disputes and Disagreements</h4>
          <p>The substantive laws of Belgium, excluding any conflict of law rules, shall apply to
            any dispute arising out of the access and use of the HDC pursuant to these General
            Terms of Use. The ordinary courts of Belgium shall have exclusive jurisdiction,
            subject to appeal, if any.</p>
          <p>This does not affect mandatory legal obligations applicable to you in your
            jurisdiction.</p>
          <h4 className='ant-typography' id='tenth'>10 Contact Us</h4>
          <p>If you have any queries, comments, or concerns about these General Terms of
            Use, please contact hdc@humanbrainproject.eu.</p>
          <h4 className='ant-typography' id='eleventh'>11 Imprint</h4>
          <p>The HDC is made available and operated by:</p>
          <p><a
            href='https://www.brainsimulation.org/bsw/zwei/team-contact'>https://www.brainsimulation.org/bsw/zwei/team-contact</a>
          </p>


        </div>
      </div>
    </Modal>
  );
}

export default TermsOfUseModal;
