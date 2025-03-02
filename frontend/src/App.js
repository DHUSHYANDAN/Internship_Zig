import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/signinpage";
import SignUp from "./pages/signuppage";
import Home from "./pages/Homepage";
import ProtectedRoute from "./components/protectedRoutes";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Protected Route for Home */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/home" element={<Home />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
