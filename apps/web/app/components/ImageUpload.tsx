"use client";

import React, { useState } from "react";
import { uploadProfilePicture } from "../services/userServices/auth.service";

interface ImageUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      // console.log("Image : ", file);
      setImage(file);
      // setImagePreview(URL.createObjectURL(file)); // Generate a preview URL
    }
  };

  const uploadImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) return;
    console.log("Uploading image: ", image);
    // Call API to upload image

    const uploaderResponse = await uploadProfilePicture(image);
    console.log("Uploader Response: ", uploaderResponse);

    if (uploaderResponse.success) {
      onClose();
      window.location.reload();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-96 z-10">
        <h2 className="text-lg font-bold mb-4">Upload Image</h2>
        <form className="space-y-4" onSubmit={uploadImage}>
          <input
            name="file"
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={handleImageChange}
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImageUploadModal;
