import AddProductForm from "./add-product-form";

export default function AddProductPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
        <AddProductForm />
      </div>
    </div>
  );
}
