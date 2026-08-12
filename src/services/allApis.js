import base_url from "./base_urls";
import commonApis from "./commonApis";
import { auth } from "../firebase-client";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export const authApis = {
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
      'registrationData',
      'parentToken',
      'parentData',
      'parentName',
      'studentName',
      'studentClass'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('🧹 All user data cleared from localStorage');
  },

  // PARENT LOGIN
  // PARENT LOGIN
async parentLogin(email, password) {
  try {
    this.clearUserData();
    
    const result = await commonApis(
      `${base_url}/parent/login`,
      "POST",
      { "Content-Type": "application/json" },
      { email, password }
    );

    if (result.success) {
      localStorage.setItem("parentToken", result.token);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", 'parent');
      
      if (result.parentData) {
        localStorage.setItem("parentData", JSON.stringify(result.parentData));
        localStorage.setItem("parentName", result.parentData.parentName || '');
        localStorage.setItem("parentInstitutionType", result.parentData.institutionType || '');
      }
      
      console.log('✅ Parent login successful for:', email);
      
      return { 
        success: true, 
        token: result.token,
        parentData: result.parentData 
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

// PARENT REGISTRATION
async parentRegister(parentData) {
  try {
    const { parentName, institutionType, email, password } = parentData;
    
    const result = await commonApis(
      `${base_url}/parent/register`,
      "POST",
      { "Content-Type": "application/json" },
      {
        parentName,
        institutionType,
        email,
        password
      }
    );

    if (result.success) {
      if (result.token) {
        localStorage.setItem("parentToken", result.token);
        localStorage.setItem("userRole", 'parent');
        localStorage.setItem("userEmail", email);
        localStorage.setItem("parentName", parentName);
        localStorage.setItem("parentInstitutionType", institutionType);
      }
      
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Firebase client auth parent created:", userCredential.user.uid);
      } catch (firebaseError) {
        console.warn("Client-side Firebase auth error:", firebaseError.message);
      }
      
      return { 
        success: true, 
        message: result.message || "Parent registration successful",
        token: result.token,
        parentData: result.parentData
      };
    }
    
    return { 
      success: false, 
      error: result.error || "Registration failed" 
    };
    
  } catch (error) {
    console.error("Parent Registration API error:", error);
    return {
      success: false,
      error: error.response?.data?.error || "Network error. Please try again."
    };
  }
},
  // GET PARENT DATA
  async getParentData(token) {
    try {
      const result = await commonApis(
        `${base_url}/parent/data`,
        "GET",
        { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      );
      
      if (result.success && result.parentData) {
        localStorage.setItem("parentData", JSON.stringify(result.parentData));
        localStorage.setItem("parentName", result.parentData.parentName || '');
        localStorage.setItem("studentName", result.parentData.studentName || '');
        localStorage.setItem("studentClass", result.parentData.studentClass || '');
      }
      
      return result;
    } catch (error) {
      console.error('Error getting parent data:', error);
      return { success: false, error: error.message };
    }
  },

  // CHECK IF PARENT IS AUTHENTICATED
  isParentAuthenticated() {
    const token = localStorage.getItem("parentToken");
    return token !== null && token !== undefined;
  },

  // GET PARENT TOKEN
  getParentToken() {
    return localStorage.getItem("parentToken");
  },

  // GET PARENT DATA FROM LOCAL STORAGE
  getStoredParentData() {
    try {
      const data = localStorage.getItem("parentData");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  // LOGOUT PARENT
  async parentLogout() {
    try {
      await auth.signOut();
      this.clearUserData();
      return { success: true };
    } catch (error) {
      console.error("Parent logout error:", error);
      this.clearUserData();
      return { success: false, error: error.message };
    }
  },

  // Existing methods...
  async adminLogin(email, password) {
    try {
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
      const storedRole = localStorage.getItem('userRole');
      const storedInstitutionType = localStorage.getItem('institutionType');
      const storedInstitutionName = localStorage.getItem('institutionName');
      const storedEmail = localStorage.getItem('userEmail');
      
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
      
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decodedToken = JSON.parse(jsonPayload);
        console.log('📋 Decoded Token:', decodedToken);
        
        let role = decodedToken.role || 'institute';
        
        if (decodedToken.admin === true && !decodedToken.role) {
          role = 'admin';
        }
        
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