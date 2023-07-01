import React from "react";

function Success() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const baseUrl = import.meta.env.VITE_BASE_URL;

  console.log(baseUrl,apiKey)

  return (
    <>
      <div>your payment is successful</div>
      <p>API Key: {apiKey}</p>
      <p>Base URL: {baseUrl}</p>
    </>
  );
}

export default Success;
