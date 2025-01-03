import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Text, PrimaryButton, Stack, IStackTokens, ITextProps, IStackStyles } from "@fluentui/react";

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
  resume: string | null;
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

  const downloadResume = () => {
    if (candidate?.resume) {
      try {
        const resumeUrl = `https://localhost:7294/${candidate.resume.replace("\\", "/")}`;
        const link = document.createElement("a");
        link.href = resumeUrl;
        link.download = `${candidate.name}_Resume.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading resume:", error);
        alert("Failed to download the resume.");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const stackTokens: IStackTokens = { childrenGap: 10 };
  const textStyle: ITextProps = {
    styles: { root: { fontSize: 16, fontWeight: 400 } },
  };
  const stackStyles: IStackStyles = { root: { width: '100%', maxWidth: '800px', margin: '0 auto' } };

  return (
    <div style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
      <Stack tokens={stackTokens} styles={stackStyles}>
        <Link to="/view-candidates">
          <PrimaryButton text="Back to List" />
        </Link>

        <Text variant="xxLarge" styles={{ root: { textAlign: "center" } }} block>
          Candidate Details
        </Text>

        {candidate && (
          <Stack tokens={stackTokens}>
            <Text {...textStyle}><strong>Name:</strong> {candidate.name}</Text>
            <Text {...textStyle}><strong>Gender:</strong> {candidate.gender}</Text>
            <Text {...textStyle}><strong>Email:</strong> {candidate.email}</Text>
            <Text {...textStyle}><strong>Date of Birth:</strong> {new Date(candidate.dob).toLocaleDateString()}</Text>
            <Text {...textStyle}><strong>Place:</strong> {candidate.place}</Text>
            <Text {...textStyle}><strong>Phone Number:</strong> {candidate.phoneNumber}</Text>
            <Text {...textStyle}><strong>Highest Education Qualification:</strong> {candidate.highestEducationQualification}</Text>
            <Text {...textStyle}><strong>Qualification Passout Year:</strong> {candidate.qualificationPassoutYear}</Text>
            <Text {...textStyle}><strong>Marks Obtained Percentage:</strong> {candidate.marksObtainedPercentage}%</Text>
            <Text {...textStyle}><strong>Experience:</strong> {candidate.haveAnyExperience ? "Yes" : "No"}</Text>

            {candidate.resume && (
              <Text {...textStyle}>
                <strong>Resume:</strong>
                <PrimaryButton text="Download Resume" onClick={downloadResume} style={{ marginLeft: "10px" }} />
              </Text>
            )}
          </Stack>
        )}
      </Stack>
    </div>
  );
};

export default CandidateDetails;
