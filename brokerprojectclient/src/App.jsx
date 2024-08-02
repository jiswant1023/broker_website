import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import SignIn from "./pages/signIn/SignIn";
import Profile from "./pages/profile/Profile";
import About from "./pages/about/About";
import Header from "./components/Header/Header";
import SignUp from "./pages/signUp/SignUp";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Listing from "./pages/listing/listing";

function App() {
  return (
    
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route element={<PrivateRoute/>}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/listing" element={<Listing/>} />
          </Route>
          
          
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    
  );
}

export default App;
