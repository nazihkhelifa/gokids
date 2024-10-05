import { neon } from "@neondatabase/serverless";

const sqlClient = neon(process.env.NEON_DATABASE_URL!);

export const query = async (queryText: string) => {
  const result = await sqlClient(queryText);
  return result;
};
