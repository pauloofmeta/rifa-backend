import { NextFunction, Request, Response } from "express";
import { param, validationResult,  } from "express-validator";

const deleteOrderValidator = [
  param('id')
    .notEmpty()
    .withMessage('O id é obrigatorio!')
    .bail(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  }
];

export default deleteOrderValidator;