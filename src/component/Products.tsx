
// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { Helmet } from 'react-helmet-async';
// import api from './api'; // تأكد من مسار الأكسيوس
// import { toast } from 'react-toastify';

// // تعريف الواجهة بناءً على السكيما الخاصة بك
// interface IProduct {
//   _id: string;
//   title: string;
//   description: string;
//   imageCover: string;
//   price: number;
//   stock: number;
//   category: { name: string }; // افترضنا أن الكاتيجوري أوبجكت
// }

// export default function Products() {
//   const [products, setProducts] = useState<IProduct[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await api.get('/api/product');
// console.log(res)
//         setProducts(res.data.products || res.data); 
//       } catch (err) {
//         toast.error("فشل في جلب المنتجات");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // إعدادات ظهور العناصر واحد تلو الآخر
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1 }
//     }
//   };

//   const cardVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { y: 0, opacity: 1 }
//   };

//   return (
//     <div className="min-vh-100 py-5" style={{ backgroundColor: '#ddd', color: '#fff' }}>
//       <Helmet>
//         <title>المتجر | المنتجات</title>
//       </Helmet>

//       <div className="container mt-5">
//         <motion.h2 
//           initial={{ x: -20, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           className="mb-4 fw-bold" 
//           style={{ borderRight: '5px solid #ff6600', paddingRight: '15px' }}
//         >
//           أحدث المنتجات
//         </motion.h2>

//         {loading ? (
//           <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//             <i className="fas fa-spinner fa-spin fa-3x" style={{ color: '#ff6600' }}></i>
//           </div>
//         ) : (
//           <motion.div 
//             className="row g-4"
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//           >
//             {products?.map((product) => (
//               <motion.div key={product._id} className="col-md-4 col-lg-3" variants={cardVariants}>
//                 <div 
//                   className="card h-100 shadow-sm border-0 position-relative overflow-hidden"
//                   style={{ backgroundColor: '#777', color: '#fff', borderRadius: '15px' }}
//                 >
//                   {/* Stock Badge */}
//                   <span 
//                     className="position-absolute top-0 end-0 m-2 px-2 py-1 small rounded"
//                     style={{ 
//                         backgroundColor: product.stock > 0 ? '#ff6600' : '#dc3545', 
//                         fontSize: '10px', color: '#000', fontWeight: 'bold', zIndex: 2
//                     }}
//                   >
//                     {product.stock > 0 ? `متوفر: ${product.stock}` : 'نفذت الكمية'}
//                   </span>

//                   {/* Product Image */}
//                   <div className="overflow-hidden" style={{ height: '220px' }}>
//                     <motion.img 
//                       whileHover={{ scale: 1.1 }}
//                       src={product.imageCover} 
//                       className="card-img-top w-100 h-100 object-fit-cover"
//                       alt={product.title}
//                       onError={(e) => { (e.target as HTMLImageElement).src =''; }}
//                     />
//                   </div>

//                   {/* Card Body */}
//                   <div className="card-body d-flex flex-column">
//                     <h6 className="card-title fw-bold text-truncate" title={product.title}>
//                       {product.title}
//                     </h6>
//                     <p className="card-text small text-secondary text-truncate-2" style={{ height: '40px', fontSize: '0.85rem' }}>
//                       {product.description}
//                     </p>
                    
//                     <div className="mt-auto d-flex justify-content-between align-items-center">
//                       <span className="fs-5 fw-bold" style={{ color: '#ff6600' }}>
//                         {product.price} <small style={{fontSize: '12px'}}>ج.م</small>
//                       </span>
//                       <motion.button 
//                         whileTap={{ scale: 0.9 }}
//                         className="btn btn-sm shadow-sm fw-bold"
//                         style={{ backgroundColor: '#ff6600', color: '#000' }}
//                         disabled={product.stock === 0}
//                       >
//                         <i className="fa-solid fa-cart-plus me-1"></i> أضف
//                       </motion.button>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from './api'; 
import { toast } from 'react-toastify';

interface IProduct {
  _id: string;
  title: string;
  description: string;
  imageCover: string;
  price: number;
  stock: number;
  category: { name: string };
}

