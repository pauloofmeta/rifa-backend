import { Request, Response } from "express";
import { NumberValueItem } from "../models/NumberModel";
import db from '../services/db';

const checkNumbersConfirmed = async (numbers: any) => {
  const exists = await db
      .collection('orders')
      .where('numbers', 'array-contains-any', numbers)
      .get();
  return exists.size > 0;
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
          n.inUse = true;
        }
      });
      transaction.update(numbersRef, { values: numbersList })
      return numbersList;
    })
  });
}

const createOrderController = async (req: Request, res: Response) => {
  const { name, phone, option, numbers } = req.body;
  try {
    const hasConfirmed = await checkNumbersConfirmed(numbers);
    if (hasConfirmed) {
      return res
        .status(422)
        .send({ errors: [{ msg: 'Número(s) já utilizados!' }] });
    }

    const newOrder = {
      name,
      phone,
      option,
      numbers,
      confirmed: false,
      createdAt: new Date()
    };

    const created = await db
      .collection('orders')
      .add(newOrder);

    try {
      await updateNumberList(numbers);
    } catch (err: any) {
      await db.collection('orders').doc(created.id).delete();
      return res.status(500).send({ message: err.message || 'Ocorreu um erro ao incluir o pedido da rifa' });
    }

    return res.send({ id: created.id, ...newOrder })
  } catch (error: any) {
    return res.status(500).send({ message: error.message || 'Ocorreu um erro ao incluir o pedido da rifa' });
  }
}

export default createOrderController;