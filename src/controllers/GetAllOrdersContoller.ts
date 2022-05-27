import { Request, Response } from "express";
import { Timestamp } from "firebase-admin/firestore";
import db from '../services/db';

interface OrderFirebaseModel {
  id: string;
  name: string;
  phone: string;
  confirmed: boolean;
  option: Number;
  numbers: Number[];
  createdAt: Timestamp;
}

const getAllOrdersController = async (req: Request, res: Response) => {
  try {
    const list = await db.collection('orders').get();

    const results: any = [];
    list.forEach((doc) => {
      const data = { id: doc.id, ...doc.data() } as OrderFirebaseModel;

      results.push({ 
        id: data.id,
        name: data.name,
        phone: data.phone,
        confirmed: data.confirmed,
        option: data.option,
        createdAt: data.createdAt?.toDate(),
        numbers: data.numbers
      });
    });

    return res.json(results);
  } catch (error: any) {
    return res.status(500).send({ message: error.message || 'Erro ao consultar os pedidos da rifa!' });
  }
}

export default getAllOrdersController;