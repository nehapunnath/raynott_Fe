import base_url from "./base_urls";
import commonApis from "./commonApis";
import { auth } from "../firebase-client";
import { signInWithEmailAndPassword } from "firebase/auth";

export const authApis = {
  async adminLogin(email, password) {
    try {
      const result = await commonApis(
        `${base_url}/login`,
        "POST",
        { "Content-Type": "application/json" },
        { email, password }
      );

      if (result.success) {
        localStorage.setItem("adminToken", result.token);
        return { success: true, token: result.token };
      }
      return result;
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again."
      };
    }
  }
};
//   _parseAuthError(error) {
//     // Handle both Firebase errors and your backend errors
//     if (error.code) { // Firebase error
//       switch (error.code) {
//         case "auth/invalid-email": return "Invalid email format";
//         case "auth/user-not-found": return "User not found";
//         case "auth/wrong-password": return "Incorrect password";
//         case "auth/too-many-requests": return "Account temporarily locked";
//         default: return "Login failed. Please try again.";
//       }
//     }
//     return error.message || "Login failed. Please try again.";
//   }
// };