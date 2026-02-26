// Helper function to save token as a cookie
function saveCookie(name, value, days) {
  document.cookie = `${name}=${value}; path=/; max-age=${days * 24 * 60 * 60}`;
}

// Helper function to retrieve a cookie
function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, val] = cookie.split("=");
    if (key === name) return val;
  }
  return null;
}

function clearAuthCookies() {
  saveCookie("token", "", -1);
  saveCookie("userID", "", -1);
  saveCookie("userName", "", -1);
}

export { saveCookie, getCookie, clearAuthCookies };
