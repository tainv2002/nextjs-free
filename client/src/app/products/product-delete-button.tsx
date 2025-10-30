"use client";
import { Button } from "@/components/ui/button";
import productApiRequest from "@/apiRequests/product";
import { handleErrorApi } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface ProductDeleteButtonProps {
  productId: number;
}

export default function ProductDeleteButton({
  productId,
}: ProductDeleteButtonProps) {
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async (event: any) => {
    event.stopPropagation();
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await productApiRequest.delete(productId);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      router.refresh();
    } catch (error: any) {
      handleErrorApi(error);
    }
  };

  return (
    <Button variant="destructive" className="flex-1" onClick={handleDelete}>
      Delete
    </Button>
  );
}
