const collectionName = 'venues';

const venue = (dbInstance, logger) => {
  const venueCollection = dbInstance.collection(collectionName);

  const create = async newVenue => {
    const scrubbedVenue = newVenue;
    if (newVenue.website) scrubbedVenue.website = newVenue.website.href;

    const newDocument = await venueCollection.add(scrubbedVenue);
    logger.debug(`created new venue: ${newDocument.id}`);

    return {
      id: newDocument.id,
      ...newVenue,
    };
  };

  const find = async id => {
    const docRef = dbInstance.doc(`${collectionName}/${id}`);
    const doc = await await docRef.get();

    return {
      id: doc.id,
      ...doc.data(),
    };
  };

  const findAll = async () => {
    const { docs } = await venueCollection.get();

    const results = docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    return results;
  };

  const update = (id, venueInput) => {
    const scrubbedVenue = venueInput;
    if (venueInput.website) scrubbedVenue.website = venueInput.website.href;

    const docRef = dbInstance.doc(`${collectionName}/${id}`);

    return docRef.update(venueInput).then(res => {
      logger.debug(`updated event: ${id}`);

      return {
        id,
        ...venueInput,
      };
    });
  };

  return { create, find, findAll, update };
};

export default venue;
