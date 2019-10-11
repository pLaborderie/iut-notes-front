import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Skeleton, message, Row, Icon, Button, Col } from 'antd';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { withApollo } from 'react-apollo';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

import { GET_NOTE, GET_NOTE_PDF } from '../../queries/notes';

function NoteDetails(props) {
  const { loading, data, error } = useQuery(GET_NOTE, {
    variables: props.match.params,
    client: props.client,
  });
  const [getPdf, { data: pdfData, error: pdfError, loading: pdfLoading }] = useLazyQuery(GET_NOTE_PDF, { client: props.client });

  useEffect(() => {
    if (!loading) {
      // Highlight all code blocks
      for (let block of document.getElementsByTagName('pre')) {
        hljs.highlightBlock(block);
      }
    }
  }, [loading]);

  useEffect(() => {
    if (!pdfLoading) {
      if (pdfError) {
        message.error('Erreur lors de la récupération du fichier');
      } else if (hasPdfData()) {
        const { blob, filename } = getPdfFile();
        downloadFile(blob, filename);
        message.success('Fichier prêt au téléchargement');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfData, pdfLoading]);

  function hasPdfData() {
    return pdfData && pdfData.notePdf;
  }

  function downloadFile(blob, filename) {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename + '.pdf';
    link.click();
  }

  function getPdfFile() {
    const buffer = Buffer.from(pdfData.notePdf, 'base64');
    const blob = new Blob([buffer], { type: 'application/pdf' });
    const filename = data.note.title.replace(/ /g, '_');
    return { blob, filename };
  }

  function handleClickPdf() {
    getPdf({
      variables: props.match.params,
    });
  }

  if (loading) return <Skeleton active />;
  if (error) {
    message.error('Erreur ! ' + error.message);
    return 'Veuillez rafraîchir la page.';
  }

  return (
    <>
      <Row justify="space-between">
        <Col span={18}>
          <h1>{data.note.title}</h1>
        </Col>
        <Col>
          <Button.Group>
            <Button loading={pdfLoading} type="primary" onClick={handleClickPdf}>
              PDF
              <Icon type="download" />
            </Button>
          </Button.Group>
        </Col>
      </Row>
      <hr />
      <ReactMarkdown source={data.note.content} />
    </>
  )
}

export default withApollo(NoteDetails);