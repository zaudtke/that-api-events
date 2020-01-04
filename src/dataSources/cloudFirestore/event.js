import debug from 'debug';

const dlog = debug('that:api:events:datasources:firebase:event');

const event = (dbInstance, logger) => {
  dlog('instance created');

  const collectionName = 'events';
  const eventsCol = dbInstance.collection(collectionName);

  const create = async newEvent => {
    dlog('create');
    const scrubbedEvent = newEvent;

    if (newEvent.website) scrubbedEvent.website = newEvent.website.href;

    const newDocument = await eventsCol.add(scrubbedEvent);
    logger.debug(`created new event: ${newDocument.id}`);

    return {
      id: newDocument.id,
      ...newEvent,
    };
  };

  const get = async id => {
    dlog('get');
    const docRef = dbInstance.doc(`${collectionName}/${id}`);
    const doc = await await docRef.get();

    return {
      id: doc.id,
      ...doc.data(),
    };
  };

  const getAll = async () => {
    dlog('get all');
    const { docs } = await eventsCol.get();

    const results = docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    return results;
  };

  const update = (id, eventInput) => {
    dlog('update');
    const scrubbedEvent = eventInput;
    if (eventInput.website) scrubbedEvent.website = eventInput.website.href;

    const docRef = dbInstance.doc(`${collectionName}/${id}`);

    return docRef.update(eventInput).then(res => {
      logger.debug(`updated event: ${id}`);

      return {
        id,
        ...eventInput,
      };
    });
  };

  return { create, getAll, get, update };
};

export default event;
