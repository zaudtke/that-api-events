import debug from 'debug';
import notificationStore from '../../../dataSources/cloudFirestore/notification';

const dlog = debug('that:api:events:query');

const resolvers = {
  notifications: (
    parent,
    { eventId },
    { dataSources: { firestore, logger } },
  ) => {
    dlog('notifications');

    const id = eventId || parent.id;
    return notificationStore(firestore, logger).findAll(id);
  },
};

export default resolvers;
