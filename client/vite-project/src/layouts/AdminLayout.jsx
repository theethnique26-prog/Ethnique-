import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

function AdminLayout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8F6F3] dark:bg-[#0E0612] text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;