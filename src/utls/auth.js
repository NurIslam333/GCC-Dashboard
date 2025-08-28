import Cookies from "js-cookie"
import jwt_decode from "jwt-decode";

export const getAuthData = () => {
  // Get auth data from both cookies and localStorage
  const token = Cookies.get('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  const user = Cookies.get('user') || (typeof window !== 'undefined' ? localStorage.getItem('user') : null);
  const role = Cookies.get('role') || (typeof window !== 'undefined' ? localStorage.getItem('role') : null);
  
  return {
    token,
    user: user ? JSON.parse(user) : null,
    role
  };
};

export const token = getAuthData().token;
export const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
}

export const isTokenExpired = (data) => {
  const tokenData = jwt_decode(data); 
  const expirationTime = tokenData.exp * 1000; 
  return Date.now() > expirationTime;
}

export const generateShortName = (fullName) => {
  const words = fullName.split(' ');
  const initials = words.map((word) => word[0].toUpperCase());
  const shortName = initials.join('');
  return shortName;
};

export const logout = () => {
  // Clear cookies
  Cookies.remove('token');
  Cookies.remove('user');
  Cookies.remove('role');
  
  // Clear localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    
    // Trigger custom event to notify AuthContext about logout
    const logoutEvent = new CustomEvent('auth:logout');
    window.dispatchEvent(logoutEvent);
  }
  
  // Note: Don't redirect here - let AuthContext handle it
  // This prevents the flash of old content
};