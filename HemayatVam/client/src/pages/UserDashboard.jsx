import NotificationBell from '../components/NotificationBell';
import PaymentModal from '../components/PaymentModal';

export default function UserDashboard() {
  return <div className="space-y-4">
    <div className="flex justify-between items-center"><h1 className="text-xl font-bold">داشبورد کاربر</h1><NotificationBell/></div>
    <div className="grid md:grid-cols-4 gap-2">
      {['کیف پول','سرمایه‌گذاری','وام‌ها','تنظیمات'].map(t => <div key={t} className="p-3 rounded bg-white dark:bg-slate-800">{t}</div>)}
    </div>
    <PaymentModal/>
  </div>;
}
