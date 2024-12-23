import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

interface CandidateDetails {
  candidateID: number;
  name: string;
  gender: string;
  email: string;
  dob: string;
  place: string;
  phoneNumber: string;
  highestEducationQualification: string;
  qualificationPassoutYear: number;
  marksObtainedPercentage: number;
  haveAnyExperience: boolean;
  resume: string;
}

const CandidateDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<CandidateDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7294/api/candidate/${id}`
        );
        setCandidate(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching candidate details.");
        setLoading(false);
      }
    };

    fetchCandidateDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-5">
       <Link to="/view-candidates" className="btn btn-primary mt-3">
        Back to List
      </Link>
      <h2 className="text-center mb-4">Candidate Details</h2>
      {candidate && (
        <div>
          <p>
            <strong>Name:</strong> {candidate.name}
          </p>
          <p>
            <strong>Gender:</strong> {candidate.gender}
          </p>
          <p>
            <strong>Email:</strong> {candidate.email}
          </p>
          <p>
            <strong>Date of Birth:</strong> {new Date(candidate.dob).toLocaleDateString()}
          </p>
          <p>
            <strong>Place:</strong> {candidate.place}
          </p>
          <p>
            <strong>Phone Number:</strong> {candidate.phoneNumber}
          </p>
          <p>
            <strong>Highest Education Qualification:</strong> {candidate.highestEducationQualification}
          </p>
          <p>
            <strong>Qualification Passout Year:</strong> {candidate.qualificationPassoutYear}
          </p>
          <p>
            <strong>Marks Obtained Percentage:</strong> {candidate.marksObtainedPercentage}%
          </p>
          <p>
            <strong>Experience:</strong> {candidate.haveAnyExperience ? "Yes" : "No"}
          </p>
          {candidate.resume && (
            <p>
            <strong>Resume:</strong>{" "}
            <a
              href={`data:application/pdf;base64,${candidate.resume}`} // assuming 'candidate.resume' contains the base64 string
              download={`Resume_${candidate.name}.pdf`} // The name of the downloaded file
              className="btn btn-info"
            >
              Download
            </a>
          </p>
          
          )}
        </div>
      )}
     
    </div>
  );
};

export default CandidateDetails;
