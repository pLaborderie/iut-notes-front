import gql from 'graphql-tag';

export const ADD_CATEGORY = gql`
  mutation addCategory($name: String!, $semester: Semester!) {
    addCategory(name: $name, semester: $semester) {
      id
    }
  }
`;