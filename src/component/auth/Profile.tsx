
import { useContext, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { MainContext } from '../mainContext.tsx';
import { toast } from 'react-toastify';
import api from '../api';
import Loading from '../Loading.tsx';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function Profile() {
  const context = useContext(MainContext);
  if (!context) return null;
  const { user, setUser, loading } = context;

  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userId = user?._id || user?.userId;

  // فورم التعديل داخل البوب آب
  const formik = useFormik({
    initialValues: { name: user?.name || '', email: user?.email || '' },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().min(2, 'الاسم قصير').required('مطلوب'),
      email: Yup.string().email('بريد غير صالح').required('مطلوب'),
    }),
    onSubmit: async (values) => {
      try {
        const res = await api.patch(`/api/user/${userId}`, values);
        if (res.data.message === "success") {
          setUser(res.data.user);
          setShowModal(false);
          toast.success("تم التحديث بنجاح ✅");
        }
      } catch (err) {
        toast.error("فشل التحديث");
      }
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    const formData = new FormData();
    formData.append('userImage', file);
    try {
      setUploading(true);
      const res = await api.patch(`/api/user/${userId}`, formData);
      if (res.data.message === "success") {
        setUser(res.data.user);
        toast.success("تم تغيير الصورة 📸");
      }
    } catch (err) {
      toast.error("فشل الرفع");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-vh-100 py-5 text-white" style={{ backgroundColor: '#121212' }}>
      {loading ? <Loading /> : (
        <div className="container mt-5">
          <Helmet><title>حسابي | {user?.name}</title></Helmet>
          
          <div className="row g-4 justify-content-center">
            {/* الكارت الرئيسي للملف الشخصي */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="col-md-5 p-4 rounded-4 shadow-lg text-center"
              style={{ backgroundColor: '#1a1a1a', border: '1px solid #ff6600' }}
            >
              <div className="position-relative d-inline-block mb-3">
                <div className="rounded-circle overflow-hidden border border-3 border-warning shadow" style={{ width: '150px', height: '150px' }}>
                  <img src={user?.userImage } className="w-100 h-100 object-fit-cover" alt="profile" />
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="btn btn-sm position-absolute bottom-0 end-0 rounded-circle" style={{ backgroundColor: '#ff6600', color: '#000', width: '40px', height: '40px' }}>
                  {uploading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-camera"></i>}
                </button>
                <input type="file" hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
              </div>

              <h3 className="fw-bold mb-1" style={{ color: '#ff6600' }}>{user?.name}</h3>
              <p className="text-secondary small mb-3">{user?.email}</p>
              <span className="badge rounded-pill px-3 py-2 bg-secondary mb-4">{user?.role}</span>

              <div className="d-grid gap-2">
                <button onClick={() => setShowModal(true)} className="btn btn-outline-warning fw-bold">
                   تعديل البيانات الشخصية <i className="fas fa-edit ms-2"></i>
                </button>
              </div>
            </motion.div>

            {/* لوحة تحكم الإدارة (تظهر فقط للأدمن والموظف) */}
            {(user?.role === 'admin' || user?.role === 'employee') && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="col-md-5 p-4 rounded-4 shadow-lg"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #00c3ff' }}
              >
                <h4 className="fw-bold mb-4" style={{ color: '#00c3ff' }}>
                  <i className="fas fa-user-shield me-2"></i> لوحة الإدارة
                </h4>
                <div className="list-group list-group-flush">
                  <Link to="/userManagement" className="list-group-item list-group-item-action bg-transparent text-white border-secondary py-3 d-flex justify-content-between align-items-center">
                    <span><i className="fas fa-users-cog me-2 text-info"></i> إدارة المستخدمين</span>
                    <i className="fas fa-chevron-left small opacity-50"></i>
                  </Link>
                  <Link to="/productManagement" className="list-group-item list-group-item-action bg-transparent text-white border-secondary py-3 d-flex justify-content-between align-items-center">
                    <span><i className="fas fa-box me-2 text-info"></i> إدارة المنتجات</span>
                    <i className="fas fa-chevron-left small opacity-50"></i>
                  </Link>
                  <Link to="/orders" className="list-group-item list-group-item-action bg-transparent text-white border-0 py-3 d-flex justify-content-between align-items-center">
                    <span><i className="fas fa-shopping-cart me-2 text-info"></i> الطلبات الواردة</span>
                    <i className="fas fa-chevron-left small opacity-50"></i>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Pop-up التعديل (Modal) */}
      <AnimatePresence>
        {showModal && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              className="modal-dialog modal-dialog-centered"
            >
              <div className="modal-content border-0 rounded-4 shadow" style={{ backgroundColor: '#1a1a1a', border: '1px solid #ff6600' }}>
                <div className="modal-header border-secondary">
                  <h5 className="modal-title fw-bold text-warning">تحديث البيانات</h5>
                  <button onClick={() => setShowModal(false)} className="btn-close btn-close-white"></button>
                </div>
                <form onSubmit={formik.handleSubmit}>
                  <div className="modal-body p-4">
                    <div className="mb-3 text-start">
                      <label className="small text-secondary mb-1">الاسم</label>
                      <input className="form-control bg-dark text-white border-secondary shadow-none" {...formik.getFieldProps('name')} />
                    </div>
                    <div className="mb-3 text-start">
                      <label className="small text-secondary mb-1">الإيميل</label>
                      <input className="form-control bg-dark text-white border-secondary shadow-none" {...formik.getFieldProps('email')} />
                    </div>
                  </div>
                  <div className="modal-footer border-0 p-3">
                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline-light">إلغاء</button>
                    <button type="submit" className="btn px-4 fw-bold" style={{ backgroundColor: '#ff6600', color: '#000' }}>حفظ التغييرات</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
