import { resolvers as graphScalars } from 'graphql-scalars';

import customScalars from './scalars/date';
import queries from './queries';
import mutations from './mutations';

const createServer = {
  ...graphScalars,
  ...customScalars,
  Query: {
    ...queries,
  },
  Mutation: {
    ...mutations,
  },
};

export default createServer;
