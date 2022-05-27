import { Request, Response } from "express";
import { NumberValue } from "../models/NumberModel";
import db from '../services/db';

const getNumbersController = async (req: Request, res: Response) => {
  try {
    const numberList = await db.collection('numbers').doc('nums').get();

    const { values } = numberList.data() as NumberValue;

    return res.send(values);
  } catch (err: any) {
    return res.status(500).send({message: err.message || 'Erro ao obter números!'});
  }
}

export default getNumbersController;