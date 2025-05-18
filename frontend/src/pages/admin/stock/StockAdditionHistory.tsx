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
import { Badge } from "flowbite-react";
import { StockAddedHistory } from "../../../types/stock";
import { useUser } from "../../../contexts/UserContext";

export default function StockAdditionHistory() {
  const { getAccessToken } = useAuthContext();
  const [history, setHistory] = useState<StockAddedHistory[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { isAdmin, isLoading } = useUser();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  //Fetch stock addition history
  useEffect(() => {
    const fetchAdditionHistory = async () => {
      try {
        const token = await getAccessToken();
        const response = await fetch(
          `${backendURL}/api/stocks/addition-history`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch addition history");

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

    fetchAdditionHistory();
  }, [backendURL, getAccessToken]);

  const getExpirationStatus = (expiryDate?: string) => {
    if (!expiryDate) return { status: "Unknown", color: "gray" };

    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDiff = expiry.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) return { status: "Expired", color: "failure" };
    if (daysDiff <= 30) return { status: "Near Expiry", color: "warning" };
    return { status: "Valid", color: "success" };
  };

  // Loading animation
  if (isLoading || isDataLoading) {
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
  if (!isAdmin) {
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
          Stock Addition History
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
                <Table.HeadCell>Quantity Added</Table.HeadCell>
                <Table.HeadCell>Label ID</Table.HeadCell>
                <Table.HeadCell>Expiry Date</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Date Added</Table.HeadCell>
                <Table.HeadCell>Added By</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {history.length > 0 ? (
                  history.map((item) => {
                    const { status, color } = getExpirationStatus(
                      item.expiryDate
                    );
                    return (
                      <Table.Row key={item._id} className="bg-white">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                          {item.bloodType}
                        </Table.Cell>
                        <Table.Cell className="text-green-600 font-bold">
                          +{item.quantityAdded}
                        </Table.Cell>
                        <Table.Cell className="font-mono">
                          {item.labelId || "N/A"}
                        </Table.Cell>
                        <Table.Cell>
                          {item.expiryDate
                            ? new Date(item.expiryDate).toLocaleDateString()
                            : "N/A"}
                        </Table.Cell>
                        <Table.Cell>
                          <Badge color={color} className="w-fit">
                            {status}
                          </Badge>
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
                    );
                  })
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={7} className="text-center py-4">
                      No addition history available
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
