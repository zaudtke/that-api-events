import uuid from 'uuid/v4';
import moment from 'moment';
import faker from 'faker';

const mockMilestone = () => ({
  __typename: 'Milestone',
  id: uuid(),
  title: faker.lorem.words(),
  description: faker.lorem.sentences(),
  dueDate: moment().add(10, 'days'),
});

const mockQueries = () => ({});

export default mockMilestone;
export const queries = mockQueries;
