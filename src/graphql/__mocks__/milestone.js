import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import faker from 'faker';

const mockMilestone = () => ({
  __typename: 'Milestone',
  id: uuidv4(),
  title: faker.lorem.words(),
  description: faker.lorem.sentences(),
  dueDate: moment().add(10, 'days'),
});

const mockQueries = () => ({});

export default mockMilestone;
export const queries = mockQueries;
