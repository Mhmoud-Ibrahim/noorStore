// import { useContext, useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Helmet } from 'react-helmet-async';
// import api from './api';
// import { toast } from 'react-toastify';

// // استيراد Swiper والموديولات
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// // استيراد ملفات الـ CSS الخاصة بـ Swiper (المسارات المتوافقة مع الإصدارات الحديثة)
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import { MainContext } from './mainContext.tsx';

// interface IProduct {
//   _id: string;
//   title: string;
//   description: string;
//   imageCover: string;
//   images: string[];
//   price: number;
//   stock: number;
//   category: { name: string };
// }

// export default function ProductDetails() {
//   const { id } = useParams(); 
//   const [product, setProduct] = useState<IProduct | null>(null);
//   const [loading, setLoading] = useState(true);
// const context = useContext(MainContext);
//   const addToCart = context?.addToCart;
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await api.get(`/api/product/${id}`);
//         // استخراج المنتج بناءً على هيكلة الـ JSON في الباك إند الخاص بك
//         setProduct(res.data.product || res.data.data || res.data);
//       } catch (err) {
//         toast.error("حدث خطأ أثناء جلب تفاصيل المنتج");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   if (loading) return (
//     <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#ddd' }}>
//       <div className="text-center">
//         <i className="fas fa-spinner fa-spin fa-3x mb-3" style={{ color: '#ff6600' }}></i>
//         <p className="fw-bold text-dark">جاري تحميل التفاصيل...</p>
//       </div>
//     </div>
//   );

//   if (!product) return (
//     <div className="min-vh-100 d-flex justify-content-center align-items-center text-dark fw-bold">
//       المنتج غير موجود أو تم حذفه.
//     </div>
//   );

//   // دمج صورة الغلاف مع الصور الإضافية للعرض في السلايدر
//   const allImages = [product.imageCover, ...(product.images || [])];

//   return (
//     <div className="min-vh-100 py-5" style={{ backgroundColor: '#ddd' }}>
//       <Helmet>
//         <title>{`المتجر | ${product.title}`}</title>
//       </Helmet>

//       <div className="container mt-5">
//         <motion.div 
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="row g-0 bg-white shadow-lg rounded-4 overflow-hidden"
//         >
//           {/* الجانب الأيمن: معرض الصور (السلايدر) */}
//           <div className="col-lg-6 bg-light d-flex align-items-center">
//             <div className="w-100 p-2">
//               <Swiper
//                 modules={[Navigation, Pagination, Autoplay]}
//                 navigation
//                 pagination={{ clickable: true }}
//                 autoplay={{ delay: 4000, disableOnInteraction: false }}
//                 loop={allImages.length > 1}
//                 style={{
//                     // تخصيص ألوان أزرار السلايدر لتناسب تصميمك
//                     //@ts-ignore
//                     '--swiper-navigation-color': '#ff6600',
//                     '--swiper-pagination-color': '#ff6600',
//                 }}
//                 className="rounded-3 overflow-hidden"
//               >
//                 {allImages.map((img, index) => (
//                   <SwiperSlide key={index}>
//                     <img 
//                       src={img} 
//                       alt={`${product.title}-${index}`} 
//                       className="w-100 object-fit-contain" 
//                       style={{ height: '500px', backgroundColor: '#f8f9fa' }} 
//                     />
//                   </SwiperSlide>
//                 ))}
//               </Swiper>
//             </div>
//           </div>

//           {/* الجانب الأيسر: معلومات المنتج */}
//           <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-center" style={{ borderRight: '1px solid #eee' }}>
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2 }}
//             >
//               <div className="d-flex align-items-center mb-2">
//                 <span className="badge px-3 py-2 rounded-pill shadow-sm" style={{ backgroundColor: '#ff6600', color: '#000', fontWeight: 'bold' }}>
//                   {product.category?.name || 'قسم عام'}
//                 </span>
//               </div>

//               <h1 className="fw-bold mb-3 text-dark display-6">{product.title}</h1>
              
//               <div className="d-flex align-items-baseline mb-4">
//                 <h2 className="fw-bold m-0" style={{ color: '#ff6600', fontSize: '2.5rem' }}>
//                   {product.price} <small className="fs-5 text-secondary">ج.م</small>
//                 </h2>
//                 <div className="ms-auto text-end">
//                     {product.stock > 0 ? (
//                         <span className="badge bg-success-subtle text-success border border-success px-3">
//                            <i className="fa-solid fa-box-open me-1"></i> متوفر: {product.stock} قطة
//                         </span>
//                     ) : (
//                         <span className="badge bg-danger-subtle text-danger border border-danger px-3">
//                            <i className="fa-solid fa-circle-xmark me-1"></i> نفذت الكمية
//                         </span>
//                     )}
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <h5 className="fw-bold text-dark border-bottom pb-2 mb-3" style={{ width: 'fit-content', borderBottom: '3px solid #ff6600 !important' }}>
//                     وصف المنتج
//                 </h5>
//                 <p className="text-muted fs-5" style={{ lineHeight: '1.8', textAlign: 'justify' }}>
//                   {product.description}
//                 </p>
//               </div>

