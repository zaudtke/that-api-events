import { gql } from 'apollo-boost';

export default gql`
  union _Entity

  type _Service {
    sdl: String
  }

  extend type Query {
    _entities(representations: [_Any!]!): [_Entity]!
    _service: _Service!
  }
`;
