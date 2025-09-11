import { useEffect, useState } from "react";
import axios from "axios";
import { Baseurl } from "../main";



export const useAuth = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const UserId = localStorage.getItem("userId1");
        if (!UserId) {
          setLoading(false);
          return;
        }

        axios.defaults.withCredentials = true;
        const response = await axios.get(`${Baseurl}/isadmin`, {
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": UserId,
          },
          withCredentials: true,
        });

        console.log("checking role in frontend :", response.data.role);
        setRole(response.data.role); // save role
      } catch (error) {
        console.log("Error checking admin status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, []);

  return { role, loading };
};
