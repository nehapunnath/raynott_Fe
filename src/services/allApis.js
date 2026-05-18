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
      
      // First, call your backend registration API
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
        // Store the token if returned
        if (result.token) {
          localStorage.setItem("adminToken", result.token);
        }
        
        // Optionally, also create user in Firebase client-side auth
        try {
          // This creates a Firebase Auth user on the client side
          // Note: Your backend already creates the user via Admin SDK
          // This is optional and can be removed if you don't need client-side auth state
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          console.log("Firebase client auth user created:", userCredential.user.uid);
        } catch (firebaseError) {
          // If Firebase client error occurs but backend succeeded, still return success
          console.warn("Client-side Firebase auth error:", firebaseError.message);
          // Don't fail the registration if client-side creation fails
          // The user is already created on backend
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
      // Sign out from Firebase client auth
      await auth.signOut();
      localStorage.removeItem("adminToken");
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("adminToken"); // Still remove token even if signOut fails
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

      // Verify token with backend
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
  }
};

// Optional: Add a helper function to get current Firebase user
export const getCurrentAdminUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        resolve(null);
      }
    }, reject);
  });
};