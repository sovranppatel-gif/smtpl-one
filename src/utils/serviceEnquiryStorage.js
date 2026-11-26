import { API_URL } from "./api.js";
import { getMasterAdminToken } from "./masterAdminAuth.js";

function baseUrl() {
  return `${API_URL}/api/service-enquiries`;
}

function adminHeaders() {
  const token = getMasterAdminToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function submitServiceEnquiry(payload) {
  const response = await fetch(baseUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    const err = new Error(
      data.message || "Unable to submit service enquiry right now."
    );
    err.status = response.status;
    err.referenceCode = data.referenceCode || "";
    throw err;
  }
  return data.enquiry;
}

export async function getServiceEnquiries({
  page = 1,
  limit = 10,
  q = "",
  status = "",
  serviceSlug = "",
  unreadOnly = false,
} = {}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (q.trim()) params.set("q", q.trim());
  if (status) params.set("status", status);
  if (serviceSlug) params.set("serviceSlug", serviceSlug);
  if (unreadOnly) params.set("unreadOnly", "true");

  const response = await fetch(`${baseUrl()}?${params.toString()}`, {
    method: "GET",
    headers: adminHeaders(),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to load service enquiries.");
  }
  return data;
}

export async function getServiceEnquiryById(id) {
  const response = await fetch(`${baseUrl()}/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: adminHeaders(),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to load service enquiry.");
  }
  return data.entry;
}

export async function getServiceEnquiryAssignees() {
  const response = await fetch(`${baseUrl()}/assignees`, {
    method: "GET",
    headers: adminHeaders(),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to load assignable users.");
  }
  return Array.isArray(data.users) ? data.users : [];
}

export async function updateServiceEnquiry(id, payload) {
  const response = await fetch(`${baseUrl()}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to update service enquiry.");
  }
  return data.entry;
}
