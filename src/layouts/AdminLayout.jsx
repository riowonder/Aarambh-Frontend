import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <main className="admin-root flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
} 