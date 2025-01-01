import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CandidateInfo, fetchCandidate, updateCandidate } from "../../services/CandidateService";
import axios from "axios";

const UpdateCandidate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<CandidateInfo>({
    name: "",
    gender: "",
    dob: "",
    place: "",
    phoneNumber: "",
    highestEducationQualification: "",
    qualificationPassoutYear: 0,
    marksObtainedPercentage: 0,
    haveAnyExperience: false,
    resume: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7294/api/candidate/${id}`);
        const dob = response.data.dob ? formatDate(response.data.dob) : '';
        
        setCandidate({ ...response.data, dob }); // Format dob if necessary
        setLoading(false);
       
      } catch (error) {
        setError("Error fetching candidate details.");
        setLoading(false);
      }
    };

    fetchCandidateDetails();
  }, [id]);

  const formatDate = (date: string) => {
    // Convert date if necessary, for example, if it comes as a timestamp or in MM/DD/YYYY format
    // For now, assuming date is in MM/DD/YYYY or timestamp format, convert to YYYY-MM-DD
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split('T')[0]; // YYYY-MM-DD
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setCandidate({ ...candidate, [name]: newValue });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCandidate({ ...candidate, resume: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCandidate(id, candidate);
      navigate("/view-candidates", { state: { successMessage: "Candidate details updated successfully!" } });
    } catch (error) {
      console.error("Error updating candidate details:", error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading candidate details...</div>;
  }

  return (
    <div className="container-lg mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-lg">
            <div className="card-body">
              <h2 className="text-center mb-4">Update Candidate</h2>
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={candidate.name || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Gender</label>
                      <select
                        name="gender"
                        className="form-control"
                        value={candidate.gender || ""}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        className="form-control"
                        value={candidate.dob || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        className="form-control"
                        value={candidate.phoneNumber || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Place</label>
                      <input
                        type="text"
                        name="place"
                        className="form-control"
                        value={candidate.place || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Highest Education Qualification</label>
                      <input
                        type="text"
                        name="highestEducationQualification"
                        className="form-control"
                        value={candidate.highestEducationQualification || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Qualification Passout Year</label>
                      <input
                        type="number"
                        name="qualificationPassoutYear"
                        className="form-control"
                        value={candidate.qualificationPassoutYear || 0}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Marks Obtained Percentage</label>
                      <input
                        type="number"
                        name="marksObtainedPercentage"
                        className="form-control"
                        value={candidate.marksObtainedPercentage || 0}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group form-check mb-3">
                  <input
                    type="checkbox"
                    name="haveAnyExperience"
                    className="form-check-input"
                    checked={candidate.haveAnyExperience || false}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Have Any Experience</label>
                </div>

                <div className="form-group mb-3">
  <label>Resume</label>
  {candidate.resume && (
    <div>
      <strong>Current Resume:</strong>
      {/* Check if the resume is a File object */}
      {typeof candidate.resume === 'string' ? (
        <span>{candidate.resume}</span>
      ) : (
        <span>{candidate.resume?.name}</span> // If it's a File, show the file name
      )}
      <br />
      
    </div>
  )}
  <input
    type="file"
    name="resume"
    className="form-control-file"
    onChange={handleFileChange}
  />
</div>



<div className="d-flex justify-content-between mt-4">
  <button type="submit" className="btn btn-primary">
    Update Candidate
  </button>
  <button
    type="button"
    className="btn btn-secondary"
    onClick={() => navigate("/view-candidates")}
  >
    Cancel
  </button>
</div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCandidate;
