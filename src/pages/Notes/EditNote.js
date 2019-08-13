import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Spin } from 'antd';
import NotesForm from '../../components/NotesForm';
import { GET_NOTE } from '../../queries/notes';
import { withApollo } from 'react-apollo';

function EditNote({ match, client }) {
  const { loading, data, error } = useQuery(GET_NOTE, {
    variables: match.params,
    client,
  });
  function displayForm() {
    if (loading) return <Spin />;
    if (error) return 'Une erreur est survenue.';
    return <NotesForm type="edit" editValues={{ ...data.note, ...match.params }} />;
  }
  return (
    <>
      <h1>Modifier une note</h1>
      {displayForm()}
    </>
  )
}

export default withApollo(EditNote)