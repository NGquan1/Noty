import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useProjectStore } from "../store/useProjectStore";
import toast from "react-hot-toast";

const JoinProjectPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const setCurrentProjectId = useProjectStore(
    (state) => state.setCurrentProjectId
  );

  const hasJoined = useRef(false);
  useEffect(() => {
    if (hasJoined.current) return;
    hasJoined.current = true;
    const joinProject = async () => {
      try {
        const res = await axios.post(
          `http://localhost:5001/api/projects/join/${token}`,
          {},
          { withCredentials: true }
        );
        toast.success("Project joined successfully!");
        setCurrentProjectId(res.data.projectId); 
        navigate("/");
      } catch (err) {
        toast.error(
          "Can't join project: " + (err.response?.data?.error || err.message)
        );
        navigate("/");
      }
    };
    joinProject();
  }, [token, navigate, setCurrentProjectId]);

  return <p className="p-4">Joining project ...</p>;
};

export default JoinProjectPage;
