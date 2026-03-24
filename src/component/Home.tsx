import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from './api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

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

  useEffect(() => {
    api.get('/api/category').then(res => setCategories(res.data.categories || res.data.data || res.data));
  }, []);

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

      {/* Hero Section - السلايدر العلوي النحيف مع لينك التفاصيل */}
      <section className="py-2 mt-3 text-white" style={{ background: 'linear-gradient(90deg, #222 0%, #000 100%)', borderBottom: '2px solid #ff6600' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h5 className="fw-bold m-0">أبرز <span style={{ color: '#ff6600' }}>المختارات</span></h5>
            </motion.div>
          </div>

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={10}
            slidesPerView={1}
            navigation={true}
            autoplay={{ delay: 3000 }}
            breakpoints={{ 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }}
            style={{
                //@ts-ignore
                '--swiper-navigation-size': '15px',
                '--swiper-navigation-color': '#ff6600',
                '--swiper-pagination-color': '#ff6600',
            }}
          >
            {products.slice(0, 6).map((p) => (
              <SwiperSlide key={p._id}>
                {/* إضافة اللينك هنا للصور العلوية */}
                <Link to={`/productDetails/${p._id}`}>
                  <div className="rounded-3 overflow-hidden shadow-sm border border-secondary" style={{ height: '140px' }}>
                    <img src={p.imageCover} className="w-100 h-100 object-fit-cover" alt={p.title} />
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* الأقسام - شريط تمرير أزرار منسق */}
      <section className="py-2 bg-white shadow-sm sticky-top" style={{ top: '0', zIndex: 100 }}>
        <div className="container">
          <div className="d-flex gap-2 overflow-auto pb-1 hide-scrollbar">
            <button 
                onClick={() => { setSelectedCat(''); setPage(1); }} 
                className={`btn btn-sm px-4 rounded-pill fw-bold border-0 transition-all ${selectedCat === '' ? 'bg-orange text-white' : 'bg-light text-dark'}`}
            > الكل </button>
            {categories.map((cat) => (
              <button 
                key={cat._id} 
                onClick={() => { setSelectedCat(cat._id); setPage(1); }} 
                className={`btn btn-sm px-4 rounded-pill fw-bold border-0 whitespace-nowrap transition-all ${selectedCat === cat._id ? 'bg-orange text-white' : 'bg-light text-dark'}`}
              > {cat.name} </button>
            ))}
          </div>
        </div>
      </section>

      {/* المنتجات - كرت كامل العرض في الموبايل مع لينك التفاصيل */}
      <section className="py-4 container">
        {loading ? (
          <div className="text-center py-5"><i className="fas fa-spinner fa-spin fa-2x" style={{ color: '#ff6600' }}></i></div>
        ) : (
          <>
            <div className="row g-3">
              {products?.map((p) => (
                <div key={p._id} className="col-12 col-md-4 col-lg-3">
                  {/* الربط بصفحة التفاصيل */}
                  <Link to={`/productDetails/${p._id}`} className="text-decoration-none">
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden" 
                      style={{ backgroundColor: '#777' }}
                    >
                      <img src={p.imageCover} className="card-img-top object-fit-cover" style={{ height: '220px' }} alt={p.title} />
                      <div className="card-body p-2 text-white">
                        <h6 className="text-truncate fw-bold mb-1" style={{ fontSize: '0.85rem' }}>{p.title}</h6>
                        <div className="d-flex justify-content-between align-items-center">
                            <p className="fw-bold m-0" style={{ color: '#ff6600', fontSize: '1rem' }}>{p.price} ج.م</p>
                            <span className="badge bg-orange text-dark" style={{fontSize: '10px'}}>عرض التفاصيل</span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4 gap-2 pb-4">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn btn-dark btn-sm px-3 shadow-sm">السابق</button>
              <span className="fw-bold p-1 px-3 bg-white rounded shadow-sm text-dark">{page}</span>
              <button disabled={resultsCount < limit} onClick={() => setPage(p => p + 1)} className="btn btn-dark btn-sm px-3 shadow-sm">التالي</button>
            </div>
          </>
        )}
      </section>

      <footer className="py-3 text-center text-secondary small bg-white border-top">
        © {new Date().getFullYear()} نور ستور - جميع الحقوق محفوظة
      </footer>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .whitespace-nowrap { white-space: nowrap; }
        .bg-orange { background-color: #ff6600 !important; }
        .transition-all { transition: 0.3s ease-in-out; }
        .swiper-button-next, .swiper-button-prev { 
            transform: scale(0.5); 
            background: rgba(255,255,255,0.5); 
            border-radius: 50%; 
            width: 40px; 
            height: 40px; 
            color: #000 !important;
        }
      `}</style>
    </div>
  );
}
