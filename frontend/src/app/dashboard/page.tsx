'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BillList from '@/components/BillList';
import AddBillForm from '@/components/AddBillForm';
import { FaPlus, FaChartLine, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { getBills } from '@/services/api';

interface Bill {
  _id: string;
  name: string;
  amount: number;
  dueDate: string;
  reminderDate: string;
  isPaid: boolean;
}

export default function DashboardPage() {
  const [showAddBillForm, setShowAddBillForm] = useState(false);
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await getBills();
      setBills(response.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const totalDue = bills.reduce((sum, bill) => sum + (bill.isPaid ? 0 : bill.amount), 0);
  const totalPaid = bills.reduce((sum, bill) => sum + (bill.isPaid ? bill.amount : 0), 0);
  const billsThisMonth = bills.filter(bill => {
    const dueDate = new Date(bill.dueDate);
    const now = new Date();
    return dueDate.getMonth() === now.getMonth() && dueDate.getFullYear() === now.getFullYear();
  }).length;
  const overdueBills = bills.filter(bill => {
    return !bill.isPaid && new Date(bill.dueDate) < new Date();
  }).length;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Total Due"
            value={`$${totalDue.toFixed(2)}`}
            icon={<FaChartLine className="text-blue-500" />}
          />
          <DashboardCard
            title="Total Paid"
            value={`$${totalPaid.toFixed(2)}`}
            icon={<FaCheckCircle className="text-green-500" />}
          />
          <DashboardCard
            title="Bills This Month"
            value={billsThisMonth.toString()}
            icon={<FaCalendarAlt className="text-yellow-500" />}
          />
          <DashboardCard
            title="Overdue Bills"
            value={overdueBills.toString()}
            icon={<FaCalendarAlt className="text-red-500" />}
          />
        </div>

        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Bills</h2>
            <button
              onClick={() => setShowAddBillForm(!showAddBillForm)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center"
            >
              <FaPlus className="mr-2" />
              Add Bill
            </button>
          </div>
          
          {showAddBillForm && (
            <div className="mb-6">
              <AddBillForm onSuccess={() => {
                setShowAddBillForm(false);
                fetchBills();
              }} />
            </div>
          )}

          <BillList bills={bills} onBillUpdate={fetchBills} />
        </div>
      </div>
    </>
  );
}

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function DashboardCard({ title, value, icon }: DashboardCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
      <div className="mr-4">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}