export default function Products() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  // حالات الباجينيشن
  const [page, setPage] = useState(1);
  const [resultsCount, setResultsCount] = useState(0); 
  const limit = 10; // نفس الـ limit الافتراضي في الباك إند عندك

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // إرسال رقم الصفحة في الـ query string كما يتوقع الـ ApiFeatures
        const res = await api.get(`/api/product?page=${page}&limit=${limit}`);
        
        setProducts(res.data.products); 
        setResultsCount(res.data.results); // عدد العناصر في الصفحة الحالية
      } catch (err) {
        toast.error("فشل في جلب المنتجات");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page]); // إعادة الجلب عند تغيير رقم الصفحة

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return <> <Helmet>
  {/* استخدم الأقواس المتعرجة مع الباك تيك لضمان تحويلها لنص صافي */}
  <title>{`المتجر | المنتجات - صفحة ${page}`}</title>
</Helmet>
    <div className="min-vh-100 py-5" style={{ backgroundColor: '#ddd', color: '#fff' }}>
      <Helmet>
        <title>المتجر | المنتجات - صفحة {page}</title>
      </Helmet>

      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <motion.h2 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="fw-bold m-0" 
              style={{ borderRight: '5px solid #ff6600', paddingRight: '15px' }}
            >
              أحدث المنتجات
            </motion.h2>
            <span className="badge bg-dark">صفحة {page}</span>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <i className="fas fa-spinner fa-spin fa-3x" style={{ color: '#ff6600' }}></i>
          </div>
        ) : (
          <>
            <motion.div 
              className="row g-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {products?.map((product) => (
                <motion.div key={product._id} className="col-md-4 col-lg-3" variants={cardVariants}>
                   {/* الكارد كما هو بدون تغيير */}
                   <div className="card h-100 shadow-sm border-0 position-relative overflow-hidden" style={{ backgroundColor: '#777', color: '#fff', borderRadius: '15px' }}>
                      <span className="position-absolute top-0 end-0 m-2 px-2 py-1 small rounded" style={{ backgroundColor: product.stock > 0 ? '#ff6600' : '#dc3545', fontSize: '10px', color: '#000', fontWeight: 'bold', zIndex: 2 }}>
                        {product.stock > 0 ? `متوفر: ${product?.stock}` : 'نفذت'}
                      </span>
                      <div className="overflow-hidden" style={{ height: '200px' }}>
                        <img src={product.imageCover} className="w-100 h-100 object-fit-cover" alt={product.title} />
                      </div>
                      <div className="card-body d-flex flex-column">
                        <h6 className="fw-bold text-truncate">{product?.title}</h6>
                        <div className="mt-auto d-flex justify-content-between align-items-center">
                          <span className="fw-bold" style={{ color: '#ff6600' }}>{product.price} ج.م</span>
                          <button className="btn btn-sm" style={{ backgroundColor: '#ff6600' }} disabled={product.stock === 0}>أضف</button>
                        </div>
                      </div>
                   </div>
                </motion.div>
              ))}
            </motion.div>

            {/* أزرار الباجينيشن */}
            <div className="d-flex justify-content-center align-items-center mt-5 gap-3">
                <motion.button 
                    whileTap={{ scale: 0.9 }}
                    disabled={page === 1}
                    onClick={() => setPage(prev => prev - 1)}
                    className="btn fw-bold px-4"
                    style={{ backgroundColor: page === 1 ? '#555' : '#ff6600', color: '#000' }}
                >
                    السابق
                </motion.button>

                <span className="fs-5 fw-bold text-dark">{page}</span>

                <motion.button 
                    whileTap={{ scale: 0.9 }}
                    // إذا كان عدد النتائج أقل من الـ limit، فهذا يعني غالباً أننا في آخر صفحة
                    disabled={resultsCount < limit}
                    onClick={() => setPage(prev => prev + 1)}
                    className="btn fw-bold px-4"
                    style={{ backgroundColor: resultsCount < limit ? '#555' : '#ff6600', color: '#000' }}
                >
                    التالي
                </motion.button>
            </div>
          </>
        )}
      </div>
    </div>
  </>
   
}
