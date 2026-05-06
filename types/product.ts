export interface Product {
  id?: string;
  name: string;
  description: string;

  pricing: {
    mrp: number;
    sellingPrice: number;
    discountPercent: number;
  };

  variants: {
    colors: string[];
    sizes: string[];
  };

  attributes: {
    fit: string;
    fabric: string;
    neck: string;
    sleeve: string;
  };

  highlights: string[];

  images: string[];
  createdAt: Date;
}