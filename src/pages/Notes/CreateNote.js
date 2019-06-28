/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Select, message, Modal } from 'antd';
import { withApollo } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

import { GET_CATEGORIES } from '../../queries/categories';
import { CREATE_NOTE } from '../../mutations/notes';
import FormInput from '../../components/FormInput';
import UserContext from '../../context/UserContext';

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

const semesters = ['Tous', 'S1', 'S2', 'S3', 'IPI', 'PEL', 'LP'];

function CreateNote({ client, form }) {
  const { token } = useContext(UserContext);
  const [categories, setCategories] = useState(null);
  const [category, setCategory] = useState('');
  const [semester, setSemester] = useState('Tous');
  const previewEl = React.useRef(null);

  useEffect(() => {
    fetchCategories();
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

  async function createNote(values) {
    // CREATE THE NOTE!
    try {
      await client.mutate({
        mutation: CREATE_NOTE,
        variables: values
      });
      form.resetFields();
      message.success('Note créée !')
    } catch (err) {
      message.error(err.message);
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
        await createNote({ ...values, category });
      }
    })
  }

  function searchCategories(inputValue, option) {
    return option.props.children.toLowerCase().includes(inputValue.toLowerCase());
  }

  function filterCategories(category) {
    if (semester === 'Tous') return true;
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

  if (!token) {
    return <Redirect to="/login" />
  }

  return (
    <>
      <h1>Créer une note</h1>
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
    </>
  )
}

export default Form.create({ name: 'create_note' })(withApollo(CreateNote));