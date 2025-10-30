import { Button } from "@/components/ui/button";
import productApiRequest from "@/apiRequests/product";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDeleteButton from "../product-delete-button";

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const productId = Number(params.id);

  let product;

  try {
    const result = await productApiRequest.getDetail(productId);
    product = result.payload.data;
  } catch (error) {}

  if (!product) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">Product not found</p>
        <Link href="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/products">
            <Button variant="outline">← Back to Products</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              className="object-cover"
              priority
              fill
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-3xl font-bold text-primary">
                ${product.price}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Created: {new Date(product.createdAt).toLocaleDateString()}</p>
              <p>
                Last updated: {new Date(product.updatedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-auto">
              <Link href={`/products/${product.id}/edit`} className="flex-1">
                <Button className="w-full" variant="default">
                  Edit Product
                </Button>
              </Link>
              <ProductDeleteButton productId={product.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
