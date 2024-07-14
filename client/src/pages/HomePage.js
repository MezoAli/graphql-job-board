import { useEffect, useState } from "react";
import JobList from "../components/JobList";
import { useJobs } from "../lib/hooks";
import PaginationBar from "../components/PaginationBar";

const JOBS_PER_PAGE = 10;

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { jobs, totalCount, error, loading } = useJobs(
    JOBS_PER_PAGE,
    (currentPage - 1) * JOBS_PER_PAGE
  );
  const totalPages = Math.ceil(totalCount / JOBS_PER_PAGE);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something Went Wrong</div>;
  }

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
