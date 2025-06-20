"use client";
import regBg from "../../assets/images/register-bg.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { handleRegister } from "../../api/authAPI's";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
// import OAuth from "../../components/OAuth";
// import toast from "react-hot-toast";
import "notyf/notyf.min.css";
import { Notyf } from "notyf";
var notyf = new Notyf({
  position: {
    x: "right",
    y: "top",
  },
});

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const formData = data;
    // console.log(formData.username);

    const { email  } = formData;

    console.log(email);

    handleRegister(formData, navigate);
  };

  return (
    <div className="w-full min-h-screen bg-[#161414] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center justify-center">
        {/* Registration form */}
        <div className="w-full bg-white rounded-t-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-4 sm:p-6">
            <h1 className="text-xl font-bold text-black text-center mb-4">
              Create Account
            </h1>

            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="bx bx-user text-gray-400 text-lg"></i>
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full py-2 pl-10 pr-4 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-transparent text-sm"
                  {...register("username", { required: true, maxLength: 20 })}
                />
                {errors.username?.type === "required" && (
                  <p className="text-red-500 text-xs mt-1">Required</p>
                )}
                {errors.username?.type === "maxLength" && (
                  <p className="text-red-500 text-xs mt-1">Max 20 chars</p>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="bx bx-envelope text-gray-400 text-lg"></i>
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full py-2 pl-10 pr-4 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-transparent text-sm"
                  {...register("email", {
                    required: true,
                    pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                  })}
                />
                {errors.email?.type === "required" && (
                  <p className="text-red-500 text-xs mt-1">Required</p>
                )}
                {errors.email?.type === "pattern" && (
                  <p className="text-red-500 text-xs mt-1">Invalid email</p>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="bx bx-lock-alt text-gray-400 text-lg"></i>
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full py-2 pl-10 pr-4 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-transparent text-sm"
                  {...register("password", {
                    required: true,
                    minLength: 8,
                    maxLength: 16,
                  })}
                />
                {errors.password?.type === "required" && (
                  <p className="text-red-500 text-xs mt-1">Required</p>
                )}
                {errors.password?.type === "minLength" && (
                  <p className="text-red-500 text-xs mt-1">Min 8 chars</p>
                )}
                {errors.password?.type === "maxLength" && (
                  <p className="text-red-500 text-xs mt-1">Max 16 chars</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2 mt-1 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-lg shadow-md transition duration-300 text-sm"
                // onClick={()=> navigate('')}
              >
                Sign Up
              </button>
            </form>

            {/* Divider */}
            <div className="mt-4 flex items-center">
              <hr className="flex-grow border-gray-300" />
              <span className="px-4 text-xs text-gray-500">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Google Auth Button */}

            <div className="mt-4 w-full">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  const post = await axios.post(
                    "http://localhost:5000/api/auth",
                    { credential: credentialResponse.credential }
                  );
                  notyf.success(`Successfully Registerd`);
                  console.log("login Success", post);
                  localStorage.setItem("user", "user");
                  localStorage.setItem("token", post.token);
                  localStorage.setItem("userId", post.data.data._id);

                  navigate("/");
                }}
                onError={() => {
                  notyf.error("Google Register Failed");
                  console.log("Login Failed");
                }}
              ></GoogleLogin>
            </div>
          </div>
        </div>

        {/* Image section */}
        <div
          className="w-full h-40 sm:h-48 rounded-b-3xl flex flex-col justify-end gap-4 px-4 py-4"
          style={{
            backgroundImage: `url(${regBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex justify-center">
            <Link
              className="py-2 px-4 bg-white/20 rounded-full text-white text-sm hover:bg-white/30 transition duration-300"
              to="/login"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
