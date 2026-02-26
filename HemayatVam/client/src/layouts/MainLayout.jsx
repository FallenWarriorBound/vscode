import { Link, Outlet } from 'react-router-dom';

export default function MainLayout() {
  return <div className="min-h-screen p-4 max-w-5xl mx-auto">
    <nav className="flex gap-4 mb-4"><Link to="/">ثبت‌نام</Link><Link to="/dashboard">داشبورد</Link><Link to="/admin">ادمین</Link></nav>
    <Outlet/>
  </div>;
}
