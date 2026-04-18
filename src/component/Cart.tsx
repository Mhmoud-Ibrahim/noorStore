
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from '../component/api'; 
import { toast } from 'react-toastify';

export default function Cart() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
 

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
const phoneNumber = "201278576173";
const message ="Hello, I would like to place an order";
  const whatsappUrl = `https://wa.me${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  // فتح الرابط في صفحة جديدة
  window.open(whatsappUrl, "_blank");
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
                 
                  className="btn w-100 py-3 fw-bold text-white shadow-lg"
                  style={{ backgroundColor: '#ff6600' }}
                >
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : 'تأكيد الطلب'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
