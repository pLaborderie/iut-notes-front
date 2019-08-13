import React from 'react';
import { Input, Form } from 'antd';

function FormInput({ name, label, form, rules, textarea, defaultValue, ...rest }) {
  const RenderedInput = textarea
    ? <Input.TextArea name={name} {...rest} autosize={{ minRows: 4 }} />
    : <Input name={name} {...rest} />
  return (
    <Form.Item label={label}>
      {
        form.getFieldDecorator(name, {
          rules,
          validateTrigger: 'onBlur',
          initialValue: defaultValue || ''
        })(
          RenderedInput
        )
      }
    </Form.Item>
  )
}

export default FormInput;