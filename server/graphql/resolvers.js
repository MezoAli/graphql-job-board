import { getCompany } from "../db/companies.js";
import {
  createJob,
  deleteJob,
  getCompanyJobs,
  getJob,
  getJobs,
  updateJob,
} from "../db/jobs.js";
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
    createJob: async (_, { input: { title, description } }, context) => {
      if (!context.user) {
        throw unauthorizedError("you are un-authorized");
      }
      const job = await createJob({
        companyId: context.user.companyId,
        description,
        title,
      });
      return job;
    },
    deleteJob: async (_, { id }) => {
      const job = await deleteJob(id);
      if (!job) {
        throw customError(`no job found with that id : ${id}`);
      }
      return job;
    },
    updateJob: async (_, { input: { title, description, id } }) => {
      const job = await updateJob({ title, description, id });
      if (!job) {
        throw customError(`no job found with that id : ${id}`);
      }
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

const unauthorizedError = (message) => {
  return new GraphQLError(message, { extensions: { code: "UNAUTHORIZED" } });
};
