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

  // Utility method for getting auth token
  getToken: () => TokenStore.getAccessToken(),
};
