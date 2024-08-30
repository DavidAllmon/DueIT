const express = require('express');
const router = express.Router();
const { getBills, addBill, updateBill, deleteBill } = require('../controllers/billController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getBills)
  .post(addBill);

router.route('/:id')
  .put(updateBill)
  .delete(deleteBill);

module.exports = router;