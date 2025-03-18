import {
    uploadData,
    getUrl,
    remove,
    downloadData
  } from "aws-amplify/storage";
  import { fetchUserAttributes } from "aws-amplify/auth";
  
  // Types
  type UploadProgressCallback = (progress: { transferredBytes: number; totalBytes: number }) => void;
  
  // Helper to get current user's identity ID
  export const getCurrentUserIdentity = async (): Promise<string> => {
    try {
      const attributes = await fetchUserAttributes();
      if (!attributes.sub) {
        throw new Error("User identity not found");
      }
      return attributes.sub;
    } catch (error) {
      console.error("Error getting user identity:", error);
      throw error;
    }
  };
  
  // Upload file to S3
  export const uploadFile = async (
    file: File,
    directory: string,
    onProgress?: UploadProgressCallback
  ): Promise<string> => {
    try {
      const entityId = await getCurrentUserIdentity();
      
      // Create file path with user identity
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${directory}/${entityId}/${fileName}`;
      
      // Upload file
      const uploadTask = uploadData({
        path: filePath,
        data: file,
        options: {
          onProgress,
        },
      });
      
      await uploadTask.result;
      return filePath;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };
  
  // Upload profile picture specifically
  export const uploadProfilePicture = async (
    file: File,
    onProgress?: UploadProgressCallback
  ): Promise<string> => {
    return uploadFile(file, "profile-pictures", onProgress);
  };
  
  // Upload business image specifically
  export const uploadBusinessImage = async (
    file: File,
    businessId: string,
    onProgress?: UploadProgressCallback
  ): Promise<string> => {
    try {
      // Create file path with business ID
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `business-images/${businessId}/${fileName}`;
      
      // Upload file
      const uploadTask = uploadData({
        path: filePath,
        data: file,
        options: {
          onProgress,
        },
      });
      
      await uploadTask.result;
      return filePath;
    } catch (error) {
      console.error("Error uploading business image:", error);
      throw error;
    }
  };
  
  // Get a file URL with optional expiration
  export const getFileUrl = async (
    filePath: string,
    expiresIn = 900 // 15 minutes
  ): Promise<string> => {
    try {
      const result = await getUrl({
        path: filePath,
        options: {
          expiresIn,
        },
      });
      return result.url.toString();
    } catch (error) {
      console.error("Error getting file URL:", error);
      throw error;
    }
  };
  
  // Download file data
  export const downloadFile = async (filePath: string): Promise<Blob> => {
    try {
      const { body } = await downloadData({
        path: filePath,
      }).result;
      
      return await body.blob();
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  };
  
  // Delete file from S3
  export const deleteFile = async (filePath: string): Promise<void> => {
    try {
      await remove({
        path: filePath,
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  };
  
  // Create a download link for a file
  export const createDownloadLink = async (
    filePath: string,
    fileName: string
  ): Promise<void> => {
    try {
      const blob = await downloadFile(filePath);
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error creating download link:", error);
      throw error;
    }
  };