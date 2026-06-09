const BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` }
}

// ─── Products ────────────────────────────────────────────────
export const getProducts = (params?: Record<string, string | number>) =>
  request<any>(`/api/products?${new URLSearchParams(params as any)}`)

export const getProduct = (id: string | number) =>
  request<any>(`/api/products/${id}`)

export const getCategories = () =>
  request<any[]>('/api/categories')

// ─── Settings ───────────────────────────────────────────────
export const getSettings = () =>
  request<any>('/api/settings')

// ─── Blog (Django) ──────────────────────────────────────────
export interface DjangoBlogPost {
  id: number
  title: string
  slug: string
  content: string
  featured_image: string | null
  published_at: string | null
  is_published: boolean
  created_at: string
}

export const getDjangoBlogs = () =>
  request<DjangoBlogPost[]>('/api/blog/posts')

export const getDjangoBlog = (slug: string) =>
  request<DjangoBlogPost>(`/api/blog/posts/${slug}`)

// ─── Auth ───────────────────────────────────────────────────
export const sendOtp = (phone: string) =>
  request<{ detail: string }>('/api/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ phone_number: phone }),
  })

export const verifyOtp = (phone: string, code: string) =>
  request<{ access: string; refresh: string }>('/api/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phone_number: phone, code }),
  })

export const login = (phone: string, password: string) =>
  request<{ access: string; refresh: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone_number: phone, password }),
  })

export const getProfile = (token: string) =>
  request<any>('/api/auth/profile', { headers: authHeaders(token) })

export const updateProfile = (token: string, data: any) =>
  request<any>('/api/auth/profile', {
    method: 'PATCH', body: JSON.stringify(data), headers: authHeaders(token),
  })

export const changePassword = (token: string, data: any) =>
  request<any>('/api/auth/change-password', {
    method: 'POST', body: JSON.stringify(data), headers: authHeaders(token),
  })

export const forgotPassword = (phone: string) =>
  request<{ detail: string }>('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ phone_number: phone }),
  })

export const resetPassword = (phone: string, code: string, newPassword: string) =>
  request<{ access: string; refresh: string }>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ phone_number: phone, code, new_password: newPassword }),
  })

// ─── Addresses ──────────────────────────────────────────────
export const getAddresses = (token: string) =>
  request<any[]>('/api/auth/addresses', { headers: authHeaders(token) })

export const addAddress = (token: string, data: any) =>
  request<any>('/api/auth/addresses', {
    method: 'POST', body: JSON.stringify(data), headers: authHeaders(token),
  })

// ─── Shipping ───────────────────────────────────────────────
export const getProvinces = () =>
  request<any[]>('/api/shipping/provinces')

export const getCities = (provinceId: number) =>
  request<any[]>(`/api/shipping/provinces/${provinceId}/cities`)

export const calculateShipping = (data: any) =>
  request<any>('/api/shipping/calculate', { method: 'POST', body: JSON.stringify(data) })

// ─── Orders ─────────────────────────────────────────────────
export const createOrder = (token: string, data: any) =>
  request<any>('/api/orders', {
    method: 'POST', body: JSON.stringify(data), headers: authHeaders(token),
  })

export const getOrders = (token: string) =>
  request<any[]>('/api/auth/orders', { headers: authHeaders(token) })

export const getOrder = (token: string, id: string) =>
  request<any>(`/api/auth/orders/${id}`, { headers: authHeaders(token) })

export const cancelOrder = (token: string, id: string) =>
  request<any>(`/api/auth/orders/${id}/cancel`, {
    method: 'POST', headers: authHeaders(token),
  })

// ─── Payment ─────────────────────────────────────────────────
export const initiatePayment = (token: string, orderId: string) =>
  request<any>('/api/payment/initiate', {
    method: 'POST', body: JSON.stringify({ order_id: orderId }), headers: authHeaders(token),
  })
