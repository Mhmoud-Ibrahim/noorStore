import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import api from '../component/api';
import Loading from '../component/Loading.tsx';

export default function EditProduct() {
  const { id } = useParams(); // استلام ID المنتج من الرابط
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);

  // مراجع لرفع الصور
  const coverRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<HTMLInputElement>(null);

  // 1. جلب بيانات المنتج والتصنيفات عند التحميل
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get(`/api/product/${id}`),
          api.get('/api/category')
        ]);
        formik.setValues({
          title: prodRes.data.product.title,
          description: prodRes.data.product.description,
          price: prodRes.data.product.price,
          stock: prodRes.data.product.stock,
          category: prodRes.data.product.category._id || prodRes.data.product.category,
        });
        setCategories(catRes.data.categories || catRes.data);
      } catch (err) {
        toast.error("فشل في تحميل بيانات المنتج");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 2. إعداد Formik
  const formik = useFormik({
    initialValues: { title: '', description: '', price: 0, stock: 0, category: '' },
    validationSchema: Yup.object({
      title: Yup.string().min(2, 'قصير جداً').required('مطلوب'),
      description: Yup.string().min(10, 'الوصف قصير').required('مطلوب'),
      price: Yup.number().min(1, 'السعر غير منطقي').required('مطلوب'),
      stock: Yup.number().min(0, 'المخزون غير صحيح').required('مطلوب'),
    }),
    onSubmit: async (values) => {
      try {
        setUploading(true);
        const formData = new FormData();
        
        // إضافة الحقول النصية
        Object.entries(values).forEach(([key, value]) => {
          formData.append(key, value.toString());
        });

        // إضافة الصورة الأساسية إذا تم اختيارها
        if (coverRef.current?.files?.[0]) {
          formData.append('imageCover', coverRef.current.files[0]);
        }

        // إضافة مصفوفة الصور إذا تم اختيارها
        if (imagesRef.current?.files) {
          Array.from(imagesRef.current.files).forEach(file => {
            formData.append('images', file);
          });
        }

        const res = await api.put(`/api/product/${id}`, formData);
        if (res.data.message === "success") {
          toast.success("تم تحديث المنتج بنجاح ✨");
          navigate('/productManagement'); // العودة لجدول الإدارة
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "فشل التحديث");
      } finally {
        setUploading(false);
      }
    }
  });

  if (loading) return <Loading />;

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: '#121212', color: '#fff' }}>
      <Helmet><title>لوحة الإدارة | تعديل منتج</title></Helmet>

      <div className="container mt-5">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-4 shadow-lg mx-auto"
          style={{ backgroundColor: '#1a1a1a', border: '1px solid #ff6600', maxWidth: '800px' }}
        >
          <h2 className="fw-bold mb-4 text-center" style={{ color: '#ff6600' }}>تعديل <span className="text-white">المنتج</span></h2>

          <form onSubmit={formik.handleSubmit}>
            <div className="row g-3">
              {/* العنوان */}
              <div className="col-12">
                <label className="small text-secondary mb-1">عنوان المنتج</label>
                <input className={`form-control bg-dark text-white border-secondary ${formik.touched.title && formik.errors.title ? 'is-invalid' : ''}`} {...formik.getFieldProps('title')} />
              </div>

              {/* الوصف */}
              <div className="col-12">
                <label className="small text-secondary mb-1">وصف المنتج</label>
                <textarea rows={3} className={`form-control bg-dark text-white border-secondary ${formik.touched.description && formik.errors.description ? 'is-invalid' : ''}`} {...formik.getFieldProps('description')} />
              </div>

              {/* السعر والمخزون */}
              <div className="col-md-4">
                <label className="small text-secondary mb-1">السعر (ج.م)</label>
                <input type="number" className="form-control bg-dark text-white border-secondary" {...formik.getFieldProps('price')} />
              </div>
              <div className="col-md-4">
                <label className="small text-secondary mb-1">المخزون</label>
                <input type="number" className="form-control bg-dark text-white border-secondary" {...formik.getFieldProps('stock')} />
              </div>
              <div className="col-md-4">
                <label className="small text-secondary mb-1">التصنيف</label>
                <select className="form-select bg-dark text-white border-secondary" {...formik.getFieldProps('category')}>
                  <option value="">اختر التصنيف</option>
                  {categories.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* رفع الصور الجديدة */}
              <div className="col-md-6 mt-4">
                <label className="small text-warning fw-bold mb-2 d-block">تغيير الصورة الأساسية</label>
                <input type="file" ref={coverRef} className="form-control bg-transparent text-secondary border-secondary btn-sm" accept="image/*" />
              </div>
              <div className="col-md-6 mt-4">
                <label className="small text-warning fw-bold mb-2 d-block">إضافة صور للمعرض (متعدد)</label>
                <input type="file" ref={imagesRef} multiple className="form-control bg-transparent text-secondary border-secondary btn-sm" accept="image/*" />
              </div>

              {/* أزرار التحكم */}
              <div className="col-12 mt-5 d-flex gap-3 justify-content-center">
                <button 
                  type="submit" 
                  className="btn px-5 fw-bold shadow" 
                  style={{ backgroundColor: '#ff6600', color: '#000' }}
                  disabled={uploading}
                >
                  {uploading ? <i className="fas fa-spinner fa-spin me-2"></i> : <i className="fas fa-save me-2"></i>}
                  حفظ التعديلات
                </button>
                <button type="button" onClick={() => navigate('/productManagement')} className="btn btn-outline-light px-4">إلغاء</button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
