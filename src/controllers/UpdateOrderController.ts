import { Request, Response } from 'express';
import { OrderModel } from '../models/OrderModel';
import db from '../services/db';

interface UpdateOrderModel {
  confirmed: boolean;
}

const updateOrderController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { confirmed } = req.body as UpdateOrderModel;
  try
  {
    const orderRef = db.collection('orders').doc(id);
    const orderDoc = await orderRef.get();
    
    if (!orderDoc.exists)
      return res.status(404).send({ errors: [{ message: 'Documento não existe!' }] });

    await orderRef.update({
      confirmed
    });

    const order = orderDoc.data() as OrderModel;
    order.confirmed = confirmed;

    return res.send({ id: orderDoc.id, ...order })
  } catch(error: any) {
    return res.status(500).send({ message: error.message || 'Erro ao atualziar o pedido!' });
  }
}

export default updateOrderController;