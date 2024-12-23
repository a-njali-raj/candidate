import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Toaster from "../Toaster/Toaster";
import { Link } from "react-router-dom";

interface Candidate {
  candidateID: number;
  name: string;
}

const ViewCandidate: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get("https://localhost:7294/api/candidates");
        setCandidates(response.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    fetchCandidates();

    // Display success message if available in location state
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // Clear success message from history state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div className="container d-flex justify-content-center mt-5">
      {/* Toaster for success message */}
      {successMessage && <Toaster message={successMessage} onClose={() => setSuccessMessage(null)} />}
      
      <div className="w-75">
        <h2 className="text-center mb-5" style={{ fontSize: "1.5rem", color: "black" }}>
          Candidates List
        </h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.candidateID}>
                <td>{candidate.name}</td>
                <td>
                  <Link
                    to={`/candidate/${candidate.candidateID}`}
                    className="btn btn-info me-2 btn-sm"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/candidate/update/${candidate.candidateID}`}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <i
                    className="bi bi-trash-fill"
                    style={{ fontSize: "1rem", cursor: "pointer" }}
                    onClick={() => console.log("Delete candidate:", candidate.candidateID)}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewCandidate;
