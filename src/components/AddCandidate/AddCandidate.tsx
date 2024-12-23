import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";

interface FormDataType {
  [key: string]: string | boolean | File | null;
}

const AddCandidate: React.FC = () => {
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    gender: "",
    email: "",
    dob: "",
    place: "",
    phoneNumber: "",
    highestEducationQualification: "",
    qualificationPassoutYear: "",
    marksObtainedPercentage: "",
    haveAnyExperience: false,
    resume: null,
  });

  const navigate = useNavigate();  // Initialize navigate

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;

    if (type === "checkbox") {
      setFormData((prevData) => ({ ...prevData, [name]: target.checked }));
    } else if (type === "file") {
      setFormData((prevData) => ({ ...prevData, [name]: target.files?.[0] || null }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const apiUrl = "https://localhost:7294/api/add";
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]: [string, string | boolean | File | null]) => {
      if (value !== null) {
        data.append(key, value instanceof File ? value : String(value));
      }
    });

    try {
      await axios.post(apiUrl, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      
      alert("Candidate added successfully!");
      navigate("/view-candidates");  // Redirect to ViewCandidate page
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the candidate.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center">
        <div className="card p-4" style={{ maxWidth: "800px", width: "100%" }}>
          <h2 className="text-center mb-4">Add Candidate</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" id="name" name="name" value={formData.name as string} onChange={handleChange} required />
            </div>

            <div className="mb-3 row">
              <div className="col-md-6">
                <label htmlFor="gender" className="col-form-label">Gender</label>
                <select className="form-select" id="gender" name="gender" value={formData.gender as string} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="email" className="col-form-label">Email</label>
                <input type="email" className="form-control" id="email" name="email" value={formData.email as string} onChange={handleChange} required />
              </div>
            </div>

            <div className="mb-3 row">
              <div className="col-md-6">
                <label htmlFor="dob" className="col-form-label">Date of Birth</label>
                <input type="date" className="form-control" id="dob" name="dob" value={formData.dob as string} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label htmlFor="place" className="col-form-label">Place</label>
                <input type="text" className="form-control" id="place" name="place" value={formData.place as string} onChange={handleChange} required />
              </div>
            </div>

            <div className="mb-3 row">
              <div className="col-md-6">
                <label htmlFor="phoneNumber" className="col-form-label">Phone Number</label>
                <input type="tel" className="form-control" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber as string} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label htmlFor="highestEducationQualification" className="col-form-label">Highest Education Qualification</label>
                <input type="text" className="form-control" id="highestEducationQualification" name="highestEducationQualification" value={formData.highestEducationQualification as string} onChange={handleChange} required />
              </div>
            </div>

            <div className="mb-3 row">
              <div className="col-md-6">
                <label htmlFor="qualificationPassoutYear" className="col-form-label">Qualification Passout Year</label>
                <input type="number" className="form-control" id="qualificationPassoutYear" name="qualificationPassoutYear" value={formData.qualificationPassoutYear as string} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label htmlFor="marksObtainedPercentage" className="col-form-label">Marks Obtained Percentage</label>
                <input type="number" className="form-control" id="marksObtainedPercentage" name="marksObtainedPercentage" value={formData.marksObtainedPercentage as string} onChange={handleChange} required />
              </div>
            </div>

            <div className="mb-3 row">
              <div className="col-md-6">
                <label htmlFor="haveAnyExperience" className="form-check-label">Have Any Experience</label>
                <input type="checkbox" className="form-check-input" id="haveAnyExperience" name="haveAnyExperience" checked={formData.haveAnyExperience as boolean} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="resume" className="col-form-label">Resume</label>
                <input type="file" className="form-control" id="resume" name="resume" onChange={handleChange} required />
              </div>
            </div>

            <div className="row">
  <div className="col-12 text-center"> {/* Use col-12 for full width and text-center for centering */}
    <button type="submit" className="btn btn-primary w-50"> {/* Use w-50 for a narrower width */}
      Submit
    </button>
  </div>
</div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCandidate;
