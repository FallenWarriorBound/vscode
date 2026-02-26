import { useState } from 'react';
import NotificationBell from '../components/NotificationBell';
import PaymentModal from '../components/PaymentModal';

const tabs = ['کیف پول', 'سرمایه‌گذاری', 'وام‌ها', 'تنظیمات'];

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('کیف پول');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">داشبورد کاربر</h1>
        <NotificationBell />
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded ${activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 rounded bg-white dark:bg-slate-800">تب فعال: {activeTab}</div>
      <PaymentModal />
    </div>
  );
}
