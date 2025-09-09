import React, { useState } from 'react';
import {
  Card,
  Upload,
  Button,
  message,
  Typography,
  Row,
  Col,
  Table,
  Space,
  Progress,
  Alert,
} from 'antd';
import {
  UploadOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useMutation } from 'react-query';
import { uploadApi } from '../services/api';

const { Title, Text } = Typography;
const { Dragger } = Upload;

const DataImport: React.FC = () => {
  const [importResult, setImportResult] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const uploadMutation = useMutation(uploadApi.uploadExcel, {
    onSuccess: (response) => {
      setImportResult(response.data);
      message.success(`成功导入 ${response.data.count} 条记录`);
      setUploading(false);
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '导入失败');
      setUploading(false);
    },
  });

  const downloadTemplateMutation = useMutation(uploadApi.downloadTemplate, {
    onSuccess: (response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '利润数据模板.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      message.success('模板下载成功');
    },
    onError: () => {
      message.error('模板下载失败');
    },
  });

  const handleUpload = (file: File) => {
    setUploading(true);
    uploadMutation.mutate(file, 'current_user');
    return false; // 阻止默认上传行为
  };

  const handleDownloadTemplate = () => {
    downloadTemplateMutation.mutate();
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.xlsx,.xls',
    beforeUpload: handleUpload,
    showUploadList: false,
  };

  const resultColumns = [
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '项目',
      dataIndex: 'project',
      key: 'project',
    },
    {
      title: '期间',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: '收入',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      title: '成本',
      dataIndex: 'cost',
      key: 'cost',
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      title: '利润',
      dataIndex: 'profit',
      key: 'profit',
      render: (value: number) => (
        <span style={{ color: value >= 0 ? '#52c41a' : '#ff4d4f' }}>
          ¥{value.toLocaleString()}
        </span>
      ),
    },
    {
      title: '利润率',
      dataIndex: 'profitMargin',
      key: 'profitMargin',
      render: (value: number) => `${value.toFixed(2)}%`,
    },
  ];

  return (
    <div>
      <div className="page-header">
        <Title level={2}>数据导入</Title>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="上传Excel文件" className="stats-card">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Alert
                message="导入说明"
                description="请下载模板文件，按照模板格式填写数据后上传。支持.xlsx和.xls格式文件。"
                type="info"
                showIcon
              />

              <Button
                type="dashed"
                icon={<DownloadOutlined />}
                onClick={handleDownloadTemplate}
                loading={downloadTemplateMutation.isLoading}
                style={{ width: '100%' }}
              >
                下载Excel模板
              </Button>

              <Dragger {...uploadProps} className="upload-area">
                <p className="ant-upload-drag-icon">
                  <FileExcelOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                </p>
                <p className="ant-upload-text">
                  点击或拖拽文件到此区域上传
                </p>
                <p className="ant-upload-hint">
                  支持单个文件上传，仅支持 .xlsx 和 .xls 格式
                </p>
              </Dragger>

              {uploading && (
                <div>
                  <Text>正在处理文件...</Text>
                  <Progress percent={50} status="active" />
                </div>
              )}
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="导入结果" className="stats-card">
            {importResult ? (
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Alert
                  message={`导入成功 ${importResult.count} 条记录`}
                  type="success"
                  icon={<CheckCircleOutlined />}
                />
                
                <div>
                  <Text strong>导入统计：</Text>
                  <ul style={{ marginTop: 8, marginBottom: 0 }}>
                    <li>总记录数：{importResult.count}</li>
                    <li>总收入：¥{importResult.data?.reduce((sum: number, item: any) => sum + item.revenue, 0).toLocaleString()}</li>
                    <li>总成本：¥{importResult.data?.reduce((sum: number, item: any) => sum + item.cost, 0).toLocaleString()}</li>
                    <li>总利润：¥{importResult.data?.reduce((sum: number, item: any) => sum + item.profit, 0).toLocaleString()}</li>
                  </ul>
                </div>
              </Space>
            ) : (
              <Text type="secondary">暂无导入结果</Text>
            )}
          </Card>
        </Col>
      </Row>

      {importResult && (
        <Card title="导入数据预览" className="table-container" style={{ marginTop: 24 }}>
          <Table
            columns={resultColumns}
            dataSource={importResult.data?.slice(0, 10) || []}
            pagination={false}
            size="small"
            scroll={{ x: 600 }}
            footer={() => (
              <Text type="secondary">
                显示前10条记录，共 {importResult.count} 条
              </Text>
            )}
          />
        </Card>
      )}
    </div>
  );
};

export default DataImport;
