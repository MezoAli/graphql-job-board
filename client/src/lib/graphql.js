import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient("http://localhost:9000/graphql");

export const getAllJobs = async () => {
  const query = gql`
    query {
      jobs {
        id
        title
        date
        company {
          id
          name
        }
      }
    }
  `;

  const data = await client.request(query);
  return data?.jobs;
};

export const getJobById = async (id) => {
  const query = gql`
    query jobById($id: ID!) {
      job(id: $id) {
        title
        id
        description
        date
        company {
          description
          id
          name
        }
      }
    }
  `;

  const data = await client.request(query, { id });
  return data?.job;
};

export const getCompanyById = async (id) => {
  const query = gql`
    query ($id: ID!) {
      company(id: $id) {
        description
        id
        name
      }
    }
  `;

  const data = await client.request(query, { id });
  console.log(data);
  return data?.company;
};
