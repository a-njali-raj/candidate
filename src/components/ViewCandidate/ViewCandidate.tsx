import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { fetchCandidates, deleteCandidate } from "../../services/CandidateService"; // Importing service functions
import Toaster from "../Toaster/Toaster";
import "bootstrap/dist/css/bootstrap.min.css"; 


interface Candidate {
  candidateID: number; 
  name: string;
}

const ViewCandidate: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidatesData = async () => {
      try {
        const data = await fetchCandidates(); 
  
        const candidatesWithID = data.map((candidate, index) => ({
          candidateID: index + 1, 
          ...candidate,
        }));
        setCandidates(candidatesWithID);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    fetchCandidatesData();


    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleDelete = async (id: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this candidate?");
    
    if (isConfirmed) {
      try {
        await deleteCandidate(id); 
        setCandidates(candidates.filter(candidate => candidate.candidateID !== id));
        setSuccessMessage("Candidate deleted successfully.");
      } catch (error) {
        console.error("Error deleting candidate:", error);
        setSuccessMessage("Error deleting candidate.");
      }
    }
  };
  return (
    <div className="container mt-5">
      {successMessage && <Toaster message={successMessage} onClose={() => setSuccessMessage(null)} />}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-center mb-0" style={{ fontSize: "1.75rem", color: "#333" }}>
          Candidates List
        </h2>
        <Link to="/addcandidate" className="btn btn-primary btn-sm">Add Candidate</Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
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
                      className="btn btn-info btn-sm me-2"
                    >
                      <i className="bi bi-eye"></i> View
                    </Link>
                    <Link
                      to={`/candidate/update/${candidate.candidateID}`}
                      className="btn-sm me-2"
                    >
                      <i className="bi bi-pencil" style={{ fontSize: "1.25rem", color: "black" }}></i>
                    </Link>
                    <i
                      className="bi bi-trash-fill text-danger"
                      style={{ fontSize: "1.25rem", cursor: "pointer" }}
                      onClick={() => handleDelete(candidate.candidateID)} 
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewCandidate;
