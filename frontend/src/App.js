
import React from 'react';
import { BrowserRouter as  Router, Routes, Route} from 'react-router-dom';
import SignIn from './components/signin';
import SignUp from './components/signup';
import Home from './components/home';


function App() {
  return (
    <Router>
            <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Home" element={<Home />} />
        
        </Routes>
    </Router>
  );
}

export default App;
