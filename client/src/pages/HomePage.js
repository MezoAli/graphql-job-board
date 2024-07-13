import JobList from "../components/JobList";
import { useJobs } from "../lib/hooks";

function HomePage() {
  const { jobs, error, loading } = useJobs();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something Went Wrong</div>;
  }

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
