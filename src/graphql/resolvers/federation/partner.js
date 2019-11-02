/* eslint-disable no-underscore-dangle */
const remoteResolvers = {
  Partner: {
    __resolveReference(user, { fetchUserById }) {
      return fetchUserById(user.id);
    },
  },
};

export default remoteResolvers;
