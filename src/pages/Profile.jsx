import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/auth/me");

      setUser(res.data);
      setName(res.data.name || "");
    } catch {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put("/auth/me", { name });

      toast.success("Profile Updated");

      fetchProfile();
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!user) return <h2>No user found</h2>;

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Profile</h1>

        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>

        <p>
          Member Since:{" "}
          {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "N/A"}
        </p>

        <hr />

        <h3>Update Name</h3>

        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter new name"
          />

          <button type="submit">Update</button>
        </form>
      </div>
    </>
  );
};

export default Profile;