import uuid from 'uuid/v4';
import moment from 'moment';
import faker from 'faker';

const mockEvent = () => ({
  __typename: 'Event',
  id: uuid(),
  startDate: moment().subtract(1, 'days'),
  endDate: moment().add(3, 'days'),
  name: faker.lorem.word(),
  description: faker.lorem.paragraph(),
  slogan: faker.lorem.sentence(),
  year: moment().year,
});

const mockQueries = () => ({});

export default mockEvent;
export const queries = mockQueries;
