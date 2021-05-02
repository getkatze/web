import { createClient } from '@urql/core';

export const client = createClient({
  url: 'http://localhost:4000/graphql',
});

export const query = async (query: string, options?: any) => {
  return await client.query(query, options || {}).toPromise();
};

