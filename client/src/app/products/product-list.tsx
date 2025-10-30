import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ProductListResType } from "@/schemaValidations/product.schema";
import ProductDeleteButton from "./product-delete-button";

interface ProductListProps {
  products: ProductListResType["data"];
}

export default function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">No products found</p>
        <Link href="/products/add">
          <Button>Add your first product</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <>
          <div className="relative h-48 w-full bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              className="object-cover"
              width={150}
              height={150}
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-2xl font-bold text-primary mb-2">
              ${product.price}
            </p>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {product.description}
            </p>
            <div className="flex gap-2">
              <Link href={`/products/${product.id}/edit`} className="flex-1">
                <Button variant="outline" className="w-full">
                  Edit
                </Button>
              </Link>
              <ProductDeleteButton productId={product.id} />
            </div>
          </div>
        </>
      ))}
    </div>
  );
}
