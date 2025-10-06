"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import authApiRequests from "@/apiRequests/auth";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";

const LoginForm = () => {
  const router = useRouter();
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginBodyType) => {
    try {
      const result = await authApiRequests.login(values);

      await authApiRequests.auth({
        sessionToken: result.payload.data.token,
      });

      router.push("/me");
    } catch (error: any) {
      handleErrorApi(error, form.setError);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 w-full mx-4 max-w-[600px]"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full !mt-10"
          disabled={form.formState.isSubmitting}
        >
          Login
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
