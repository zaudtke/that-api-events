import debug from 'debug';

const dlog = debug('that:api:events:datasources:firebase:community');

const eventColName = 'events';

const community = dbInstance => {
  dlog('instance created');

  const eventCol = dbInstance.collection(eventColName);

  async function findActiveEvents(name) {
    const slimname = name.trim().toLowerCase();
    dlog('allActiveEvents for community: %s', slimname);
    const colSnapshot = eventCol
      .where('isActive', '==', true)
      .where('isFeatured', '==', true)
      .where('community', '==', slimname);

    const { size, docs } = await colSnapshot.get();
    let result = null;
    if (size > 0) {
      result = docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));
    }

    return result;
  }

  async function findAllEvents(name) {
    const slimname = name.trim().toLowerCase();
    dlog('allEvents for community: %s', slimname);
    const colSnapshot = eventCol
      .where('isFeatured', '==', true)
      .where('community', '==', slimname);

    const { size, docs } = await colSnapshot.get();
    let result = null;
    if (size > 0) {
      result = docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));
    }

    return result;
  }

  return { findActiveEvents, findAllEvents };
};

export default community;
