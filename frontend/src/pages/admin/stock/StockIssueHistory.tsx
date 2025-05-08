/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useState, useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { Button, Table, Alert } from "flowbite-react";
import { HiInformationCircle, HiArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { StockIssuedHistory } from "../../../types/stock";
import axios from "axios";

export default function StockIssueHistory() {
  const { state, getAccessToken } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [history, setHistory] = useState<StockIssuedHistory[]>([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const isLoading = isAuthLoading || isDataLoading;
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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

  //Fetch stock issuance history
  useEffect(() => {
    const fetchIssuanceHistory = async () => {
      try {
        const token = await getAccessToken();
        const response = await fetch(
          `${backendURL}/api/stocks/issuance-history`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch issuance history");

        const data = await response.json();
        setHistory(data);
        setIsDataLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setIsDataLoading(false);
      }
    };

    fetchIssuanceHistory();
  }, [backendURL, getAccessToken]);

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
    <div className="mt-10 mb-10 p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Stock Issuance History
        </h1>
        <Button color="gray" onClick={() => navigate(-1)}>
          <HiArrowLeft className="mr-2 h-5 w-5" />
          Back to Inventory
        </Button>
      </div>

      {error && (
        <Alert color="failure" icon={HiInformationCircle} className="mb-6">
          <span>{error}</span>
        </Alert>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        {isDataLoading ? (
          <div className="loading flex justify-center items-center h-40">
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
        ) : (
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Blood Type</Table.HeadCell>
                <Table.HeadCell>Quantity Issued</Table.HeadCell>
                <Table.HeadCell>Issued To</Table.HeadCell>
                <Table.HeadCell>Date Issued</Table.HeadCell>
                <Table.HeadCell>Issued By</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {history.length > 0 ? (
                  history.map((item) => (
                    <Table.Row key={item._id} className="bg-white">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                        {item.bloodType}
                      </Table.Cell>
                      <Table.Cell className="text-green-600 font-bold">
                        -{item.quantityIssued}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                        {item.issuedTo}
                      </Table.Cell>
                      <Table.Cell>
                        {new Date(item.updatedAt).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell className="text-blue-600 hover:underline">
                        <a href={`mailto:${item.updatedBy}`}>
                          {item.updatedBy}
                        </a>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={4} className="text-center py-4">
                      No issuance history available
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
