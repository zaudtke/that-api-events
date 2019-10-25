import { resolvers } from 'graphql-scalars';
import queries from './queries';
import mutations from './mutations';

const createServer = {
  ...resolvers,
  Query: {
    ...queries,
  },
  Mutation: {
    ...mutations,
  },
};

export default createServer;
