import type {
  AmCampaign,
  AmLogEntry,
  AmOrder,
  AmProduct,
  ApiDeliveryPrice,
  ApiDiscountPlan,
  ApiMarketingCampaign,
  ApiMarketingPackage,
  ApiNotification,
  ApiOrder,
  ApiProduct,
  ApiSettlement,
  ApiVendor,
} from "./utils";

const BASE = "/api/backend";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body: { error?: string } = await res.json().catch(() => ({}));
    const message = body.error ?? `HTTP ${res.status}`;
    if (
      res.status === 401 &&
      !path.startsWith("/auth/login") &&
      !path.startsWith("/auth/signup") &&
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/login") &&
      !window.location.pathname.startsWith("/signup")
    ) {
      window.location.replace("/login");
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

function qs(params: Record<string, string | number | undefined>) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

export type OrdersParams = {
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

export type ProductsParams = {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export const api = {
  auth: {
    login: (email: string, password: string) =>
      req<{ id: string; reference: string; name: string; email: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    signup: (data: {
      name: string;
      email: string;
      password: string;
      phone: string;
      companyLocation: string;
    }) =>
      req<{ id: string; reference: string; name: string; email: string }>("/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    logout: () => req<{ ok: boolean }>("/auth/logout", { method: "POST" }),
  },

  orders: {
    list: (params: OrdersParams = {}) =>
      req<{ items: ApiOrder[]; total: number; page: number; limit: number }>(
        `/orders${qs(params as Record<string, string | number | undefined>)}`,
      ),
    get: (orderNumber: string) => req<ApiOrder>(`/orders/${orderNumber}`),
    updateStatus: (orderNumber: string, status: string) =>
      req<ApiOrder>(`/orders/${orderNumber}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
  },

  products: {
    list: (params: ProductsParams = {}) =>
      req<{ items: ApiProduct[]; total: number; page: number; limit: number }>(
        `/products${qs(params as Record<string, string | number | undefined>)}`,
      ),
    get: (id: string) => req<ApiProduct>(`/products/${id}`),
    create: (data: unknown) =>
      req<ApiProduct>("/products", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: unknown) =>
      req<ApiProduct>(`/products/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) => req<{ ok: boolean }>(`/products/${id}`, { method: "DELETE" }),
    uploadImage: async (file: File): Promise<string> => {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${BASE}/products/upload`, {
        method: "POST",
        credentials: "include",
        body: form,
      });
      if (!res.ok) {
        const body: { error?: string } = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Upload failed (HTTP ${res.status})`);
      }
      const data = (await res.json()) as { url: string };
      return data.url;
    },
  },

  settlements: {
    list: (params: { status?: string; date?: string; paymentMethod?: string } = {}) =>
      req<ApiSettlement[]>(`/settlements${qs(params)}`),
  },

  notifications: {
    list: () => req<{ items: ApiNotification[]; unread: number }>("/notifications"),
    readAll: () => req<{ ok: boolean }>("/notifications/read-all", { method: "PATCH" }),
    read: (id: string) => req<ApiNotification>(`/notifications/${id}/read`, { method: "PATCH" }),
  },

  profile: {
    get: () => req<ApiVendor>("/profile"),
    update: (data: unknown) =>
      req<ApiVendor>("/profile", { method: "PATCH", body: JSON.stringify(data) }),
  },

  discountPlans: {
    list: () => req<ApiDiscountPlan[]>("/discount-plans"),
    create: (data: { name: string; startDate: string; endDate: string; productIds: string[] }) =>
      req<ApiDiscountPlan>("/discount-plans", { method: "POST", body: JSON.stringify(data) }),
    delete: (id: string) => req<{ ok: boolean }>(`/discount-plans/${id}`, { method: "DELETE" }),
  },

  marketing: {
    packages: () => req<ApiMarketingPackage[]>("/marketing/packages"),
    campaigns: () => req<ApiMarketingCampaign[]>("/marketing/campaigns"),
    createCampaign: (packageId: string) =>
      req<ApiMarketingCampaign>("/marketing/campaigns", {
        method: "POST",
        body: JSON.stringify({ packageId }),
      }),
  },

  deliveryPrices: {
    list: () => req<ApiDeliveryPrice[]>("/delivery-prices"),
  },

  am: {
    orders: (params: { vendor?: string; status?: string; dateFrom?: string; dateTo?: string } = {}) =>
      req<AmOrder[]>(`/am/orders${qs(params as Record<string, string>)}`),
    updateOrderStatus: (orderNumber: string, status: string) =>
      req<AmOrder>(`/am/orders/${orderNumber}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
    updateOrderAgent: (orderNumber: string, agent: string, fulfillment?: string) =>
      req<AmOrder>(`/am/orders/${orderNumber}/agent`, { method: "PATCH", body: JSON.stringify({ agent, fulfillment }) }),
    pendingProducts: () => req<AmProduct[]>("/am/pending-products"),
    approveProduct: (id: string) =>
      req<AmProduct>(`/am/pending-products/${id}/approve`, { method: "PATCH" }),
    rejectProduct: (id: string, reason: string) =>
      req<AmProduct>(`/am/pending-products/${id}/reject`, { method: "PATCH", body: JSON.stringify({ reason }) }),
    campaigns: () => req<AmCampaign[]>("/am/campaigns"),
    approveCampaign: (id: string) =>
      req<AmCampaign>(`/am/campaigns/${id}/approve`, { method: "PATCH" }),
    log: (params: { action?: string; search?: string; dateFrom?: string; dateTo?: string } = {}) =>
      req<AmLogEntry[]>(`/am/log${qs(params as Record<string, string>)}`),
  },
};
