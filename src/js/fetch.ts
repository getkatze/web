import { createClient } from "@urql/core";

const client = createClient({
    url: "https://dependent-hydrant-production.up.railway.app/graphql"
})


export const query = async (query: string, options?: any) => {
    let bruh = await client.query(query, options || {}).toPromise()
    return bruh
    // bruh moment











    // get it? *bruh* moment 
}