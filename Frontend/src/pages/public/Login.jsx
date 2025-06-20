import React from "react";
import { useForm } from "react-hook-form";
import LogBg from "../../assets/images/login-bg.jpg";
import { Link, useNavigate } from "react-router-dom";
import { handleLogin } from "../../api/authAPI's";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    handleLogin(data, navigate);
  };

  return (
    <div className="w-full min-h-screen bg-[#07090c] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center justify-center">
        {/* Form Section */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full bg-white rounded-t-3xl flex flex-col justify-center items-center gap-4 p-6 shadow-lg"
        >
          <h1 className="text-xl font-bold text-gray-800 mb-4">Login</h1>

          {/* Email Input + Error */}
          <div className="w-full flex flex-col items-start">
            <input
              type="text"
              {...register("email", { required: true })}
              className="w-full py-2 px-4 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/50 text-sm"
              placeholder="Email"
            />
            {errors.email?.type === "required" && (
              <p className="text-red-500 text-xs mt-1">Required</p>
            )}
          </div>

          {/* Password Input + Error */}
          <div className="w-full flex flex-col items-start">
            <input
              type="password"
              {...register("password", { required: true })}
              className="w-full py-2 px-4 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/50 text-sm"
              placeholder="Password"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500 text-xs mt-1">Required</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-gray-300 hover:bg-gray-400/70 text-black font-semibold rounded-lg shadow-md text-sm"
          >
            Login
          </button>

          <div className="mt-4 w-full">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                const post = await axios.post(
                  "http://localhost:5000/api/auth",
                  { credential: credentialResponse.credential }
                );
                console.log("login Success", post);
                localStorage.setItem("user", "user");
                localStorage.setItem("token", post.data.token1);
                localStorage.setItem("userId", post.data.data._id);

                navigate("/");

              
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            ></GoogleLogin>
          </div>
        </form>

        {/* Image Section */}
        <div className="w-full h-40 sm:h-48 relative rounded-b-3xl overflow-hidden">
          {/* Background Image with Brightness */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${LogBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "brightness(0.5)",
            }}
          ></div>

          {/* Content (Text) */}
          <div className="relative z-10 w-full h-full flex flex-col gap-4 items-center justify-center text-white px-6 text-center">
            <h1 className="text-sm">
              New to <span className="font-bold">ticketa</span>? Create an
              account now to discover and book amazing events!
            </h1>
            <Link
              className="py-2 bg-gray-300/10 px-4 rounded-4xl text-white hover:bg-gray-300/30 text-sm"
              to="/register"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
