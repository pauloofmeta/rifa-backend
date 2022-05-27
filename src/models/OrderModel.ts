export interface OrderModel {
  name: string;
  phone: string;
  option: Number;
  numbers: Number[];
  confirmed: boolean;
  createdAt: Date;
}