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

  const result = await apolloClient.query({
    query,
    fetchPolicy: "network-only",
  });
  return result.data.jobs;
};

const jobDetailsFragment = gql`
  fragment JobDetails on Job {
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
`;

const jobByIdQuery = gql`
  query jobById($id: ID!) {
    job(id: $id) {
      ...JobDetails
    }
  }
  ${jobDetailsFragment}
`;

export const getJobById = async (id) => {
  const result = await apolloClient.query({
    query: jobByIdQuery,
    variables: { id },
  });
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
        ...JobDetails
      }
    }
    ${jobDetailsFragment}
  `;

  const result = await apolloClient.mutate({
    mutation,
    variables: {
      input: {
        title,
        description,
      },
    },
    update: (cache, result) => {
      cache.writeQuery({
        query: jobByIdQuery,
        variables: { id: result.data.job.id },
        data: result.data,
      });
    },
  });

  return result.data.job;
};
