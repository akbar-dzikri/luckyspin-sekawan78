"use client";

export interface User {
  username: string;
  role: "admin" | "user";
}

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "sekawan78admin",
};

export const authService = {
  login: (username: string, password: string): User | null => {
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const user: User = { username, role: "admin" };
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem("user");
  },

  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return authService.getCurrentUser() !== null;
  },

  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.role === "admin";
  },
};
