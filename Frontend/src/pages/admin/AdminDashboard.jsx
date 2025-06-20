/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import AdminSidebar from "../../components/Sidebar";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { MyContext } from "../../context/EventContext";
import {
  format,
  parseISO,
  isWithinInterval,
  subDays,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
} from "date-fns";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function AdminDashboard() {
  const { adminAllBookings, eventsArray, users } = useContext(MyContext);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedView, setSelectedView] = useState("year"); // year, month, custom
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 7), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd"),
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (adminAllBookings !== undefined) {
      setIsLoading(false);
    }
  }, [adminAllBookings]);

  // Process bookings data
  const allBookingsOnly =
    adminAllBookings?.flatMap((user) => user.bookings || []) || [];

  // Function to calculate revenue from bookings
  const calculateRevenue = (bookings) => {
    return bookings.reduce((total, booking) => {
      return total + (booking.amount || 0);
    }, 0);
  };

  // Function to filter bookings by date range
  const filterBookingsByDateRange = (bookings, start, end) => {
    const startDate = startOfDay(new Date(start));
    const endDate = endOfDay(new Date(end));

    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.Created_At);
      return isWithinInterval(bookingDate, { start: startDate, end: endDate });
    });
  };

  // Function to filter bookings by month and year
  const filterBookingsByMonth = (bookings, month, year) => {
    const startDate = startOfMonth(new Date(year, month));
    const endDate = endOfMonth(new Date(year, month));

    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.Created_At);
      return isWithinInterval(bookingDate, { start: startDate, end: endDate });
    });
  };

  // Function to get monthly data for the selected year
  const getMonthlyData = () => {
    const labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const bookingCounts = Array(12).fill(0);
    const revenue = Array(12).fill(0);

    allBookingsOnly.forEach((booking) => {
      const bookingDate = new Date(booking.Created_At);
      const bookingYear = bookingDate.getFullYear();
      const bookingMonth = bookingDate.getMonth();

      if (bookingYear === selectedYear) {
        bookingCounts[bookingMonth] += 1;
        revenue[bookingMonth] += booking.amount || 0;
      }
    });

    return { labels, bookingCounts, revenue };
  };

  // Function to get daily data for the selected month
  const getDailyData = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);

    const bookingCounts = Array(daysInMonth).fill(0);
    const revenue = Array(daysInMonth).fill(0);

    const monthBookings = filterBookingsByMonth(
      allBookingsOnly,
      selectedMonth,
      selectedYear
    );

    monthBookings.forEach((booking) => {
      const bookingDate = new Date(booking.Created_At);
      const day = bookingDate.getDate() - 1;

      bookingCounts[day] += 1;
      revenue[day] += booking.amount || 0;
    });

    return { labels, bookingCounts, revenue };
  };

  // Function to get custom date range data
  const getCustomRangeData = () => {
    const filteredBookings = filterBookingsByDateRange(
      allBookingsOnly,
      dateRange.start,
      dateRange.end
    );

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const dayDiff =
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const labels = Array.from({ length: dayDiff }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return format(date, "MMM dd");
    });

    const bookingCounts = Array(labels.length).fill(0);
    const revenue = Array(labels.length).fill(0);

    filteredBookings.forEach((booking) => {
      const bookingDate = new Date(booking.Created_At);
      const dayIndex = Math.floor(
        (bookingDate - startDate) / (1000 * 60 * 60 * 24)
      );

      if (dayIndex >= 0 && dayIndex < labels.length) {
        bookingCounts[dayIndex] += 1;
        revenue[dayIndex] += booking.amount || 0;
      }
    });

    return { labels, bookingCounts, revenue };
  };

  // Get chart data based on selected view
  const getChartData = () => {
    switch (selectedView) {
      case "month":
        return getDailyData();
      case "custom":
        return getCustomRangeData();
      default:
        return getMonthlyData();
    }
  };

  const { labels, bookingCounts, revenue } = getChartData();

  // Chart data for bookings chart
  const bookingsChartData = {
    labels,
    datasets: [
      {
        label: "Bookings",
        data: bookingCounts,
        borderColor: "#6B7280", // Grey
        backgroundColor: "rgba(107, 114, 128, 0.3)", // Light grey fill
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#6B7280",
        pointBorderColor: "#FFFFFF", // White
        pointHoverBackgroundColor: "#FFFFFF",
        pointHoverBorderColor: "#6B7280",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Chart data for revenue chart
  const revenueChartData = {
    labels,
    datasets: [
      {
        label: "Revenue (₹)",
        data: revenue,
        borderColor: "#D1D5DB", // Light grey
        backgroundColor: "rgba(209, 213, 219, 0.3)", // Light grey fill
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#D1D5DB",
        pointBorderColor: "#FFFFFF",
        pointHoverBackgroundColor: "#FFFFFF",
        pointHoverBorderColor: "#D1D5DB",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#D1D5DB", font: { size: 12 } }, // Light grey
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        padding: 15,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        ticks: { color: "#9CA3AF", font: { size: 11 } }, // Grey
        grid: { color: "rgba(255, 255, 255, 0.1)" }, // Light grid
      },
      y: {
        min: 0, // Prevent negative numbers
        ticks: { color: "#9CA3AF", font: { size: 11 } }, // Grey
        grid: { color: "rgba(255, 255, 255, 0.1)" }, // Light grid
      },
    },
  };

  // Calculate total revenue
  const totalRevenue = calculateRevenue(allBookingsOnly);

  // Calculate filtered revenue based on date view
  let filteredBookings;
  switch (selectedView) {
    case "month":
      filteredBookings = filterBookingsByMonth(
        allBookingsOnly,
        selectedMonth,
        selectedYear
      );
      break;
    case "custom":
      filteredBookings = filterBookingsByDateRange(
        allBookingsOnly,
        dateRange.start,
        dateRange.end
      );
      break;
    default:
      filteredBookings = allBookingsOnly.filter(
        (booking) => new Date(booking.Created_At).getFullYear() === selectedYear
      );
  }
  const filteredRevenue = calculateRevenue(filteredBookings);

  // Year options (last 5 years to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i);

  // Month options
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-black justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-gray-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 pt-20 transition-all duration-300 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">
              <span className="text-gray-500">Analytics</span> Dashboard
            </h1>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedView("year")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-transform duration-200 ${
                  selectedView === "year"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-600 hover:text-white hover:scale-105"
                }`}
              >
                Yearly
              </button>
              <button
                onClick={() => setSelectedView("month")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-transform duration-200 ${
                  selectedView === "month"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-600 hover:text-white hover:scale-105"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedView("custom")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-transform duration-200 ${
                  selectedView === "custom"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-600 hover:text-white hover:scale-105"
                }`}
              >
                Custom
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users */}
            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-700 shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Users</p>
                  <h3 className="text-3xl font-bold text-white">
                    {users?.length || 0}
                  </h3>
                </div>
                <div className="p-3 bg-gray-800 rounded-xl">
                  <i className="bx bxs-user text-3xl text-gray-500"></i>
                </div>
              </div>
            </div>

            {/* Total Events */}
            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-700 shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Events</p>
                  <h3 className="text-3xl font-bold text-white">
                    {eventsArray?.length || 0}
                  </h3>
                </div>
                <div className="p-3 bg-gray-800 rounded-xl">
                  <i className="bx bxs-calendar text-3xl text-gray-500"></i>
                </div>
              </div>
            </div>

            {/* Total Bookings */}
            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-700 shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Bookings</p>
                  <h3 className="text-3xl font-bold text-white">
                    {allBookingsOnly?.length || 0}
                  </h3>
                </div>
                <div className="p-3 bg-gray-800 rounded-xl">
                  <i className="bx bxs-ticket text-3xl text-gray-500"></i>
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-700 shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                  <h3 className="text-3xl font-bold text-white">
                    ₹{totalRevenue.toLocaleString()}
                  </h3>
                </div>
                <div className="p-3 bg-gray-800 rounded-xl">
                  <i className="bx bxs-dollar-circle text-3xl text-gray-500"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Time Period Selection */}
          <div className="mb-8 p-6 rounded-2xl bg-gray-900 shadow-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {selectedView === "year" && (
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Select Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200 hover:bg-gray-700 hover:border-gray-500"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedView === "month" && (
                <>
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Select Year
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200 hover:bg-gray-700 hover:border-gray-500"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Select Month
                    </label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200 hover:bg-gray-700 hover:border-gray-500"
                    >
                      {months.map((month, index) => (
                        <option key={month} value={index}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {selectedView === "custom" && (
                <>
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, start: e.target.value })
                      }
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200 hover:bg-gray-700 hover:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, end: e.target.value })
                      }
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200 hover:bg-gray-700 hover:border-gray-500"
                    />
                  </div>
                </>
              )}

              <div className="flex items-end">
                <div className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 transition-colors duration-200 hover:bg-gray-700">
                  <div className="text-sm text-gray-300 mb-1">
                    Period Revenue
                  </div>
                  <div className="text-2xl font-bold text-white">
                    ₹{filteredRevenue.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Charts Section */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            {/* Bookings Chart */}
            <div className="p-6 rounded-2xl bg-gray-900 shadow-lg border border-gray-700 transition-all duration-200 hover:border-gray-500">
              <h2 className="text-xl font-bold text-white mb-4">
                Bookings Activity
              </h2>
              <div className="h-80">
                <Line data={bookingsChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Revenue Chart Section */}
          <div className="p-6 rounded-2xl bg-gray-900 shadow-lg border border-gray-700 mb-8 transition-all duration-200 hover:border-gray-500">
            <h2 className="text-xl font-bold text-white mb-4">
              Revenue Analysis
            </h2>
            <div className="h-80">
              <Line
                data={revenueChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: "Revenue Over Time",
                      color: "#D1D5DB", // Light grey
                      font: { size: 16, weight: "bold" },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Monthly Profit Details */}
          <div className="p-6 rounded-2xl bg-gray-900 shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">
              Monthly Profit Details
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-gray-200">
                <thead>
                  <tr className="text-left">
                    <th className="pb-4 font-medium text-gray-500">Month</th>
                    <th className="pb-4 font-medium text-gray-500">Bookings</th>
                    <th className="pb-4 font-medium text-gray-500">Revenue</th>
                    <th className="pb-4 font-medium text-gray-500">
                      Avg. Booking Value
                    </th>
                    <th className="pb-4 font-medium text-gray-500">
                      Est. Profit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getMonthlyData().labels.map((month, index) => {
                    const monthlyBookings =
                      getMonthlyData().bookingCounts[index];
                    const monthlyRevenue = getMonthlyData().revenue[index];
                    const estimatedProfit = monthlyRevenue * 0.7;
                    const avgBookingValue =
                      monthlyBookings > 0
                        ? (monthlyRevenue / monthlyBookings).toFixed(2)
                        : 0;

                    return (
                      <tr
                        key={month}
                        className="border-t border-gray-700 transition-colors duration-200 hover:bg-gray-800 cursor-pointer"
                      >
                        <td className="py-4">{month}</td>
                        <td className="py-4">{monthlyBookings}</td>
                        <td className="py-4">
                          ₹{monthlyRevenue.toLocaleString()}
                        </td>
                        <td className="py-4">₹{avgBookingValue}</td>
                        <td className="py-4 text-gray-300">
                          ₹{estimatedProfit.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
