export type Product = {
  id: string;
  name: string;
  price_in_cents: number;
  currency: 'COP';
  stock: number;
  image_url?: string | null;
  description?: string;
  category_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type CartItem = {
  product_id: string;
  name: string;
  price_in_cents: number;
  qty: number;
  image_url?: string | null;
};

export type AppTransaction = {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR';
  amountInCents: number;
  currency: 'COP';
  productId: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
  card_brand?: 'VISA' | 'MASTERCARD';
  card_last4?: string;
  error_message?: string;
};

export type Category = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type CheckoutDto = {
  productId: string;
  email: string;
  amountInCents: number;
  installments?: number;
  card: {
    number: string;
    cvc: string;
    exp_month: string;
    exp_year: string;
    card_holder: string;
  };
};

export type CheckoutResponse = {
  transaction: AppTransaction;
  wompi: {
    status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR';
    external_id: string;
    raw?: any;
  };
};