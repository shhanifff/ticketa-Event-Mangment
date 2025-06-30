import React, { useContext, useState } from "react";
import AdminSidebar from "../../components/Sidebar";
import { MyContext } from "../../context/EventContext";
import { useNavigate } from "react-router-dom";

function ManageUsers() {
  const { users } = useContext(MyContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Safe initials function
  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "NA";
    return name
      .split(" ")
      .map((n) => n[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2);
  };

  if (!Array.isArray(users) || users.length === 0) {
    return <p className="text-white">No users available</p>;
  }
 
  const filteredUsers = users.filter(
    (user) =>
      user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#161414] min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6 pt-20 text-white">
        <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

        {/* 🔍 Search Box */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/2 p-3 rounded-lg bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
          />
        </div>

        {/* 👥 Users List */}
        <div className="grid gap-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user?._id}
                onClick={() => navigate(`/admin/ManageUsers/${user?._id}`)}
                className="flex items-center gap-4 p-4 border border-gray-700 rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] cursor-pointer transition-all"
              >
                {/* 🔤 Initials */}
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg">
                  {getInitials(user?.username)}
                </div>

                {/* 📄 User Info */}
                <div>
                  <p className="text-lg font-semibold">
                    {user?.username || "Unknown User"}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {user?.email || "No email"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No users found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
