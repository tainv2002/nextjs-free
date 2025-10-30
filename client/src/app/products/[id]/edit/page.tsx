import ProductForm from "../../_components/product-form";
import productApiRequest from "@/apiRequests/product";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EditProductPageProps {
  params: {
    id: string;
  };
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
    const result = await productApiRequest.getDetail(productId);
    product = result.payload.data;
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
