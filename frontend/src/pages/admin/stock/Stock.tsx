/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import { useState, useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import {
  Button,
  Label,
  Select,
  TextInput,
  Alert,
  Table,
  Modal,
  Checkbox,
  Badge,
} from "flowbite-react";
import { HiInformationCircle, HiPlus, HiCheck, HiMinus } from "react-icons/hi";
import { BloodStock, StockAddedHistory } from "../../../types/stock";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function BloodStockManagement() {
  const { getAccessToken, getBasicUserInfo, state } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [stocks, setStocks] = useState<BloodStock[]>([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const isLoading = isAuthLoading || isDataLoading;
  const [isAdditionLoading, setIsAdditionLoading] = useState(false);
  const [isIssuanceLoading, setIsIssuanceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    bloodType: "",
    quantity: "",
    expiryDate: "",
    labelId: "",
  });
  const [issueFormData, setIssueFormData] = useState({
    bloodType: "",
    quantity: "",
    issuedTo: "",
  });
  const [userEmail, setUserEmail] = useState("");
  const [showStockHistoryModal, setShowStockHistoryModal] = useState(false);
  const [stockHistory, setStockHistory] = useState<StockAddedHistory[]>([]);
  const [selectedStockEntries, setSelectedStockEntries] = useState<string[]>(
    []
  );
  const navigate = useNavigate();
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Fetch user info and check admin role
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (state?.isAuthenticated) {
        try {
          setIsAuthLoading(true);
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

  // Fetch stock data
  const fetchData = async () => {
    try {
      const token = await getAccessToken();
      const userInfo = await getBasicUserInfo();
      setUserEmail(userInfo.email || "");

      const response = await fetch(`${backendURL}/api/stocks/fetch-stocks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch blood stocks");

      const data = await response.json();
      setStocks(data);
      setIsDataLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setIsDataLoading(false);
    }
  };

  // Fetch stock history for selected blood type
  const fetchStockHistory = async (bloodType: string) => {
    try {
      const token = await getAccessToken();
      const response = await fetch(
        `${backendURL}/api/stocks/history?bloodType=${encodeURIComponent(
          bloodType
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch stock history");

      const data = await response.json();
      setStockHistory(data);
      setShowStockHistoryModal(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, [backendURL, getAccessToken, getBasicUserInfo]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIssueInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setIssueFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add stock
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (
      !formData.bloodType ||
      !formData.quantity ||
      !formData.expiryDate ||
      !formData.labelId
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const parsedQuantity = Number(formData.quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setError("Quantity must be a positive number.");
      return;
    }

    const today = new Date();
    const expiryDate = new Date(formData.expiryDate);
    if (expiryDate <= today) {
      setError("Expiry date must be in the future.");
      return;
    }

    try {
      setIsAdditionLoading(true);
      const token = await getAccessToken();
      const response = await fetch(`${backendURL}/api/stocks/update-stock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bloodType: formData.bloodType,
          quantity: parsedQuantity,
          updatedBy: userEmail,
          expiryDate: formData.expiryDate,
          labelId: formData.labelId,
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to add blood stock");

      setSuccess("Blood stock added successfully!");
      setFormData({
        bloodType: "",
        quantity: "",
        expiryDate: "",
        labelId: "",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      fetchData();
      setIsAdditionLoading(false);
    }
  };

  // Validate and show stock history for issuance
  const validateAndShowStockHistory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (
      !issueFormData.bloodType ||
      !issueFormData.quantity ||
      !issueFormData.issuedTo
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const parsedQuantity = Number(issueFormData.quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setError("Quantity must be a positive number.");
      return;
    }

    const currentStock = stocks.find(
      (s) => s.bloodType === issueFormData.bloodType
    );
    if (!currentStock || currentStock.quantity < parsedQuantity) {
      setError("Not enough stock available for this blood type.");
      return;
    }

    fetchStockHistory(issueFormData.bloodType);
  };

  // Handle stock entry selection
  const handleStockEntrySelection = (entryId: string) => {
    setSelectedStockEntries((prev) =>
      prev.includes(entryId)
        ? prev.filter((id) => id !== entryId)
        : [...prev, entryId]
    );
  };

  // Issue stock with selected entries
  const handleIssueStockWithEntries = async () => {
    setError(null);
    setSuccess(null);

    const parsedQuantity = Number(issueFormData.quantity);
    const selectedEntries = stockHistory.filter((entry) =>
      selectedStockEntries.includes(entry._id)
    );
    const totalSelectedQuantity = selectedEntries.reduce(
      (sum, entry) => sum + entry.quantityAdded,
      0
    );

    if (totalSelectedQuantity < parsedQuantity) {
      setError("Selected stock entries do not cover the requested quantity.");
      return;
    }

    try {
      setIsIssuanceLoading(true);
      const token = await getAccessToken();
      const response = await fetch(`${backendURL}/api/stocks/issue-stock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bloodType: issueFormData.bloodType,
          quantity: parsedQuantity,
          updatedBy: userEmail,
          issuedTo: issueFormData.issuedTo,
          selectedEntries: selectedStockEntries,
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to issue blood stock");

      setSuccess("Blood stock issued successfully!");
      setIssueFormData({ bloodType: "", quantity: "", issuedTo: "" });
      setSelectedStockEntries([]);
      setShowStockHistoryModal(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      fetchData();
      setIsIssuanceLoading(false);
    }
  };

  // Handle show history buttons
  const handleShowHistory = (type: "issue" | "addition") => {
    if (type === "addition") {
      navigate("/admin/stock/addition-history");
    }
    if (type === "issue") {
      navigate("/admin/stock/issuance-history");
    }
  };

  // Get expiration status for stock history
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
      {success && (
        <Alert color="success" icon={HiCheck} className="mb-6">
          <span>{success}</span>
        </Alert>
      )}
      {error && (
        <Alert color="failure" icon={HiInformationCircle} className="mb-6">
          <span>{error}</span>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Stock Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Add Blood Stock
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="bloodType" value="Blood Type" />
                <Select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select blood type</option>
                  {bloodTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity" value="Quantity (units)" />
                <TextInput
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Enter quantity to add"
                  required
                />
              </div>
              <div>
                <Label htmlFor="expiryDate" value="Expiry Date" />
                <TextInput
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="labelId" value="Label ID" />
                <TextInput
                  id="labelId"
                  name="labelId"
                  type="text"
                  value={formData.labelId}
                  onChange={handleInputChange}
                  placeholder="Enter unique label ID"
                  required
                />
              </div>

              <Button
                type="submit"
                color="failure"
                className="w-full"
                disabled={isAdditionLoading}
              >
                <HiPlus className="mr-2 h-5 w-5" />
                {isAdditionLoading ? "Adding..." : "Add to Stock"}
              </Button>
            </form>
          </div>

          {/* Issue Stock Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Issue Blood Stock
            </h2>
            <form className="space-y-4" onSubmit={validateAndShowStockHistory}>
              <div>
                <Label htmlFor="issueBloodType" value="Blood Type" />
                <Select
                  id="issueBloodType"
                  name="bloodType"
                  value={issueFormData.bloodType}
                  onChange={handleIssueInputChange}
                  required
                >
                  <option value="">Select blood type</option>
                  {bloodTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="issueQuantity" value="Quantity (units)" />
                <TextInput
                  id="issueQuantity"
                  name="quantity"
                  type="number"
                  value={issueFormData.quantity}
                  onChange={handleIssueInputChange}
                  placeholder="Enter quantity to issue"
                  required
                />
              </div>

              <div>
                <Label htmlFor="issuedTo" value="Issued To" />
                <TextInput
                  id="issuedTo"
                  name="issuedTo"
                  type="text"
                  value={issueFormData.issuedTo}
                  onChange={handleIssueInputChange}
                  placeholder="Enter recipient name"
                  required
                />
              </div>

              <Button
                type="submit"
                color="failure"
                className="w-full"
                disabled={isIssuanceLoading}
              >
                <HiMinus className="mr-2 h-5 w-5" />
                {isIssuanceLoading ? "Issuing..." : "Select Stock Entries"}
              </Button>
            </form>
          </div>
        </div>

        {/* Stock Table */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            {isLoading ? (
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
              <>
                <div className="flex space-x-2">
                  <Button
                    color="gray"
                    onClick={() => handleShowHistory("issue")}
                    disabled={isLoading}
                  >
                    Issue History
                  </Button>
                  <Button
                    color="failure"
                    onClick={() => handleShowHistory("addition")}
                    disabled={isLoading}
                  >
                    Addition History
                  </Button>
                </div>
                <h2 className="mt-9 ml-2 text-xl font-semibold text-gray-800 mb-4">
                  Current Blood Inventory
                </h2>
                <div className="mt-8 overflow-x-auto">
                  <Table hoverable>
                    <Table.Head>
                      <Table.HeadCell>Blood Type</Table.HeadCell>
                      <Table.HeadCell>Quantity (ml)</Table.HeadCell>
                      <Table.HeadCell>Last Updated</Table.HeadCell>
                      <Table.HeadCell>Updated By</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      {stocks.length > 0 ? (
                        stocks.map((stock, index) => (
                          <Table.Row key={index} className="bg-white">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                              {stock.bloodType}
                            </Table.Cell>
                            <Table.Cell>
                              <span
                                className={`font-bold ${
                                  stock.quantity < 10
                                    ? "text-red-600"
                                    : "text-green-600"
                                }`}
                              >
                                {stock.quantity}
                              </span>
                            </Table.Cell>
                            <Table.Cell>
                              {new Date(stock.lastUpdated).toLocaleString()}
                            </Table.Cell>
                            <Table.Cell className="text-blue-600 hover:underline">
                              <a href={`mailto:${stock.updatedBy}`}>
                                {stock.updatedBy}
                              </a>
                            </Table.Cell>
                          </Table.Row>
                        ))
                      ) : (
                        <Table.Row>
                          <Table.Cell colSpan={6} className="text-center py-4">
                            No blood stock data available
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stock History Modal */}
      <Modal
        show={showStockHistoryModal}
        onClose={() => setShowStockHistoryModal(false)}
      >
        <Modal.Header>Select Stock Entries</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p>
              Select stock entries to issue {issueFormData.quantity} units of{" "}
              {issueFormData.bloodType} blood.
            </p>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Select</Table.HeadCell>
                <Table.HeadCell>Label ID</Table.HeadCell>
                <Table.HeadCell>Available Quantity (ml)</Table.HeadCell>
                <Table.HeadCell>Expiry Date</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Date Added</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {stockHistory.length > 0 ? (
                  stockHistory.map((entry) => {
                    const { status, color } = getExpirationStatus(
                      entry.expiryDate
                    );
                    return (
                      <Table.Row key={entry._id} className="bg-white">
                        <Table.Cell>
                          <Checkbox
                            checked={selectedStockEntries.includes(entry._id)}
                            onChange={() =>
                              handleStockEntrySelection(entry._id)
                            }
                            disabled={status === "Expired"}
                          />
                        </Table.Cell>
                        <Table.Cell>{entry.labelId}</Table.Cell>
                        <Table.Cell>
                          {entry.remainingQuantity ?? entry.quantityAdded}
                        </Table.Cell>
                        <Table.Cell>
                          {entry.expiryDate
                            ? new Date(entry.expiryDate).toLocaleDateString()
                            : "N/A"}
                        </Table.Cell>
                        <Table.Cell>
                          <Badge color={color}>{status}</Badge>
                        </Table.Cell>
                        <Table.Cell>
                          {new Date(entry.updatedAt).toLocaleString()}
                        </Table.Cell>
                      </Table.Row>
                    );
                  })
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={6} className="text-center py-4">
                      No stock entries available
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="failure"
            onClick={handleIssueStockWithEntries}
            disabled={isIssuanceLoading || selectedStockEntries.length === 0}
          >
            {isIssuanceLoading ? "Issuing..." : "Issue Selected Entries"}
          </Button>
          <Button color="gray" onClick={() => setShowStockHistoryModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
