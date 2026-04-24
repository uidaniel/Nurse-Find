import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import RegisterPatient from "./pages/auth/RegisterPatient";
import RegisterNurse from "./pages/auth/RegisterNurse";

import Dashboard from "./pages/patient/Dashboard";
import Search from "./pages/patient/Search";
import Bookings from "./pages/patient/Bookings";
import BookingDetail from "./pages/patient/BookingDetail";
import CreateBooking from "./pages/patient/CreateBooking";
import Addresses from "./pages/patient/Addresses";

import NurseDashboard from "./pages/nurse/Dashboard";
import CompleteProfile from "./pages/nurse/CompleteProfile";
import NurseServices from "./pages/nurse/Services";
import NurseOffers from "./pages/nurse/Offers";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPatient />} />
          <Route path="/register/nurse" element={<RegisterNurse />} />

          {/* Patient routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="patient"><Dashboard /></ProtectedRoute>
          } />
          <Route path="/search" element={
            <ProtectedRoute requiredRole="patient"><Search /></ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute requiredRole="patient"><Bookings /></ProtectedRoute>
          } />
          <Route path="/bookings/create" element={
            <ProtectedRoute requiredRole="patient"><CreateBooking /></ProtectedRoute>
          } />
          <Route path="/bookings/:id" element={
            <ProtectedRoute requiredRole="patient"><BookingDetail /></ProtectedRoute>
          } />
          <Route path="/addresses" element={
            <ProtectedRoute requiredRole="patient"><Addresses /></ProtectedRoute>
          } />

          {/* Nurse routes */}
          <Route path="/nurse/dashboard" element={
            <ProtectedRoute requiredRole="nurse"><NurseDashboard /></ProtectedRoute>
          } />
          <Route path="/nurse/complete-profile" element={
            <ProtectedRoute requiredRole="nurse"><CompleteProfile /></ProtectedRoute>
          } />
          <Route path="/nurse/services" element={
            <ProtectedRoute requiredRole="nurse"><NurseServices /></ProtectedRoute>
          } />
          <Route path="/nurse/offers" element={
            <ProtectedRoute requiredRole="nurse"><NurseOffers /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
