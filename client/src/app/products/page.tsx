import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductList from "./product-list";
import productApiRequest from "@/apiRequests/product";
import { ProductListResType } from "@/schemaValidations/product.schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
};

export default async function ProductsPage() {
  let products: ProductListResType["data"] = [];

  try {
    const result = await productApiRequest.getList();
    products = result.payload.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products</h1>
          <Link href="/products/add">
            <Button>Add Product</Button>
          </Link>
        </div>
        <ProductList products={products} />
      </div>
    </div>
  );
}
