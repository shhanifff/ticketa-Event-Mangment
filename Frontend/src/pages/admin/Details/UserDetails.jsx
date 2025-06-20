import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import AdminSidebar from "../../../components/Sidebar";
import { MyContext } from "../../../context/EventContext";
import LoadingPage from "../../Loading";
import Swal from "sweetalert2";

function UserDetails() {
  const { users, BlockAndUnblock, userDelete } = useContext(MyContext);
  const { id } = useParams();

  if (!users) return <LoadingPage />;

  const currentUser = users.find((x) => x._id.toString() === id);
  console.log(currentUser);

  if (!currentUser) {
    return (
      <div className="flex min-h-screen bg-black text-white items-center justify-center">
        <div className="text-xl">User not found</div>
      </div>
    );
  }

  // Format the date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Fixed function to properly handle block/unblock actions
  const handleUserBlockAndUnblock = (action) => {
    console.log("user " + action);
    BlockAndUnblock(action, id);
  };

  // Handle delete user with SweetAlert2 confirmation
  const handleDeleteUser = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the user. This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        userDelete(currentUser._id);
        Swal.fire("Deleted!", "The user has been deleted.", "success");
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 pt-20 transition-all duration-300 mt-16 md:mt-[7%]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Profile Card */}
            <div className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg border border-[#2b2b2b]">
              <div className="bg-black/25 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Profile</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      currentUser.isBlocked === true
                        ? "bg-red-900 text-red-200"
                        : "bg-green-900 text-green-200"
                    }`}
                  >
                    {currentUser.isBlocked === true ? "BLOCKED" : "ACTIVE"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center py-6 md:py-8 px-4">
                {/* Profile Picture */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-lg mb-4">
                  <img
                    src={
                      currentUser.profileImageUrl ||
                      "https://via.placeholder.com/150"
                    }
                    alt="User Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-center">
                  {currentUser.username}
                </h2>
                <span className="mt-2 px-3 py-1 bg-[#292929] rounded-full text-sm">
                  {currentUser.role}
                </span>
              </div>

              <div className="border-t border-[#2b2b2b] p-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <p className="text-white text-sm mt-1 break-words">
                      {currentUser.email}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Joined</label>
                    <p className="text-white text-sm mt-1">
                      {formatDate(currentUser.created_At)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Card */}
            <div className="lg:col-span-2">
              <div className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg border border-[#2b2b2b] h-full">
                <div className="bg-black/25 p-4">
                  <h2 className="text-lg font-bold">User Details</h2>
                </div>

                <div className="p-4 md:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-[#262626] p-4 rounded-lg">
                      <label className="text-sm text-gray-400 block mb-1">
                        User ID
                      </label>
                      <p className="text-white break-all font-mono text-sm">
                        {currentUser._id}
                      </p>
                    </div>

                    <div className="bg-[#262626] p-4 rounded-lg">
                      <label className="text-sm text-gray-400 block mb-1">
                        Role
                      </label>
                      <p className="text-white">{currentUser.role}</p>
                    </div>

                    <div className="bg-[#262626] p-4 rounded-lg">
                      <label className="text-sm text-gray-400 block mb-1">
                        Email
                      </label>
                      <p className="text-white break-words">
                        {currentUser.email}
                      </p>
                    </div>

                    <div className="bg-[#262626] p-4 rounded-lg">
                      <label className="text-sm text-gray-400 block mb-1">
                        Status
                      </label>
                      <p
                        className={`font-medium ${
                          currentUser.isBlocked === true
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {currentUser.isBlocked === true ? "Blocked" : "Active"}
                      </p>
                    </div>

                    <div className="bg-[#262626] p-4 rounded-lg">
                      <label className="text-sm text-gray-400 block mb-1">
                        Joined
                      </label>
                      <p className="text-white">
                        {formatDate(currentUser.created_At)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleDeleteUser}
                      className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Delete User
                    </button>

                    {currentUser.isBlocked === true ? (
                      <button
                        onClick={() => handleUserBlockAndUnblock("unblock")}
                        className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        Unblock User
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUserBlockAndUnblock("block")}
                        className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        Block User
                      </button>
                    )}
                  </div>

                  <div className="mt-4 text-sm text-gray-400">
                    <p>
                      {currentUser.isBlocked === true
                        ? "Unblocking this user will allow them to access all features."
                        : "Blocking this user will restrict their access to the platform."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
