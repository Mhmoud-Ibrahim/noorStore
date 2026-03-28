import { useContext, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { MainContext } from '../mainContext.tsx';
import { toast } from 'react-toastify';
import api from '../api'; // تأكد أن api.ts يحتوي على withCredentials: true
import Loading from '../Loading.tsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function Profile() {
  const context = useContext(MainContext);
  if (!context) return null;
  const { user, setUser, loading } = context;

  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // استخراج المعرف الصحيح (أغلب قواعد MongoDB تستخدم _id)
  const userId = user?._id || user?.userId;

  // 1. فورم البيانات النصية
  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().min(2, 'الاسم قصير جداً').required('الاسم مطلوب'),
      email: Yup.string().email('بريد إلكتروني غير صالح').required('البريد مطلوب'),
    }),
    onSubmit: async (values) => {
      try {
        if (!userId) return toast.error("معرف المستخدم غير موجود");
        
        const res = await api.patch(`/api/user/${userId}`, values);
        if (res.data.message === "success") {
          setUser(res.data.user); // تحديث البيانات من الرد المباشر للسيرفر
          setIsEditing(false);
          toast.success("تم تحديث بياناتك بنجاح ✅");
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "فشل في تحديث البيانات");
      }
    },
  });

  // 2. معالجة رفع الصورة
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!userId) return toast.error("يجب تسجيل الدخول أولاً");

    const formDataImg = new FormData();
    formDataImg.append('userImage', file);

    try {
      setUploading(true);
      // إرسال الطلب للباك إند (تأكد أن الراوت هناك يستخدم uploadSingleFile)
      const res = await api.patch(`/api/user/${userId}`, formDataImg);
      
      if (res.data.message === "success") {
        // تحديث الـ context بالكائن الجديد المرتجع من السيرفر (والذي يحتوي رابط Cloudinary)
        setUser(res.data.user);
        console.log("البيانات الجديدة بعد رفع الصورة:", res.data.user);
        toast.success("تم تغيير الصورة الشخصية بنجاح 📸");
      }
    } catch (err: any) {
      console.error("Error details:", err.response?.data);
      toast.error(err.response?.data?.message || "فشل رفع الصورة (تأكد من حجم الملف)");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {loading ? <Loading /> : (
        <div className="min-vh-100 py-5" style={{ backgroundColor: '#121212', color: '#fff' }}>
          <Helmet><title>حسابي | {user?.name || 'الملف الشخصي'}</title></Helmet>

          <div className="container mt-5">
            <div className="row justify-content-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="col-md-8 p-4 rounded-4 shadow-lg"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #ff6600' }}
              >
                {/* قسم الصورة الشخصية مع Motion */}
                <div className="text-center position-relative mb-4">
                  <div className="position-relative d-inline-block">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={user?.userImage}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4 }}
                        className="rounded-circle overflow-hidden border border-3 border-warning shadow"
                        style={{ width: '150px', height: '150px', backgroundColor: '#333' }}
                      >
                        <img 
                          src={user?.userImage || 'https://via.placeholder.com'} 
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                          alt="profile"
                        />
                      </motion.div>
                    </AnimatePresence>
                    
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-sm position-absolute bottom-0 end-0 rounded-circle shadow d-flex align-items-center justify-content-center"
                      style={{ backgroundColor: '#ff6600', color: '#000', zIndex: 2, width: '40px', height: '40px' }}
                      disabled={uploading}
                    >
                      {uploading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-camera"></i>}
                    </motion.button>
                    <input type="file" hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                  </div>
                  
                  <motion.h2 layout className="mt-3 fw-bold" style={{ color: '#ff6600' }}>
                    {user?.name}
                  </motion.h2>
                  <span className="badge rounded-pill bg-secondary">{user?.role || 'User'}</span>
                </div>

                <hr style={{ borderColor: '#ff6600', opacity: 0.3 }} />

                {/* فورم البيانات الشخصية */}
                <form onSubmit={formik.handleSubmit}>
                  <div className="row g-4 text-start">
                    <div className="col-md-6">
                      <label className="small text-secondary mb-2">الاسم الكامل</label>
                      <AnimatePresence mode="wait">
                        {isEditing ? (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <input 
                              className={`form-control bg-dark text-white border-secondary ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                              {...formik.getFieldProps('name')}
                            />
                            {formik.touched.name && formik.errors.name && <div className="text-danger small mt-1">{formik.errors.name}</div>}
                          </motion.div>
                        ) : (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fs-5 border-bottom border-secondary pb-1">{user?.name}</motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <div className="col-md-6">
                      <label className="small text-secondary mb-2">البريد الإلكتروني</label>
                      <AnimatePresence mode="wait">
                        {isEditing ? (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <input 
                              className={`form-control bg-dark text-white border-secondary ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                              {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email && <div className="text-danger small mt-1">{formik.errors.email}</div>}
                          </motion.div>
                        ) : (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fs-5 border-bottom border-secondary pb-1">{user?.email}</motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="mt-5 d-flex gap-3 justify-content-center">
                    {isEditing ? (
                      <>
                        <motion.button whileHover={{ scale: 1.05 }} type="submit" className="btn px-5 fw-bold" style={{ backgroundColor: '#ff6600', color: '#000' }}>
                          حفظ التعديلات
                        </motion.button>
                        <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline-light px-4">
                          إلغاء
                        </button>
                      </>
                    ) : (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        type="button" 
                        onClick={() => setIsEditing(true)} 
                        className="btn btn-outline-warning px-5"
                      >
                        تعديل الملف الشخصي
                      </motion.button>
                    )}
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
