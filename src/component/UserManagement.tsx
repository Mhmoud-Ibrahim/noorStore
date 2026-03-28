import { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from '../component/api';
import { MainContext } from '../component/mainContext.tsx';
import { toast } from 'react-toastify';
import Loading from './Loading.tsx';


interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  userImage?: string;
}

export default function UserManagement() {
  const context = useContext(MainContext);
  const currentUser = context?.user;

  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // جلب المستخدمين من الباك إند
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/user?page=${page}&limit=10`);
      setUsers(res.data.users);
    } catch (err) {
      toast.error("فشل في تحميل قائمة المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  // دالة الحذف
  const handleDelete = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    try {
      await api.delete(`/api/user/${id}`);
      setUsers(users.filter(u => u._id !== id));
      toast.success("تم حذف المستخدم بنجاح");
    } catch (err) {
      toast.error("عفواً، لا تملك الصلاحية أو حدث خطأ");
    }
  };

  // دالة تغيير الدور (Update Role)
  const handleChangeRole = async (id: string, newRole: string) => {
    try {
      const res = await api.patch(`/api/user/${id}`, { role: newRole });
      if (res.data.message === "success") {
        setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
        toast.success("تم تحديث الدور بنجاح");
      }
    } catch (err) {
      toast.error("فشل في تحديث الدور");
    }
  };

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'employee') {
    return <div className="text-center mt-5 text-white">عفواً، لا تملك صلاحية الوصول لهذه الصفحة.</div>;
  }

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: '#121212', color: '#fff' }}>
      <Helmet><title>لوحة الإدارة | إدارة المستخدمين</title></Helmet>

      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold"><i className="fas fa-users-cog text-warning me-2"></i> إدارة <span style={{ color: '#ff6600' }}>المستخدمين</span></h2>
          <span className="badge bg-dark border border-secondary px-3 py-2">إجمالي المسجلين: {users.length}</span>
        </div>

        {loading ? <Loading /> : (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="table-responsive rounded-4 shadow-lg p-3" 
            style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
          >
            <table className="table table-dark table-hover align-middle mb-0">
              <thead className="text-secondary">
                <tr>
                  <th>المستخدم</th>
                  <th>البريد الإلكتروني</th>
                  <th>الصلاحية</th>
                  <th className="text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {users.map((u) => (
                    <motion.tr key={u._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img 
                            src={u.userImage || 'https://via.placeholder.com'} 
                            className="rounded-circle border border-secondary" 
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
                            alt="" 
                          />
                          <span className="fw-bold">{u.name}</span>
                        </div>
                      </td>
                      <td className="text-secondary">{u.email}</td>
                      <td>
                        <select 
                          className="form-select form-select-sm bg-dark text-white border-secondary shadow-none"
                          style={{ width: '120px' }}
                          value={u.role}
                          onChange={(e) => handleChangeRole(u._id, e.target.value)}
                          disabled={currentUser?.role !== 'admin'} // الموظف لا يغير الأدوار
                        >
                          <option value="user">User</option>
                          <option value="employee">Employee</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button 
                            onClick={() => handleDelete(u._id)} 
                            className="btn btn-sm btn-outline-danger border-0"
                            disabled={u._id === currentUser?._id} // لا يمكن حذف نفسك
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-4 gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn btn-sm btn-dark border-secondary px-3">السابق</button>
          <button onClick={() => setPage(p => p + 1)} className="btn btn-sm btn-dark border-secondary px-3 text-warning">التالي</button>
        </div>
      </div>

      <style>{`
        .table-hover tbody tr:hover { background-color: #252525 !important; }
        .form-select:focus { border-color: #ff6600; }
      `}</style>
    </div>
  );
}
