import { useProjectStore } from "../store/useProjectStore"; // đường dẫn chính xác tùy file bạn

const JoinProjectPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const setCurrentProjectId = useProjectStore((state) => state.setCurrentProjectId);

  useEffect(() => {
    const joinProject = async () => {
      try {
        const res = await axios.post(
          `http://localhost:5001/api/projects/join/${token}`,
          {},
          { withCredentials: true }
        );
        alert("Project joined successfully!");
        setCurrentProjectId(res.data.projectId); // set vào store
        navigate("/"); 
      } catch (err) {
        alert(
          "Can't join project : " +
            (err.response?.data?.error || err.message)
        );
        navigate("/");
      }
    };

    joinProject();
  }, [token, navigate, setCurrentProjectId]);

  return <p className="p-4">Joining project ...</p>;
};
