const Bill = require('../models/billModel');

exports.getBills = async (req, res) => {
  try {
    const bills = await Bill.find({ user: req.user._id });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addBill = async (req, res) => {
  try {
    const { name, amount, dueDate } = req.body;
    const reminderDate = new Date(dueDate);
    reminderDate.setDate(reminderDate.getDate() - 1); // Set reminder to 1 day before due date

    const bill = new Bill({
      user: req.user._id,
      name,
      amount,
      dueDate,
      reminderDate,
    });

    const createdBill = await bill.save();
    res.status(201).json(createdBill);
  } catch (error) {
    console.error('Error adding bill:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateBill = async (req, res) => {
  try {
    const { name, amount, dueDate, reminderDate, isPaid } = req.body;
    const bill = await Bill.findById(req.params.id);

    if (bill && bill.user.toString() === req.user._id.toString()) {
      bill.name = name || bill.name;
      bill.amount = amount || bill.amount;
      bill.dueDate = dueDate || bill.dueDate;
      bill.reminderDate = reminderDate || bill.reminderDate;
      bill.isPaid = isPaid !== undefined ? isPaid : bill.isPaid;

      const updatedBill = await bill.save();
      res.json(updatedBill);
    } else {
      res.status(404).json({ message: 'Bill not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    if (bill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized' });
    }

    await Bill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bill removed' });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};