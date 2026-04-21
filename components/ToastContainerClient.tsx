"use client";

import { ToastContainer } from "react-toastify";

export default function ToastContainerClient() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnHover
      theme="light"
    />
  );
}
