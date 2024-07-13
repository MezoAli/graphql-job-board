import { useQuery } from "@apollo/client";
import { companyByIdQuery } from "./graphql";

export const useCompany = (id) => {
  const { data, error, loading } = useQuery(companyByIdQuery, {
    variables: { id },
  });
  return { company: data?.company, loading, error: Boolean(error) };
};
