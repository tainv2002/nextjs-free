import envConfig from "@/config";
import { normalizePath } from "@/lib/utils";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { redirect } from "next/navigation";

type CustomOptions = RequestInit & { baseUrl?: string };
type CustomOptionsWithoutBody = Omit<CustomOptions, "body">;

const ENTITY_ERROR_STATUS = 422;
const UNAUTHORIZED_ERROR_STATUS = 401;

type EntityErrorPayload = {
  message: string;
  errors: { field: string; message: string }[];
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };

  constructor({ status, payload }: { status: number; payload: any }) {
    super("HTTP Error: ");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: 422;
  payload: EntityErrorPayload;

  constructor({
    payload,
    status,
  }: {
    payload: EntityErrorPayload;
    status: 422;
  }) {
    super({ status, payload });
    this.payload = payload;
    this.status = status;
  }
}

export const isClient = () => typeof window !== "undefined";

let clientLogoutRequest: Promise<any> | null = null;

const request = async <TPayload>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions
) => {
  const body = options?.body
    ? options.body instanceof FormData
      ? options.body
      : JSON.stringify(options.body)
    : undefined;
  const baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options?.body instanceof FormData) {
    delete (baseHeaders as any)["Content-Type"];
  }

  if (isClient()) {
    const sessionToken = localStorage.getItem("sessionToken");
    baseHeaders["sessionToken"] = sessionToken || "";
  }

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
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        }
      );
    } else if (res.status === UNAUTHORIZED_ERROR_STATUS) {
      if (isClient()) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            body: JSON.stringify({ force: true }),
            headers: { ...baseHeaders, ...options?.headers },
          });
          try {
            await clientLogoutRequest;
          } catch (error) {
          } finally {
            clientLogoutRequest = null;
            window.location.href = "/login";
            localStorage.removeItem("sessionToken");
          }
        }
      } else {
        const sessionToken = (options?.headers as any)?.sessionToken;

        redirect(`/logout?sessionToken=${sessionToken}`);
      }
    }

    throw new HttpError(data);
  }

  const normalizedUrl = normalizePath(url);

  if (isClient()) {
    if (
      ["auth/login", "auth/register"].some((item) => item === normalizedUrl)
    ) {
      localStorage.setItem(
        "sessionToken",
        (payload as LoginResType).data.token
      );
    } else if (["auth/logout"].includes(normalizedUrl)) {
      localStorage.removeItem("sessionToken");
    }
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
