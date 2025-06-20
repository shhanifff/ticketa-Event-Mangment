import { useContext } from "react";
import AdminSidebar from "../../components/Sidebar";
import { MyContext } from "../../context/EventContext";
import blank_profile from '../../assets/images/Profile_avatar.png'

export default function MangeReviews() {
  const { reviews, deleteReview } = useContext(MyContext);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-[#121212] text-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 sm:p-8 md:ml-5">
        <div className="max-w-7xl mx-auto mt-11">
          {reviews?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews?.map((review) => (
                <div
                  key={review?._id}
                  className="bg-gradient-to-br from-[#1e1e1e] to-[#2b2b2b] rounded-xl p-5 shadow-md border border-[#2d2d2d] transition transform hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-[#3d3d3d]">
                        <img
                          src={
                            review?.userId?.profileImage ||
                            blank_profile
                          }
                          alt="User Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">
                          {review?.userId?.username || "Unknown User"}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {review?.created_At
                            ? formatDate(review?.created_At)
                            : "Date unavailable"}
                        </p>
                      </div>
                      <div className="text-amber-400 text-sm">
                        {"★".repeat(review?.rating || 0)}
                        {"☆".repeat(5 - (review?.rating || 0))}
                      </div>
                    </div>

                    {/* Review Content */}
                    <p className="text-sm text-gray-300 line-clamp-4">
                      {review?.review || "No review provided"}
                    </p>

                    {/* Footer */}
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => deleteReview(review?._id)}
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-700 transition-colors text-xs font-semibold rounded-md shadow-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#1e1e1e] rounded-xl p-6 text-center text-gray-400 border border-[#2d2d2d]">
              No reviews available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
