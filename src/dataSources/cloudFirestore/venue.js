import debug from 'debug';

const dlog = debug('that:api:events:datasources:firebase:venue');

const collectionName = 'venues';

const venue = dbInstance => {
  dlog('instance created');

  const venueCollection = dbInstance.collection(collectionName);

  async function create(newVenue) {
    dlog('create');
    const scrubbedVenue = newVenue;
    if (newVenue.website) scrubbedVenue.website = newVenue.website.href;

    const newDocument = await venueCollection.add(scrubbedVenue);

    return {
      id: newDocument.id,
      ...newVenue,
    };
  }

  async function find(id) {
    dlog('find');
    const doc = await dbInstance.doc(`${collectionName}/${id}`).get();

    let result = null;
    if (doc.exists) {
      result = {
        id: doc.id,
        ...doc.data(),
      };
    }

    return result;
  }

  async function findByIds(ids) {
    dlog('find by id');
    let results = [];
    if (ids && ids.length > 0) {
      const dbResults = await Promise.all(
        ids.map(id => {
          const docRef = dbInstance.doc(`${collectionName}/${id}`);
          return docRef.get();
        }),
      );

      results = dbResults
        .filter(doc => doc.exists)
        .map(d => ({
          id: d.id,
          ...d.data(),
        }));
    }

    return results;
  }

  async function findAll() {
    dlog('findAll');
    const { docs } = await venueCollection.get();

    const results = docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    return results;
  }

  function update(id, venueInput) {
    dlog('update');
    const scrubbedVenue = venueInput;
    if (venueInput.website) scrubbedVenue.website = venueInput.website.href;

    const docRef = dbInstance.doc(`${collectionName}/${id}`);

    return docRef.update(venueInput).then(res => ({
      id,
      ...venueInput,
    }));
  }

  return { create, find, findAll, findByIds, update };
};

export default venue;
