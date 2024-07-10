import { GraphQLClient, gql } from "graphql-request";
import { getAccessToken } from "./auth";

const client = new GraphQLClient("http://localhost:9000/graphql", {
  headers: () => {
    const accessToken = getAccessToken();
    if (accessToken) {
      return { Authorization: `Bearer ${accessToken}` };
    } else {
      return {};
    }
  },
});

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
    query companyById($id: ID!) {
      company(id: $id) {
        description
        id
        name
        jobs {
          id
          title
          description
          date
        }
      }
    }
  `;

  const data = await client.request(query, { id });
  console.log(data);
  return data?.company;
};

export const createJob = async ({ title, description }) => {
  const mutation = gql`
    mutation ($input: CreateJobType!) {
      job: createJob(input: $input) {
        id
      }
    }
  `;

  const data = await client.request(mutation, {
    input: { title, description },
  });
  return data?.job;
};
