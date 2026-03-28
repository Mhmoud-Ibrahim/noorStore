import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from './api'; // تأكد من المسار الصحيح لملف الـ api
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';

// استايلات Swiper
import 'swiper/css';

import 'swiper/css/pagination';

interface IProduct { _id: string; title: string; imageCover: string; }

export default function About() {
  const [products, setProducts] = useState<IProduct[]>([]);

  // جلب بعض المنتجات لعرضها في السلايدر
  useEffect(() => {
    api.get('/api/product?limit=8')
      .then(res => setProducts(res.data.products))
      .catch(err => console.log("خطأ في جلب الصور للسلايدر", err));
  }, []);

  return (
    <div style={{ backgroundColor: '#ddd', minHeight: '100vh' }}>
      <Helmet><title>نور ستور | من نحن</title></Helmet>

      {/* Hero Section */}
      <section className="py-5 text-white shadow-sm" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)', borderBottom: '4px solid #ff6600' }}>
        <div className="container text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="fw-bold display-5"
          >
            عن <span style={{ color: '#ff6600' }}>نور ستور</span>
          </motion.h1>
          <p className="text-secondary mt-2">جودة نثق بها.. ومنتجات تليق بكم</p>
        </div>
      </section>

      {/* قصة المتجر بتنسيق مودرن */}
      <section className="container my-5">
        <div className="row g-4 align-items-center">
          <div className="col-md-6 order-2 order-md-1">
            <motion.div 
              initial={{ opacity: 0, x: -50 }} 
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-4 rounded-4 bg-white shadow-sm border-start border-5 border-warning"
            >
              <h2 className="fw-bold mb-4" style={{ color: '#222' }}>لماذا <span style={{ color: '#ff6600' }}>نحن؟</span></h2>
              <p className="fs-6 text-muted" style={{ lineHeight: '1.9' }}>
                في "نور ستور"، نسعى لتوفير تجربة تسوق فريدة تجمع بين الأناقة والجودة. نحن فخورون بخدمة أكثر من 10,000 عميل، ونحرص دائماً على أن تكون منتجاتنا المختارة من قاعدة بياناتنا هي الأفضل في السوق المصري.
              </p>
              <div className="d-flex gap-3 mt-4">
                <div className="text-center">
                  <h4 className="fw-bold m-0" style={{ color: '#ff6600' }}>+10K</h4>
                  <small className="text-secondary">عميل سعيد</small>
                </div>
                <div className="vr"></div>
                <div className="text-center">
                  <h4 className="fw-bold m-0" style={{ color: '#ff6600' }}>100%</h4>
                  <small className="text-secondary">جودة أصلية</small>
                </div>
              </div>
            </motion.div>
          </div>

          {/* سلايدر الصور من الداتا بيز بتأثير 3D Coverflow */}
          <div className="col-md-6 order-1 order-md-2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              whileInView={{ opacity: 1, scale: 1 }}
              className="rounded-4 overflow-hidden"
            >
              <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                autoplay={{ delay: 2500 }}
                coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                }}
                pagination={true}
                modules={[EffectCoverflow, Pagination, Autoplay]}
                className="mySwiper"
                style={{ width: '100%', padding: '20px 0' }}
              >
                {products.length > 0 ? products.map((p) => (
                  <SwiperSlide key={p._id} style={{ width: '280px', height: '350px' }}>
                    <div className="card h-100 border-0 shadow-lg rounded-4 overflow-hidden bg-dark">
                      <img src={p.imageCover} className="w-100 h-100 object-fit-cover shadow-sm" alt={p.title} />
                      <div className="position-absolute bottom-0 start-0 end-0 p-2 text-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
                        <span className="text-white small fw-bold text-truncate d-block">{p.title}</span>
                      </div>
                    </div>
                  </SwiperSlide>
                )) : (
                    // عرض صور مؤقتة في حالة عدم وجود منتجات
                    [1,2,3].map(i => (
                        <SwiperSlide key={i} style={{ width: '280px', height: '350px' }}>
                            <div className="w-100 h-100 bg-secondary rounded-4 animate-pulse"></div>
                        </SwiperSlide>
                    ))
                )}
              </Swiper>
            </motion.div>
          </div>
        </div>
      </section>

      {/* قسم أخير لتحفيز الشراء */}
      <section className="container mb-5">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="p-5 rounded-5 text-center text-white shadow-lg"
          style={{ background: '#ff6600' }}
        >
          <h2 className="fw-bold mb-3">هل أنت مستعد لتجربة تسوق مختلفة؟</h2>
          <p className="mb-4 opacity-75">تصفح مجموعتنا المختارة من أحدث المنتجات الآن</p>
          <button className="btn btn-dark btn-lg px-5 rounded-pill fw-bold shadow">ابدأ التسوق</button>
        </motion.div>
      </section>

      <footer className="py-3 text-center text-secondary small bg-white border-top">
        © {new Date().getFullYear()} نور ستور - جميع الحقوق محفوظة
      </footer>

      <style>{`
        .swiper-slide { background-position: center; background-size: cover; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        .swiper-pagination-bullet-active { background: #ff6600 !important; }
      `}</style>
    </div>
  );
}
