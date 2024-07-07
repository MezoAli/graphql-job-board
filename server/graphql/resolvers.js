import { getCompany } from "../db/companies.js";
import { getJobs } from "../db/jobs.js";

export const resolvers = {
  Query: {
    jobs: () => getJobs(),
  },
  Job: {
    date: (job) => {
      return new Date(job.createdAt).toLocaleDateString();
    },
    company: (job) => getCompany(job.companyId),
  },
};
