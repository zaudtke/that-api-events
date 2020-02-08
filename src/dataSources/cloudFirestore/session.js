import debug from 'debug';

const dlog = debug('that:api:events:datasources:firebase:sessions');

const collectionName = 'sessions';

const session = dbInstance => {
  dlog('instance created');

  const sessionsCollections = dbInstance.collection(collectionName);

  async function findAllApprovedByEventId(eventId) {
    dlog('findAll');
    const { docs } = await sessionsCollections
      .where('eventId', '==', eventId)
      .where('status', 'in', ['ACCEPTED', 'SCHEDULED', 'CANCELLED'])
      .get();

    const results = docs.map(d => ({
      id: d.id,
    }));

    return results;
  }

  return { findAllApprovedByEventId };
};

export default session;
