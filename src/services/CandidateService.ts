import axios from "axios";

export interface CandidateInfo {
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

const API_BASE_URL = "https://localhost:7294/api";

export const addCandidate = async (candidate: CandidateInfo): Promise<void> => {
    const formData = new FormData();
    Object.entries(candidate).forEach(([key, value]) => {
      if (value !== null) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });
    await axios.post(`${API_BASE_URL}/add`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
  };

export const fetchCandidate = async (id: string | undefined): Promise<CandidateInfo> => {
  const response = await axios.get(`${API_BASE_URL}/candidate/${id}`);
  const candidateData = response.data;
  if (candidateData.dob) {
    candidateData.dob = candidateData.dob.split("T")[0]; // Extract only the date part
  }
  return candidateData;
};

export const updateCandidate = async (id: string | undefined, candidate: CandidateInfo): Promise<void> => {
  const formData = new FormData();
  Object.entries(candidate).forEach(([key, value]) => {
    formData.append(key, value as string | Blob);
  });
  await axios.put(`${API_BASE_URL}/update/${id}`, formData);
};
