/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Form, Button, Select, message, Modal } from 'antd';
import { withApollo } from 'react-apollo';
import { useMutation } from '@apollo/react-hooks';
import ReactMarkdown from 'react-markdown';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

import { GET_CATEGORIES } from '../queries/categories';
import { CREATE_NOTE } from '../mutations/notes';
import FormInput from './FormInput';
import LoginBoundary from './LoginBoundary';
import { EDIT_NOTE } from '../mutations/notes';
import { GET_NOTE, GET_NOTES } from '../queries/notes';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

const semesters = ['S1', 'S2', 'S3', 'IPI', 'PEL', 'LP'];

function NotesForm({ client, form, type, editValues }) {
  const [categories, setCategories] = useState(null);
  const [category, setCategory] = useState(null);
  const [semester, setSemester] = useState(null);
  const previewEl = React.useRef(null);
  const mutation = type === 'edit' ? EDIT_NOTE : CREATE_NOTE;
  const [createOrEdit] = useMutation(mutation, {
    client,
    ignoreResults: true,
    onCompleted() {
      if (type === 'edit') {
        message.success('Note modifiée.');
      } else {
        message.success('Note créée.');
        form.resetFields();
      }
    },
    refetchQueries: getRefetchQueries(),
  });
  useEffect(() => {
    fetchCategories();
    if (type === 'edit') {
      // Load note data into form
      const { title, content, category } = editValues;
      form.setFieldsValue({
        title,
        content
      });
      setSemester(category.semester);
      setCategory(category.id);
    }
  }, []);

  useEffect(() => {
    if (categories) {
      const filtered = categories.filter(filterCategories);
      // Update selected category
      if (!filtered.length) {
        setCategory('');
      } else if (filtered.findIndex(cat => cat.id === category) < 0) {
        setCategory(filtered[0].id);
      }
    }
  }, [semester]);

  useEffect(() => {
    if (previewEl) {
      hljs.initHighlighting();
    }
  }, [previewEl])

  function getRefetchQueries() {
    const queries = [{ query: GET_NOTES }];
    return type === 'edit'
      ? queries.concat({ query: GET_NOTE, variables: { id: editValues.id } })
      : queries;
  }

  async function fetchCategories() {
    try {
      const { data } = await client.mutate({
        mutation: GET_CATEGORIES
      });
      setCategories(data.categories);
      setCategory(data.categories[0].id);
    } catch (err) {
      console.error(err);
      message.error('Erreur lors de la récupération des données.')
    }
  }

  async function createNote(variables) {
    try {
      createOrEdit({ variables })
    } catch (err) {
      console.error(err);
    }
  }

  async function editNote(variables) {
    try {
      createOrEdit({ variables });
    } catch (err) {
      console.error(err);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    form.validateFields(async (err, values) => {
      if (err) {
        console.error(err);
        message.error('Erreur lors de la validation du formulaire.');
      } else {
        if (type === "edit") {
          const { id } = editValues;
          await editNote({ ...values, category, id });
        } else {
          await createNote({ ...values, category });
        }
      }
    })
  }

  function searchCategories(inputValue, option) {
    return option.props.children.toLowerCase().includes(inputValue.toLowerCase());
  }

  function filterCategories(category) {
    if (!semester) return true;
    return semester === category.semester;
  }

  function previewNote() {
    Modal.info({
      title: form.getFieldValue('title'),
      content: (
        <div id="preview">
          <ReactMarkdown source={form.getFieldValue('content')} />
        </div>
      )
    });
    const destroy = setInterval(() => {
      const doc = document.getElementById('preview');
      if (doc) {
        const codeBlocks = document.getElementsByTagName('pre');
        for (let block of codeBlocks) {
          hljs.highlightBlock(block);
        }
        clearInterval(destroy)
      }
    }, 10)
  }

  return (
    <LoginBoundary>
      <Form {...formItemLayout} onSubmit={handleSubmit}>
        <FormInput
          label="Titre"
          form={form}
          rules={[{ required: true, message: 'Veuillez saisir un titre.' }]}
          name="title"
          placeholder="Titre"
        />
        <Form.Item label="Semestre">
          <Select
            allowClear
            value={semester}
            onChange={(sem) => setSemester(sem)}
          >
            {semesters.map(sem => (
              <Select.Option
                key={sem}
                value={sem}
              >
                {sem}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Catégorie">
          <Select
            showSearch
            allowClear
            value={category}
            onChange={cat => setCategory(cat)}
            filterOption={searchCategories}
            notFoundContent="Aucune catégorie trouvée."
          >
            {categories && categories.filter(filterCategories).map(cat => (
              <Select.Option
                key={cat.id}
                value={cat.id}
                onChange={() => setCategory(cat.id)}
              >
                {`${cat.name} - ${cat.semester}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <FormInput
          label="Note"
          form={form}
          rules={[{ required: true, message: 'Veuillez saisir un contenu.' }]}
          name="content"
          placeholder="Contenu"
          textarea
        />
        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Button style={{ marginRight: 10 }} type="primary" htmlType="submit">
            Confirmer
            </Button>
          <Button type="dashed" icon={'eye'} onClick={previewNote}>Aperçu</Button>
        </Form.Item>
      </Form>
    </LoginBoundary>
  )
}

export default Form.create({ name: 'create_note' })(withApollo(NotesForm));