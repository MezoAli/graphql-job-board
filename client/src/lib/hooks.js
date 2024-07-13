import { useQuery } from "@apollo/client";
import { allJobsQuery, companyByIdQuery, jobByIdQuery } from "./graphql";

export const useCompany = (id) => {
  const { data, error, loading } = useQuery(companyByIdQuery, {
    variables: { id },
  });
  return { company: data?.company, loading, error: Boolean(error) };
};

export const useJob = (id) => {
  const { data, error, loading } = useQuery(jobByIdQuery, {
    variables: { id },
  });
  return { job: data?.job, loading, error: Boolean(error) };
};

export const useJobs = () => {
  const { data, error, loading } = useQuery(allJobsQuery, {
    fetchPolicy: "network-only",
  });
  return { jobs: data?.jobs, loading, error: Boolean(error) };
};
