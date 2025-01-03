import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Text, PrimaryButton } from '@fluentui/react';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleAddCandidate = () => {
    navigate ('/addcandidate'); 
  };

  const handleViewCandidates = () => {
    navigate('/view-candidates');
  };

  return (
    <Stack
      verticalAlign="center"
      horizontalAlign="center"
      styles={{
        root: {
          height: '100vh',
          backgroundColor: '#f3f2f1',
         
          backgroundSize: 'cover',
          backgroundPosition: 'center center', 
          padding: 20,
        },
      }}
    >
      <Text variant="xxLarge" styles={{ root: { marginBottom: 20, fontWeight: 600, selectors: { 
        ':hover': { 
          color: 'grey' 
        } 
      }}
       }}>
        Welcome to the Candidate Management System
      </Text>
      <Stack
        horizontal
        horizontalAlign="center"
        tokens={{ childrenGap: 20 }}
      >
        <PrimaryButton
          text="Add Candidate"
          onClick={handleAddCandidate}
          styles={{
            root: { height: 40, padding: '0 20px' },
          }}
        />
        <PrimaryButton
          text="View Registered Candidates"
          onClick={handleViewCandidates}
          styles={{
            root: { height: 40, padding: '0 20px' },
          }}
        />
      </Stack>
    </Stack>
  );
};

export default Home;
