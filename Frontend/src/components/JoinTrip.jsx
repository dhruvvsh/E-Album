import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function JoinTrip() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = localStorage.getItem("Token");

    if (!jwt) {
      localStorage.setItem("pendingInvite", token);
      navigate("/auth");
      return;
    }

    joinTrip();
  }, []);

  const joinTrip = async () => {
    try {
      const jwt = localStorage.getItem("Token");

      const { data } = await axios.post(
        `http://localhost:8000/trips/join/${token}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      navigate(`/trips/${data.trip._id}`);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  return <div>Joining Trip...</div>;
}

export default JoinTrip;
