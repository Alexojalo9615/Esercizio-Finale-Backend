import React from "react";
import "./index.css"; // Importa il file CSS
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import NavbarCon from "./components/Navbar";
import Register from "./pages/Register";
import { Container } from "react-bootstrap";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import MyPosts from "./pages/MyPosts";
import Profile from "./pages/Profile";

function App() {

  return (

    <Router>
      <AuthProvider>
        <NavbarCon />
        <Container>
          <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/create" element={<CreatePost/>} />
            <Route path="/posts/:id" element={<PostDetails/>} />
            <Route path="/my-posts" element={<MyPosts/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/" element={<Home/>} />
          </Routes>
        </Container>
      </AuthProvider>
    </Router>

  );
}

export default App;
