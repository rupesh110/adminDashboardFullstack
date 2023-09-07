import express from 'express';
import { 
    getProducts, 
    getCustomers, 
    getTransactions, 
    getGeography, 
    getParticipants 
} from '../controllers/client.js';


const router = express.Router();

router.get('/products', getProducts);
router.get('/customers', getCustomers)
router.get("/transactions", getTransactions)
router.get("/geography", getGeography)
router.get('/participants', getParticipants)

export default router;