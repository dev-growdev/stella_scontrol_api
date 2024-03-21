export class ProductDto {
  uid: string;
  code: number;
  name: string;
  enable: boolean;
  description?: string;
  measurement?: string;
  quantity?: number;
  category?: {
    uid: string;
    name: string;
    enable: boolean;
  };
}
