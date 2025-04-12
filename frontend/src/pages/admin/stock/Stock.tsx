/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import { useState, useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { Button, Label, Select, TextInput, Alert, Table } from "flowbite-react";
import { HiInformationCircle, HiPlus, HiCheck, HiMinus } from "react-icons/hi";
import { BloodStock } from "../../../types/stock";
import { useNavigate } from "react-router-dom";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function BloodStockManagement() {
  const { getAccessToken, getBasicUserInfo } = useAuthContext();
  const [stocks, setStocks] = useState<BloodStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    bloodType: "",
    quantity: "",
  });
  const [issueFormData, setIssueFormData] = useState({
    bloodType: "",
    quantity: "",
    issuedTo: "",
  });
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  //Fetch stock data
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
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setLoading(false);
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

  //
  const handleIssueInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setIssueFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //Add stock
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.bloodType || !formData.quantity) {
      setError("Please fill in all fields.");
      return;
    }

    const parsedQuantity = Number(formData.quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setError("Quantity must be a positive number.");
      return;
    }

    try {
      setLoading(true);
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
        }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok)
        throw new Error(data.message || "Failed to add blood stock");

      setSuccess("Blood stock added successfully!");
      setFormData({ bloodType: "", quantity: "" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      fetchData();
      setLoading(false);
    }
  };

  //Issue stock
  const handleIssueSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

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

    // Check if enough stock is available
    const currentStock = stocks.find(
      (s) => s.bloodType === issueFormData.bloodType
    );
    if (!currentStock || currentStock.quantity < parsedQuantity) {
      setError("Not enough stock available for this blood type.");
      return;
    }

    try {
      setLoading(true);
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
        }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok)
        throw new Error(data.message || "Failed to issue blood stock");

      setSuccess("Blood stock issued successfully!");
      setIssueFormData({ bloodType: "", quantity: "", issuedTo: "" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      fetchData();
      setLoading(false);
    }
  };

  //Handle show history buttons
  const handleShowHistory = (type: "issue" | "addition") => {
    if (type === "addition") {
      navigate("/admin/stock/addition-history");
    }
    if (type === "issue") {
      navigate("/admin/stock/issuance-history");
    }
  };

  //Loading Animation
  if (loading) {
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

              <Button
                type="submit"
                color="failure"
                className="w-full"
                disabled={loading}
              >
                <HiPlus className="mr-2 h-5 w-5" />
                {loading ? "Adding..." : "Add to Stock"}
              </Button>
            </form>
          </div>

          {/* Issue Stock Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Issue Blood Stock
            </h2>
            <form className="space-y-4" onSubmit={handleIssueSubmit}>
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
                disabled={loading}
              >
                <HiMinus className="mr-2 h-5 w-5" />
                {loading ? "Issuing..." : "Issue Stock"}
              </Button>
            </form>
          </div>
        </div>

        {/* Stock Table */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            {loading ? (
              <div className=" loading flex justify-center items-center h-40">
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
                    disabled={loading}
                  >
                    Issue History
                  </Button>
                  <Button
                    color="failure"
                    onClick={() => handleShowHistory("addition")}
                    disabled={loading}
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
                      <Table.HeadCell>Quantity (units)</Table.HeadCell>
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
                          <Table.Cell colSpan={4} className="text-center py-4">
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
    </div>
  );
}
