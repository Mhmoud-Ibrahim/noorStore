// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { Helmet } from 'react-helmet-async';
// import api from './api'; 
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// export default function AddProduct() {
//  const navigate = useNavigate();
//   const [categories, setCategories] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   // إعدادات Cloudinary الخاصة بك
//   const CLOUDINARY_UPLOAD_PRESET = "ml_cloud"; 
//   const CLOUDINARY_CLOUD_NAME = "dnniuejpd";

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     price: '',
//     costPrice: '',
//     stock: '',
//     category: '',
//   });

//   const [imageCoverFile, setImageCoverFile] = useState<File | null>(null);
//   const [imagesFiles, setImagesFiles] = useState<FileList | null>(null);

//   // جلب الأقسام عند تحميل المكون
//   useEffect(() => {
//     const fetchCats = async () => {
//       try {
//         const res = await api.get('/api/category');
//         // التأكد من استخراج المصفوفة سواء كانت داخل data أو categories
//         setCategories(res.data.categories || res.data.data || res.data);
//       } catch (err) {
//         toast.error("فشل في جلب الأقسام");
//       }
//     };
//     fetchCats();
//   }, []);

//   // فانكشن الرفع لكلاوديناري
//   const uploadToCloudinary = async (file: File) => {
//     const data = new FormData();
//     data.append("file", file);
//     data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    
//     const res = await axios.post(
//       `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
//       data
//     );
//     return res.data.secure_url;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // 1. رفع صورة الغلاف
//       if (!imageCoverFile) {
//         toast.error("يرجى اختيار صورة الغلاف");
//         setLoading(false);
//         return;
//       }
//       const imageCoverUrl = await uploadToCloudinary(imageCoverFile);

//       // 2. رفع مصفوفة الصور الإضافية
//       let imagesUrls: string[] = [];
//       if (imagesFiles && imagesFiles.length > 0) {
//         const uploadPromises = Array.from(imagesFiles).map(file => uploadToCloudinary(file));
//         imagesUrls = await Promise.all(uploadPromises);
//       }

//       // 3. تجهيز البيانات النهائية (تحويل الأرقام لضمان قبول الـ Joi لها)
//       const finalData = {
//         title: formData.title,
//         description: formData.description,
//         price: Number(formData.price),
//         costPrice: Number(formData.costPrice),
//         stock: Number(formData.stock),
//         category: formData.category, // هذا هو الـ ID المختار من الـ select
//         imageCover: imageCoverUrl,
//         images: imagesUrls
//       };

//       // 4. الإرسال للباك إند
//       const response = await api.post('/api/product', finalData);
//       console.log(response);
//       if (response.data.message === "success" || response.status === 201) {
//         setFormData({
//        title: '',
//        description: '',
//        price: '',
//        costPrice: '',
//        stock: '',
//        category: '',
//      });
//         toast.success("تم إضافة المنتج بنجاح!");
//         setImageCoverFile(null);
//         setImagesFiles(null);
//         navigate('/addProduct');
//       }
//     } catch (err: any) {
//       console.error("Error details:", err.response?.data);
//       const msg = err.response?.data?.message || "حدث خطأ في البيانات أو الرفع";
//       toast.error(Array.isArray(msg) ? msg[0] : msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-vh-100 py-5" style={{ backgroundColor: '#ddd' }}>
//       <Helmet><title>إضافة منتج | لوحة التحكم</title></Helmet>
//       <div className="container mt-5">
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card shadow-lg p-4 m-auto" style={{ maxWidth: '800px', borderRadius: '15px', border: 'none' }}>
//           <h2 className="fw-bold mb-4" style={{ borderRight: '5px solid #ff6600', paddingRight: '15px', color: '#333' }}>إضافة منتج جديد</h2>
          
//           <form onSubmit={handleSubmit}>
//             <div className="row">
//               <div className="col-12 mb-3">
//                 <label className="fw-bold text-dark mb-1">اسم المنتج</label>
//                 <input type="text" className="form-control" onChange={(e)=> setFormData({...formData, title: e.target.value})} required />
//               </div>

