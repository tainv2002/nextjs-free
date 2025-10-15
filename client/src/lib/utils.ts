import { toast } from "@/hooks/use-toast";
import { EntityError } from "@/lib/http";
import { type ClassValue, clsx } from "clsx";
import { ErrorOption, UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleErrorApi = (
  error: any,
  setError?: UseFormSetError<any>,
  duration?: number
) => {
  if (error instanceof EntityError) {
    error.payload.errors.forEach((err) => {
      setError?.(err.field, {
        message: err.message,
        type: "server",
      });
    });
  } else {
    toast({
      title: "Lỗi",
      description: error?.payload?.message || "Đã có lỗi xảy ra",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};

export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const decodeJwt = <Payload = any>(token: string) => {
  return jwt.decode(token) as Payload;
};
