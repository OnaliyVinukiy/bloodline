/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useAuthContext } from "@asgardeo/auth-react";
import { useEffect, useState } from "react";

interface Stats {
  donors: number;
  camps: number;
  appointments: number;
  organizations: number;
}

interface LoadingState {
  donors: boolean;
  camps: boolean;
  appointments: boolean;
  organizations: boolean;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    donors: 0,
    camps: 0,
    appointments: 0,
    organizations: 0,
  });

  const [loading, setLoading] = useState<LoadingState>({
    donors: true,
    camps: true,
    appointments: true,
    organizations: true,
  });

  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  const { getAccessToken } = useAuthContext();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await getAccessToken();

        const [donorsRes, campsRes, appointmentsRes, organizationsRes] =
          await Promise.all([
            fetch(`${backendURL}/api/donors/count`).then((res) => res.json()),
            fetch(`${backendURL}/api/camps/count`).then((res) => res.json()),
            fetch(`${backendURL}/api/appointments/count`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }).then((res) => res.json()),
            fetch(`${backendURL}/api/organizations/count`).then((res) =>
              res.json()
            ),
          ]);

        setStats({
          donors: donorsRes.count,
          camps: campsRes.count,
          appointments: appointmentsRes.count,
          organizations: organizationsRes.count,
        });

        setLoading({
          donors: false,
          camps: false,
          appointments: false,
          organizations: false,
        });
      } catch (error) {
        console.error("Error fetching data:", error);

        setLoading({
          donors: false,
          camps: false,
          appointments: false,
          organizations: false,
        });
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mt-8 sm:mx-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Donors"
          value={stats.donors}
          icon={<DonorsIcon />}
          loading={loading.donors}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Appointments"
          value={stats.appointments}
          icon={<AppointmentsIcon />}
          loading={loading.appointments}
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Blood Camps"
          value={stats.camps}
          icon={<CampsIcon />}
          loading={loading.camps}
          color="from-green-500 to-green-600"
        />

        <StatCard
          title="Organizations"
          value={stats.organizations}
          icon={<OrganizationsIcon />}
          loading={loading.organizations}
          color="from-orange-500 to-orange-600"
        />
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: JSX.Element;
  loading: boolean;
  color: string;
}

const StatCard = ({ title, value, icon, loading, color }: StatCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-300 ${color}"></div>

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          {loading ? (
            <div className="h-8 w-16 mt-2 bg-gray-200 rounded-lg animate-pulse"></div>
          ) : (
            <p className="text-3xl font-bold text-gray-800">
              {value >= 0 ? value.toLocaleString() : "Error"}
            </p>
          )}
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
