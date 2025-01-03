import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { addCandidate } from "../../services/CandidateService"; 

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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

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

   
    validateField(name, value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, resume: e.target.files[0] });
    }
  };

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "name":
        if (!/^[a-zA-Z ]{1,100}$/.test(value)) {
          error = "Name must contain only letters and up to 2 spaces.";
        } else if (value.length > 100) {
          error = "Name cannot exceed 100 characters.";
        }
        break;
      case "gender":
        if (!/^[a-zA-Z]+$/.test(value)) {
          error = "Gender must contain only letters.";
        } else if (value.length > 10) {
          error = "Gender cannot exceed 10 characters.";
        }
        break;
      case "email":
        if (!/^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          error = "Email is not in a valid format.";
        } else if (value.length > 100) {
          error = "Email cannot exceed 100 characters.";
        }
        break;
      case "dob":
        const dobDate = new Date(value);
        if (dobDate < new Date("1999-01-01") || dobDate > new Date("2002-12-31")) {
          error = "Date of Birth must be between 1999 and 2002.";
        }
        break;
      case "place":
        if (!/^[a-zA-Z]+( [a-zA-Z]+)?$/.test(value)) {
          error = "Place must contain only letters and one space.";
        } else if (value.length > 200) {
          error = "Place cannot exceed 200 characters.";
        }
        break;
      case "phoneNumber":
        if (!/^\d{10}$/.test(value)) {
          error = "Phone number must be exactly 10 digits and contain no spaces or special characters.";
        }
        break;
      case "highestEducationQualification":
        if (!/^[a-zA-Z ]{1,50}$/.test(value)) {
          error = "Education qualification must contain only letters and up to 4 spaces.";
        } else if (value.length > 50) {
          error = "Highest Education Qualification cannot exceed 50 characters.";
        }
        break;
      case "qualificationPassoutYear":
        const year = parseInt(value, 10);
        if (year < 2020 || year > 2024) {
          error = "Passout Year must be between 2020 and 2024.";
        }
        break;
      case "marksObtainedPercentage":
        const marks = parseFloat(value);
        if (marks < 0 || marks > 100) {
          error = "Marks obtained percentage must be between 0 and 100.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  
    Object.keys(formData).forEach((field) => {
      if (formData[field] !== null && formData[field] !== "") {
        validateField(field, formData[field] as string);
      }
    });


    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

   
    const candidateData = {
      name: formData.name as string,
      gender: formData.gender as string,
      email: formData.email as string,
      dob: formData.dob as string,
      place: formData.place as string,
      phoneNumber: formData.phoneNumber as string,
      highestEducationQualification: formData.highestEducationQualification as string,
      qualificationPassoutYear: parseInt(formData.qualificationPassoutYear as string, 10),
      marksObtainedPercentage: parseFloat(formData.marksObtainedPercentage as string),
      haveAnyExperience: formData.haveAnyExperience as boolean,
      resume: formData.resume as File | null,
    };

    try {
      await addCandidate(candidateData);
      alert("Candidate added successfully!");
      navigate("/view-candidates");
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the candidate.");
    }
  };

  return (
    <div className="container mt-5">
   
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-secondary" onClick={() => navigate("/view-candidates")}>View Candidates</button>
      </div>
      
     
      <div className="d-flex justify-content-center">
        <div className="card p-4 shadow-lg" style={{ maxWidth: "800px", width: "100%" }}>
          <h2 className="text-center mb-4">Add Candidate</h2>
          <form onSubmit={handleSubmit}>
          
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name as string}
                onChange={handleChange}
                required
              />
              {errors.name && <div className="text-danger">{errors.name}</div>}
            </div>

            <div className="mb-3 row">
              <div className="col-md-6">
                <label htmlFor="gender" className="col-form-label">Gender</label>
                <select
                  className="form-select"
                  id="gender"
                  name="gender"
                  value={formData.gender as string}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <div className="text-danger">{errors.gender}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="email" className="col-form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email as string}
                  onChange={handleChange}
                  required
                />
                {errors.email && <div className="text-danger">{errors.email}</div>}
              </div>
            </div>

            <div className="mb-3 row">
              <div className="col-md-6">
                <label htmlFor="dob" className="col-form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  id="dob"
                  name="dob"
                  value={formData.dob as string}
                  onChange={handleChange}
                  required
                />
                {errors.dob && <div className="text-danger">{errors.dob}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="place" className="col-form-label">Place</label>
                <input
                  type="text"
                  className="form-control"
                  id="place"
                  name="place"
                  value={formData.place as string}
                  onChange={handleChange}
                  required
                />
                {errors.place && <div className="text-danger">{errors.place}</div>}
              </div>
            </div>

            <div className="mb-3 row">
              <div className="col-md-6">
                <label htmlFor="phoneNumber" className="col-form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber as string}
                  onChange={handleChange}
                  required
                />
                {errors.phoneNumber && <div className="text-danger">{errors.phoneNumber}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="highestEducationQualification" className="col-form-label">Highest Education Qualification</label>
                <input
                  type="text"
                  className="form-control"
                  id="highestEducationQualification"
                  name="highestEducationQualification"
                  value={formData.highestEducationQualification as string}
                  onChange={handleChange}
                  required
                />
                {errors.highestEducationQualification && <div className="text-danger">{errors.highestEducationQualification}</div>}
              </div>
            </div>

            <div className="mb-3 row">
              <div className="col-md-6">
                <label htmlFor="qualificationPassoutYear" className="col-form-label">Qualification Passout Year</label>
                <input
                  type="number"
                  className="form-control"
                  id="qualificationPassoutYear"
                  name="qualificationPassoutYear"
                  value={formData.qualificationPassoutYear as string}
                  onChange={handleChange}
                  required
                />
                {errors.qualificationPassoutYear && <div className="text-danger">{errors.qualificationPassoutYear}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="marksObtainedPercentage" className="col-form-label">Marks Obtained Percentage</label>
                <input
                  type="number"
                  className="form-control"
                  id="marksObtainedPercentage"
                  name="marksObtainedPercentage"
                  value={formData.marksObtainedPercentage as string}
                  onChange={handleChange}
                  required
                />
                {errors.marksObtainedPercentage && <div className="text-danger">{errors.marksObtainedPercentage}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="resume" className="form-label">Upload Resume</label>
              <input
                type="file"
                className="form-control"
                id="resume"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
              />
              {errors.resume && <div className="text-danger">{errors.resume}</div>}
            </div>

            <div className="mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="haveAnyExperience"
                  name="haveAnyExperience"
                  checked={formData.haveAnyExperience as boolean}
                  onChange={handleChange}
                />
                <label htmlFor="haveAnyExperience" className="form-check-label">Do you have any experience?</label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCandidate;
