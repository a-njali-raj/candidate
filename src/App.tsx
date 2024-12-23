import React from 'react';
import { BrowserRouter as Router, Route,Routes} from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home';
import AddCandidate from './components/AddCandidate/AddCandidate';
import ViewCandidate from './components/ViewCandidate/ViewCandidate';
import CandidateDetails from './components/CandidateDetails/CandidateDetails';
import UpdateCandidate from './components/UpdateCandidate/UpdateCandidate';

const App: React.FC = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/addcandidate" element={<AddCandidate/>} />
          <Route path="/view-candidates" element={<ViewCandidate/>} />
          <Route path="/candidate/:id" element={<CandidateDetails/>} />
          <Route path="/candidate/update/:id" element={<UpdateCandidate/>}/>
          
        </Routes>
      </Router>
    );
  };

export default App;
