// import { useContext, useState, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Helmet } from 'react-helmet-async';
// import { MainContext } from '../mainContext.tsx';
// import { toast } from 'react-toastify';
// import api from '../api';
// import Loading from '../Loading.tsx';
// import { Link } from 'react-router-dom';

// export default function Profile() {
//   const context = useContext(MainContext);
//   if (!context) return null;
//   const { user, setUser, loading } = context;

//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '' });
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // تحديث البيانات النصية
//   const handleUpdateInfo = async () => {
//     try {
//       const res = await api.put('/users/update-me', formData);
//       setUser(res.data.user);
//       setIsEditing(false);
//       toast.success("تم تحديث بياناتك بنجاح ✅");
//     } catch (err) {
//       toast.error("فشل في التحديث");
//     }
//   };

//   // رفع وتغيير الصورة
//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const formDataImg = new FormData();
//     formDataImg.append('image', file);

//     try {
//       setUploading(true);
//       const res = await api.put('/api/user', formDataImg);
//       setUser(res.data.user);
//       toast.success("تم تغيير الصورة الشخصية 📸");
//     } catch (err) {
//       toast.error("فشل رفع الصورة");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return <>  {loading? <Loading /> :<div className="min-vh-100 py-5" style={{ backgroundColor: '#777', color: '#fff' }}>
//       <Helmet><title>حسابي | {user?.name}</title></Helmet>

//       <div className="container mt-5">
//         <div className="row justify-content-center">
//           <motion.div 
//             initial={{ opacity: 0, scale: 0.9 }} 
//             animate={{ opacity: 1, scale: 1 }}
//             className="col-md-8 p-4 rounded-4 shadow-lg"
//             style={{ backgroundColor: '#1a1a1a', border: '1px solid #ff6600' }}
//           >
//             {/* الجزء العلوي: الصورة والاسم */}
//             <div className="text-center position-relative mb-4">
//               <div className="position-relative d-inline-block">
//                 <motion.img 
//                   src={user?.userImage || 'https://via.placeholder.com'} 
//                   className="rounded-circle border border-3 border-warning shadow"
//                   style={{ width: '150px', height: '150px', objectFit: 'cover' }}
//                   alt="profile"
//                 />
//                 <button 
//                   onClick={() => fileInputRef.current?.click()}
//                   className="btn btn-sm position-absolute bottom-0 end-0 rounded-circle shadow"
//                   style={{ backgroundColor: '#ff6600', color: '#000' }}
//                 >
//                   {uploading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-camera"></i>}
//                 </button>
//                 <input type="file" hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
//               </div>
//               <h2 className="mt-3 fw-bold" style={{ color: '#ff6600' }}>{user?.name}</h2>
//               <span className="badge rounded-pill bg-secondary">{user?.role || 'User'}</span>
//             </div>

//             <hr style={{ borderColor: '#ff6600', opacity: 0.3 }} />

//             {/* عرض وتعديل البيانات */}
//             <div className="row g-3">
//               <div className="col-md-6">
//                 <label className="small text-secondary">الاسم الكامل</label>
//                 {isEditing ? (
//                   <input className="form-control bg-light" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} />
//                 ) : (
//                   <p className="fs-5">{user?.name}</p>
//                 )}
//               </div>
//               <div className="col-md-6">
//                 <label className="small text-secondary">البريد الإلكتروني</label>
//                 <p className="fs-5">{user?.email}</p>
//               </div>
//             </div>

//             {/* أزرار التحكم في البيانات */}
//             <div className="mt-4 d-flex gap-2">
//               {isEditing ? (
//                 <>
//                   <button onClick={handleUpdateInfo} className="btn px-4 fw-bold" style={{ backgroundColor: '#ff6600', color: '#000' }}>حفظ التعديلات</button>
//                   <button onClick={() => setIsEditing(false)} className="btn btn-outline-light">إلغاء</button>
//                 </>
//               ) : (
//                 <button onClick={() => setIsEditing(true)} className="btn btn-outline-warning px-4">تعديل الملف الشخصي</button>
//               )}
//             </div>

//             {/* لوحة تحكم الأدوار (Admin / Employee) */}
//             <AnimatePresence>
//               {(user?.role === 'admin' || user?.role === 'employee') && (
//                 <motion.div 
//                   initial={{ height: 0, opacity: 0 }}
//                   animate={{ height: 'auto', opacity: 1 }}
//                   className="mt-5 p-3 rounded-3"
//                   style={{ backgroundColor: '#2d2d2d', borderRight: '4px solid #ff6600' }}
//                 >
//                   <h5 className="fw-bold" style={{ color: '#ff6600' }}>لوحة التحكم السريعة</h5>
//                   <div className="d-flex gap-3 mt-3">

//                     <Link to="/addProduct" className="btn btn-sm btn-dark border-warning text-warning">
//                      <i className="fas fa-plus-circle me-1"></i> إضافة منتج جديد
//                     </Link>
                
//                     {user.role === 'admin' && (
//                       <button className="btn btn-sm btn-dark border-info text-info">
//                         <i className="fas fa-users-cog me-1"></i> إدارة المستخدمين
//                       </button>
//                     )}
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//           </motion.div>
//         </div>
//       </div>
//     </div>}
//   </>
  

