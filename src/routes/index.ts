import { Router } from "express";
import createOrderController from "../controllers/CreateOrderController";
import deleteOrderController from "../controllers/DeleteOrderController";
import getAllOrdersController from "../controllers/GetAllOrdersContoller";
import getNumbersController from "../controllers/GetNumbersController";
import updateOrderController from "../controllers/UpdateOrderController";
import { isAuthtenticated } from "../middlewares/AuthMiddleware";
import { createOrderValidator } from '../validators/CreateOrderValidator';
import deleteOrderValidator from "../validators/DeleteOrderValidator";

const routes = Router();

routes
  .route('/numbers')
  .get(getNumbersController);

routes
  .route('/orders')
  .post(createOrderValidator , createOrderController);

routes
  .get('/orders', isAuthtenticated, getAllOrdersController)
  .delete('/orders/:id', deleteOrderValidator, isAuthtenticated, deleteOrderController)
  .put('/orders/:id', isAuthtenticated, updateOrderController);

export { routes }