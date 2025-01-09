import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ViewCandidate from "./ViewCandidate";
import { fetchCandidates } from "../../services/CandidateService";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

jest.mock("../../services/CandidateService", () => ({
  fetchCandidates: jest.fn(),
}));

describe("ViewCandidate", () => {
  const mockCandidates = [
    { candidateID: 1, name: "amrutha nair" },
  ];

  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    mock.onGet("https://localhost:7294/api/candidates").reply(200, mockCandidates);
    (fetchCandidates as jest.Mock).mockResolvedValue(mockCandidates);
  });

  it("should fetch and display the candidates", async () => {
    render(
      <Router>
        <ViewCandidate />
      </Router>
    );

    await waitFor(() => expect(fetchCandidates).toHaveBeenCalledTimes(1));
    const candidateNameCell = await screen.findByText("amrutha nair");
    expect(candidateNameCell).toBeInTheDocument();
   
  });

 
});
