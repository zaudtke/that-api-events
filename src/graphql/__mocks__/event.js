import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import faker from 'faker';

const mockEvent = () => ({
  __typename: 'Event',
  id: uuidv4(),
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
