/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Skeleton, List, Pagination, Divider, Select, Input, Form, Button, Modal } from 'antd';
import { Link } from 'react-router-dom';

import { GET_NOTES } from '../../queries/notes';
import client from '../../apollo-client';
import { GET_CATEGORIES } from '../../queries/categories';
import { GET_CURRENT_USER } from '../../queries/users';
import { DELETE_NOTE } from '../../mutations/notes';

const useStyles = makeStyles({
  pagination: {
    margin: '10px 0px',
    display: 'flex',
    justifyContent: 'center',
  },
});

const semesters = ['S1', 'S2', 'S3', 'IPI', 'PEL', 'LP'];

function NotesList({ history }) {
  const [page, setPage] = useState(1);
  const [semester, setSemester] = useState(null);
  const [category, setCategory] = useState(null);
  const [searchBar, setSearchBar] = useState('');
  const classes = useStyles();
  const filters = { semester, category, title: searchBar };
  // Queries
  const { loading, error, data, fetchMore } = useQuery(GET_NOTES, {
    variables: {
      offset: (page - 1) * 5,
      limit: 5,
      ...filters,
    },
    pollInterval: 5000,
    client: client,
  });
  const { data: userData } = useQuery(GET_CURRENT_USER, { client });
  const { data: catData, loading: catLoading } = useQuery(GET_CATEGORIES, { client });
  // Mutations
  const [deleteNote] = useMutation(DELETE_NOTE, {
    client,
    ignoreResults: true,
    refetchQueries: [{ query: GET_NOTES }],
  });

  useEffect(() => {
    loadMore(page);
  }, [semester, category, searchBar]);

  function updateQuery(prev, { fetchMoreResult }) {
    if (!fetchMoreResult) return prev;
    return fetchMoreResult.notes.rows;
  }

  function loadMore(clickedPage) {
    const newVars = {
      offset: (clickedPage - 1) * 5,
      limit: 5,
      ...filters,
    };
    fetchMore({
      variables: newVars,
      updateQuery,
    });
    setPage(clickedPage);
  }

  function getSortedCategories() {
    const categories = catData ? catData.categories : [];
    const res = !semester
      ? categories
      : categories.filter(cat => cat.semester === semester);
    return res.map(cat => (
      <Option value={cat.id} key={cat.id}>{cat.name} - {cat.semester}</Option>
    ));
  }

  function showDeleteConfirm(note) {
    Modal.confirm({
      title: 'Supprimer la note ?',
      content: `La note ${note.title} sera définitivement supprimée.
      Les données ne sont pas récupérables. Souhaitez-vous continuer ?`,
      onOk() {
        deleteNote({ variables: { id: note.id } });
      },
      cancelText: 'Annuler',
      okButtonProps: { type: 'danger' },
      mask: true,
    });
  }

  function renderList() {
    if (loading || !data || !data.notes) return <Skeleton active />
    if (error) {
      console.log(error);
      return 'Veuillez rafraîchir la page.';
    }
    return (
      <>
        <List
          header="Notes correspondantes"
          itemLayout="horizontal"
          dataSource={data.notes.rows}
          bordered
          locale={{ emptyText: 'Aucune note trouvée.' }}
          renderItem={item => (
            <List.Item
              extra={
                userData && userData.me && userData.me.id === item.author.id && (
                  <React.Fragment>
                    <Button shape="circle" icon="edit" onClick={() => history.push(`/notes/edit/${item.id}`)} />
                    <Button shape="circle" icon="delete" onClick={() => showDeleteConfirm(item)} type="danger" />
                  </React.Fragment>
                )
              }
            >
              <List.Item.Meta
                title={<Link to={`/notes/${item.id}`}>{item.title}</Link>}
                description={
                  <p>
                    Auteur : {item.author.name} <br />
                    Date de création : {new Date(parseInt(item.createdAt)).toLocaleDateString()}<br />
                    Catégorie : {item.category.semester} - {item.category.name}
                  </p>
                }
              />
            </List.Item>
          )}
        />
        <footer className={classes.pagination}>
          <Pagination
            current={page}
            onChange={loadMore}
            pageSize={5}
            total={data.notes.count}
            size="small"
          />
        </footer>
      </>
    );
  }

  const { Option } = Select;
  return (
    <>
      <h1>Liste des notes</h1>
      <Form layout="vertical">
        <Divider>Filtres</Divider>
        <Form.Item label="Semestre">
          <Select
            allowClear
            defaultValue={semester}
            onChange={value => setSemester(value)}
          >
            {semesters.map(val => (
              <Option value={val} key={val}>{val}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Catégorie">
          <Select
            onChange={value => setCategory(value)}
            filterOption={(inputValue, option) => {
              return option.props.children.toLowerCase()
                .includes(inputValue.toLowerCase());
            }}
            defaultValue={category}
            allowClear
            showSearch
            loading={catLoading}
          >
            {!catLoading ? getSortedCategories() : null}
          </Select>
        </Form.Item>
        <Form.Item label="Titre">
          <Input.Search
            allowClear
            placeholder="Titre de la note"
            onSearch={value => setSearchBar(value)}
          />
        </Form.Item>
      </Form>
      {renderList()}
    </>
  )
}

export default NotesList;