//               <div className="col-md-6 mb-3">
//                 <label className="fw-bold text-dark mb-1">صورة الغلاف (أساسية)</label>
//                 <input type="file" className="form-control" accept="image/*" onChange={(e) => setImageCoverFile(e.target.files?.[0] || null)} required />
//               </div>

//               <div className="col-md-6 mb-3">
//                 <label className="fw-bold text-dark mb-1">صور إضافية</label>
//                 <input type="file" className="form-control" accept="image/*" multiple onChange={(e) => setImagesFiles(e.target.files)} />
//               </div>

//               <div className="col-md-6 mb-3">
//                 <label className="fw-bold text-dark mb-1">القسم</label>
//                 <select className="form-select" value={formData.category} onChange={(e)=> setFormData({...formData, category: e.target.value})} required>
//                    <option value="">اختر القسم المختص...</option>
//                    {categories.map((c: any) => (
//                      <option key={c._id} value={c._id}>{c.name}</option>
//                    ))}
//                 </select>
//               </div>
              
//               <div className="col-md-3 mb-3">
//                 <label className="fw-bold text-dark mb-1">سعر البيع</label>
//                 <input type="number" className="form-control" onChange={(e)=> setFormData({...formData, price: e.target.value})} required />
//               </div>

//               <div className="col-md-3 mb-3">
//                 <label className="fw-bold text-dark mb-1">التكلفة</label>
//                 <input type="number" className="form-control" onChange={(e)=> setFormData({...formData, costPrice: e.target.value})} required />
//               </div>

//               <div className="col-md-12 mb-3">
//                 <label className="fw-bold text-dark mb-1">الكمية (Stock)</label>
//                 <input type="number" className="form-control" onChange={(e)=> setFormData({...formData, stock: e.target.value})} required />
//               </div>

//               <div className="col-12 mb-3">
//                 <label className="fw-bold text-dark mb-1">وصف المنتج</label>
//                 <textarea className="form-control" rows={4} onChange={(e)=> setFormData({...formData, description: e.target.value})} required></textarea>
//               </div>
//             </div>

