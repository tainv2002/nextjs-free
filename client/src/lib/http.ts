import envConfig from "@/config";
import { LoginResType } from "@/schemaValidations/auth.schema";

type CustomOptions = RequestInit & { baseUrl?: string };
type CustomOptionsWithoutBody = Omit<CustomOptions, "body">;

class HttpError extends Error {
  status: number;
  payload: any;

  constructor({ status, payload }: { status: number; payload: any }) {
    super("HTTP Error: ");
    this.status = status;
    this.payload = payload;
  }
}

class SessionToken {
  private token = "";

  get value() {
    return this.token;
  }

  set value(token: string) {
    if (typeof window === "undefined") {
      throw new Error("SessionToken can only be set in a browser environment");
    }
    this.token = token;
  }
}

export const clientSessionToken = new SessionToken();

const request = async <TPayload>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  const baseHeaders = {
    "Content-Type": "application/json",
    Authorization: clientSessionToken.value
      ? `Bearer ${clientSessionToken.value}`
      : "",
  };
  const baseUrl = options?.baseUrl ?? envConfig.NEXT_PUBLIC_API_ENDPOINT;
  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    method,
    headers: { ...baseHeaders, ...options?.headers },
    body,
  });

  const payload: TPayload = await res.json();
  const data = {
    status: res.status,
    payload,
  };

  if (!res.ok) {
    throw new HttpError(data);
  }

  if (["/auth/login", "/auth/register"].includes(url)) {
    clientSessionToken.value = (payload as LoginResType).data.token;
  } else if (["/auth/logout"].includes(url)) {
    clientSessionToken.value = "";
  }

  return data;
};

const http = {
  get: <T>(url: string, options?: CustomOptionsWithoutBody) =>
    request<T>("GET", url, options),
  post: <T>(url: string, body?: any, options?: CustomOptionsWithoutBody) =>
    request<T>("POST", url, { ...options, body }),
  put: <T>(url: string, body?: any, options?: CustomOptionsWithoutBody) =>
    request<T>("PUT", url, { ...options, body }),
  delete: <T>(url: string, options?: CustomOptionsWithoutBody) =>
    request<T>("DELETE", url, options),
};

export default http;
