const event = dbInstance => {
  const create = async newEvent => {
    const eventsCol = dbInstance.collection('events');
    const newDocument = await eventsCol.add(newEvent);

    const returnDoc = {
      id: newDocument.id,
      ...newEvent,
    };

    console.log('return doc', returnDoc);

    return returnDoc;
  };

  return { create };
};

export default event;