// }

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

  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // إعداد Formik لإدارة تحديث البيانات النصية
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
        // استخدام المعرف _id والمسار الصحيح للباك إند
        const res = await api.patch(`/api/user/${user?.userId}`, values);
        console.log(res)
        if (res.data.message === "success") {
          setUser(res.data.user);
          setIsEditing(false);
          toast.success("تم تحديث بياناتك بنجاح ✅");
        }
      } catch (err) {
        toast.error("فشل في تحديث البيانات");
      }
    },
  });

  // رفع وتغيير الصورة الشخصية
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataImg = new FormData();
    formDataImg.append('userImage', file); // 'userImage' هو الاسم المعرف في الـ multer بـ الباك إند

    try {
      setUploading(true);
      const res = await api.patch(`/api/user/${user?.userId}`, formDataImg);
      console.log(res)
      if (res.data.message === "success") {
        setUser(res.data.user);
        toast.success("تم تغيير الصورة الشخصية بنجاح 📸");
      }
    } catch (err) {
      toast.error("فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {loading ? <Loading /> : (
        <div className="min-vh-100 py-5" style={{ backgroundColor: '#777', color: '#fff' }}>
          <Helmet><title>حسابي | {user?.name}</title></Helmet>

          <div className="container mt-5">
            <div className="row justify-content-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="col-md-8 p-4 rounded-4 shadow-lg"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #ff6600' }}
              >
                {/* قسم الصورة الشخصية */}
                <div className="text-center position-relative mb-4">
                  <div className="position-relative d-inline-block">
                    <motion.img 
                      key={user?.userImage} // لضمان تحديث الصورة فور تغييرها
                      src={user?.userImage || ''} 
                      className="rounded-circle border border-3 border-warning shadow"
                      style={{ width: '150px', height: '150px', objectFit: 'cover', backgroundColor: '#333' }}
                      alt="profile"
                      onError={(e) => { (e.target as HTMLImageElement).src = ''; }}
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-sm position-absolute bottom-0 end-0 rounded-circle shadow"
                      style={{ backgroundColor: '#ff6600', color: '#000', zIndex: 2 }}
                    >
                      {uploading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-camera"></i>}
                    </button>
                    <input type="file" hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                  </div>
                  <h2 className="mt-3 fw-bold" style={{ color: '#ff6600' }}>{user?.name}</h2>
                  <span className="badge rounded-pill bg-secondary">{user?.role || 'User'}</span>
                </div>

                <hr style={{ borderColor: '#ff6600', opacity: 0.3 }} />

                {/* فورم البيانات الشخصية */}
                <form onSubmit={formik.handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small text-secondary mb-1">الاسم الكامل</label>
                      {isEditing ? (
                        <>
                          <input 
                            className={`form-control bg-light ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                            {...formik.getFieldProps('name')}
                          />
                          {formik.touched.name && formik.errors.name && <div className="text-danger small">{formik.errors.name}</div>}
                        </>
                      ) : (
                        <p className="fs-5 border-bottom border-secondary pb-1">{user?.name}</p>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="small text-secondary mb-1">البريد الإلكتروني</label>
                      {isEditing ? (
                        <>
                          <input 
                            className={`form-control bg-light ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                            {...formik.getFieldProps('email')}
                          />
                          {formik.touched.email && formik.errors.email && <div className="text-danger small">{formik.errors.email}</div>}
                        </>
                      ) : (
                        <p className="fs-5 border-bottom border-secondary pb-1">{user?.email}</p>
                      )}
                    </div>
                  </div>

                  {/* أزرار التحكم */}
                  <div className="mt-4 d-flex gap-2">
                    {isEditing ? (
                      <>
                        <button type="submit" className="btn px-4 fw-bold" style={{ backgroundColor: '#ff6600', color: '#000' }}>
                          حفظ التعديلات
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline-light">
                          إلغاء
                        </button>
                      </>
                    ) : (
                      <button type="button" onClick={() => setIsEditing(true)} className="btn btn-outline-warning px-4">
                        تعديل الملف الشخصي
                      </button>
                    )}
                  </div>
                </form>

                {/* لوحة تحكم الأدوار (Admin / Employee) */}
                <AnimatePresence>
                  {(user?.role === 'admin' || user?.role === 'employee') && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mt-5 p-3 rounded-3"
                      style={{ backgroundColor: '#2d2d2d', borderRight: '4px solid #ff6600' }}
                    >
                      <h5 className="fw-bold" style={{ color: '#ff6600' }}>لوحة التحكم السريعة</h5>
                      <div className="d-flex flex-wrap gap-3 mt-3">
                        <Link to="/addProduct" className="btn btn-sm btn-dark border-warning text-warning text-decoration-none">
                          <i className="fas fa-plus-circle me-1"></i> إضافة منتج جديد
                        </Link>
                        {user.role === 'admin' && (
                          <button className="btn btn-sm btn-dark border-info text-info">
                            <i className="fas fa-users-cog me-1"></i> إدارة المستخدمين
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
