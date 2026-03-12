const USER_KEY = "mind_current_user";

export const setCurrentUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

export const clearCurrentUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const isLoggedIn = () => {
  return !!getCurrentUser();
};
