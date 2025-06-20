import axios from "axios";
import { Notyf } from "notyf";
import toast from "react-hot-toast";
import "notyf/notyf.min.css";
var notyf = new Notyf({
  position: {
    x: "right",
    y: "top",
  },
});

export async function handleRegister(data, navigate) {
  console.log("handle regis", data);
  const { username, email, password } = data;

  // Normalize phone numbers (remove spaces, convert to string)

  try {
    // already registred ano check chyth
    const response = await axios.get("http://localhost:5000/api/getUsers");
    const users = response.data.data;

    // check the email exist
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      console.log("Email already registered");
      notyf.error("Email already registered!");
      return;
    }

    // values pass chyth

    await axios.post("http://localhost:5000/api/register", {
      username,
      email,
      password,
    });

    localStorage.setItem("canVerifyOtp", "true");
    navigate("/otp-verify", { state: { email } });
    await axios.post("http://localhost:5000/api/generate-otp", { email });

    // toast.success("Registration successful!");
    // notyf.success("Register Successfully");
    // navigate("/login");
  } catch (error) {
    toast.error(error.response?.data?.data?.message || "Something went wrong!");
    console.error("Error in handleRegister:", error);
  }
}

export async function handleLogin(datas, navigate) {
  const { email, password } = datas;
  console.log("Login email & pass", email, password);

  try {
    const response = await axios.get("http://localhost:5000/api/getUsers");
    const users = response.data.data;

    const userExistIndex = users.findIndex((user) => user.email === email);

    if (userExistIndex === -1) {
      notyf.error("Invalid email or password");
      return;
    }

    const userExist = users[userExistIndex];

    if (userExist.regType === "Google") {
      notyf.error("This Email Signed Up with Google");
      return;
    }

    const res = await axios.post("http://localhost:5000/api/login", {
      email,
      password,
    });
    const currentUser = res.data;

    if (currentUser.data.role === "admin") {
      localStorage.setItem("admin", "admin");
      localStorage.setItem("Token ID", currentUser?.token);
      console.log("token", currentUser.token);
      notyf.success(`Welcome ${currentUser.data.role}`);
      navigate("/admin/dashboard");
      return;
    }

    localStorage.setItem("user", "user");
    localStorage.setItem("isNewLogin", "true");
    localStorage.setItem("token", currentUser.token);
    localStorage.setItem("userId", currentUser.data._id);

    notyf.success("Login successful!");
    navigate("/");
    return;
  } catch (err) {
    console.log("Login failed", err);
    notyf.error("Invalid E-mail or Password");
  }
}

export const GoogleAuth = async (code) => {
  try {
    if (code && code.trim() !== "") {
      console.log("code received in googleAuth in frontend", code);
      const res = await axios.get(
        `http://localhost:5000/api/google?code=${encodeURIComponent(code)}`
      );
      return res;
    } else {
      console.log("Invalid code received in googleAuth in frontend");
    }
  } catch (error) {
    console.error("Error in GoogleAuth:", error);
  }
};
