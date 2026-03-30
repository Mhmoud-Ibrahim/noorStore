// import { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Helmet } from 'react-helmet-async';
// import api from './api';
// import { toast } from 'react-toastify';
// import { Link } from 'react-router-dom';

// interface ICartItem {
//   _id: string;
//   product: {
//     _id: string;
//     title: string;
//     imageCover: string;
//     price: number;
//     stock: number;
//   };
//   quantity: number;
//   price: number;
// }

// interface ICart {
//   _id: string;
//   cartItems: ICartItem[];
//   totalCartPrice: number;
// }

// export default function Cart() {
//   const [cart, setCart] = useState<ICart | null>(null);
//   const [loading, setLoading] = useState(true);

//   // جلب بيانات السلة
//   const fetchCart = async () => {
//     try {
//       const res = await api.get('/api/cart');
//       setCart(res.data.cart);
//     } catch (err: any) {
//       if (err.response?.status !== 404) {
//         toast.error("حدث خطأ أثناء جلب السلة");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   // تحديث الكمية
//   const updateCount = async (itemId: string, count: number) => {
//     try {
//       const res = await api.patch(`/api/cart/${itemId}`, { quantity: count });
//       setCart(res.data.cart);
//       toast.success("تم تحديث الكمية");
//     } catch (err) {
//       toast.error("فشل تحديث الكمية");
//     }
//   };

//   // حذف منتج
//   const removeItem = async (itemId: string) => {
//     try {
//       const res = await api.delete(`/api/cart/${itemId}`);
//       setCart(res.data.cart);
//       toast.warn("تم إزالة المنتج من السلة");
//     } catch (err) {
//       toast.error("فشل إزالة المنتج");
//     }
//   };

//   if (loading) return (
//     <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#ddd' }}>
//       <i className="fas fa-spinner fa-spin fa-3x" style={{ color: '#ff6600' }}></i>
//     </div>
//   );

//   return (
//     <div className="min-vh-100 py-5" style={{ backgroundColor: '#ddd' }}>
//       <Helmet>
//         <title>المتجر | عربة التسوق</title>
//       </Helmet>

//       <div className="container mt-5">
//         <h2 className="fw-bold mb-4 text-dark">
//           <i className="fa-solid fa-cart-shopping me-2" style={{ color: '#ff6600' }}></i>
//           عربة التسوق
//         </h2>

//         {!cart || cart.cartItems.length === 0 ? (
//           <div className="bg-white p-5 rounded-4 shadow-sm text-center">
//             <i className="fa-solid fa-cart-plus fa-4x mb-3 text-muted"></i>
//             <h3>عربة التسوق فارغة</h3>
//             <Link to="/" className="btn mt-3 px-4 py-2 fw-bold" style={{ backgroundColor: '#ff6600', color: '#000', borderRadius: '10px' }}>
//               ابدأ التسوق الآن
//             </Link>
//           </div>
//         ) : (
//           <div className="row g-4">
//             {/* قائمة المنتجات */}
//             <div className="col-lg-8">
//               <AnimatePresence>
//                 {cart.cartItems.map((item) => (
//                   <motion.div
//                     key={item._id}
//                     layout
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: 20 }}
//                     className="bg-white p-3 rounded-4 shadow-sm mb-3 d-flex align-items-center"
//                   >
//                     <img 
//                       src={item.product.imageCover} 
//                       alt={item.product.title} 
//                       className="rounded-3 object-fit-cover" 
//                       style={{ width: '100px', height: '100px', backgroundColor: '#f8f9fa' }}
//                     />
//                     <div className="ms-3 flex-grow-1">
//                       <h5 className="fw-bold text-dark mb-1">{item.product.title}</h5>
//                       <p className="text-secondary mb-2">السعر: {item.price} ج.م</p>
                      
