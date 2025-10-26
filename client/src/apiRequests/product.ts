import http from "@/lib/http";
import {
  CreateProductBodyType,
  ProductResType,
  ProductListResType,
  UpdateProductBodyType,
} from "@/schemaValidations/product.schema";

const productApiRequest = {
  create: (body: CreateProductBodyType) =>
    http.post<ProductResType>("/products", body),
  getList: () => http.get<ProductListResType>("/products"),
  getDetail: (id: number) => http.get<ProductResType>(`/products/${id}`),
  update: (id: number, body: UpdateProductBodyType) =>
    http.put<ProductResType>(`/products/${id}`, body),
  delete: (id: number) => http.delete<ProductResType>(`/products/${id}`),
};

export default productApiRequest;
