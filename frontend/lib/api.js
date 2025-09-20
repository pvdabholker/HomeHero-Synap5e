// api client for backend integration

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://homehero-synap5e.onrender.com";

let inMemoryAccessToken = null;
let inMemoryRefreshToken = null;
let lastUsedPhone = null;

export const TokenStore = {
  setTokens: ({ access_token, refresh_token }) => {
    inMemoryAccessToken = access_token || null;
    inMemoryRefreshToken = refresh_token || null;
  },
  clear: () => {
    inMemoryAccessToken = null;
    inMemoryRefreshToken = null;
    lastUsedPhone = null;
  },
  getAccessToken: () => inMemoryAccessToken,
  getRefreshToken: () => inMemoryRefreshToken,
  setLastPhone: (phone) => {
    lastUsedPhone = phone || null;
  },
  getLastPhone: () => lastUsedPhone,
};

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const url = `${API_BASE_URL}${path}`;
  const token = TokenStore.getAccessToken();

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    if (!response.ok) {
      const message =
        (data && (data.detail || data.message)) ||
        `Request failed: ${response.status} ${response.statusText}`;

      // Enhanced logging for debugging
      console.error("API Error Details:", {
        status: response.status,
        statusText: response.statusText,
        url: url,
        method: method,
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? { Authorization: `Bearer ${token.substring(0, 10)}...` }
            : {}),
          ...headers,
        },
        body: body,
        responseData: data,
        message: message,
      });

      throw new Error(message);
    }

    return data;
  } catch (networkError) {
    console.error("Network Error:", networkError);
    // Check if it's a network connectivity issue
    if (
      networkError.message.includes("fetch") ||
      networkError.message.includes("Network")
    ) {
      throw new Error(
        "Network error. Please check your internet connection and try again."
      );
    }
    throw networkError;
  }

  return data;
}

