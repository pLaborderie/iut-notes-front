import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Skeleton, message } from 'antd';
import { Query } from 'react-apollo';

import { GET_NOTE } from '../../queries/notes';

function NoteDetails(props) {
  return (
    <Query query={GET_NOTE} variables={{ id: props.match.params.id }}>
      {({ loading, error, data }) => {
        if (loading) return <Skeleton active />;
        if (error) {
          message.error('Erreur ! ' + error.message);
          return 'Veuillez rafraîchir la page.';
        }
        return (
          <>
            <h1>{data.note.title}</h1>
            <hr />
            <ReactMarkdown source={data.note.content} />
          </>
        )
      }}
    </Query>
  )
}

export default NoteDetails;