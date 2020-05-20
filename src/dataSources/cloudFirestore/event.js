import debug from 'debug';

const dlog = debug('that:api:events:datasources:firebase:event');

const event = dbInstance => {
  dlog('instance created');

  const collectionName = 'events';
  const eventsCol = dbInstance.collection(collectionName);

  const findBySlug = async slug => {
    dlog('find by slug');
    const colSnapshot = eventsCol.where('slug', '==', slug);
    const { size, docs } = await colSnapshot.get();

    let result = null;
    if (size === 1) {
      dlog('have 1 doc returned for slug %s', slug);
      const [d] = docs;
      result = {
        id: d.id,
        ...d.data(),
      };
    } else if (size > 1) {
      throw new Error(`Multiple Event slugs found for ${slug}`);
    }

    return result;
  };

  const create = async newEvent => {
    dlog('create with slug %s', newEvent.slug);
    const scrubbedEvent = newEvent;

    const slugCheck = await findBySlug(scrubbedEvent.slug);
    if (slugCheck)
      throw new Error(`Event slug, ${scrubbedEvent.slug}, is taken`);

    if (newEvent.website) scrubbedEvent.website = newEvent.website.href;

    const newDocument = await eventsCol.add(scrubbedEvent);

    return {
      id: newDocument.id,
      ...newEvent,
    };
  };

  const get = async id => {
    dlog('get');
    const docRef = dbInstance.doc(`${collectionName}/${id}`);
    const doc = await docRef.get();

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

  const update = async (id, eventInput) => {
    dlog('update id: %s', id);
    const scrubbedEvent = eventInput;
    if (eventInput.slug) {
      const slugCheck = await findBySlug(eventInput.slug);
      if (slugCheck) {
        if (slugCheck.id !== id)
          throw new Error(`Event slug, ${scrubbedEvent.slug}, is taken`);
      }
    }

    if (eventInput.website) scrubbedEvent.website = eventInput.website.href;

    const docRef = dbInstance.doc(`${collectionName}/${id}`);

    return docRef.update(eventInput).then(() => get(id));
  };

  return { create, getAll, get, findBySlug, update };
};

export default event;
