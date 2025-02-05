import { useEffect, useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { Label } from "flowbite-react";
import { UserIcon } from "@heroicons/react/24/solid";
import { Datepicker } from "flowbite-react";
import { User } from "../../types/types";

export default function Profile() {
  const { state, signOut, getAccessToken } = useAuthContext();
  const [user, setUser] = useState<User | null>(null);

  const [editableFields, setEditableFields] = useState<{
    [key: string]: boolean;
  }>({
    firstName: false,
    lastName: false,
    email: false,
    birthdate: false,
  });

  //Fetch and assign user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (state?.isAuthenticated) {
        try {
          const accessToken = await getAccessToken();
          console.log("acc", accessToken);
          const response = await fetch("http://localhost:5000/api/user-info", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ accessToken }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user info");
          }

          const userInfo = await response.json();

          setUser(userInfo);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      } else {
        setUser(null);
      }
    };

    fetchUserInfo();
  }, [state?.isAuthenticated, getAccessToken]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  // Handle the editing of fields
  const handleEditClick = (field: string) => {
    setEditableFields((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  // Handle input change
  const handleInputChange = (field: string, value: string) => {
    if (user) {
      setUser((prevUser) => ({
        ...prevUser!,
        [field]: value,
      }));
    }
  };

  //Update user info
  const handleUpdate = async () => {
    try {
      const accessToken = await getAccessToken();

      const response = await fetch("http://localhost:5000/api/update-user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken,
          sub: user?.sub,
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          birthdate: user?.birthdate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user info");
      }

      const data = await response.json();
      alert("User info updated successfully!");
    } catch (error) {
      console.error("Error updating user info:", error);
      alert("Error updating user info.");
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <main className="mt-16 mb-16 flex justify-center items-center w-full max-w-4xl px-4 py-6 md:w-2/3 lg:w-3/4">
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
          <div className="grid max-w-2xl mx-auto mt-4">
            <div className="lg:ml-4 flex justify-center items-center flex-col sm:flex-row sm:space-y-0 sm:space-x-6">
              {user.avatar ? (
                <img
                  className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-red-300"
                  src={user.avatar}
                  alt="User Avatar"
                />
              ) : (
                <div className="w-40 h-40 p-1 rounded-full ring-2 ring-red-300 flex items-center justify-center bg-gray-300">
                  <UserIcon className="w-12 h-12 text-gray-600" />
                </div>
              )}

              <div className="flex flex-row sm:ml-8">
                <button
                  type="button"
                  className="lg:mt-32 text-gray-700 hover:text-red-600"
                >
                  <svg
                    className="w-6 h-6 text-indigo-700"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="lg:mt-32 text-gray-700 hover:text-red-600"
                >
                  <svg
                    className="w-6 h-6 text-red-700"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="items-center mt-8 sm:mt-14 text-[#202142]">
              <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                <div className="w-full">
                  <Label
                    htmlFor="first_name"
                    className="block mb-2 text-sm font-medium text-indigo-900"
                  >
                    First Name
                  </Label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      id="first_name"
                      className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                      placeholder={user.firstName}
                      value={editableFields.firstName ? user.firstName : ""}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      disabled={!editableFields.firstName}
                    />
                    <button
                      type="button"
                      className="ml-2"
                      onClick={() => handleEditClick("firstName")}
                    >
                      <svg
                        className="w-6 h-6 text-indigo-700 "
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="w-full">
                  <Label
                    htmlFor="last_name"
                    className="block mb-2 text-sm font-medium text-indigo-900"
                  >
                    Last Name
                  </Label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      id="last_name"
                      className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                      placeholder={user.lastName}
                      value={editableFields.lastName ? user.lastName : ""}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      disabled={!editableFields.lastName}
                    />
                    <button
                      type="button"
                      className="ml-2"
                      onClick={() => handleEditClick("lastName")}
                    >
                      <svg
                        className="w-6 h-6 text-indigo-700"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-2 sm:mb-6">
                <Label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  Email
                </Label>
                <div className="flex items-center">
                  <input
                    type="email"
                    id="email"
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    value={editableFields.email ? user.email : ""}
                    placeholder={user.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!editableFields.email}
                  />
                  <button
                    type="button"
                    className="ml-2"
                    onClick={() => handleEditClick("email")}
                  >
                    <svg
                      className="w-6 h-6 text-indigo-700 "
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mb-2 sm:mb-6">
                <Label
                  htmlFor="birthdate"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  Birthdate
                </Label>
                <div className="flex items-center">
                  {editableFields.birthdate ? (
                    <Datepicker
                      id="birthdate"
                      value={user.birthdate ? user.birthdate : null}
                      onChange={(date) => {
                        handleInputChange(
                          "birthdate",
                          date ? date.toISOString().split("T")[0] : ""
                        );
                      }}
                      className="w-full bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
                    />
                  ) : (
                    <Datepicker
                      id="birthdate"
                      value={user.birthdate ? new Date(user.birthdate) : null}
                      disabled
                      onChange={(date) => {
                        handleInputChange(
                          "birthdate",
                          date ? date.toISOString().split("T")[0] : ""
                        );
                      }}
                      className="w-full bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
                    />
                  )}
                  <button
                    type="button"
                    className="ml-2"
                    onClick={() => handleEditClick("birthdate")}
                  >
                    <svg
                      className="w-6 h-6 text-indigo-700"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="text-white bg-red-900 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
