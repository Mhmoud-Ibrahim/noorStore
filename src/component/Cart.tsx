import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from './api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

interface ICartItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    imageCover: string;
    price: number;
    stock: number;
  };
  quantity: number;
  price: number;
}

interface ICart {
  _id: string;
  cartItems: ICartItem[];
  totalCartPrice: number;
}

export default function Cart() {
  const [cart, setCart] = useState<ICart | null>(null);
  const [loading, setLoading] = useState(true);

  // جلب بيانات السلة
  const fetchCart = async () => {
    try {
      const res = await api.get('/api/cart');
      setCart(res.data.cart);
    } catch (err: any) {
      if (err.response?.status !== 404) {
        toast.error("حدث خطأ أثناء جلب السلة");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // تحديث الكمية
  const updateCount = async (itemId: string, count: number) => {
    try {
      const res = await api.patch(`/api/cart/${itemId}`, { quantity: count });
      setCart(res.data.cart);
      toast.success("تم تحديث الكمية");
    } catch (err) {
      toast.error("فشل تحديث الكمية");
    }
  };

  // حذف منتج
  const removeItem = async (itemId: string) => {
    try {
      const res = await api.delete(`/api/cart/${itemId}`);
      setCart(res.data.cart);
      toast.warn("تم إزالة المنتج من السلة");
    } catch (err) {
      toast.error("فشل إزالة المنتج");
    }
  };

  if (loading) return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#ddd' }}>
      <i className="fas fa-spinner fa-spin fa-3x" style={{ color: '#ff6600' }}></i>
    </div>
  );

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: '#ddd' }}>
      <Helmet>
        <title>المتجر | عربة التسوق</title>
      </Helmet>

      <div className="container mt-5">
        <h2 className="fw-bold mb-4 text-dark">
          <i className="fa-solid fa-cart-shopping me-2" style={{ color: '#ff6600' }}></i>
          عربة التسوق
        </h2>

        {!cart || cart.cartItems.length === 0 ? (
          <div className="bg-white p-5 rounded-4 shadow-sm text-center">
            <i className="fa-solid fa-cart-plus fa-4x mb-3 text-muted"></i>
            <h3>عربة التسوق فارغة</h3>
            <Link to="/" className="btn mt-3 px-4 py-2 fw-bold" style={{ backgroundColor: '#ff6600', color: '#000', borderRadius: '10px' }}>
              ابدأ التسوق الآن
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* قائمة المنتجات */}
            <div className="col-lg-8">
              <AnimatePresence>
                {cart.cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white p-3 rounded-4 shadow-sm mb-3 d-flex align-items-center"
                  >
                    <img 
                      src={item.product.imageCover} 
                      alt={item.product.title} 
                      className="rounded-3 object-fit-cover" 
                      style={{ width: '100px', height: '100px', backgroundColor: '#f8f9fa' }}
                    />
                    <div className="ms-3 flex-grow-1">
                      <h5 className="fw-bold text-dark mb-1">{item.product.title}</h5>
                      <p className="text-secondary mb-2">السعر: {item.price} ج.م</p>
                      
                      <div className="d-flex align-items-center">
                        <button 
                          onClick={() => updateCount(item?._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="btn btn-sm btn-outline-dark rounded-circle"
                        >-</button>
                        <span className="mx-3 fw-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateCount(item._id, item.quantity + 1)}
                          className="btn btn-sm btn-outline-dark rounded-circle"
                        >+</button>
                      </div>
                    </div>
                    <div className="text-end">
                      <p className="fw-bold fs-5 mb-2" style={{ color: '#ff6600' }}>
                        {item.price * item.quantity} ج.م
                      </p>
                      <button 
                        onClick={() => removeItem(item._id)}
                        className="btn btn-link text-danger p-0 border-0"
                      >
                        <i className="fa-solid fa-trash-can fs-5"></i>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ملخص الطلب */}
            <div className="col-lg-4">
              <div className="bg-white p-4 rounded-4 shadow-lg h-100">
                <h4 className="fw-bold mb-4 border-bottom pb-2">ملخص الطلب</h4>
                <div className="d-flex justify-content-between mb-3 fs-5">
                  <span>إجمالي المنتجات:</span>
                  <span className="fw-bold">{cart.totalCartPrice} ج.م</span>
                </div>
                <div className="d-flex justify-content-between mb-4 fs-5">
                  <span>الشحن:</span>
                  <span className="text-success fw-bold">مجاني</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4 mt-2">
                  <span className="fs-4 fw-bold">الإجمالي النهائي:</span>
                  <span className="fs-3 fw-bold" style={{ color: '#ff6600' }}>{cart.totalCartPrice} ج.م</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn w-100 py-3 fw-bold fs-5 shadow"
                  style={{ backgroundColor: '#ff6600', color: '#000', borderRadius: '15px' }}
                >
                  إتمام الشراء (Checkout)
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
