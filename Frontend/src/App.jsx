import { TripsView } from "./components/TripsView";
import { TripDetailView } from "./components/TripDetailView";
import { Routes, Route, Navigate } from "react-router-dom";
import Profile from "./components/Profile.jsx";
import Settings from "./components/Settings";
import { useAuth } from "./components/auth/AuthContext";
import { AuthPage } from "./components/auth/AuthPage";
import Layout from "./components/Layout.jsx";
import { ImageCarouselView } from "./components/ImageCarouselView";
import { PhotoGrid } from "./components/PhotoGrid.jsx";
import JoinTrip from "./components/JoinTrip";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Zoom } from 'react-toastify'

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const pendingInvite = localStorage.getItem("pendingInvite");
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
        />
    <Routes>
      {/* Public auth route */}
      <Route
        path="/auth"
        element={
          isAuthenticated ? (
            <Navigate
              to={pendingInvite ? `/join-trip/${pendingInvite}` : "/"}
              replace
            />
          ) : (
            <AuthPage />
          )
        }
      />

      <Route path="/join-trip/:token" element={<JoinTrip />} />

      {/* Protected routes inside Layout */}
      {isAuthenticated && (
        <Route element={<Layout />}>
          <Route path="/" element={<TripsView />}></Route>
          <Route path="/trips/:tripId" element={<TripDetailView />} />
          <Route
            path="/trips/:tripId/:memorycardId"
            element={<ImageCarouselView />}
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<PhotoGrid />} />
        </Route>
      )}

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/auth"} />}
      />
    </Routes>
    </>
  );
}
