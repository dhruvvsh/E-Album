import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Users } from "lucide-react";
import { toast } from "react-toastify";
import api, { getErrorMessage } from "@/lib/api";

function JoinTrip() {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasRequested = useRef(false);

  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;

    const jwt = localStorage.getItem("Token");

    if (!jwt) {
      localStorage.setItem("pendingInvite", token);
      navigate("/auth");
      return;
    }

    joinTrip();
  }, [token]);

  const joinTrip = async () => {
    localStorage.removeItem("pendingInvite");

    try {
      const { data } = await api.post(`/trips/join/${token}`);

      navigate(`/trips/${data.trip._id}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to join trip"));
      navigate("/");
    }
  };

  return (
    <div className="app-canvas flex min-h-screen items-center justify-center p-6">
      <div className="animate-fade-up flex max-w-sm flex-col items-center text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-white shadow-sm">
          <Users className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Joining the trip</h1>
        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Hang tight, this only takes a moment...
        </p>
      </div>
    </div>
  );
}

export default JoinTrip;
