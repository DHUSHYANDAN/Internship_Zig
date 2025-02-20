import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React  from 'react';

import Adduser from './components/addUser';
import Viewuser from './components/ViewUser';
import Edit from './components/edit';
// import Delete from './components/delete';
import './App.css';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Viewuser />} />
        <Route path="/addUsers" element={<Adduser />} />
        <Route path="/viewUsers" element={<Viewuser />} />
        <Route path="/UpdateUsers/:employee_code" element={<Edit />} />
        {/* <Route path="/DeleteUsers" element={<Delete />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
