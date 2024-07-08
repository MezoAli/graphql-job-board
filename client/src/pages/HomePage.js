import { useEffect, useState } from "react";
import JobList from "../components/JobList";
import { getAllJobs } from "../lib/graphql";

function HomePage() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    const setAllJobs = async () => {
      const allJobs = await getAllJobs();
      setJobs(allJobs);
    };
    setAllJobs();
  }, []);
  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
