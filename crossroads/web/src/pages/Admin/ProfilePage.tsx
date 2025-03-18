import React, { useEffect, useState } from "react";
import { uploadData, getUrl, remove } from "aws-amplify/storage";
import { fetchUserAttributes } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import { useFetchUserById, updateUser } from "../../helpers/userHelpers";

const client = generateClient<Schema>();

const ProfilePage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userId, setUserId] = useState<string>("");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user's ID using attributes
  useEffect(() => {
    const getUserId = async () => {
      try {
        const attributes = await fetchUserAttributes();
        if (attributes.sub) {
          // Find user with matching profileOwner
          const usersList = await client.models.User.list({
            filter: {
              profileOwner: {
                eq: attributes.sub,
              },
            },
          });

          if (usersList.data && usersList.data.length > 0) {
            setUserId(usersList.data[0].id);
          } else {
            setError("User profile not found");
          }
        }
      } catch (err) {
        console.error("Error fetching user ID:", err);
        setError("Failed to fetch user details");
      }
    };

    getUserId();
  }, []);

  // Fetch user data including profile picture once userId is available
  const { user, loading, refetch } = useFetchUserById(userId);

  // Load profile picture when user data is available
  useEffect(() => {
    const loadProfilePicture = async () => {
      if (user?.profilePhoto) {
        try {
          const result = await getUrl({
            path: user.profilePhoto,
          });
          console.log(result.url.toString());
          setProfileImageUrl(result.url.toString());
        } catch (err) {
          console.error("Error loading profile picture:", err);
          setError("Failed to load profile picture");
        }
      }
    };

    if (user) {
      loadProfilePicture();
    }
  }, [user]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Upload profile picture
  const handleUpload = async () => {
    if (!selectedFile || !userId) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Get user's sub for the path
      const attributes = await fetchUserAttributes();
      const entityId = attributes.sub;

      if (!entityId) {
        throw new Error("User identity not found");
      }

      // Create a unique filename using timestamp
      const fileName = `${Date.now()}-${selectedFile.name}`;
      const filePath = `profile-pictures/${entityId}/${fileName}`;

      // Upload the file
      const uploadTask = uploadData({
        path: filePath,
        data: selectedFile,
        options: {
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              const progress = Math.round(
                (transferredBytes / totalBytes) * 100
              );
              setUploadProgress(progress);
            }
          },
        },
      });

      await uploadTask.result;

      // Update user record with the new profile photo path
      await updateUser(userId, { profilePhoto: filePath });

      // Refresh user data
      await refetch();

      // Reset states
      setSelectedFile(null);
      setPreviewUrl(null);
      setError(null);
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      setError("Failed to upload profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  // Delete profile picture
  const handleDelete = async () => {
    if (!user?.profilePhoto) return;

    try {
      // Delete from S3
      await remove({
        path: user.profilePhoto,
      });

      // Update user record
      await updateUser(userId, { profilePhoto: null });

      // Refresh user data
      await refetch();

      // Clear the image URL
      setProfileImageUrl(null);
      setError(null);
    } catch (err) {
      console.error("Error deleting profile picture:", err);
      setError("Failed to delete profile picture");
    }
  };

  if (loading) {
    return <div className="p-4">Loading profile...</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>

        <div className="flex flex-col md:flex-row md:items-center mb-6">
          <div className="mb-4 md:mb-0 md:mr-6">
            {profileImageUrl ? (
              <div className="relative">
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                />
                <button
                  onClick={handleDelete}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  title="Delete profile picture"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="mb-4">
              {previewUrl && (
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Preview:
                  </p>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover border border-gray-300"
                  />
                </div>
              )}

              <input
                type="file"
                id="profile-photo"
                onChange={handleFileChange}
                accept="image/*"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            {selectedFile && (
              <div>
                {isUploading ? (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                    <p className="text-sm text-gray-600">
                      {uploadProgress}% uploaded
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleUpload}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Upload
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {user && (
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium mb-2">User Details</h3>
            <p>
              <span className="font-medium">Name:</span> {user.firstName}{" "}
              {user.lastName}
            </p>
            <p>
              <span className="font-medium">Username:</span> {user.username}
            </p>
            <p>
              <span className="font-medium">Group:</span> {user.groupName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
