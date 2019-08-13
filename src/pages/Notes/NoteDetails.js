import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Skeleton, message } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import { withApollo } from 'react-apollo';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

import { GET_NOTE } from '../../queries/notes';

function NoteDetails(props) {
  const { loading, data, error } = useQuery(GET_NOTE, {
    variables: props.match.params,
    client: props.client,
  });
  useEffect(() => {
    if (!loading) {
      // Highlight all code blocks
      for (let block of document.getElementsByTagName('pre')) {
        hljs.highlightBlock(block);
      }
    }
  }, [loading]);
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
}

export default withApollo(NoteDetails);