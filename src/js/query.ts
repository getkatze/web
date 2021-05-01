import { createClient } from '@urql/core';

const client = createClient({
  url: 'https://api.katze.tech/graphql',
});

export const query = async (query: string, options?: any) => {
  return await client.query(query, options || {}).toPromise();
};

export default query;