//               <div className="row g-3 mt-4">
//                 <div className="col-md-9">
//                     <motion.button 
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         disabled={product.stock === 0}
//                         className="btn w-100 py-3 fw-bold fs-5 shadow"
//                         style={{ backgroundColor: '#ff6600', color: '#000', borderRadius: '15px' }}
//                     >
//                         <i className="fa-solid fa-cart-shopping me-2"></i> إضافة إلى عربة التسوق
//                     </motion.button>
//                 </div>
//                 <div className="col-md-3">
//                     <motion.button 
//                         whileHover={{ scale: 1.05 }}
//                         className="btn btn-outline-dark w-100 py-3 rounded-4 shadow-sm"
//                     >
//                         <i className="fa-regular fa-heart fs-4"></i>
//                     </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from './api';
import { toast } from 'react-toastify';

// استيراد Swiper والموديولات
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// استيراد ملفات الـ CSS الخاصة بـ Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { MainContext } from './mainContext.tsx';

interface IProduct {
  _id: string;
  title: string;
  description: string;
  imageCover: string;
  images: string[];
  price: number;
  stock: number;
  category: { name: string };
}

export default function ProductDetails() {
  const { id } = useParams(); 
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);

  // استخدام الكونتكس لجلب وظيفة الإضافة للسلة
  const context = useContext(MainContext);
  const addToCart = context?.addToCart;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/product/${id}`);
        setProduct(res.data.product || res.data.data || res.data);
      } catch (err) {
        toast.error("حدث خطأ أثناء جلب تفاصيل المنتج");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#ddd' }}>
      <div className="text-center">
        <i className="fas fa-spinner fa-spin fa-3x mb-3" style={{ color: '#ff6600' }}></i>
        <p className="fw-bold text-dark">جاري تحميل التفاصيل...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center text-dark fw-bold">
      المنتج غير موجود أو تم حذفه.
    </div>
  );

  const allImages = [product.imageCover, ...(product.images || [])];

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: '#ddd' }}>
      <Helmet>
        <title>{`المتجر | ${product.title}`}</title>
      </Helmet>

      <div className="container mt-5">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="row g-0 bg-white shadow-lg rounded-4 overflow-hidden"
        >
          {/* الجانب الأيمن: معرض الصور */}
          <div className="col-lg-6 bg-light d-flex align-items-center">
            <div className="w-100 p-2">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={allImages.length > 1}
                style={{
                    //@ts-ignore
                    '--swiper-navigation-color': '#ff6600',
                    '--swiper-pagination-color': '#ff6600',
                }}
                className="rounded-3 overflow-hidden"
              >
                {allImages.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img 
                      src={img} 
                      alt={`${product.title}-${index}`} 
                      className="w-100 object-fit-contain" 
                      style={{ height: '500px', backgroundColor: '#f8f9fa' }} 
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* الجانب الأيسر: معلومات المنتج */}
          <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-center" style={{ borderRight: '1px solid #eee' }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="d-flex align-items-center mb-2">
                <span className="badge px-3 py-2 rounded-pill shadow-sm" style={{ backgroundColor: '#ff6600', color: '#000', fontWeight: 'bold' }}>
                  {product.category?.name || 'قسم عام'}
                </span>
              </div>

              <h1 className="fw-bold mb-3 text-dark display-6">{product.title}</h1>
              
              <div className="d-flex align-items-baseline mb-4">
                <h2 className="fw-bold m-0" style={{ color: '#ff6600', fontSize: '2.5rem' }}>
                  {product.price} <small className="fs-5 text-secondary">ج.م</small>
                </h2>
                <div className="ms-auto text-end">
                    {product.stock > 0 ? (
                        <span className="badge bg-success-subtle text-success border border-success px-3">
                           <i className="fa-solid fa-box-open me-1"></i> متوفر: {product.stock} قطع
                        </span>
                    ) : (
                        <span className="badge bg-danger-subtle text-danger border border-danger px-3">
                           <i className="fa-solid fa-circle-xmark me-1"></i> نفذت الكمية
                        </span>
                    )}
                </div>
              </div>

              <div className="mb-4">
                <h5 className="fw-bold text-dark border-bottom pb-2 mb-3" style={{ width: 'fit-content', borderBottom: '3px solid #ff6600 !important' }}>
                    وصف المنتج
                </h5>
                <p className="text-muted fs-5" style={{ lineHeight: '1.8', textAlign: 'justify' }}>
                  {product.description}
                </p>
              </div>

              <div className="row g-3 mt-4">
                <div className="col-md-9">
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={product.stock === 0}
                        onClick={() => addToCart && addToCart(product._id)}
                        className="btn w-100 py-3 fw-bold fs-5 shadow"
                        style={{ backgroundColor: '#ff6600', color: '#000', borderRadius: '15px' }}
                    >
                        <i className="fa-solid fa-cart-shopping me-2"></i> إضافة إلى عربة التسوق
                    </motion.button>
                </div>
                <div className="col-md-3">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        className="btn btn-outline-dark w-100 py-3 rounded-4 shadow-sm"
                    >
                        <i className="fa-regular fa-heart fs-4"></i>
                    </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
