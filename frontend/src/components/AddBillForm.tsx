'use client';

import { useState } from 'react';
import { addBill } from '@/services/api';

interface AddBillFormProps {
  onSuccess: () => void;
}

export default function AddBillForm({ onSuccess }: AddBillFormProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [reminderDays, setReminderDays] = useState('7'); // Default to 7 days
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !amount || !dueDate || !reminderDays) {
      setError('All fields are required');
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Amount must be a positive number');
      return;
    }

    if (isNaN(Number(reminderDays)) || Number(reminderDays) < 0) {
      setError('Reminder days must be a non-negative number');
      return;
    }

    setIsLoading(true);
    try {
      const dueDateUTC = new Date(dueDate + 'T00:00:00Z');
      const reminderDateUTC = new Date(dueDateUTC);
      reminderDateUTC.setUTCDate(dueDateUTC.getUTCDate() - Number(reminderDays));
      
      await addBill({ 
        name, 
        amount: Number(amount), 
        dueDate: dueDateUTC.toISOString(),
        reminderDate: reminderDateUTC.toISOString()
      });
      
      setName('');
      setAmount('');
      setDueDate('');
      setReminderDays('7');
      onSuccess();
    } catch (err) {
      console.error('Error adding bill:', err);
      setError('Failed to add bill. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-8">
      <h2 className="text-xl font-semibold">Add New Bill</h2>
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label htmlFor="name" className="block mb-2">Bill Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded text-gray-800"
        />
      </div>
      <div>
        <label htmlFor="amount" className="block mb-2">Amount</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0.01"
          step="0.01"
          className="w-full p-2 border rounded text-gray-800"
        />
      </div>
      <div>
        <label htmlFor="dueDate" className="block mb-2">Due Date</label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          className="w-full p-2 border rounded text-gray-800"
        />
      </div>
      <div>
        <label htmlFor="reminderDays" className="block mb-2">Remind Me (Days Before Due Date)</label>
        <input
          type="number"
          id="reminderDays"
          value={reminderDays}
          onChange={(e) => setReminderDays(e.target.value)}
          required
          min="0"
          className="w-full p-2 border rounded text-gray-800"
        />
      </div>
      <button 
        type="submit" 
        className="w-full bg-green-500 text-white p-2 rounded disabled:bg-green-300"
        disabled={isLoading}
      >
        {isLoading ? 'Adding...' : 'Add Bill'}
      </button>
    </form>
  );
}