export const api = {
  // Auth
  auth: {
    login: async ({ email_or_phone, password }) => {
      const data = await request("/api/auth/login", {
        method: "POST",
        body: { email_or_phone, password },
      });
      TokenStore.setTokens(data);
      TokenStore.setLastPhone(email_or_phone);
      return data;
    },
    register: async ({
      name,
      email,
      phone,
      password,
      user_type = "customer",
    }) => {
      const res = await request("/api/auth/register", {
        method: "POST",
        body: { name, email, phone, password, user_type },
      });
      TokenStore.setLastPhone(phone);
      return res;
    },
    verifyOtp: async ({ phone, otp }) => {
      return request("/api/auth/verify-otp", {
        method: "POST",
        body: { phone, otp },
      });
    },
    logout: async () => {
      try {
        await request("/api/auth/logout", { method: "POST" });
      } finally {
        TokenStore.clear();
      }
    },
  },

  // Users
  users: {
    me: async () => request("/api/users/me"),
    updateMe: async (payload) =>
      request("/api/users/me", { method: "PUT", body: payload }),
    updateLocation: async ({ location, pincode }) =>
      request("/api/users/location", {
        method: "POST",
        body: { location, pincode },
      }),
    uploadAvatar: async ({ uri, name = "avatar.jpg", type = "image/jpeg" }) => {
      const token = TokenStore.getAccessToken();
      const form = new FormData();
      form.append("avatar", { uri, name, type });
      const res = await fetch(`${API_BASE_URL}/api/users/me/avatar`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: form,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          (data && (data.detail || data.message)) ||
            `Upload failed: ${res.status}`
        );
      }
      return data;
    },
  },

  // Services
  services: {
    getAll: async () => request("/api/services"),
    getCategories: async () => request("/api/services/categories"),
  },

  // Providers
  providers: {
    create: async (payload) =>
      request("/api/providers/", { method: "POST", body: payload }),
    me: async () => request("/api/providers/me"),
    updateMe: async (payload) =>
      request("/api/providers/me", { method: "PUT", body: payload }),
    updateAvailability: async (payload) =>
      request("/api/providers/availability", { method: "PUT", body: payload }),
    updatePricing: async (payload) =>
      request("/api/providers/pricing", { method: "PUT", body: payload }),
    search: async (params = {}) => {
      const query = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params).filter(
            ([, v]) => v !== undefined && v !== null && `${v}` !== ""
          )
        )
      ).toString();
      const path = `/api/providers/search${query ? `?${query}` : ""}`;
      return request(path);
    },
    list: async (params = {}) => {
      const query = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params).filter(
            ([, v]) => v !== undefined && v !== null && `${v}` !== ""
          )
        )
      ).toString();
      const path = `/api/providers${query ? `?${query}` : ""}`;
      return request(path);
    },
    getById: async (id) => request(`/api/providers/${id}`),
  },

  // Bookings
  bookings: {
    create: async (payload) =>
      request("/api/bookings/", { method: "POST", body: payload }),
    my: async () => request("/api/bookings/my-bookings"),
    pending: async () => request("/api/bookings/provider/pending"),
    respond: async (bookingId, payload) =>
      request(`/api/bookings/${bookingId}/respond`, {
        method: "POST",
        body: payload,
      }),
  },

  // Admin
  admin: {
    getUsers: async (skip = 0, limit = 100) =>
      request(`/api/admin/users?skip=${skip}&limit=${limit}`),
    getProviders: async (skip = 0, limit = 100) =>
      request(`/api/admin/providers?skip=${skip}&limit=${limit}`),
    getBookings: async () => request("/api/admin/bookings"),
    approveProvider: async (providerId) =>
      request(`/api/admin/providers/${providerId}/approve`, { method: "POST" }),
    getComplaints: async () => request("/api/admin/complaints"),

    // Additional admin functions for the admin pages
    updateUserStatus: async (userId, isActive) =>
      request(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        body: { is_active: isActive },
      }),
    deleteUser: async (userId) =>
      request(`/api/admin/users/${userId}`, { method: "DELETE" }),
    updateBookingStatus: async (bookingId, status) =>
      request(`/api/admin/bookings/${bookingId}/status`, {
        method: "PATCH",
        body: { status },
      }),
    createProvider: async (providerData) =>
      request("/api/admin/providers", { method: "POST", body: providerData }),
    sendAnnouncement: async (announcement) =>
      request("/api/admin/announcements", {
        method: "POST",
        body: announcement,
      }),
    getSystemSettings: async () => request("/api/admin/settings"),
    updateSystemSettings: async (settings) =>
      request("/api/admin/settings", { method: "PUT", body: settings }),
    generateReport: async (reportConfig) =>
      request("/api/admin/reports/generate", {
        method: "POST",
        body: reportConfig,
      }),
    getAnalyticsData: async (period = "30days") =>
      request(`/api/admin/analytics?period=${period}`),
    getReportsData: async (period = "30days") =>
      request(`/api/admin/reports?period=${period}`),
  },

  // Utility method for getting auth token
  getToken: () => TokenStore.getAccessToken(),
};

// Helper functions for admin pages
export const getAdminDashboard = async () => {
  try {
    const [users, providers, bookings] = await Promise.all([
      api.admin.getUsers(),
      api.admin.getProviders(),
      api.admin.getBookings(),
    ]);

    return {
      users: users || [],
      providers: providers || [],
      bookings: bookings || [],
    };
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    throw error;
  }
};

export const updateUserStatus = async (userId, isActive) => {
  return api.admin.updateUserStatus(userId, isActive);
};

export const deleteUser = async (userId) => {
  return api.admin.deleteUser(userId);
};

export const updateBookingStatus = async (bookingId, status) => {
  return api.admin.updateBookingStatus(bookingId, status);
};

export const createProvider = async (providerData) => {
  return api.admin.createProvider(providerData);
};

export const sendAnnouncement = async (announcement) => {
  return api.admin.sendAnnouncement(announcement);
};

export const getSystemSettings = async () => {
  return api.admin.getSystemSettings();
};

export const updateSystemSettings = async (settings) => {
  return api.admin.updateSystemSettings(settings);
};

export const generateReport = async (reportConfig) => {
  return api.admin.generateReport(reportConfig);
};

export const getAnalyticsData = async (period) => {
  return api.admin.getAnalyticsData(period);
};

export const getReportsData = async (period) => {
  return api.admin.getReportsData(period);
};
