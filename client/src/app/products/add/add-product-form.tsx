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
  CreateProductBody,
  CreateProductBodyType,
} from "@/schemaValidations/product.schema";
import productApiRequest from "@/apiRequests/product";
import { handleErrorApi } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Image from "next/image";

const AddProductForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<CreateProductBodyType>({
    resolver: zodResolver(CreateProductBody),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      image: "",
    },
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const imageFileUrl = useMemo(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }
    return "";
  }, [imageFile]);

  const onSubmit = async (values: CreateProductBodyType) => {
    try {
      const result = await productApiRequest.create(values);
      toast({
        title: "Success",
        description: result.payload.message,
      });
      router.push("/products");
      router.refresh();
    } catch (error: any) {
      handleErrorApi(error, form.setError);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full mx-4 max-w-[600px]"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter product name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter product price"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter product description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                  }
                }}
              />
              <FormControl>
                <Input
                  type="url"
                  placeholder="Enter image URL"
                  {...field}
                  className="hidden"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {imageFileUrl && (
          <div className="mt-4">
            <Image
              src={imageFileUrl}
              alt="Selected Image"
              width={300}
              height={300}
            />
          </div>
        )}
        <Button
          type="submit"
          className="w-full !mt-10"
          disabled={form.formState.isSubmitting}
        >
          Add Product
        </Button>
      </form>
    </Form>
  );
};

export default AddProductForm;
