import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../services/api";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
    } catch (error) {
      setUser(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "#2563eb",
        color: "white",
        padding: "15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <Link to="/dashboard" style={{ color: "white", marginRight: "15px" }}>
          Dashboard
        </Link>

        <Link to="/profile" style={{ color: "white", marginRight: "15px" }}>
          Profile
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        {user && user.name && (
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "white",
              color: "#2563eb",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}

        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;