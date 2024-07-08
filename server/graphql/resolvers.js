import { getCompany } from "../db/companies.js";
import { getJob, getJobs } from "../db/jobs.js";

export const resolvers = {
  Query: {
    jobs: () => getJobs(),
    job: (_, args) => getJob(args.id),
  },
  Job: {
    date: (job) => {
      return new Date(job.createdAt).toLocaleDateString();
    },
    company: (job) => getCompany(job.companyId),
  },
};