//                       <div className="d-flex align-items-center">
//                         <button 
//                           onClick={() => updateCount(item?._id, item.quantity - 1)}
//                           disabled={item.quantity <= 1}
//                           className="btn btn-sm btn-outline-dark rounded-circle"
//                         >-</button>
//                         <span className="mx-3 fw-bold">{item.quantity}</span>
//                         <button 
//                           onClick={() => updateCount(item._id, item.quantity + 1)}
//                           className="btn btn-sm btn-outline-dark rounded-circle"
//                         >+</button>
//                       </div>
//                     </div>
//                     <div className="text-end">
//                       <p className="fw-bold fs-5 mb-2" style={{ color: '#ff6600' }}>
//                         {item.price * item.quantity} ج.م
//                       </p>
//                       <button 
//                         onClick={() => removeItem(item._id)}
//                         className="btn btn-link text-danger p-0 border-0"
//                       >
//                         <i className="fa-solid fa-trash-can fs-5"></i>
//                       </button>
//                     </div>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </div>

//             {/* ملخص الطلب */}
//             <div className="col-lg-4">
//               <div className="bg-white p-4 rounded-4 shadow-lg h-100">
//                 <h4 className="fw-bold mb-4 border-bottom pb-2">ملخص الطلب</h4>
//                 <div className="d-flex justify-content-between mb-3 fs-5">
//                   <span>إجمالي المنتجات:</span>
//                   <span className="fw-bold">{cart.totalCartPrice} ج.م</span>
//                 </div>
//                 <div className="d-flex justify-content-between mb-4 fs-5">
//                   <span>الشحن:</span>
//                   <span className="text-success fw-bold">مجاني</span>
//                 </div>
//                 <hr />
//                 <div className="d-flex justify-content-between mb-4 mt-2">
//                   <span className="fs-4 fw-bold">الإجمالي النهائي:</span>
//                   <span className="fs-3 fw-bold" style={{ color: '#ff6600' }}>{cart.totalCartPrice} ج.م</span>
//                 </div>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="btn w-100 py-3 fw-bold fs-5 shadow"
//                   style={{ backgroundColor: '#ff6600', color: '#000', borderRadius: '15px' }}
//                 >
//                   إتمام الشراء (Checkout)
//                 </motion.button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from '../component/api'; 
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get('/api/cart');
      setCart(res.data.cart);
    } catch (err: any) {
      if (err.response?.status !== 404) toast.error("حدث خطأ أثناء جلب السلة");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchCart(); }, []);

  // وظيفة تحديث الكمية (الزيادة والنقصان) - كما كانت في كودك
  const updateCount = async (itemId: string, count: number) => {
    if (count < 1) return;
    try {
      const res = await api.patch(`/api/cart/${itemId}`, { quantity: count });
      setCart(res.data.cart);
      toast.success("تم تحديث الكمية");
    } catch (err) { toast.error("فشل تحديث الكمية"); }
  };

  // حذف منتج - كما كان في كودك
  const removeItem = async (itemId: string) => {
    try {
      const res = await api.delete(`/api/cart/${itemId}`);
      setCart(res.data.cart);
      toast.warn("تم إزالة المنتج");
    } catch (err) { toast.error("فشل إزالة المنتج"); }
  };

  // إتمام الطلب (Checkout)
