import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface CandidateInfo {
  name: string;
  gender: string;
  dob: string;
  place: string;
  phoneNumber: string;
  highestEducationQualification: string;
  qualificationPassoutYear: number;
  marksObtainedPercentage: number;
  haveAnyExperience: boolean;
  resume: File | null;
}

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

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await axios.get(`https://localhost:7294/api/candidate/${id}`);
        const candidateData = response.data;
        if (candidateData.dob) {
            candidateData.dob = candidateData.dob.split("T")[0]; // Extract only the date part
          }
        setCandidate(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching candidate details:", error);
      }
    };
    fetchCandidate();
  }, [id]);

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
  
    const formData = new FormData();
    Object.entries(candidate).forEach(([key, value]) => {
      formData.append(key, value as string | Blob);
    });
  
    try {
      await axios.put(`https://localhost:7294/api/update/${id}`, formData);
      navigate("/view-candidates", { state: { successMessage: "Candidate details updated successfully!" } });
    } catch (error) {
      console.error("Error updating candidate details:", error);
    }
  };
  
  if (loading) {
    return <div className="text-center">Loading candidate details...</div>;
  }

  return (
    <div className="container">
      <h2 className="text-center">Update Candidate</h2>
      <form onSubmit={handleSubmit}>
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
        <div className="form-group">
          <label>Have Any Experience</label>
          <input
            type="checkbox"
            name="haveAnyExperience"
            className="form-check-input"
            checked={candidate.haveAnyExperience || false}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Resume</label>
          <input
            type="file"
            name="resume"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Update</button>
      </form>
    </div>
  );
};

export default UpdateCandidate;
