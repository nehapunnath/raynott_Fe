// services/authApis.js
import base_url from "./base_urls";
import commonApis from "./commonApis";
import { auth } from "../firebase-client";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export const authApis = {
  // Clear all user-specific data from localStorage
  clearUserData: () => {
    const keysToRemove = [
      'adminToken',
      'userEmail', 
      'userRole',
      'institutionName',
      'institutionType',
      'userUid',
      'registrationId',
      'schoolId',
      'schoolData',
      'registrationData'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('🧹 All user data cleared from localStorage');
  },

  async adminLogin(email, password) {
    try {
      // Clear previous user data before login
      this.clearUserData();
      
      const result = await commonApis(
        `${base_url}/login`,
        "POST",
        { "Content-Type": "application/json" },
        { email, password }
      );

      if (result.success) {
        localStorage.setItem("adminToken", result.token);
        localStorage.setItem("userEmail", email);
        
        // Store user role from the response
        if (result.user && result.user.role) {
          localStorage.setItem("userRole", result.user.role);
        }
        if (result.user && result.user.institutionType) {
          localStorage.setItem("institutionType", result.user.institutionType);
        }
        if (result.user && result.user.institutionName) {
          localStorage.setItem("institutionName", result.user.institutionName);
        }
        
        console.log('✅ Login successful for:', email);
        console.log('📋 User data stored:', {
          role: localStorage.getItem('userRole'),
          institutionType: localStorage.getItem('institutionType'),
          institutionName: localStorage.getItem('institutionName'),
          email: localStorage.getItem('userEmail')
        });
        
        return { 
          success: true, 
          token: result.token,
          user: result.user 
        };
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
          localStorage.setItem("userRole", 'institute');
          localStorage.setItem("userEmail", email);
          localStorage.setItem("institutionName", institutionName);
          localStorage.setItem("institutionType", institutionType);
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
      this.clearUserData();
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      this.clearUserData();
      return { success: false, error: error.message };
    }
  },

  getAdminToken() {
    return localStorage.getItem("adminToken");
  },

  getUserRole() {
    return localStorage.getItem("userRole");
  },

  getCurrentUserEmail() {
    return localStorage.getItem("userEmail");
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

  async getCurrentAdminUser(token) {
    try {
      // First, try to get user data from localStorage
      const storedRole = localStorage.getItem('userRole');
      const storedInstitutionType = localStorage.getItem('institutionType');
      const storedInstitutionName = localStorage.getItem('institutionName');
      const storedEmail = localStorage.getItem('userEmail');
      
      // If we have data in localStorage, use it
      if (storedRole && storedInstitutionType) {
        console.log('📋 Using stored user data from localStorage');
        return {
          success: true,
          role: storedRole,
          institutionType: storedInstitutionType,
          institutionName: storedInstitutionName || 'N/A',
          email: storedEmail || ''
        };
      }
      
      // Decode the JWT token on client side to get claims
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decodedToken = JSON.parse(jsonPayload);
        console.log('📋 Decoded Token:', decodedToken);
        
        // Extract role from claims
        let role = decodedToken.role || 'institute';
        
        // If old format with admin: true, set as admin
        if (decodedToken.admin === true && !decodedToken.role) {
          role = 'admin';
        }
        
        // Store in localStorage for future use
        localStorage.setItem('userRole', role);
        if (decodedToken.institutionType) {
          localStorage.setItem('institutionType', decodedToken.institutionType);
        }
        if (decodedToken.institutionName) {
          localStorage.setItem('institutionName', decodedToken.institutionName);
        }
        if (decodedToken.email) {
          localStorage.setItem('userEmail', decodedToken.email);
        }
        
        return {
          success: true,
          role: role,
          institutionType: decodedToken.institutionType || 'N/A',
          institutionName: decodedToken.institutionName || 'N/A',
          uid: decodedToken.user_id,
          email: decodedToken.email || ''
        };
      } catch (decodeError) {
        console.error('Error decoding token:', decodeError);
      }
      
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
        
        if (result.success) {
          // Store in localStorage
          localStorage.setItem('userRole', result.role || 'institute');
          if (result.institutionType) {
            localStorage.setItem('institutionType', result.institutionType);
          }
          if (result.institutionName) {
            localStorage.setItem('institutionName', result.institutionName);
          }
          if (result.email) {
            localStorage.setItem('userEmail', result.email);
          }
        }
        
        return result;
      } catch (apiError) {
        console.error('API error:', apiError);
        return {
          success: false,
          error: "Failed to get user data"
        };
      }
    } catch (error) {
      console.error('Error in getCurrentAdminUser:', error);
      return {
        success: false,
        error: error.message || "Failed to get user data"
      };
    }
  }
};