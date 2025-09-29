/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  Table,
  Checkbox,
  Spinner,
  Label,
  TextInput,
} from "flowbite-react";
import { useTranslation } from "react-i18next";
import { ValidationModal } from "../../../components/ValidationModal";
import { HiOutlineUserAdd } from "react-icons/hi";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  contactNumber: string;
  isSubscribed: boolean;
  maskedNumber: string;
}

interface NewAdminData {
  name: string;
  email: string;
  contactNumber: string;
}

export default function AdminSubscription() {
  const { t } = useTranslation(["admin", "common"]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminFormData, setNewAdminFormData] = useState<NewAdminData>({
    name: "",
    email: "",
    contactNumber: "",
  });
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "" | "otp_sent" | "success" | "error"
  >("");
  const [otp, setOtp] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationModalContent, setValidationModalContent] = useState({
    title: "",
    content: "",
  });

  const showValidationMessage = (title: string, content: string) => {
    setValidationModalContent({ title, content });
    setShowValidationModal(true);
  };

  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  // Utility function from the original code
  const transformPhoneNumber = (phone: string): string => {
    if (phone.startsWith("0")) {
      return "94" + phone.substring(1);
    }
    return phone;
  };

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming a new API endpoint to fetch all admin users
      const response = await axios.get(`${backendURL}/api/admin/users`);
      setAdmins(response.data);
    } catch (err) {
      console.error("Error fetching admin users:", err);
      setError(t("fetch_error"));
    } finally {
      setLoading(false);
    }
  }, [backendURL, t]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleCheckboxChange = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setOtp("");
    setSubscriptionStatus("");

    if (admin.isSubscribed) {
      setShowUnsubscribeModal(true);
    } else {
      if (!admin.contactNumber) {
        showValidationMessage(
          t("validation_missing_phone_title", { ns: "admin" }),
          t("validation_missing_phone_content", { ns: "admin" })
        );
        return;
      }
      setShowSubscriptionModal(true);
    }
  };

  const handleAdminFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdminFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingAdmin(true);

    // Simple client-side validation
    if (
      !newAdminFormData.name ||
      !newAdminFormData.email ||
      !newAdminFormData.contactNumber
    ) {
      showValidationMessage(
        t("validation_error_title", { ns: "common" }),
        t("validation_admin_fields_required", { ns: "admin" })
      );
      setIsAddingAdmin(false);
      return;
    }

    try {
      const response = await axios.post(
        `${backendURL}/api/admin/add-admin`,
        newAdminFormData
      );

      if (response.data.success) {
        const newAdmin: AdminUser = {
          ...response.data.admin,
          isSubscribed: false,
          maskedNumber: "",
        };
        setAdmins((prev) => [...prev, newAdmin]);

        // Show success message
        showValidationMessage(
          t("admin_add_success_title", { ns: "admin" }),
          t("admin_add_success_content", { ns: "admin", name: newAdmin.name })
        );

        // Reset form and close modal
        setNewAdminFormData({ name: "", email: "", contactNumber: "" });
        setShowAddAdminModal(false);
      } else {
        showValidationMessage(
          t("admin_add_fail_title", { ns: "admin" }),
          response.data.error ||
            t("admin_add_fail_content_generic", { ns: "admin" })
        );
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      showValidationMessage(
        t("admin_add_fail_title", { ns: "admin" }),
        t("admin_add_fail_content_generic", { ns: "admin" })
      );
    } finally {
      setIsAddingAdmin(false);
    }
  };

  // Subscription Logic
  const handleRequestOtp = async () => {
    if (!selectedAdmin || !selectedAdmin.contactNumber) return;

    setIsRequestingOtp(true);
    try {
      const transformedPhone = transformPhoneNumber(
        selectedAdmin.contactNumber
      );

      const response = await axios.post(
        `${backendURL}/subscription/request-otp`,
        {
          phone: transformedPhone,
        }
      );

      if (response.data.success) {
        setSubscriptionId(response.data.subscriptionId);
        setSubscriptionStatus("otp_sent");
      } else {
        setSubscriptionStatus("error");
        console.error("Failed to send OTP:", response.data.error);
        showValidationMessage(
          t("request_otp_fail_title", { ns: "admin" }),
          response.data.error ||
            t("request_otp_fail_content_generic", { ns: "admin" })
        );
      }
    } catch (error) {
      setSubscriptionStatus("error");
      console.error("Error requesting OTP:", error);
      showValidationMessage(
        t("request_otp_fail_title", { ns: "admin" }),
        t("request_otp_fail_content_generic", { ns: "admin" })
      );
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!selectedAdmin) return;
    setIsVerifyingOtp(true);
    try {
      const transformedPhone = transformPhoneNumber(
        selectedAdmin.contactNumber
      );

      const response = await axios.post(
        `${backendURL}/subscription/verify-otp`,
        {
          phone: transformedPhone,
          otp: otp,
          subscriptionId: subscriptionId,
          email: selectedAdmin.email,
          userCollection: "admin",
        }
      );

      if (response.data.success) {
        setSubscriptionStatus("success");

        // Optimistically update the local state
        setAdmins((prev) =>
          prev.map((a) =>
            a._id === selectedAdmin._id
              ? {
                  ...a,
                  isSubscribed: true,
                  maskedNumber: response.data.maskedNumber,
                }
              : a
          )
        );

        // Success message
        showValidationMessage(
          t("subscription_success_title", { ns: "admin" }),
          t("subscription_success_content", { ns: "admin" })
        );
      } else {
        setSubscriptionStatus("error");
        showValidationMessage(
          t("subscription_fail_title", { ns: "admin" }),
          t("subscription_fail_content", { ns: "admin" })
        );
      }
    } catch (error) {
      setSubscriptionStatus("error");
      console.error("Error verifying OTP:", error);
      showValidationMessage(
        t("subscription_fail_title", { ns: "admin" }),
        t("subscription_fail_content_generic", { ns: "admin" })
      );
    } finally {
      setIsVerifyingOtp(false);
      // Close the modal on success or error, and let the validation modal handle the message
      if (subscriptionStatus === "success" || subscriptionStatus === "error") {
        setShowSubscriptionModal(false);
      }
    }
  };

  const handleUnsubscribeAdmin = async () => {
    if (!selectedAdmin) return;
    setIsUnsubscribing(true);
    try {
      const response = await axios.post(
        `${backendURL}/subscription/unsubscribe`,
        {
          email: selectedAdmin.email,
          userCollection: "admin",
        }
      );

      if (response.data.success) {
        // Update local state
        setAdmins((prev) =>
          prev.map((a) =>
            a._id === selectedAdmin._id
              ? { ...a, isSubscribed: false, maskedNumber: "" }
              : a
          )
        );

        setShowUnsubscribeModal(false);
        showValidationMessage(
          t("unsub_success_title", { ns: "admin" }),
          t("unsub_success_content", { ns: "admin" })
        );
      } else {
        showValidationMessage(
          t("unsub_fail_title", { ns: "admin" }),
          response.data.error ||
            t("unsub_fail_content_generic", { ns: "admin" })
        );
      }
    } catch (error) {
      console.error("Error during unsubscription:", error);
      showValidationMessage(
        t("unsub_fail_title", { ns: "admin" }),
        t("unsub_fail_content_generic", { ns: "admin" })
      );
    } finally {
      setIsUnsubscribing(false);
    }
  };

  // Helper to reset modal state on close
  const handleCloseSubscriptionModal = () => {
    setShowSubscriptionModal(false);
    setSelectedAdmin(null);
    setOtp("");
    setSubscriptionStatus("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start pt-10 min-h-screen bg-gray-50">
      <main className="w-full max-w-6xl px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("page_title", { ns: "admin" })}
          </h1>
          <Button onClick={() => setShowAddAdminModal(true)} color="success">
            <HiOutlineUserAdd className="mr-2 h-5 w-5" />
            {t("add_admin_button", { ns: "admin" })}
          </Button>
        </div>
        <p className="text-gray-600 mb-8">
          {t("page_description", { ns: "admin" })}
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>
                {t("table_header_name", { ns: "admin" })}
              </Table.HeadCell>
              <Table.HeadCell>
                {t("table_header_email", { ns: "admin" })}
              </Table.HeadCell>
              <Table.HeadCell>
                {t("table_header_contact", { ns: "admin" })}
              </Table.HeadCell>
              <Table.HeadCell>
                {t("table_header_status", { ns: "admin" })}
              </Table.HeadCell>
              <Table.HeadCell>
                {t("table_header_subscribe", { ns: "admin" })}
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {admins.length > 0 ? (
                admins.map((admin) => (
                  <Table.Row
                    key={admin._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {admin.name}
                    </Table.Cell>
                    <Table.Cell>{admin.email}</Table.Cell>
                    <Table.Cell>
                      {admin.contactNumber ||
                        t("not_available", { ns: "common" })}
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        className={`font-semibold ${
                          admin.isSubscribed ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {admin.isSubscribed
                          ? t("status_subscribed", { ns: "admin" })
                          : t("status_not_subscribed", { ns: "admin" })}
                      </span>
                      {admin.isSubscribed && admin.maskedNumber && (
                        <p className="text-xs text-gray-500">
                          {t("masked_number", {
                            ns: "admin",
                            number: admin.maskedNumber,
                          })}
                        </p>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <Checkbox
                        checked={admin.isSubscribed}
                        onChange={() => handleCheckboxChange(admin)}
                        disabled={!admin.contactNumber}
                      />
                      {!admin.contactNumber && (
                        <p className="text-xs text-red-500 mt-1">
                          {t("no_phone_warning", { ns: "admin" })}
                        </p>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center text-gray-500">
                    {t("no_records_found", { ns: "admin" })}
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>

        <Modal
          show={showAddAdminModal}
          onClose={() => {
            setShowAddAdminModal(false);
            setNewAdminFormData({ name: "", email: "", contactNumber: "" });
          }}
        >
          <Modal.Header>
            {t("add_admin_modal_title", { ns: "admin" })}
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="admin-name"
                    value={t("admin_name_label", { ns: "admin" })}
                  />
                </div>
                <TextInput
                  id="admin-name"
                  name="name"
                  type="text"
                  placeholder={t("admin_name_placeholder", { ns: "admin" })}
                  value={newAdminFormData.name}
                  onChange={handleAdminFormChange}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="admin-email"
                    value={t("admin_email_label", { ns: "admin" })}
                  />
                </div>
                <TextInput
                  id="admin-email"
                  name="email"
                  type="email"
                  placeholder={t("admin_email_placeholder", { ns: "admin" })}
                  value={newAdminFormData.email}
                  onChange={handleAdminFormChange}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="admin-contact"
                    value={t("admin_contact_label", { ns: "admin" })}
                  />
                </div>
                <TextInput
                  id="admin-contact"
                  name="contactNumber"
                  type="tel"
                  placeholder={t("admin_contact_placeholder", { ns: "admin" })}
                  value={newAdminFormData.contactNumber}
                  onChange={handleAdminFormChange}
                  required
                />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isAddingAdmin}>
                  {isAddingAdmin
                    ? t("saving_admin", { ns: "admin" })
                    : t("add_admin_submit_button", { ns: "admin" })}
                </Button>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button color="gray" onClick={() => setShowAddAdminModal(false)}>
              {t("cancel_button", { ns: "common" })}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showSubscriptionModal}
          onClose={handleCloseSubscriptionModal}
        >
          <Modal.Header>
            {t("subscribe_modal_title", { ns: "admin" })}: {selectedAdmin?.name}
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              {subscriptionStatus === "" && (
                <>
                  <p className="text-gray-700">
                    {t("subscribe_modal_phone_prefix", { ns: "admin" })}
                    <span className="font-semibold">
                      {" "}
                      {selectedAdmin?.contactNumber}
                    </span>
                  </p>
                  <Button
                    onClick={handleRequestOtp}
                    disabled={isRequestingOtp}
                    className="w-full"
                  >
                    {isRequestingOtp
                      ? t("sending_otp", { ns: "admin" })
                      : t("request_otp_button", { ns: "admin" })}
                  </Button>
                </>
              )}

              {subscriptionStatus === "otp_sent" && (
                <>
                  <p className="text-gray-700">
                    {t("otp_sent_message", { ns: "admin" })}
                  </p>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder={t("otp_placeholder", { ns: "admin" })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={isVerifyingOtp || otp.length < 4}
                    className="w-full"
                  >
                    {isVerifyingOtp
                      ? t("verifying_otp", { ns: "admin" })
                      : t("verify_otp_button", { ns: "admin" })}
                  </Button>
                </>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button color="gray" onClick={handleCloseSubscriptionModal}>
              {t("close_button", { ns: "admin" })}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Unsubscribe Confirmation Modal */}
        <Modal
          show={showUnsubscribeModal}
          onClose={() => setShowUnsubscribeModal(false)}
        >
          <Modal.Header>
            {t("unsubscribe_modal_title", { ns: "admin" })}
          </Modal.Header>
          <Modal.Body>
            <p className="text-lg text-gray-700">
              {t("unsubscribe_confirm_message", {
                ns: "admin",
                name: selectedAdmin?.name,
              })}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {t("unsubscribe_warning_message", { ns: "admin" })}
            </p>
          </Modal.Body>
          <Modal.Footer className="flex justify-end space-x-4">
            <Button color="gray" onClick={() => setShowUnsubscribeModal(false)}>
              {t("cancel_button", { ns: "admin" })}
            </Button>
            <Button
              color="failure"
              onClick={handleUnsubscribeAdmin}
              disabled={isUnsubscribing}
            >
              {isUnsubscribing
                ? t("unsubscribing", { ns: "admin" })
                : t("unsubscribe_button", { ns: "admin" })}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* General Validation/Status Modal */}
        <ValidationModal
          show={showValidationModal}
          onClose={() => setShowValidationModal(false)}
          title={validationModalContent.title}
          content={validationModalContent.content}
        />
      </main>
    </div>
  );
}
