import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home'; 

describe('Home Component', () => {
  it('checks if buttons are present by text', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
 
    const addCandidateButton = screen.getByText('Add Candidate');
    const viewCandidatesButton = screen.getByText('View Registered Candidates');
    
    expect(addCandidateButton).toBeInTheDocument();
    expect(viewCandidatesButton).toBeInTheDocument();
  });
});
