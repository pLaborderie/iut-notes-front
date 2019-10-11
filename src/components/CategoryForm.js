import React from 'react';
import { message, Form, Button, Select } from 'antd';
import { withApollo } from 'react-apollo';
import { useMutation } from '@apollo/react-hooks';

import { GET_CATEGORIES } from '../queries/categories';
import { ADD_CATEGORY } from '../mutations/categories';

import FormInput from './FormInput';

const semesters = ['S1', 'S2', 'S3', 'IPI', 'PEL', 'LP'];

function CategoryForm({ client, form }) {

  const [addCategory, { loading: updateLoading }] = useMutation(ADD_CATEGORY, {
    client,
    refetchQueries: [{ query: GET_CATEGORIES }],
    onCompleted() {
      message.success('Catégorie crée.');
    }
  });

  function handleAddCategory(e) {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) {
        message.error(err);
      } else {
        addCategory({ variables: values });
        form.resetFields();
      }
    })
  }
  return (
    <Form layout="vertical" onSubmit={handleAddCategory}>
      <FormInput
        label="Nom"
        form={form}
        rules={[{ required: true, message: 'Veuillez saisir un nom.' }]}
        name="name"
        placeholder="Gestion de projet"
      />
      <Form.Item label="Semestre">
        {form.getFieldDecorator('semester', {
          rules: [{ required: true, message: 'Veuillez saisir un semestre.' }]
        })(
          <Select>
            {semesters.map(sem => (
              <Select.Option
                key={`option-${sem}`}
                value={sem}
              >
                {sem}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
      <Button htmlType="submit" type="primary" loading={updateLoading}>Ajouter</Button>
    </Form>
  )
}
export default Form.create({ name: 'category_form' })(withApollo(CategoryForm))