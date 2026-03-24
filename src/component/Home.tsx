import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from './api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

interface ICategory { _id: string; name: string; }
interface IProduct { _id: string; title: string; price: number; imageCover: string; category: any; stock: number; }

export default function Home() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('');
  const [page, setPage] = useState(1);
  const [resultsCount, setResultsCount] = useState(0);
  const limit = 8;

  // 1. جلب الأقسام
  useEffect(() => {
    api.get('/api/category').then(res => setCategories(res.data.categories || res.data.data || res.data));
  }, []);

  // 2. جلب المنتجات بناءً على القسم والصفحة
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/api/product?page=${page}&limit=${limit}`;
        if (selectedCat) url += `&category=${selectedCat}`;
        
        const res = await api.get(url);
        setProducts(res.data.products);
        setResultsCount(res.data.results);
      } catch (err) {
        toast.error("خطأ في تحميل المنتجات");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCat, page]);

  return (
    <div style={{ backgroundColor: '#ddd', minHeight: '100vh' }}>
      <Helmet><title>نور ستور | الرئيسية</title></Helmet>

      {/* Hero Section صغير وعصري */}
      <section className="py-4 text-white" style={{ background: 'linear-gradient(90deg, #222 0%, #000 100%)', borderBottom: '3px solid #ff6600' }}>
        <div className="container d-flex justify-content-between align-items-center">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h2 className="fw-bold m-0">استكشف <span style={{ color: '#ff6600' }}>عالمنا</span></h2>
            <p className="small m-0 text-secondary text-right">أفضل المنتجات المختارة بعناية فائقة</p>
          </motion.div>
          <Link to="/products" className="btn btn-sm fw-bold px-4 py-2" style={{ backgroundColor: '#ff6600', borderRadius: '10px' }}>كل المنتجات</Link>
        </div>
      </section>

      {/* الأقسام (تعتمد على الـ API) */}
      <section className="py-4 bg-white shadow-sm sticky-top" style={{ top: '0', zIndex: 100 }}>
        <div className="container">
          <div className="d-flex gap-2 overflow-auto pb-2 custom-scroll">
            <button 
              onClick={() => { setSelectedCat(''); setPage(1); }}
              className={`btn btn-sm px-4 fw-bold rounded-pill transition-all ${selectedCat === '' ? 'btn-dark' : 'btn-outline-dark'}`}
            >
              الكل
            </button>
            {categories.map((cat) => (
              <button 
                key={cat._id}
                onClick={() => { setSelectedCat(cat._id); setPage(1); }}
                className={`btn btn-sm px-4 fw-bold rounded-pill whitespace-nowrap ${selectedCat === cat._id ? 'btn-dark' : 'btn-outline-dark'}`}
                style={selectedCat === cat._id ? { backgroundColor: '#ff6600', borderColor: '#ff6600' } : {}}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* عرض المنتجات */}
      <section className="py-5 container">
        {loading ? (
          <div className="text-center py-5"><i className="fas fa-spinner fa-spin fa-3x" style={{ color: '#ff6600' }}></i></div>
        ) : (
          <>
            <div className="row g-4">
              <AnimatePresence mode="popLayout">
                {products?.map((p) => (
                  <motion.div 
                    layout key={p._id} className="col-6 col-md-3"
                    initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                  >
                    <Link to={`/product/${p._id}`} className="text-decoration-none">
                      <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden" style={{ backgroundColor: '#777' }}>
                        <img src={p.imageCover} className="card-img-top object-fit-cover" style={{ height: '180px' }} alt={p.title} />
                        <div className="card-body p-2 text-white">
                          <h6 className="text-truncate fw-bold mb-1" style={{ fontSize: '0.9rem' }}>{p.title}</h6>
                          <p className="fw-bold m-0" style={{ color: '#ff6600' }}>{p.price} ج.م</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-5 gap-3">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn btn-dark btn-sm px-4">السابق</button>
              <span className="fw-bold p-2 px-3 bg-white rounded shadow-sm">{page}</span>
              <button disabled={resultsCount < limit} onClick={() => setPage(p => p + 1)} className="btn btn-dark btn-sm px-4">التالي</button>
            </div>
          </>
        )}
      </section>

      {/* مميزات الخدمات (في الأسفل كما طلبت) */}
      <section className="py-5 mt-5 border-top bg-white">
        <div className="container">
          <div className="row g-4 text-center">
            {[
              { i: 'fa-truck-fast', t: 'شحن سريع', d: 'لكل مكان' },
              { i: 'fa-shield-heart', t: 'دفع آمن', d: 'تشفير كامل' },
              { i: 'fa-arrows-rotate', t: 'استرجاع', d: 'خلال 14 يوم' },
              { i: 'fa-headset', t: 'دعم فني', d: 'على مدار الساعة' }
            ].map((item, idx) => (
              <div key={idx} className="col-6 col-md-3">
                <i className={`fa-solid ${item.i} fa-2x mb-2`} style={{ color: '#ff6600' }}></i>
                <h6 className="fw-bold mb-1">{item.t}</h6>
                <p className="small text-muted">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-3 text-center text-secondary small">© {new Date().getFullYear()} نور ستور - جميع الحقوق محفوظة</footer>

      <style>{`
        .custom-scroll::-webkit-scrollbar { display: none; }
        .whitespace-nowrap { white-space: nowrap; }
        .transition-all { transition: 0.3s ease; }
      `}</style>
    </div>
  );
}
