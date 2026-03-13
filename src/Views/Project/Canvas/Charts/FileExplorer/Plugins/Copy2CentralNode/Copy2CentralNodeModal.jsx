/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Steps, Typography, Space, message } from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import {
  initCentralNodeUpload,
  waitCentralNodeAccess,
} from '../../../../../../../APIs';
import { tokenManager } from '../../../../../../../Service/tokenManager';
import { useCurrentProject } from '../../../../../../../Utility';

const { Step } = Steps;
const { Title, Paragraph, Text } = Typography;

const Copy2CentralNodeModal = ({ visible, selectedRows, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [polling, setPolling] = useState(false);
  const [pollingStatus, setPollingStatus] = useState('idle');
  const [loading, setLoading] = useState(false);
  const [loginUrl, setLoginUrl] = useState(null);
  const [uploadKey, setUploadKey] = useState(null);
  const abortControllerRef = useRef(null);
  const [currentProject] = useCurrentProject();

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      setCurrentStep(0);
      setPolling(false);
      setPollingStatus('idle');
      setLoading(false);
      setUploadKey(null);
      setLoginUrl(null);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
  }, [visible]);

  const startLongPolling = async () => {
    if (!uploadKey) {
      console.error('No uploadKey available for long-polling');
      return;
    }

    setPolling(true);
    setPollingStatus('polling');

    abortControllerRef.current = new AbortController();

    try {
      const response = await waitCentralNodeAccess(uploadKey, abortControllerRef.current.signal)

      if (response.status !== 202) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setPollingStatus('success');
      setPolling(false);

      setCurrentStep(2);
    } catch (error) {
      console.error('Long-polling error:', error);
      setPollingStatus('error');
      setPolling(false);
    }
  };

  const makeInitialRequest = async () => {
    try {
      setLoading(true);

      const selectedFile = selectedRows && selectedRows.length > 0 ? selectedRows[0] : null;
      if (!selectedFile) {
        throw new Error('No file selected for upload');
      }

      const sessionId = tokenManager.getLocalCookie('sessionId');
      const response = await initCentralNodeUpload(selectedFile.guid, sessionId);

      if (response.status !== 200) {
        throw new Error(`HTTP error. Status: ${response.status}`);
      }

      const data = response.data;

      setLoginUrl(data.loginUrl);
      setUploadKey(data.uploadKey);
      setLoading(false);

      return { success: true, data };
    } catch (error) {
      message.error('Error while initiating a Copy to the Central Node request', 3);
      setLoading(false);

      return { success: false, error };
    }
  };

  const handleOpenExternal = () => {
    if (!loginUrl) {
      throw new Error('Login URL is not available');
    }
    window.open(loginUrl, '_blank', 'noopener,noreferrer');
    startLongPolling();
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      const result = await makeInitialRequest();

      if (result.success) {
        setCurrentStep(1);
      }
    } else if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      if (currentStep === 1 && abortControllerRef.current) {
        abortControllerRef.current.abort();
        setPolling(false);
        setPollingStatus('idle');
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <Title level={4}>Getting Started</Title>
            <Paragraph>
              Please review the following important points before proceeding:
            </Paragraph>
            <ul style={{ paddingLeft: '20px' }}>
              <li style={{ marginBottom: '6px' }}>
                <Text strong>Complete the external verification:</Text> You will need to grant access to your external account in a separate tab
              </li>
              <li style={{ marginBottom: '6px' }}>
                <Text strong>Project with the same code:</Text> Project with the "{currentProject.code}" code must exist on the Central Node
              </li>
              <li style={{ marginBottom: '6px' }}>
                <Text strong>Destination Greenroom user folder:</Text> Selected file will be copied to the user folder in the Greenroom zone
              </li>
              <li style={{ marginBottom: '6px' }}>
                <Text strong>Keep this window open:</Text> Don't close this modal while access confirmation is in progress
              </li>
              <li style={{ marginBottom: '6px' }}>
                <Text strong>Wait for confirmation:</Text> The system will automatically detect when access is granted
              </li>
              <li style={{ marginBottom: '6px' }}>
                <Text strong>Network connection:</Text> Ensure you have a stable internet connection throughout the process
              </li>
            </ul>
          </div>
        );

      case 1:
        return (
          <div>
            <Title level={4}>Complete Authentication on the Central Node</Title>
            <Paragraph>
              Click the button below to open the login page in a new window:
            </Paragraph>

            <ul style={{ paddingLeft: '20px', marginBottom: '6px' }}>
              <li style={{ marginBottom: '6px' }}>
                <Text strong>Complete authentication:</Text> Login and click on "Yes" button to grant access to your account
              </li>
              <li style={{ marginBottom: '6px' }}>
                <Text strong>Don't close this window:</Text> Keep this modal open while you grant access
              </li>
              <li style={{ marginBottom: '6px' }}>
                <Text strong>Automatic detection:</Text> Your confirmation will be automatically detected
              </li>
            </ul>

            <Space direction='vertical' size='large' style={{ width: '100%', marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  type='primary'
                  size='large'
                  style={{ borderRadius: '6px' }}
                  onClick={handleOpenExternal}
                  disabled={polling}
                >
                  Open Central Node Authentication Page
                </Button>
              </div>

              {pollingStatus === 'polling' && (
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  background: '#f0f2f5',
                  borderRadius: '6px',
                }}>
                  <Space direction='vertical' size='small'>
                    <LoadingOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
                    <Text type='secondary'>
                      Awaiting confirmation for account access...
                    </Text>
                    <Text type='secondary' style={{ fontSize: '12px' }}>
                      This may take a few moments
                    </Text>
                  </Space>
                </div>
              )}

              {pollingStatus === 'success' && (
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  background: '#f6ffed',
                  border: '1px solid #b7eb8f',
                  borderRadius: '6px',
                }}>
                  <Space direction='vertical' size='small'>
                    <CheckCircleOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
                    <Text style={{ color: '#52c41a' }}>
                      Access granted! Proceeding...
                    </Text>
                  </Space>
                </div>
              )}

              {pollingStatus === 'error' && (
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  background: '#fff2e8',
                  border: '1px solid #ffbb96',
                  borderRadius: '6px'
                }}>
                  <Space direction="vertical" size="small">
                    <ExclamationCircleOutlined style={{ fontSize: '32px', color: '#ff7a45' }} />
                    <Text style={{ color: '#ff7a45', fontWeight: 'bold' }}>
                      Authentication failed
                    </Text>
                    <Text style={{ color: '#595959' }}>
                      Please try to authenticate again or go back to the previous step and start again.
                    </Text>
                  </Space>
                </div>
              )}
            </Space>
          </div>
        );

      case 2:
        return (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <CheckCircleOutlined style={{ fontSize: '64px', color: '#52c41a', marginBottom: '24px' }} />
            <Title level={3} style={{ color: '#52c41a' }}>
              Success!
            </Title>
            <Paragraph style={{ fontSize: '16px', marginTop: '16px' }}>
              Access to your account has been granted. You can now close this modal.
            </Paragraph>
          </div>
        );

      default:
        return null;
    }
  };

  const renderFooter = () => {
    switch (currentStep) {
      case 0:
        return (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} disabled={loading} style={{ borderRadius: '6px', marginRight: '8px' }}>
              Cancel
            </Button>
            <Button type='primary' onClick={handleNext} loading={loading} style={{ borderRadius: '6px' }}>
              Next
            </Button>
          </div>
        );

      case 1:
        return (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handlePrevious} style={{ borderRadius: '6px' }}>
              Previous
            </Button>
            <Button onClick={handleClose} style={{ borderRadius: '6px' }}>
              Cancel
            </Button>
          </div>
        );

      case 2:
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type='primary' onClick={handleClose} style={{ borderRadius: '6px' }}>
              Close
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      title='Copy to the Central Node'
      visible={visible}
      onCancel={handleClose}
      footer={renderFooter()}
      width={800}
      maskClosable={false}
    >
      <Steps current={currentStep} style={{ marginBottom: '32px' }}>
        <Step title='Start' />
        <Step title='Authentication' />
        <Step title='Complete' />
      </Steps>

      <div style={{ minHeight: '180px' }}>
        {renderStepContent()}
      </div>
    </Modal>
  );
};

export default Copy2CentralNodeModal;