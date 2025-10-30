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
import { useEffect, useState } from "react";
import Image from "next/image";

interface ProductFormProps {
  productId?: number;
  initialData?: CreateProductBodyType;
}

const ProductForm = ({ productId, initialData }: ProductFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!productId;

  const form = useForm<CreateProductBodyType>({
    resolver: zodResolver(CreateProductBody),
    defaultValues: initialData || {
      name: "",
      price: 0,
      description: "",
      image: "",
    },
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string>(
    initialData?.image || ""
  );

  const onSubmit = async (values: CreateProductBodyType) => {
    try {
      let imageUrl = values.image;

      // Upload new image if file is selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const imageRes = await productApiRequest.uploadImage(formData);
        imageUrl = imageRes?.payload?.data;
      }

      const productData = {
        ...values,
        image: imageUrl,
      };

      let result;
      if (isEditing) {
        result = await productApiRequest.update(productId, productData);
      } else {
        result = await productApiRequest.create(productData);
      }

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

  useEffect(() => {
    return () => {
      if (imageFileUrl && imageFileUrl !== initialData?.image) {
        URL.revokeObjectURL(imageFileUrl);
      }
    };
  }, [imageFileUrl, initialData?.image]);

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
              <FormLabel>Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setImageFile(file);
                  const imageUrl = URL.createObjectURL(file);
                  setImageFileUrl(imageUrl);
                  form.setValue("image", imageUrl);
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
            <p className="text-sm text-muted-foreground mb-2">Preview:</p>
            <div className="relative w-[300px] h-[300px]">
              <Image
                src={imageFileUrl}
                alt="Product Image"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        )}
        <Button
          type="submit"
          className="w-full !mt-10"
          disabled={form.formState.isSubmitting}
        >
          {isEditing ? "Update Product" : "Add Product"}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;
