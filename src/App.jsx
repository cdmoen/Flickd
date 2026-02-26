import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute/ProtectedRoute";
import { AuthRedirect } from "./routes/AuthRedirect/AuthRedirect";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import MovieSearch from "./pages/MovieSearch/MovieSearch";
import Friends from "./pages/Friends/Friends";
import NavBar from "./components/NavBar/NavBar";
import Groups from "./pages/Groups/Groups";
import Layout from "./components/Layout/Layout";
import MoviePage from "./pages/MoviePage/MoviePage";
import Home from "./pages/Home/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<AuthRedirect />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/movies" element={<MovieSearch />} />
            <Route path="/movies/:movieID" element={<MoviePage />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/groups" element={<Groups />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
