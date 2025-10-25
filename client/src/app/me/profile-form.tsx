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
import {
  UpdateMeBody,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
import accountApiRequest from "@/apiRequests/account";
import { handleErrorApi } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Props {
  initialData: UpdateMeBodyType;
}

const ProfileForm = ({ initialData }: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: initialData,
  });

  const onSubmit = async (values: UpdateMeBodyType) => {
    try {
      const result = await accountApiRequest.updateMe(values);
      toast({
        title: "Success",
        description: result.payload.message,
      });
      router.refresh();
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter your name" {...field} />
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
          Update Profile
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
