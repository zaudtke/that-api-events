// import { importSchema } from 'graphql-import';

// const typeDefs = () => importSchema(`${__dirname}/schema.graphql`);

// export default typeDefs();

import path from 'path';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';

const typesArray = fileLoader(path.join(__dirname, './**/*.graphql'), {
  recursive: true,
});

export default mergeTypes(typesArray, { all: true });