const handleCheckout = async () => {
  try {
    setCheckoutLoading(true);
    
    // 1. نكلم الباك إند عشان يسجل الطلب مبدئياً
    const res = await api.post('/api/checkout', { paymentType: paymentMethod });
    
    if (res.data.message) {
      const orderId = res.data.order._id;

      if (paymentMethod === 'cash') {
        // حالة الكاش: وديه لصفحة الفاتورة مباشرة
        toast.success("تم تسجيل طلبك بنجاح");
        navigate(`/order-details/${orderId}`); 
      } else {
        // حالة الفيزا: هنا المفروض نفتح بوابة الدفع
        // لو رابط بـ Stripe مثلاً، الباك إند هيبعتلك رابط دفع (Session URL)
        if (res.data.sessionUrl) {
            window.location.href = res.data.sessionUrl; // تحويل العميل لصفحة الفيزا
        } else {
            // لو لسه مفيش بوابة دفع حقيقية، وديه لصفحة "جاري الدفع" وهمية
            navigate(`/payment-gateway/${orderId}`);
        }
      }
      setCart(null); // تفريغ السلة في الفرونت
    }
  } catch (err: any) {
    toast.error(err.response?.data?.message || "فشل إتمام الطلب");
  } finally {
    setCheckoutLoading(false);
  }
};


  if (loading) return <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#121212' }}><i className="fas fa-spinner fa-spin fa-3x text-warning"></i></div>;

  return (
    <div className="min-vh-100 py-5 text-start" style={{ backgroundColor: '#121212', color: '#fff' }}>
      <Helmet><title>سلة التسوق | Checkout</title></Helmet>

      <div className="container mt-5">
        <h2 className="fw-bold mb-4">
          <i className="fas fa-shopping-cart text-warning me-2"></i> 
          سلة <span style={{ color: '#ff6600' }}>التسوق</span>
        </h2>

        {!cart || cart.cartItems.length === 0 ? (
          <div className="text-center p-5 rounded-4 bg-dark border border-secondary">
             <h4>السلة فارغة حالياً</h4>
          </div>
        ) : (
          <div className="row g-4">
            {/* قائمة المنتجات - نفس تصميمك */}
            <div className="col-lg-8">
              <div className="rounded-4 p-3 shadow-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
                <AnimatePresence>
                  {cart.cartItems.map((item: any) => (
                    <motion.div layout key={item._id} className="d-flex align-items-center justify-content-between border-bottom border-secondary py-3">
                      <div className="d-flex align-items-center">
                        <img src={item.product?.imageCover} className="rounded-3" style={{ width: '70px', height: '70px', objectFit: 'cover' }} alt="" />
                        <div className="ms-3 text-start">
                          <h6 className="mb-0 fw-bold">{item.product?.title}</h6>
                          <small className="text-warning">{item.price} ج.م</small>
                        </div>
                      </div>
                      
                      {/* أزرار الزيادة والنقصان - رجعت زي ما كانت */}
                      <div className="d-flex align-items-center gap-2">
                        <button onClick={() => updateCount(item._id, item.quantity - 1)} className="btn btn-sm btn-outline-secondary border-secondary text-white">-</button>
                        <span className="fw-bold px-2">{item.quantity}</span>
                        <button onClick={() => updateCount(item._id, item.quantity + 1)} className="btn btn-sm btn-outline-warning border-warning text-warning">+</button>
                        <button onClick={() => removeItem(item._id)} className="btn btn-sm btn-outline-danger border-0 ms-3">
                            <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* ملخص الطلب وخيارات الدفع */}
            <div className="col-lg-4">
              <div className="p-4 rounded-4 shadow-sm bg-dark border-0" style={{ borderTop: '4px solid #ff6600 !important' }}>
                <h5 className="fw-bold mb-4 text-start">إتمام العملية</h5>
                
                {/* خيارات الدفع */}
                <div className="mb-4 text-start">
                  <label className="small text-secondary mb-2">اختر وسيلة الدفع:</label>
                  <div 
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2 rounded-3 mb-2 border cursor-pointer ${paymentMethod === 'cash' ? 'border-warning bg-black' : 'border-secondary'}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <input type="radio" checked={paymentMethod === 'cash'} readOnly className="me-2" />
                    <small>كاش (Cash)</small>
                  </div>
                  <div 
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2 rounded-3 border cursor-pointer ${paymentMethod === 'card' ? 'border-warning bg-black' : 'border-secondary'}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <input type="radio" checked={paymentMethod === 'card'} readOnly className="me-2" />
                    <small>فيزا / ماستر كارد</small>
                  </div>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">الإجمالي</span>
                  <span className="fw-bold">{cart.totalCartPrice} ج.م</span>
                </div>
                <hr className="border-secondary" />
                <button 
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="btn w-100 py-3 fw-bold text-white shadow-lg"
                  style={{ backgroundColor: '#ff6600' }}
                >
                  {checkoutLoading ? <i className="fas fa-spinner fa-spin"></i> : 'تأكيد الطلب'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
