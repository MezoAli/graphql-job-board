import { getAccessToken } from "./auth";
import {
  ApolloClient,
  InMemoryCache,
  gql,
  concat,
  ApolloLink,
  createHttpLink,
} from "@apollo/client";

const httpLink = createHttpLink({ uri: "http://localhost:9000/graphql" });

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

export const getAllJobs = async () => {
  const query = gql`
    query jobs {
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

  const result = await apolloClient.query({ query });
  return result.data.jobs;
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

  const result = await apolloClient.query({ query, variables: { id } });
  return result.data.job;
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
  const result = await apolloClient.query({ query, variables: { id } });
  return result.data.company;
};

export const createJob = async ({ title, description }) => {
  const mutation = gql`
    mutation ($input: CreateJobType!) {
      job: createJob(input: $input) {
        id
      }
    }
  `;

  const result = await apolloClient.mutate({
    mutation,
    variables: {
      input: {
        title,
        description,
      },
    },
  });

  return result.data.job;
};