//             <motion.button 
//               whileHover={{ scale: 1.01 }} 
//               whileTap={{ scale: 0.99 }}
//               type="submit" 
//               disabled={loading} 
//               className="btn w-100 fw-bold py-2 mt-3 shadow-sm" 
//               style={{ backgroundColor: '#ff6600', color: '#fff', fontSize: '1.1rem' }}
//             >
//               {loading ? (
//                 <><i className="fas fa-spinner fa-spin me-2"></i> جاري الرفع والحفظ...</>
//               ) : "حفظ ونشر المنتج"}
//             </motion.button>
//           </form>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from './api'; 
import { toast } from 'react-toastify';
//import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddProduct() {
  //const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // إعدادات Cloudinary الخاصة بك
  const CLOUDINARY_UPLOAD_PRESET = "ml_cloud"; 
  const CLOUDINARY_CLOUD_NAME = "dnniuejpd";

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    costPrice: '',
    stock: '',
    category: '',
  });

  const [imageCoverFile, setImageCoverFile] = useState<File | null>(null);
  const [imagesFiles, setImagesFiles] = useState<FileList | null>(null);

  // جلب الأقسام عند تحميل المكون
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/api/category');
        setCategories(res.data.categories || res.data.data || res.data);
      } catch (err) {
        toast.error("فشل في جلب الأقسام");
      }
    };
    fetchCats();
  }, []);

  // فانكشن الرفع لكلاوديناري
  const uploadToCloudinary = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      data
    );
    return res.data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. رفع صورة الغلاف
      if (!imageCoverFile) {
        toast.error("يرجى اختيار صورة الغلاف");
        setLoading(false);
        return;
      }
      const imageCoverUrl = await uploadToCloudinary(imageCoverFile);

      // 2. رفع مصفوفة الصور الإضافية
      let imagesUrls: string[] = [];
      if (imagesFiles && imagesFiles.length > 0) {
        const uploadPromises = Array.from(imagesFiles).map(file => uploadToCloudinary(file));
        imagesUrls = await Promise.all(uploadPromises);
      }

      // 3. تجهيز البيانات النهائية
      const finalData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        costPrice: Number(formData.costPrice),
        stock: Number(formData.stock),
        category: formData.category,
        imageCover: imageCoverUrl,
        images: imagesUrls
      };

      // 4. الإرسال للباك إند
      const response = await api.post('/api/product', finalData);
      
      if (response.data.message === "success" || response.status === 201) {
        toast.success("تم إضافة المنتج بنجاح!");
        
        // تفريغ الحالة (State) لمسح الحقول من الواجهة
        setFormData({
          title: '',
          description: '',
          price: '',
          costPrice: '',
          stock: '',
          category: '',
        });
        setImageCoverFile(null);
        setImagesFiles(null);
      }
    } catch (err: any) {
      console.error("Error details:", err.response?.data);
      const msg = err.response?.data?.message || "حدث خطأ في البيانات أو الرفع";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  return <>
    <Helmet>
  <title>المتجر | إضافة منتج جديد</title> 
</Helmet>
    <div className="min-vh-100 py-5" style={{ backgroundColor: '#ddd' }}>
      <Helmet><title>إضافة منتج | لوحة التحكم</title></Helmet>
      <div className="container mt-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card shadow-lg p-4 m-auto" style={{ maxWidth: '800px', borderRadius: '15px', border: 'none' }}>
          <h2 className="fw-bold mb-4" style={{ borderRight: '5px solid #ff6600', paddingRight: '15px', color: '#333' }}>إضافة منتج جديد</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12 mb-3">
                <label className="fw-bold text-dark mb-1">اسم المنتج</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.title}
                  onChange={(e)=> setFormData({...formData, title: e.target.value})} 
                  required 
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="fw-bold text-dark mb-1">صورة الغلاف (أساسية)</label>
                <input 
                  type="file" 
                  className="form-control" 
                  accept="image/*" 
                  onChange={(e) => setImageCoverFile(e.target.files?.[0] || null)} 
                  required 
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="fw-bold text-dark mb-1">صور إضافية</label>
                <input 
                  type="file" 
                  className="form-control" 
                  accept="image/*" 
                  multiple 
                  onChange={(e) => setImagesFiles(e.target.files)} 
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="fw-bold text-dark mb-1">القسم</label>
                <select 
                  className="form-select" 
                  value={formData.category}
                  onChange={(e)=> setFormData({...formData, category: e.target.value})} 
                  required
                >
                   <option value="">اختر القسم المختص...</option>
                   {categories.map((c: any) => (
                     <option key={c._id} value={c._id}>{c.name}</option>
                   ))}
                </select>
              </div>
              
              <div className="col-md-3 mb-3">
                <label className="fw-bold text-dark mb-1">سعر البيع</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={formData.price}
                  onChange={(e)=> setFormData({...formData, price: e.target.value})} 
                  required 
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="fw-bold text-dark mb-1">التكلفة</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={formData.costPrice}
                  onChange={(e)=> setFormData({...formData, costPrice: e.target.value})} 
                  required 
                />
              </div>

              <div className="col-md-12 mb-3">
                <label className="fw-bold text-dark mb-1">الكمية (Stock)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={formData.stock}
                  onChange={(e)=> setFormData({...formData, stock: e.target.value})} 
                  required 
                />
              </div>

              <div className="col-12 mb-3">
                <label className="fw-bold text-dark mb-1">وصف المنتج</label>
                <textarea 
                  className="form-control" 
                  rows={4} 
                  value={formData.description}
                  onChange={(e)=> setFormData({...formData, description: e.target.value})} 
                  required
                ></textarea>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }} 
              whileTap={{ scale: 0.99 }}
              type="submit" 
              disabled={loading} 
              className="btn w-100 fw-bold py-2 mt-3 shadow-sm" 
              style={{ backgroundColor: '#ff6600', color: '#fff', fontSize: '1.1rem' }}
            >
              {loading ? (
                <><i className="fas fa-spinner fa-spin me-2"></i> جاري الرفع والحفظ...</>
              ) : "حفظ ونشر المنتج"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  
  </>
}
