const stringSort = ({ data, sortBy, sortField }) => {
  const sortByObject = sortBy.reduce(
    (obj, item, index) => ({
      ...obj,
      [item]: index,
    }),
    {},
  );
  return data.sort(
    (a, b) => sortByObject[a[sortField]] - sortByObject[b[sortField]],
  );
};

export default {
  stringSort,
};
