import { Request, Response, NextFunction } from "express";
import { check, CustomSanitizer, validationResult } from "express-validator";

const especialSanitize: CustomSanitizer = value => {
  return value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/\s]/gi, '');
}

export const createOrderValidator = [
  check('name')
    .notEmpty()
    .withMessage('O nome dever ser informado!')
    .bail(),
  check('phone')
    .customSanitizer(especialSanitize)
    .trim(' ')
    .escape()
    .not()
    .notEmpty()
    .withMessage('O telefone dever ser informado!')
    .bail()
    .isLength({ max: 11, min: 11 })
    .withMessage('O telefone deve ter 11 digítos!')
    .bail(),
  check('option')
    .notEmpty()
    .withMessage('A opção deve ser informada!')
    .bail()
    .isInt({ min: 1, max: 2 })
    .withMessage('Opção invalída, deve informar 1 para pix ou 2 para frauda!')
    .bail(),
  check('numbers')
    .notEmpty()
    .withMessage('Os números devem ser informados!')
    .bail()
    .isArray()
    .withMessage('Os números deve ser uma lista!'),
  check('numbers.*')
    .notEmpty()
    .isNumeric()
    .withMessage('O número deve ser informado!'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  }
];