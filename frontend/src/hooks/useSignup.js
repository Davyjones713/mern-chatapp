import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext.jsx";

function useSignup() {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async ({
    fullName,
    username,
    password,
    verifyPassword,
    gender,
  }) => {
    const success = handleInputsValidation({
      fullName,
      username,
      password,
      verifyPassword,
      gender,
    });
    if (!success) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          fullName,
          username,
          password,
          verifyPassword,
          gender,
        }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, signup };
}

const handleInputsValidation = ({
  fullName,
  username,
  password,
  verifyPassword,
  gender,
}) => {
  if (!fullName || !username || !password || !verifyPassword || !gender) {
    toast.error("Please fill all the fields");
    return false;
  }
  if (password !== verifyPassword) {
    toast.error("Passwords doesnt match");
    return false;
  }
  if (password.length < 6) {
    toast.error("Password must be more than 6 characters");
    return false;
  }

  return true;
};

export default useSignup;
