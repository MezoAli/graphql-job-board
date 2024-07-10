import { getCompany } from "../db/companies.js";
import { createJob, getCompanyJobs, getJob, getJobs } from "../db/jobs.js";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    jobs: () => getJobs(),
    job: async (_, args) => {
      const job = await getJob(args.id);
      if (!job) {
        throw customError(`can't find job with id : ${args.id}`);
      }
      return job;
    },
    company: async (_, args) => {
      const company = await getCompany(args.id);
      if (!company) {
        throw customError(`can't find company with id : ${args.id}`);
      }
      return company;
    },
  },

  Mutation: {
    createJob: async (_, { input: { title, description } }) => {
      const companyId = "FjcJCHJALA4i";
      const job = await createJob({ companyId, description, title });
      return job;
    },
  },
  Job: {
    date: (job) => {
      return new Date(job.createdAt).toLocaleDateString();
    },
    company: (job) => getCompany(job.companyId),
  },
  Company: {
    jobs: (company) => getCompanyJobs(company.id),
  },
};

const customError = (message) => {
  return new GraphQLError(message, { extensions: { code: "NOT_FOUND" } });
};
