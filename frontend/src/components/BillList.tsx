'use client';

import { FaTrash, FaCheck } from 'react-icons/fa';
import { deleteBill, updateBill } from '@/services/api';

interface Bill {
  _id: string;
  name: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
}

interface BillListProps {
  bills: Bill[];
  onBillUpdate: () => void;
}

export default function BillList({ bills, onBillUpdate }: BillListProps) {
  const handleDelete = async (id: string) => {
    try {
      await deleteBill(id);
      onBillUpdate();
    } catch (err) {
      console.error('Error deleting bill:', err);
    }
  };

  const handleTogglePaid = async (id: string, isPaid: boolean) => {
    try {
      await updateBill(id, { isPaid: !isPaid });
      onBillUpdate();
    } catch (err) {
      console.error('Error updating bill:', err);
    }
  };

  if (bills.length === 0) return <div className="text-center py-4">No bills found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-600">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Due Date</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill._id} className="border-b dark:border-gray-600">
              <td className="px-4 py-2">{bill.name}</td>
              <td className="px-4 py-2">${bill.amount.toFixed(2)}</td>
              <td className="px-4 py-2">{new Date(bill.dueDate).toLocaleDateString()}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded-full text-xs ${bill.isPaid ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                  {bill.isPaid ? 'Paid' : 'Unpaid'}
                </span>
              </td>
              <td className="px-4 py-2">
                <button 
                  onClick={() => handleTogglePaid(bill._id, bill.isPaid)}
                  className={`mr-2 p-1 rounded ${bill.isPaid ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                  title={bill.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
                >
                  <FaCheck />
                </button>
                <button 
                  onClick={() => handleDelete(bill._id)}
                  className="p-1 rounded bg-red-500 hover:bg-red-600 text-white"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}