import ProductForm from "../../_components/product-form";
import productApiRequest from "@/apiRequests/product";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { cache } from "react";

interface EditProductPageProps {
  params: {
    id: string;
  };
}

// Cache the product fetch to avoid duplicate requests
const getProduct = cache(async (productId: number) => {
  const result = await productApiRequest.getDetail(productId);
  return result.payload.data;
});

export async function generateMetadata({
  params,
}: EditProductPageProps): Promise<Metadata> {
  const productId = Number(params.id);

  try {
    const product = await getProduct(productId);

    return {
      title: `Edit ${product.name}`,
      description: `Edit product: ${product.name}`,
    };
  } catch (error) {
    return {
      title: "Edit Product",
      description: "Edit product details",
    };
  }
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const productId = Number(params.id);

  if (isNaN(productId)) {
    notFound();
  }

  let product;

  try {
    product = await getProduct(productId);
  } catch (error) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-[600px] mb-6">
          <Link href={`/products/${productId}`}>
            <Button variant="outline">← Back to Product</Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
        <ProductForm
          productId={productId}
          initialData={{
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
          }}
        />
      </div>
    </div>
  );
}
