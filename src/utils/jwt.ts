import jwtDecode from 'jwt-decode';
// routes
import { PATH_AUTH } from '../routes/paths';
//
import axios from './axios';

// ----------------------------------------------------------------------

const isValidToken = (isLoggedIn: string) => {
  if (!isLoggedIn) {
    return false;
  }
  const decoded = jwtDecode<{ exp: number }>(isLoggedIn);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

const handleTokenExpired = (exp: number) => {
  let expiredTimer;

  const currentTime = Date.now();

  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    alert('Token expired');

    localStorage.removeItem('isLoggedIn');

    window.location.href = PATH_AUTH.login;
  }, timeLeft);
};

const setSession = (isLoggedIn: string | null | boolean) => {
  if (isLoggedIn) {
    localStorage.setItem('isLoggedIn', `${isLoggedIn}`);
    // axios.defaults.headers.common.Authorization = `Bearer ${isLoggedIn}`;

    // This function below will handle when token is expired
    // const { exp } = jwtDecode<{ exp: number }>(isLoggedIn); // ~3 days by minimals server
    // handleTokenExpired(exp);
  } else {
    localStorage.removeItem('isLoggedIn');
    // delete axios.defaults.headers.common.Authorization;
  }
};

export { isValidToken, setSession };
