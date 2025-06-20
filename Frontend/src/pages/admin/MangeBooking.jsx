


/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useState, useMemo, useEffect } from "react";
import AdminSidebar from "../../components/Sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MyContext } from "../../context/EventContext";
import LoadingPage from "../Loading";
import { useTable, useSortBy } from "react-table";

function ManageBooking() {
  const { adminAllBookings } = useContext(MyContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade-in animation on mount
    setIsVisible(true);
  }, []);

  if (!adminAllBookings) return <LoadingPage />;

  const bookingsData = useMemo(() => {
    const all = [];

    adminAllBookings.forEach((user) => {
      user.bookings.forEach((b) => {
        const bookingDate = new Date(b.Created_At);

        const matchDate =
          !selectedDate ||
          (bookingDate.getFullYear() === selectedDate.getFullYear() &&
            bookingDate.getMonth() === selectedDate.getMonth() &&
            bookingDate.getDate() === selectedDate.getDate());

        const username = user.userId?.username || "N/A";
        const eventName = b.eventId?.title || "N/A";
        const matchSearch =
          username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          eventName.toLowerCase().includes(searchQuery.toLowerCase());

        if (matchDate && matchSearch) {
          all.push({
            bookingId: b.bookingId || "Free",
            username,
            eventName,
            paymentMode: b.bookingId ? "Razorpay" : "Free",
            createdAt: bookingDate.toLocaleDateString(),
            amount: b.amount || 0,
            quantity: b.quantity || 1,
            banner: b.eventId?.banner || "",
            phone: b.phone,
            email: b.email,
            fullDetails: b,
          });
        }
      });
    });

    return all;
  }, [adminAllBookings, selectedDate, searchQuery]);

  const columns = useMemo(
    () => [
      {
        Header: "Username",
        accessor: "username",
      },
      {
        Header: "Event Name",
        accessor: "eventName",
      },
      {
        Header: "Payment Mode",
        accessor: "paymentMode",
      },
      {
        Header: "Booking ID",
        accessor: "bookingId",
      },
      {
        Header: "Date",
        accessor: "createdAt",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <button
            onClick={() =>
              setSelectedBookingId(
                selectedBookingId === row.original.bookingId
                  ? null
                  : row.original.bookingId
              )
            }
            className="text-[#4B5EAA] hover:text-white hover:underline px-2 py-1 transition-all duration-200"
          >
            {selectedBookingId === row.original.bookingId
              ? "Close"
              : "view more..."}
          </button>
        ),
      },
    ],
    [selectedBookingId]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: bookingsData }, useSortBy);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <AdminSidebar />
      <div
        className={`flex-1 p-6 sm:p-8 pt-24 transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#4B5EAA] mb-8">
          Manage Bookings
        </h1>

        {/* Filters */}
        <div className="flex flex-col gap-6 mb-8 sm:flex-row sm:gap-4">
          <div className="w-full sm:w-48">
            <label className="block mb-2 text-gray-300 font-semibold text-sm sm:text-base">
              Filter by Date
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              placeholderText="Select Date"
              dateFormat="yyyy-MM-dd"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#4B5EAA] transition-all duration-300 hover:border-[#4B5EAA] text-sm sm:text-base"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 text-gray-300 font-semibold text-sm sm:text-base">
              Search Username / Event
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Username or Event Name"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#4B5EAA] transition-all duration-300 hover:border-[#4B5EAA] text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-gray-900 rounded-2xl shadow-xl border border-gray-700">
          <table
            {...getTableProps()}
            className="min-w-full text-white divide-y divide-gray-700"
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="p-4 text-left text-gray-300 font-semibold text-sm sm:text-base cursor-pointer hover:bg-gray-800 transition-colors duration-200"
                    >
                      {column.render("Header")}
                      <span className="ml-1">
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-6 text-center text-gray-300 text-sm sm:text-base"
                  >
                    No bookings found.
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  prepareRow(row);
                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        {...row.getRowProps()}
                        className="hover:bg-gray-800 transition-colors duration-200"
                      >
                        {row.cells.map((cell) => (
                          <td
                            {...cell.getCellProps()}
                            className="p-4 text-sm sm:text-base text-gray-300 border-t border-gray-700"
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                      {selectedBookingId === row.original.bookingId && (
                        <tr className="bg-gray-900">
                          <td
                            colSpan={columns.length}
                            className="p-4 transition-all duration-300"
                          >
                            <div className="flex flex-col gap-4 sm:gap-6">
                              <img
                                src={row.original.banner}
                                alt="Event Banner"
                                className="w-full h-32 sm:h-48 object-cover rounded-xl shadow-md"
                              />
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                                <p>
                                  <strong className="text-white">Event:</strong>{" "}
                                  <span className="text-gray-300">
                                    {row.original.eventName}
                                  </span>
                                </p>
                                <p>
                                  <strong className="text-white">
                                    Username:
                                  </strong>{" "}
                                  <span className="text-gray-300">
                                    {row.original.username}
                                  </span>
                                </p>
                                <p>
                                  <strong className="text-white">
                                    Quantity:
                                  </strong>{" "}
                                  <span className="text-gray-300">
                                    {row.original.quantity}
                                  </span>
                                </p>
                                <p>
                                  <strong className="text-white">Amount:</strong>{" "}
                                  <span className="text-[#4A7043]">
                                    ₹{row.original.amount}
                                  </span>
                                </p>
                                <p>
                                  <strong className="text-white">
                                    Booking ID:
                                  </strong>{" "}
                                  <span className="text-gray-300">
                                    {row.original.bookingId}
                                  </span>
                                </p>
                                <p>
                                  <strong className="text-white">
                                    Payment Mode:
                                  </strong>{" "}
                                  <span className="text-gray-300">
                                    {row.original.paymentMode}
                                  </span>
                                </p>
                                <p>
                                  <strong className="text-white">Email:</strong>{" "}
                                  <span className="text-gray-300">
                                    {row.original.email}
                                  </span>
                                </p>
                                <p>
                                  <strong className="text-white">Phone:</strong>{" "}
                                  <span className="text-gray-300">
                                    {row.original.phone}
                                  </span>
                                </p>
                              </div>
                              <button
                                onClick={() => setSelectedBookingId(null)}
                                className="text-[#4B5EAA] hover:text-white hover:underline text-sm sm:text-base self-start transition-all duration-200"
                              >
                                Close
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageBooking;