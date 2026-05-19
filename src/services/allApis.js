import base_url from "./base_urls";
import commonApis from "./commonApis";
import { auth } from "../firebase-client";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

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
  },

  async adminRegister(institutionData) {
    try {
      const { institutionName, institutionType, email, password } = institutionData;
      
      const result = await commonApis(
        `${base_url}/register`,
        "POST",
        { "Content-Type": "application/json" },
        {
          institutionName,
          institutionType,
          email,
          password
        }
      );

      if (result.success) {
        if (result.token) {
          localStorage.setItem("adminToken", result.token);
        }
        
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          console.log("Firebase client auth user created:", userCredential.user.uid);
        } catch (firebaseError) {
          console.warn("Client-side Firebase auth error:", firebaseError.message);
        }
        
        return { 
          success: true, 
          message: result.message || "Registration successful",
          token: result.token,
          user: result.user
        };
      }
      
      return { 
        success: false, 
        error: result.error || "Registration failed" 
      };
      
    } catch (error) {
      console.error("Registration API error:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Network error. Please try again."
      };
    }
  },

  async adminLogout() {
    try {
      await auth.signOut();
      localStorage.removeItem("adminToken");
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("adminToken");
      return { success: false, error: error.message };
    }
  },

  getAdminToken() {
    return localStorage.getItem("adminToken");
  },

  isAdminAuthenticated() {
    const token = this.getAdminToken();
    return token !== null && token !== undefined;
  },

  async verifyAdminToken() {
    try {
      const token = this.getAdminToken();
      if (!token) {
        return { success: false, error: "No token found" };
      }

      const result = await commonApis(
        `${base_url}/verify-token`,
        "POST",
        { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        { token }
      );

      return result;
    } catch (error) {
      return { success: false, error: "Token verification failed" };
    }
  },

  // Add this function properly inside the authApis object
  async getCurrentAdminUser(token) {
    try {
      // Decode the JWT token on client side to get claims
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const decodedToken = JSON.parse(jsonPayload);
      
      // Extract claims from the decoded token
      return {
        success: true,
        institutionType: decodedToken.institutionType,
        institutionName: decodedToken.institutionName,
        uid: decodedToken.user_id,
        email: decodedToken.email
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      
      // Fallback: Make an API call to get user data
      try {
        const result = await commonApis(
          `${base_url}/admin/user-data`,
          "GET",
          { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        );
        return result;
      } catch (apiError) {
        return {
          success: false,
          error: "Failed to get user data"
        };
      }
    }
  }
};