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

export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

export const allJobsQuery = gql`
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

export const jobByIdQuery = gql`
  query jobById($id: ID!) {
    job(id: $id) {
      ...JobDetails
    }
  }
  ${jobDetailsFragment}
`;

export const companyByIdQuery = gql`
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

export const createJobMutation = gql`
  mutation ($input: CreateJobType!) {
    job: createJob(input: $input) {
      ...JobDetails
    }
  }
  ${jobDetailsFragment}
`;
