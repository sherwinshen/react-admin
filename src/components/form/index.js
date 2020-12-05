import React, { Component } from 'react';
import { Button, Form, Input, InputNumber, Radio, message, Select } from 'antd';
import requestUrl from '../../api/requestUrl';
import { FormSubmit } from '../../api/form';

class FormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    this.refs.form.setFieldsValue(nextProps.formConfig.setFieldsValue);
  }

  // 初始化form-item
  initFormItem = () => {
    const { formItem } = this.props;
    if (!formItem || (formItem && formItem.length === 0)) {
      return null;
    }
    return formItem.map((item) => {
      if (item.type === 'Input') {
        return this.inputElem(item);
      } else if (item.type === 'InputNumber') {
        return this.inputNumberElem(item);
      } else if (item.type === 'Radio') {
        return this.radioElem(item);
      } else if (item.type === 'TextArea') {
        return this.textAreaElem(item);
      } else if (item.type === 'Select') {
        return this.selectElem(item);
      } else {
        return null;
      }
    });
  };

  // 提交表单
  onFinish = (values) => {
    // 如果有传入submit方法则调用传入的submit方法
    if (this.props.submit) {
      this.props.submit(values);
      return true;
    }
    // 如果没有传入submit方法则调用统一的方法
    const data = {
      url: requestUrl[this.props.formConfig.url],
      data: values,
    };
    // 如果传入id则添加id
    if (this.props.id) {
      data.data.id = this.props.id;
    }
    this.setState({ loading: true });
    FormSubmit(data)
      .then((response) => {
        const responseData = response.data;
        message.info(responseData.message);
        this.setState({ loading: false });
        // // 重置表单
        // this.refs.form.resetFields();
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log('error', error);
      });
  };

  // input元素
  inputElem = (item) => {
    return (
      <Form.Item
        label={item.label}
        name={item.name}
        key={item.name}
        rules={item.rules}
      >
        <Input style={item.style} placeholder={item.placeholder} />
      </Form.Item>
    );
  };

  // inputNumber元素
  inputNumberElem = (item) => {
    return (
      <Form.Item
        label={item.label}
        name={item.name}
        key={item.name}
        rules={item.rules}
      >
        <InputNumber style={item.style} min={item.min} max={item.max} />
      </Form.Item>
    );
  };

  // radio元素
  radioElem = (item) => {
    return (
      <Form.Item
        label={item.label}
        name={item.name}
        key={item.name}
        rules={item.rules}
      >
        <Radio.Group>
          {item.options &&
            item.options.map((elem) => {
              return (
                <Radio value={elem.value} key={elem.value}>
                  {elem.label}
                </Radio>
              );
            })}
        </Radio.Group>
      </Form.Item>
    );
  };

  // TextArea元素
  textAreaElem = (item) => {
    return (
      <Form.Item
        label={item.label}
        name={item.name}
        key={item.name}
        rules={item.rules}
      >
        <Input.TextArea rows={item.rows} style={item.style} />
      </Form.Item>
    );
  };

  // Select元素
  selectElem = (item) => {
    return (
      <Form.Item
        label={item.label}
        name={item.name}
        key={item.name}
        rules={item.rules}
      >
        <Select style={item.style} placeholder={item.placeholder}>
          {item.options &&
            item.options.map((elem) => {
              return (
                <Select.Option value={elem.value} key={elem.value}>
                  {elem.label}
                </Select.Option>
              );
            })}
        </Select>
      </Form.Item>
    );
  };

  render() {
    const { layout, tailLayout, initialValues } = this.props.formConfig;
    return (
      <Form
        ref="form"
        {...layout}
        initialValues={initialValues}
        onFinish={this.onFinish}
      >
        {this.initFormItem()}
        <Form.Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: '100px' }}
            loading={this.state.loading}
          >
            提交
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default FormComponent;
