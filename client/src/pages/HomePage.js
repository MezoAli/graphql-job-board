import { useEffect, useState } from "react";
import JobList from "../components/JobList";
import { useJobs } from "../lib/hooks";

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "50%",
          margin: "20px auto",
        }}
      >
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          style={{
            padding: "5px 10px",
            borderRadius: "5px",
            fontWeight: "bolder",
            cursor: `${currentPage === 1 ? "" : "pointer"}`,
          }}
        >
          Previous
        </button>
        <span style={{ fontWeight: "bold", fontSize: "30px" }}>
          {currentPage}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: "5px 10px",
            borderRadius: "5px",
            fontWeight: "bolder",
            cursor: `${currentPage === totalPages ? "" : "pointer"}`,
          }}
        >
          Next
        </button>
      </div>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
