import React from 'react';
import { Query } from "react-apollo";
import { Skeleton, List } from 'antd';

import { GET_NOTES } from '../../queries/notes';

function NotesList() {
  return (
    <>
      <h1>Liste des notes</h1>
      <Query query={GET_NOTES}>
        {({ loading, error, data }) => {
          if (loading) return <Skeleton />
          if (error) return 'Error! ' + error.message
          return (
            <List
              header="Notes correspondantes"
              itemLayout="horizontal"
              dataSource={data.notes}
              bordered
              locale={{ emptyText: 'Aucune note trouvée.' }}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
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
          )
        }}
      </Query>
    </>
  )
}

export default NotesList;
