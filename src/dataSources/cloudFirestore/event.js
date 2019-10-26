const event = dbInstance => {
  const eventsCol = dbInstance.collection('events');
  const create = async newEvent => {
    const newDocument = await eventsCol.add(newEvent);

    return {
      id: newDocument.id,
      ...newEvent,
    };
  };

  const getAll = async () => {
    const { docs } = await eventsCol.get();

    return docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));
  };

  return { create, getAll };
};

export default event;
