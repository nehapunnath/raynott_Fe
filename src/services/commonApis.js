import axios from "axios";

const commonApis = async (reqUrl, reqMethod, reqHeaders, reqBody) => {
  const config = {
    url: reqUrl,
    method: reqMethod,
    headers: {
      "Content-Type": "application/json", // Required for JSON data
      ...reqHeaders, // Merge additional headers
    },
    data: reqBody,
  };

  try {
    const res = await axios(config);
    return res.data; // Return only the response data
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
    return { success: false, error: err.response?.data?.error || "Request failed" };
  }
};

export default commonApis;
