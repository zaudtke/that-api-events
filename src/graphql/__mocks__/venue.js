import uuid from 'uuid/v4';
import faker from 'faker';

const mockVenue = () => ({
  __typename: 'Venue',
  id: uuid(),
  name: faker.company.companyName(),
  address: faker.address.streetAddress(),
  addressLineTwo: faker.address.secondaryAddress(),
  city: faker.address.city(),
  state: faker.address.state(),
});

const mockQueries = () => ({});

export default mockVenue;
export const queries = mockQueries;
