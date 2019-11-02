import { resolvers as graphScalars } from 'graphql-scalars';

import customScalars from './scalars/date';
import queries from './queries';
import mutations from './mutations';
import federation from './federation';

const createServer = {
  ...graphScalars,
  ...customScalars,
  ...federation,
  Query: {
    ...queries,
  },
  Mutation: {
    ...mutations,
  },
};

export default createServer;
