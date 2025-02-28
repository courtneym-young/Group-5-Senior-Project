import { FunctionComponent, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFetchUsersList, useFetchUserById, updateUser } from "../helpers/userHelpers";
import { changeUserGroup } from "../helpers/userHelpers";
import { formatDate } from "../helpers/timeHelpers";
import { GroupType } from "../types/group-types";
import type { Schema } from "../../amplify/data/resource";

interface UserPageProps {}

const UsersPage: FunctionComponent<UserPageProps> = () => {
  const { userId } = useParams<{ userId?: string }>();
    const { users, refreshUsers } = useFetchUsersList();
    const [selectedUser, setSelectedUser] = useState<string | null>(userId || null);
    const [searchTerm, setSearchTerm] = useState("");
    const [groupFilter, setGroupFilter] = useState<string | null>(null);
    const { user, loading, error } = useFetchUserById(selectedUser || "");
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState<Schema["User"]["type"] | null>(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

  // Reset edited user when selected user changes
  useEffect(() => {
    if (user) {
      setEditedUser(user);
    } else {
      setEditedUser(null);
    }
    setIsEditing(false);
  }, [user]);

  // Filter users based on search and group filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGroup = !groupFilter || user.groupName === groupFilter;
    
    return matchesSearch && matchesGroup;
  });

  const handleGroupChange = async (userId: string, profileOwner: string, groupName: GroupType) => {
    try {
        await changeUserGroup(groupName, userId, profileOwner);
        setSuccessMessage(`User ${userId} ${profileOwner} successfully assigned to ${groupName} group`);
        setTimeout(() => setSuccessMessage(""), 3000);
        refreshUsers();
    } catch (err) {
        setErrorMessage(`Failed to change user group: ${err instanceof Error ? err.message : String(err)}`);
        setTimeout(() => setErrorMessage(""), 5000);
    }
};

  const handleUserSelect = (id: string) => {
    setSelectedUser(id);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: string, value: unknown) => {
    if (editedUser) {
        setEditedUser({
            ...editedUser,
            [field]: value,
        });
    }
};

const handleSaveChanges = async () => {
  if (!editedUser) return;
  try {
      await updateUser(editedUser.id, editedUser);
      setSuccessMessage("User information updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsEditing(false);
      refreshUsers();
  } catch (err) {
      setErrorMessage(`Failed to update user: ${err instanceof Error ? err.message : String(err)}`);
      setTimeout(() => setErrorMessage(""), 5000);
  }
};

  const groupOptions: GroupType[] = ["ADMINS", "OWNERS", "CUSTOMERS"];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
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
        {/* Left column: User list with filters */}
        <div className="border rounded-lg p-4 overflow-hidden">
          <h2 className="text-xl font-semibold mb-4">User List</h2>
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <select
              className="w-full p-2 border rounded"
              value={groupFilter || ""}
              onChange={(e) => setGroupFilter(e.target.value === "" ? null : e.target.value)}
            >
              <option value="">All Groups</option>
              {groupOptions.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
          
          <div className="overflow-y-auto max-h-96">
            {filteredUsers.length > 0 ? (
              <ul className="divide-y">
                {filteredUsers.map((user) => (
                  <li 
                    key={user.id}
                    className={`p-2 hover:bg-gray-100 cursor-pointer ${
                      selectedUser === user.id ? "bg-blue-100" : ""
                    }`}
                    onClick={() => handleUserSelect(user.id)}
                  >
                    <div className="font-medium">{user.firstName} {user.lastName}</div>
                    <div className="text-sm text-gray-600">{user.username}</div>
                    <div className="text-xs text-gray-500">Group: {user.groupName}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 p-2">No users match your criteria.</p>
            )}
          </div>
        </div>
        
        {/* Right column: User details and editing */}
        <div className="border rounded-lg p-4 md:col-span-2">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading user data...</p>
            </div>
          ) : error ? (
            <div className="text-red-500">Error: {error}</div>
          ) : user ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">User Details</h2>
                <button
                  onClick={handleEditToggle}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {isEditing ? "Cancel" : "Edit User"}
                </button>
              </div>
              
              {isEditing ? (
                // Edit mode
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <input
                        type="text"
                        className="mt-1 block w-full p-2 border rounded"
                        value={editedUser?.firstName || ""}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        type="text"
                        className="mt-1 block w-full p-2 border rounded"
                        value={editedUser?.lastName || ""}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Group</label>
                    <select
                      className="mt-1 block w-full p-2 border rounded"
                      value={editedUser?.groupName || ""}
                      onChange={(e) => handleInputChange("groupName", e.target.value)}
                    >
                      {groupOptions.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      onClick={handleSaveChanges}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">User ID</p>
                      <p>{user.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Profile Owner</p>
                      <p>{user.profileOwner}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Username</p>
                      <p>{user.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p>{user.firstName} {user.lastName}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Group(s)</p>
                      <p>{user.groupName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Birthdate</p>
                      <p>{user.birthdate ? formatDate(user.birthdate.toString()) : "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t pt-4">
                    <h3 className="font-medium mb-2">Quick Actions</h3>
                    <div className="flex space-x-2">
                      {groupOptions.map(group => (
                        <button
                          key={group}
                          onClick={() => handleGroupChange(user.id, user.profileOwner, group)}
                          className={`px-3 py-1 rounded ${
                            user.groupName === group 
                              ? "bg-blue-200 text-blue-800" 
                              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                          }`}
                          disabled={user.groupName === group}
                        >
                          Make {group}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              Select a user to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;