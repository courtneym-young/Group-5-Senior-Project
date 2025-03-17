import { FunctionComponent, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useFetchBusinessListEx,
  updateBusinessAsAdmin,
  deleteBusinessAsAdmin,
  createBusinessAsAdmin,
} from "../../helpers/businessHelpers";
import { useFetchUsersList } from "../../helpers/userHelpers";
import { formatDate } from "../../helpers/timeHelpers";
import {
  BusinessStatusTypes,
  BusinessStatusType,
  ResolvedBusinessEx,
  emptyBusiness,
} from "../../types/business-types";
import { APP_ROUTES } from "../../config/UrlConfig";
import { BUSINESS_CATEGORIES } from "../../config/BusinessConfig";

interface BusinessesPageProps {}

const BusinessesPage: FunctionComponent<BusinessesPageProps> = () => {
  const { businessId } = useParams<{ businessId?: string }>();
  const { businesses, loading, error } = useFetchBusinessListEx();
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(
    businessId || null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BusinessStatusType | null>(
    null
  );
  const [currentBusiness, setCurrentBusiness] =
    useState<ResolvedBusinessEx | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBusiness, setEditedBusiness] =
    useState<ResolvedBusinessEx | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddingBusiness, setIsAddingBusiness] = useState(false);
  const [newBusiness, setNewBusiness] = useState(emptyBusiness);
  const { users, loading: loadingUsers } = useFetchUsersList();

  // Initialize newBusiness if category is undefined
  useEffect(() => {
    if (newBusiness && !newBusiness.category) {
      setNewBusiness({
        ...newBusiness,
        category: [],
      });
    }
  }, [newBusiness]);

  // Set the current business when businesses are loaded or selection changes
  useEffect(() => {
    if (!loading && businesses.length > 0 && selectedBusiness) {
      const business = businesses.find((b) => b.id === selectedBusiness);
      if (business) {
        setCurrentBusiness(business);
        setEditedBusiness(business);
      }
    } else if (!selectedBusiness) {
      setCurrentBusiness(null);
      setEditedBusiness(null);
    }
  }, [businesses, selectedBusiness, loading]);

  // Reset edited business when selected business changes
  useEffect(() => {
    if (currentBusiness) {
      setEditedBusiness(currentBusiness);
    } else {
      setEditedBusiness(null);
    }
    setIsEditing(false);
  }, [currentBusiness]);

  // Filter businesses based on search and status filter
  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch =
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;

    const matchesStatus = !statusFilter || business.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleBusinessSelect = (id: string) => {
    setSelectedBusiness(id);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: string, value: unknown) => {
    if (editedBusiness) {
      if (field.startsWith("location.")) {
        const locationField = field.split(".")[1];
        setEditedBusiness({
          ...editedBusiness,
          location: {
            ...(editedBusiness.location || {}),
            [locationField]: value,
          },
        });
      } else {
        setEditedBusiness({
          ...editedBusiness,
          [field]: value,
        });
      }
    }
  };

  const handleCreateBusiness = async () => {
    try {
      if (!newBusiness.userId) {
        setErrorMessage("Please select a user");
        return;
      }

      if (!newBusiness.name) {
        setErrorMessage("Business name is required");
        return;
      }
      console.log("Awaiting creating the businesss");
      await createBusinessAsAdmin({
        name: newBusiness.name,
        userId: newBusiness.userId,
        description: newBusiness.description,
        category: newBusiness.category,
        location: newBusiness.location,
        phone: newBusiness.phone,
        website: newBusiness.website,
        email: newBusiness.email,
        hours: newBusiness.hours,
        profilePhoto: newBusiness.profilePhoto,
        isMinorityOwned: newBusiness.isMinorityOwned,
        status: newBusiness.status as BusinessStatusType,
      });

      setSuccessMessage("Business created successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsAddingBusiness(false);
      setNewBusiness(emptyBusiness);
      // Ideally we'd refresh the business list here
    } catch (err) {
      setErrorMessage(
        `Failed to create business: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleNewBusinessInputChange = (field: string, value: unknown) => {
    if (field.startsWith("location.")) {
      const locationField = field.split(".")[1];
      setNewBusiness({
        ...newBusiness,
        location: {
          ...newBusiness.location,
          [locationField]: value,
        },
      });
    } else {
      setNewBusiness({
        ...newBusiness,
        [field]: value,
      });
    }
  };

  const handleSaveChanges = async () => {
    if (!editedBusiness) return;
    try {
      await updateBusinessAsAdmin(editedBusiness.id, {
        name: editedBusiness.name,
        userId: editedBusiness.userId,
        description: editedBusiness.description || "",
        category: editedBusiness.category || [],
        location: editedBusiness.location || {
          streetAddress: "",
          city: "",
          state: "",
          zip: "",
        },
        phone: editedBusiness.phone || "",
        website: editedBusiness.website || "",
        email: editedBusiness.email || "",
        hours: editedBusiness.hours || "",
        profilePhoto: editedBusiness.profilePhoto || "",
        isMinorityOwned: editedBusiness.isMinorityOwned || false,
        status:
          (editedBusiness.status as BusinessStatusType) ||
          BusinessStatusTypes.PENDING,
      });
      setSuccessMessage("Business information updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsEditing(false);
      // Ideally we'd refresh the business list here
      // Since there's no refreshBusinesses function in useFetchBusinessListEx, we'll just update the current business
      setCurrentBusiness(editedBusiness);
    } catch (err) {
      setErrorMessage(
        `Failed to update business: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleDeleteBusiness = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this business? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteBusinessAsAdmin(id);
      setSuccessMessage("Business deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      setSelectedBusiness(null);
      setCurrentBusiness(null);
      // Ideally, we would refresh the business list here
    } catch (err) {
      setErrorMessage(
        `Failed to delete business: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleStatusChange = async (id: string, status: BusinessStatusType) => {
    if (!currentBusiness) return;

    try {
      await updateBusinessAsAdmin(id, {
        name: currentBusiness.name,
        userId: currentBusiness.userId,
        description: currentBusiness.description || "",
        category: currentBusiness.category || [],
        location: currentBusiness.location || {
          streetAddress: "",
          city: "",
          state: "",
          zip: "",
        },
        phone: currentBusiness.phone || "",
        website: currentBusiness.website || "",
        email: currentBusiness.email || "",
        hours: currentBusiness.hours || "",
        profilePhoto: currentBusiness.profilePhoto || "",
        isMinorityOwned: currentBusiness.isMinorityOwned || false,
        status: status,
      });
      setSuccessMessage(`Business status updated to ${status}`);
      setTimeout(() => setSuccessMessage(""), 3000);

      // Update the current business status
      if (currentBusiness) {
        const updatedBusiness = { ...currentBusiness, status };
        setCurrentBusiness(updatedBusiness);
        setEditedBusiness(updatedBusiness);
      }
    } catch (err) {
      setErrorMessage(
        `Failed to update business status: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Business Management</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Business list with filters */}
        <div className="border rounded-lg p-4 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold mb-4">Business List</h2>
            <button
              onClick={() => setIsAddingBusiness(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Add Business
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search businesses..."
              className="w-full p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <select
              className="w-full p-2 border rounded"
              value={statusFilter || ""}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value === ""
                    ? null
                    : (e.target.value as BusinessStatusType)
                )
              }
            >
              <option value="">All Statuses</option>
              <option value={BusinessStatusTypes.PENDING}>
                Pending Review
              </option>
              <option value={BusinessStatusTypes.VERIFIED}>Verified</option>
              <option value={BusinessStatusTypes.FLAGGED}>Flagged</option>
            </select>
          </div>

          <div className="overflow-y-auto max-h-96">
            {loading ? (
              <p className="text-gray-500 p-2">Loading businesses...</p>
            ) : error ? (
              <p className="text-red-500 p-2">Error: {error}</p>
            ) : filteredBusinesses.length > 0 ? (
              <ul className="divide-y">
                {filteredBusinesses.map((business) => (
                  <li
                    key={business.id}
                    className={`p-2 hover:bg-gray-100 cursor-pointer ${
                      selectedBusiness === business.id ? "bg-blue-100" : ""
                    }`}
                    onClick={() => handleBusinessSelect(business.id)}
                  >
                    <div className="font-medium">{business.name}</div>
                    <div className="text-sm text-gray-600">
                      Owner:{" "}
                      {business.user
                        ? `${business.user.firstName} ${business.user.lastName}`
                        : "Unknown"}
                    </div>
                    <div className="flex items-center mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          business.status === BusinessStatusTypes.VERIFIED
                            ? "bg-green-100 text-green-800"
                            : business.status === BusinessStatusTypes.FLAGGED
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {business.status || BusinessStatusTypes.PENDING}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 p-2">
                No businesses match your criteria.
              </p>
            )}
          </div>
        </div>

        {/* Right column: Business details and editing */}
        <div className="border rounded-lg p-4 md:col-span-2">
          {loading && selectedBusiness ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading business data...</p>
            </div>
          ) : currentBusiness ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Business Details</h2>
                <div className="space-x-2">
                  <button
                    onClick={handleEditToggle}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    {isEditing ? "Cancel" : "Edit Business"}
                  </button>
                  {!isEditing && (
                    <button
                      onClick={() => handleDeleteBusiness(currentBusiness.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Delete Business
                    </button>
                  )}
                </div>
              </div>

              {isEditing ? (
                // Edit mode
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Business Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full p-2 border rounded"
                      value={editedBusiness?.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      className="mt-1 block w-full p-2 border rounded"
                      rows={3}
                      value={editedBusiness?.description || ""}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full p-2 border rounded"
                        value={editedBusiness?.phone || ""}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full p-2 border rounded"
                        value={editedBusiness?.email || ""}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Website
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full p-2 border rounded"
                      value={editedBusiness?.website || ""}
                      onChange={(e) =>
                        handleInputChange("website", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full p-2 border rounded"
                      value={editedBusiness?.location?.streetAddress || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "location.streetAddress",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full p-2 border rounded"
                        value={editedBusiness?.location?.city || ""}
                        onChange={(e) =>
                          handleInputChange("location.city", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full p-2 border rounded"
                        value={editedBusiness?.location?.state || ""}
                        onChange={(e) =>
                          handleInputChange("location.state", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full p-2 border rounded"
                        value={editedBusiness?.location?.state || ""}
                        onChange={(e) =>
                          handleInputChange("location.state", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        ZIP
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full p-2 border rounded"
                        value={editedBusiness?.location?.zip || ""}
                        onChange={(e) =>
                          handleInputChange("location.zip", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Categories
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editedBusiness?.category?.map((cat, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 px-2 py-1 rounded text-sm flex items-center"
                        >
                          <span>{cat}</span>
                          <button
                            onClick={() => {
                              const updatedCategories = [
                                ...(editedBusiness?.category || []),
                              ];
                              updatedCategories.splice(index, 1);
                              handleInputChange("category", updatedCategories);
                            }}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      <select
                        className="p-1 border rounded text-sm"
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            const newCategory = e.target.value;
                            const currentCategories =
                              editedBusiness?.category || [];

                            // Only add if not already in the list
                            if (!currentCategories.includes(newCategory)) {
                              const updatedCategories = [
                                ...currentCategories,
                                newCategory,
                              ];
                              handleInputChange("category", updatedCategories);
                            }

                            // Reset select to placeholder
                            e.target.value = "";
                          }
                        }}
                      >
                        <option value="" disabled>
                          Add category
                        </option>
                        {BUSINESS_CATEGORIES.filter(
                          (cat) =>
                            !(editedBusiness?.category || []).includes(cat)
                        ).map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Hours
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full p-2 border rounded"
                      value={editedBusiness?.hours || ""}
                      onChange={(e) =>
                        handleInputChange("hours", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border rounded"
                      checked={editedBusiness?.isMinorityOwned || false}
                      onChange={(e) =>
                        handleInputChange("isMinorityOwned", e.target.checked)
                      }
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700">
                      Minority Owned Business
                    </label>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleSaveChanges}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-2"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {currentBusiness.name}
                      </h3>
                      <p className="text-gray-600">
                        <a
                          href={`${APP_ROUTES.ADMIN.USERS}/${currentBusiness.user?.id}`}
                        >
                          {" "}
                          Owner:{" "}
                          {currentBusiness.user
                            ? `${currentBusiness.user.firstName} ${currentBusiness.user.lastName}`
                            : "Unknown"}
                        </a>
                      </p>
                    </div>
                    <div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          currentBusiness.status ===
                          BusinessStatusTypes.VERIFIED
                            ? "bg-green-100 text-green-800"
                            : currentBusiness.status ===
                              BusinessStatusTypes.FLAGGED
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {currentBusiness.status || BusinessStatusTypes.PENDING}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-gray-600">
                      {currentBusiness.description ||
                        "No description provided."}
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p>{currentBusiness.phone || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p>{currentBusiness.email || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <p>{currentBusiness.website || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Hours</p>
                        <p>{currentBusiness.hours || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Location</h4>
                    <p>
                      {currentBusiness.location?.streetAddress ||
                        "No address provided"}
                      {currentBusiness.location?.secondaryAddress &&
                        `, ${currentBusiness.location.secondaryAddress}`}
                    </p>
                    <p>
                      {currentBusiness.location?.city &&
                        `${currentBusiness.location.city}, `}
                      {currentBusiness.location?.state &&
                        `${currentBusiness.location.state} `}
                      {currentBusiness.location?.zip &&
                        currentBusiness.location.zip}
                    </p>
                  </div>

                  {currentBusiness.category &&
                    currentBusiness.category.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Categories</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentBusiness.category.map((cat, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 px-2 py-1 rounded text-sm"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Additional Details</h4>
                    <p>
                      <span className="text-sm text-gray-500 mr-2">
                        Minority Owned:
                      </span>
                      {currentBusiness.isMinorityOwned ? "Yes" : "No"}
                    </p>
                    <p>
                      <span className="text-sm text-gray-500 mr-2">
                        Created:
                      </span>
                      {currentBusiness.createdAt
                        ? formatDate(currentBusiness.createdAt)
                        : "Unknown"}
                    </p>
                    <p>
                      <span className="text-sm text-gray-500 mr-2">
                        Last Updated:
                      </span>
                      {currentBusiness.updatedAt
                        ? formatDate(currentBusiness.updatedAt)
                        : "Unknown"}
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Actions</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleStatusChange(
                            currentBusiness.id,
                            BusinessStatusTypes.VERIFIED
                          )
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        disabled={
                          currentBusiness.status ===
                          BusinessStatusTypes.VERIFIED
                        }
                      >
                        Verify
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(
                            currentBusiness.id,
                            BusinessStatusTypes.FLAGGED
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        disabled={
                          currentBusiness.status === BusinessStatusTypes.FLAGGED
                        }
                      >
                        Flag
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(
                            currentBusiness.id,
                            BusinessStatusTypes.PENDING
                          )
                        }
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                        disabled={
                          currentBusiness.status === BusinessStatusTypes.PENDING
                        }
                      >
                        Mark as Pending
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">
                Select a business from the list to view details.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Business Modal */}
      {isAddingBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Business</h2>
              <button
                onClick={() => setIsAddingBusiness(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  User*
                </label>
                <select
                  className="mt-1 block w-full p-2 border rounded"
                  value={newBusiness.userId}
                  onChange={(e) =>
                    handleNewBusinessInputChange("userId", e.target.value)
                  }
                  required
                >
                  <option value="">Select a user</option>
                  {loadingUsers ? (
                    <option disabled>Loading users...</option>
                  ) : (
                    users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} (
                        {user.username || user.profileOwner})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Business Name*
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border rounded"
                  value={newBusiness.name}
                  onChange={(e) =>
                    handleNewBusinessInputChange("name", e.target.value)
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  className="mt-1 block w-full p-2 border rounded"
                  rows={3}
                  value={newBusiness.description}
                  onChange={(e) =>
                    handleNewBusinessInputChange("description", e.target.value)
                  }
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone*
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full p-2 border rounded"
                    value={newBusiness.phone}
                    onChange={(e) =>
                      handleNewBusinessInputChange("phone", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email*
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full p-2 border rounded"
                    value={newBusiness.email}
                    onChange={(e) =>
                      handleNewBusinessInputChange("email", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Website*
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border rounded"
                  value={newBusiness.website}
                  onChange={(e) =>
                    handleNewBusinessInputChange("website", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border rounded"
                  value={newBusiness.location.streetAddress}
                  onChange={(e) =>
                    handleNewBusinessInputChange(
                      "location.streetAddress",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full p-2 border rounded"
                    value={newBusiness.location.city}
                    onChange={(e) =>
                      handleNewBusinessInputChange(
                        "location.city",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full p-2 border rounded"
                    value={newBusiness.location.state}
                    onChange={(e) =>
                      handleNewBusinessInputChange(
                        "location.state",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ZIP
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full p-2 border rounded"
                    value={newBusiness.location.zip}
                    onChange={(e) =>
                      handleNewBusinessInputChange(
                        "location.zip",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newBusiness.category?.map((cat, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 px-2 py-1 rounded text-sm flex items-center"
                    >
                      <span>{cat}</span>
                      <button
                        onClick={() => {
                          const updatedCategories = [
                            ...(newBusiness.category || []),
                          ];
                          updatedCategories.splice(index, 1);
                          handleNewBusinessInputChange(
                            "category",
                            updatedCategories
                          );
                        }}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <select
                    className="p-1 border rounded text-sm"
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        const newCategory = e.target.value;
                        const currentCategories =
                          (newBusiness?.category as string[]) || [];

                        // Only add if not already in the list
                        if (!currentCategories.includes(newCategory)) {
                          const updatedCategories = [
                            ...currentCategories,
                            newCategory,
                          ];
                          handleNewBusinessInputChange(
                            "category",
                            updatedCategories
                          );
                        }

                        // Reset select to placeholder
                        e.target.value = "";
                      }
                    }}
                  >
                    <option value="" disabled>
                      Add category
                    </option>
                    {BUSINESS_CATEGORIES.filter(
                      (cat) =>
                        !(newBusiness?.category || []).includes(cat as never)
                    ).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hours
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border rounded"
                  value={newBusiness.hours}
                  onChange={(e) =>
                    handleNewBusinessInputChange("hours", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  className="mt-1 block w-full p-2 border rounded"
                  value={newBusiness.status}
                  onChange={(e) =>
                    handleNewBusinessInputChange("status", e.target.value)
                  }
                >
                  <option value={BusinessStatusTypes.PENDING}>
                    Pending Review
                  </option>
                  <option value={BusinessStatusTypes.VERIFIED}>Verified</option>
                  <option value={BusinessStatusTypes.FLAGGED}>Flagged</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border rounded"
                  checked={newBusiness.isMinorityOwned}
                  onChange={(e) =>
                    handleNewBusinessInputChange(
                      "isMinorityOwned",
                      e.target.checked
                    )
                  }
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Minority Owned Business
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setIsAddingBusiness(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBusiness}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Create Business
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessesPage;
