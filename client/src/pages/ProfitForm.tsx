import React, { useEffect } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  Row,
  Col,
  message,
  Typography,
  Space,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { profitApi, departmentApi } from '../services/api';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ProfitForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const queryClient = useQueryClient();

  const { data: profitData, isLoading: profitLoading } = useQuery(
    ['profit', id],
    () => profitApi.getProfit(id!),
    { enabled: isEdit }
  );

  const { data: departments } = useQuery(
    'departments',
    departmentApi.getDepartments
  );

  const createMutation = useMutation(profitApi.createProfit, {
    onSuccess: () => {
      message.success('创建成功');
      queryClient.invalidateQueries('profits');
      navigate('/profits');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '创建失败');
    },
  });

  const updateMutation = useMutation(
    (data: any) => profitApi.updateProfit(id!, data),
    {
      onSuccess: () => {
        message.success('更新成功');
        queryClient.invalidateQueries('profits');
        navigate('/profits');
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || '更新失败');
      },
    }
  );

  useEffect(() => {
    if (isEdit && profitData) {
      form.setFieldsValue(profitData);
    }
  }, [isEdit, profitData, form]);

  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        createdBy: 'current_user', // 实际应用中从用户状态获取
        lastModifiedBy: 'current_user',
      };

      if (isEdit) {
        updateMutation.mutate(formData);
      } else {
        createMutation.mutate(formData);
      }
    } catch (error) {
      message.error('提交失败');
    }
  };

  const handleCancel = () => {
    navigate('/profits');
  };

  return (
    <div>
      <div className="page-header">
        <Title level={2}>{isEdit ? '编辑利润记录' : '新增利润记录'}</Title>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'draft',
            materialCost: 0,
            laborCost: 0,
            overheadCost: 0,
            otherCost: 0,
          }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="department"
                label="部门"
                rules={[{ required: true, message: '请选择部门' }]}
              >
                <Select placeholder="请选择部门">
                  {departments?.map((dept: any) => (
                    <Option key={dept._id} value={dept.name}>
                      {dept.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="project"
                label="项目"
                rules={[{ required: true, message: '请输入项目名称' }]}
              >
                <Input placeholder="请输入项目名称" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="period"
                label="期间"
                rules={[{ required: true, message: '请输入期间' }]}
              >
                <Input placeholder="如：2025-01, 2025-Q1" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="revenue"
                label="收入"
                rules={[
                  { required: true, message: '请输入收入' },
                  { type: 'number', min: 0, message: '收入不能为负数' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入收入"
                  formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="cost"
                label="总成本"
                rules={[
                  { required: true, message: '请输入总成本' },
                  { type: 'number', min: 0, message: '成本不能为负数' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入总成本"
                  formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="status"
                label="状态"
              >
                <Select>
                  <Option value="draft">草稿</Option>
                  <Option value="confirmed">已确认</Option>
                  <Option value="archived">已归档</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Title level={4}>成本细分</Title>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name="materialCost"
                label="材料成本"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="材料成本"
                  formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name="laborCost"
                label="人工成本"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="人工成本"
                  formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name="overheadCost"
                label="管理费用"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="管理费用"
                  formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name="otherCost"
                label="其他成本"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="其他成本"
                  formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea
              rows={4}
              placeholder="请输入项目描述"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMutation.isLoading || updateMutation.isLoading}
              >
                {isEdit ? '更新' : '创建'}
              </Button>
              <Button onClick={handleCancel}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProfitForm;
