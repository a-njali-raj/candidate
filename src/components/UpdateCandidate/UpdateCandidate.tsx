import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CandidateInfo, fetchCandidate, updateCandidate } from "../../services/CandidateService";

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

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        const candidateData = await fetchCandidate(id);
        setCandidate(candidateData);
        setLoading(false);
      } catch (error) {
        setError("Error fetching candidate details.");
        setLoading(false);
      }
    };

    fetchCandidateDetails();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setCandidate({ ...candidate, [name]: newValue });

    validateField(name, newValue);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCandidate({ ...candidate, resume: e.target.files[0] });
    }
  };

  const validateField = (fieldName: string, value: any) => {
    let errorMessage = "";

    switch (fieldName) {
      case "name":
        if (!/^[a-zA-Z ]{1,100}$/.test(value)) {
          errorMessage = "Name must contain only letters and up to 2 spaces.";
        } else if (value.length > 100) {
          errorMessage = "Name cannot exceed 100 characters.";
        }
        break;
      case "gender":
        if (!/^[a-zA-Z]+$/.test(value)) {
          errorMessage = "Gender must contain only letters.";
        } else if (value.length > 10) {
          errorMessage = "Gender cannot exceed 10 characters.";
        }
        break;
      case "email":
        if (!/^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          errorMessage = "Email is not in a valid format.";
        } else if (value.length > 100) {
          errorMessage = "Email cannot exceed 100 characters.";
        }
        break;
      case "dob":
        const dobDate = new Date(value);
        if (dobDate < new Date("1999-01-01") || dobDate > new Date("2002-12-31")) {
          errorMessage = "Date of Birth must be between 1999 and 2002.";
        }
        break;
      case "place":
        if (!/^[a-zA-Z]+( [a-zA-Z]+)?$/.test(value)) {
          errorMessage = "Place must contain only letters and one space.";
        } else if (value.length > 200) {
          errorMessage = "Place cannot exceed 200 characters.";
        }
        break;
      case "phoneNumber":
        if (!/^\d{10}$/.test(value)) {
          errorMessage = "Phone number must be exactly 10 digits and contain no spaces or special characters.";
        }
        break;
      case "highestEducationQualification":
        if (!/^[a-zA-Z ]{1,50}$/.test(value)) {
          errorMessage = "Education qualification must contain only letters and up to 4 spaces.";
        } else if (value.length > 50) {
          errorMessage = "Highest Education Qualification cannot exceed 50 characters.";
        }
        break;
      case "qualificationPassoutYear":
        const year = parseInt(value, 10);
        if (year < 2020 || year > 2024) {
          errorMessage = "Passout Year must be between 2020 and 2024.";
        }
        break;
      case "marksObtainedPercentage":
        const marks = parseFloat(value);
        if (marks < 0 || marks > 100) {
          errorMessage = "Marks obtained percentage must be between 0 and 100.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors: any) => ({ ...prevErrors, [fieldName]: errorMessage }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  
    let isValid = true;
    Object.keys(candidate).forEach((field) => {
      validateField(field, (candidate as any)[field]);
      if (errors[field]) isValid = false;
    });

    if (!isValid) return;

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
            <div className="card-body position-relative">
              <button
                className="btn-close position-absolute top-0 end-0 m-3"
                aria-label="Close"
                onClick={() => navigate("/view-candidates")}
              ></button>

              <h2 className="text-center mb-4">Update Candidate</h2>
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        value={candidate.name}
                        onChange={handleChange}
                        required
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Gender</label>
                      <select
                        name="gender"
                        className={`form-control ${errors.gender ? "is-invalid" : ""}`}
                        value={candidate.gender}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
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
                        className={`form-control ${errors.dob ? "is-invalid" : ""}`}
                        value={candidate.dob}
                        onChange={handleChange}
                        required
                      />
                      {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
                        value={candidate.phoneNumber}
                        onChange={handleChange}
                        required
                      />
                      {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
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
                        className={`form-control ${errors.place ? "is-invalid" : ""}`}
                        value={candidate.place}
                        onChange={handleChange}
                        required
                      />
                      {errors.place && <div className="invalid-feedback">{errors.place}</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Highest Education Qualification</label>
                      <input
                        type="text"
                        name="highestEducationQualification"
                        className={`form-control ${errors.highestEducationQualification ? "is-invalid" : ""}`}
                        value={candidate.highestEducationQualification}
                        onChange={handleChange}
                        required
                      />
                      {errors.highestEducationQualification && (
                        <div className="invalid-feedback">{errors.highestEducationQualification}</div>
                      )}
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
                        className={`form-control ${errors.qualificationPassoutYear ? "is-invalid" : ""}`}
                        value={candidate.qualificationPassoutYear}
                        onChange={handleChange}
                        required
                      />
                      {errors.qualificationPassoutYear && (
                        <div className="invalid-feedback">{errors.qualificationPassoutYear}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Marks Obtained Percentage</label>
                      <input
                        type="number"
                        name="marksObtainedPercentage"
                        className={`form-control ${errors.marksObtainedPercentage ? "is-invalid" : ""}`}
                        value={candidate.marksObtainedPercentage}
                        onChange={handleChange}
                        required
                      />
                      {errors.marksObtainedPercentage && (
                        <div className="invalid-feedback">{errors.marksObtainedPercentage}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label>Do you have any experience?</label>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="haveAnyExperience"
                      className="form-check-input"
                      checked={candidate.haveAnyExperience}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Yes</label>
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label>Resume</label>
                  {candidate.resume && (
                    <div>
                      <strong>Current Resume:</strong>
                      {typeof candidate.resume === "string" ? (
                        <span>{candidate.resume}</span>
                      ) : (
                        <span>{candidate.resume?.name}</span>
                      )}
                      <br />
                    </div>
                  )}
                  <input
                    type="file"
                    name="resume"
                    accept=".pdf"
                    className="form-control-file"
                    onChange={handleFileChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  Update Candidate
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCandidate;
