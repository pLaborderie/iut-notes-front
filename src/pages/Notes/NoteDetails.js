import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Skeleton, message } from 'antd';
import { Query } from 'react-apollo';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

import { GET_NOTE } from '../../queries/notes';

function NoteDetails(props) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (loaded) {
      // Highlight all code blocks
      for (let block of document.getElementsByTagName('pre')) {
        hljs.highlightBlock(block);
      }
    }
  }, [loaded]);
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
            {setLoaded(true)}
          </>
        )
      }}
    </Query>
  )
}

export default NoteDetails;