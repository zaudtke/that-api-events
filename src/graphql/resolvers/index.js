import { resolvers as graphScalars } from 'graphql-scalars';

import customScalars from './scalars/date';
import queries, { fieldResolvers as qFieldResolvers } from './queries';
import mutations, { fieldResolvers as mFieldResolvers } from './mutations';
// import federation from './federation';

const createServer = {
  ...graphScalars,
  ...customScalars,
  // ...federation,

  ...qFieldResolvers,
  ...mFieldResolvers,

  Query: {
    ...queries,
  },

  Mutation: {
    ...mutations,
  },
};

export default createServer;
