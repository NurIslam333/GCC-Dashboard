import Cookies from "js-cookie"
import jwt_decode from "jwt-decode";

export const token = Cookies.get('token')
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