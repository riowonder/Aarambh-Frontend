import { Outlet } from 'react-router-dom';

export default function UserLayout() {
  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <main className="flex-1 p-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
