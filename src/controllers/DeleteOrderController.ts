import { Request, Response } from "express";
import { NumberValueItem } from "../models/NumberModel";
import db from '../services/db';

const saveHistory = async (doc: any) => {
  try {
    await db.collection('ordersHistory').add({
      deletedAt: new Date(),
      ...doc
    });
  } catch (error: any) {
    console.error('Erro ao salvar historico de pedido: ', error);
  }
}

const updateNumberList = async (numbers: Number[]) => {
  const numbersRef = db.collection('numbers').doc('nums');
  await db.runTransaction(async (transaction) => {
    return transaction.get(numbersRef).then((numbersDocs) => {
      if (!numbersDocs.exists) {
        throw 'Números não cadastrados!';
      }
      const numbersList = numbersDocs.data()?.values as NumberValueItem[];
      numbersList.forEach(n => {
        if (numbers.includes(n.number)) {
          n.inUse = false;
        }
      });
      transaction.update(numbersRef, { values: numbersList })
      return numbersList;
    })
  });
}

const deleteOrderController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const orderDoc = await db.collection('orders').doc(id).get();
    if (!orderDoc.exists) {
      return res
        .status(404)
        .send({ errors: [{ message: 'Pedido não encontrado!' }] });
    }

    if (orderDoc.data()?.confirmed) {
      return res
        .status(403)
        .send({ errors: [{ message: 'O pedido está confirmado, não será possível excluir-lo!' }] });
    }

    const numbers = orderDoc.data()?.numbers;
    const data = { orderId: orderDoc.id, ...orderDoc.data() };
    await orderDoc.ref.delete();

    await saveHistory(data);
    await updateNumberList(numbers);

    res.send();
  } catch(err : any) {
    res.status(500).send({ message: err.message || 'Erro ao excluir um pedido!' });
  }
}

export default deleteOrderController;