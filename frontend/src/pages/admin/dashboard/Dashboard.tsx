/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useAuthContext } from "@asgardeo/auth-react";
import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  DailyData,
  MonthlyData,
  StatCardProps,
  Stats,
} from "../../../types/dashboard";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    donors: 0,
    camps: 0,
    appointments: 0,
    organizations: 0,
  });

  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const isLoading = isAuthLoading || isDataLoading;
  const [appointmentsByMonth, setAppointmentsByMonth] = useState<MonthlyData[]>(
    []
  );
  const [campsByMonth, setCampsByMonth] = useState<MonthlyData[]>([]);
  const [donorsByDay, setDonorsByDay] = useState<DailyData[]>([]);
  const [organizationsByDay, setOrganizationsByDay] = useState<DailyData[]>([]);

  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  const { state, getAccessToken } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch user info and check admin role
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (state?.isAuthenticated) {
        try {
          const accessToken = await getAccessToken();
          const response = await axios.post(
            `${backendURL}/api/user-info`,
            { accessToken },
            { headers: { "Content-Type": "application/json" } }
          );

          if (
            response.data.role &&
            response.data.role.includes("Internal/Admin")
          ) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        } finally {
          setIsAuthLoading(false);
        }
      } else {
        setIsAuthLoading(false);
      }
    };

    fetchUserInfo();
  }, [state?.isAuthenticated, getAccessToken]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await getAccessToken();

        // Fetch all stats and monthly data in parallel
        const [
          donorsRes,
          campsRes,
          appointmentsRes,
          organizationsRes,
          appointmentsMonthlyRes,
          campsMonthlyRes,
          donorsDailyRes,
          organizationsDailyRes,
        ] = await Promise.all([
          fetch(`${backendURL}/api/donors/count`).then((res) => res.json()),
          fetch(`${backendURL}/api/camps/count`).then((res) => res.json()),
          fetch(`${backendURL}/api/appointments/count`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => res.json()),
          fetch(`${backendURL}/api/organizations/count`).then((res) =>
            res.json()
          ),
          fetch(`${backendURL}/api/appointments/monthly`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => res.json()),
          fetch(`${backendURL}/api/camps/monthly`).then((res) => res.json()),
          fetch(`${backendURL}/api/donors/daily`).then((res) => res.json()),
          fetch(`${backendURL}/api/organizations/daily`).then((res) =>
            res.json()
          ),
        ]);

        setStats({
          donors: donorsRes.count,
          camps: campsRes.count,
          appointments: appointmentsRes.count,
          organizations: organizationsRes.count,
        });

        setAppointmentsByMonth(appointmentsMonthlyRes);
        setCampsByMonth(campsMonthlyRes);
        setDonorsByDay(donorsDailyRes);
        setOrganizationsByDay(organizationsDailyRes);

        setIsDataLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsDataLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Prepare chart data
  const appointmentsChartData = {
    labels: appointmentsByMonth.map((item) => item.month),
    datasets: [
      {
        label: "Appointments",
        data: appointmentsByMonth.map((item) => item.count),
        backgroundColor: "rgba(124, 58, 237, 0.7)",
        borderColor: "rgba(124, 58, 237, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const campsChartData = {
    labels: campsByMonth.map((item) => item.month),
    datasets: [
      {
        label: "Blood Camps",
        data: campsByMonth.map((item) => item.count),
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const donorsChartData = {
    labels: donorsByDay.map((item) => item.date),
    datasets: [
      {
        label: "Donors Registered",
        data: donorsByDay.map((item) => item.count),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        tension: 0.1,
        fill: true,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const organizationsChartData = {
    labels: organizationsByDay.map((item) => item.date),
    datasets: [
      {
        label: "Organizations Registered",
        data: organizationsByDay.map((item) => item.count),
        borderColor: "rgba(245, 158, 11, 1)",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        borderWidth: 2,
        tension: 0.1,
        fill: true,
        pointBackgroundColor: "rgba(245, 158, 11, 1)",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Loading animation
  if (isLoading) {
    return (
      <div className="loading flex justify-center items-center h-screen">
        <svg width="64px" height="48px">
          <polyline
            points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
            id="back"
            stroke="#e53e3e"
            strokeWidth="2"
            fill="none"
          ></polyline>
          <polyline
            points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
            id="front"
            stroke="#f56565"
            strokeWidth="2"
            fill="none"
          ></polyline>
        </svg>
      </div>
    );
  }

  // Loading Animation
  if (!isAdmin && !isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <svg
            className="w-16 h-16 mx-auto text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-2xl font-bold mt-4 text-gray-800 dark:text-white">
            Access Denied
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            You don't have permission to view this page. Only administrators can
            access this content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Stats Cards */}
      <div className="mt-10 md:mx-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Donors"
          value={stats.donors}
          icon={<DonorsIcon />}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Appointments"
          value={stats.appointments}
          icon={<AppointmentsIcon />}
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Blood Camps"
          value={stats.camps}
          icon={<CampsIcon />}
          color="from-green-500 to-green-600"
        />
        <StatCard
          title="Organizations"
          value={stats.organizations}
          icon={<OrganizationsIcon />}
          color="from-orange-500 to-orange-600"
        />
      </div>

      {/* Charts Section */}
      <div className="sm:mx-40 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-10">
            Monthly Appointments
          </h2>

          <Bar
            data={appointmentsChartData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
              },
            }}
          />
        </div>

        {/* Camps Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-8">
            Monthly Blood Camps
          </h2>

          <Bar
            data={campsChartData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
              },
            }}
          />
        </div>
      </div>

      <div className="mb-20 sm:mx-40 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donors Trend Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-8">
            Donor Registration Trend
          </h2>

          <Line
            data={donorsChartData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
              },
            }}
          />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-8">
            Organization Registration Trend
          </h2>

          <Line
            data={organizationsChartData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  return (
    <div className="group relative z-0 overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-300 ${color}"></div>

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>

          <p className="text-3xl font-bold text-gray-800">
            {value >= 0 ? value.toLocaleString() : "Error"}
          </p>
        </div>
        <div
          className={`p-3 rounded-lg bg-gradient-to-br ${color} text-white shadow-md`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const DonorsIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const CampsIcon = () => (
  <svg
    className="w-6 h-6 fill-[#ffffff]"
    viewBox="0 0 576 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M224 24V80H168c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h56v56c0 13.3 10.7 24 24 24h48c13.3 0 24-10.7 24-24V176h56c13.3 0 24-10.7 24-24V104c0-13.3-10.7-24-24-24H320V24c0-13.3-10.7-24-24-24H248c-13.3 0-24 10.7-24 24zM559.7 392.2c17.8-13.1 21.6-38.1 8.5-55.9s-38.1-21.6-55.9-8.5L392.6 416H272c-8.8 0-16-7.2-16-16s7.2-16 16-16h16 64c17.7 0 32-14.3 32-32s-14.3-32-32-32H288 272 193.7c-29.1 0-57.3 9.9-80 28L68.8 384H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H192 352.5c29 0 57.3-9.3 80.7-26.5l126.6-93.3zm-367-8.2l.9 0 0 0c-.3 0-.6 0-.9 0z"></path>
  </svg>
);

const AppointmentsIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const OrganizationsIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
);

export default Dashboard;
