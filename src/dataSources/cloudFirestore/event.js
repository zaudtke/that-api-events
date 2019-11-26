const event = (dbInstance, logger) => {
  const collectionName = 'events';
  const eventsCol = dbInstance.collection(collectionName);

  const create = async newEvent => {
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
    const docRef = dbInstance.doc(`${collectionName}/${id}`);
    const doc = await await docRef.get();

    return {
      id: doc.id,
      ...doc.data(),
    };
  };

  const getAll = async () => {
    const { docs } = await eventsCol.get();

    const results = docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    return results;
  };

  const update = (id, eventInput) => {
    logger.debug(`updating event: ${id}`);

    const docRef = dbInstance.doc(`${collectionName}/${id}`);

    return docRef.set(eventInput).then(res => ({
      id,
      ...eventInput,
    }));
  };

  return { create, getAll, get, update };
};

export default event;
