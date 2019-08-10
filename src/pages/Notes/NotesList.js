/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { Query } from "react-apollo";
import { makeStyles } from '@material-ui/styles';
import { Skeleton, List, message, Pagination } from 'antd';
import { Link } from 'react-router-dom';

import { GET_NOTES } from '../../queries/notes';

const useStyles = makeStyles({
  pagination: {
    margin: '10px 0px',
    display: 'flex',
    justifyContent: 'center',
  }
});

function NotesList() {
  const [page, setPage] = useState(1);
  const [max, setMax] = useState(0);
  const classes = useStyles();

  function updateQuery(prev, { fetchMoreResult }) {
    if (!fetchMoreResult) return prev;
    if (fetchMoreResult.notes.count !== max) setMax(fetchMoreResult.notes.count);
    return fetchMoreResult.notes.rows;
  }

  return (
    <>
      <h1>Liste des notes</h1>
      <Query
        query={GET_NOTES}
        variables={{
          offset: (page - 1) * 5,
          limit: 5
        }}
        pollInterval={5000}
      >
        {({ loading, error, data, fetchMore }) => {
          if (loading || !data || !data.notes) return <Skeleton active />
          if (error) {
            message.error('Erreur ! ' + error.message);
            return 'Veuillez rafraîchir la page.';
          }
          setMax(data.notes.count);
          function loadMore(clickedPage) {
            const newPagination = {
              offset: (clickedPage - 1) * 5,
              limit: 5,
            }
            fetchMore({
              variables: newPagination,
              updateQuery,
            });
            setPage(clickedPage);
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
                  <List.Item>
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
                  total={max}
                  size="small"
                />
              </footer>
            </>
          )
        }}
      </Query>
    </>
  )
}

export default NotesList;
