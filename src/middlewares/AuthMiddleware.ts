import { Request, Response, NextFunction } from "express";
import app from '../config/firebase-config';
import { getAuth } from 'firebase-admin/auth';

interface AuthRequest extends Request {
  userId: string;
  jwtToken: string;
}

const getAuthToken = (req: Request) => {
  if (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  } else {
    return null;
  }
}

export const isAuthtenticated = async (req: Request, res: Response, next: NextFunction) => {
  const jwtToken = getAuthToken(req);
  if (!jwtToken) {
    return res.status(401).send({ errors: [{ message: 'Jwt bearer token not be empty!' }] });
  }

  try {
    const authApp = getAuth(app);
    const userInfo = await authApp.verifyIdToken(jwtToken!!);
    const authRequest = req as AuthRequest;
    authRequest.userId = userInfo.uid;
    authRequest.jwtToken = jwtToken!!;
    return next();
  } catch(error: any) {
    return res.status(401).send({ errors: [{ message: error.message || 'Erro ao validar token!' }] });
  }
}