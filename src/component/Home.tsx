// import { Helmet } from "react-helmet-async"

// function Home() {
//   return <>
//    <Helmet>
//         <title>chatnow </title>
//         <meta name="description" content="chat now with friends " />
//       </Helmet>
//   </>
// }

// export default Home
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

// استيراد ستايلات السويبر
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
export default function Home() {
  
  // أنيميشن للعناصر
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const services = [
    { icon: 'fa-truck-fast', title: 'شحن سريع', desc: 'توصيل لجميع المحافظات' },
    { icon: 'fa-shield-halved', title: 'دفع آمن', desc: 'دفع عند الاستلام أو فيزا' },
    { icon: 'fa-rotate-left', title: 'استرجاع سهل', desc: 'سياسة استرجاع خلال 14 يوم' },
    { icon: 'fa-headset', title: 'دعم 24/7', desc: 'متواجدون لخدمتك دائماً' },
  ];

  return (
    <div style={{ backgroundColor: '#ddd', minHeight: '100vh' }}>
      <Helmet><title>نور ستور | الرئيسية</title></Helmet>

      {/* 1. Hero Section (Slider) */}
      <section className="hero-section overflow-hidden shadow-sm" style={{ height: '80vh', backgroundColor: '#000' }}>
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          className="h-100"
        >
          <SwiperSlide>
            <div className="h-100 d-flex align-items-center justify-content-center text-center text-white position-relative" 
                 style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                <h1 className="display-2 fw-bold mb-3">أحدث صيحات الموضة</h1>
                <p className="fs-4 mb-4">اكتشف تشكيلة واسعة من الملابس العصرية بجودة لا تقارن</p>
                <Link to="/products" className="btn btn-lg px-5 fw-bold" style={{ backgroundColor: '#ff6600', color: '#000', borderRadius: '30px' }}>تسوق الآن</Link>
              </motion.div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
             {/* Slide 2 - يمكن إضافة صورة أخرى هنا */}
             <div className="h-100 d-flex align-items-center justify-content-center text-center text-white position-relative" 
                 style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <motion.div initial="hidden" whileInView="visible" variants={fadeInUp}>
                <h1 className="display-2 fw-bold mb-3">عروض الصيف المذهلة</h1>
                <p className="fs-4 mb-4">خصومات تصل إلى 50% على جميع المنتجات الإلكترونية</p>
                <Link to="/products" className="btn btn-lg px-5 fw-bold" style={{ backgroundColor: '#ff6600', color: '#000', borderRadius: '30px' }}>اكتشف العروض</Link>
              </motion.div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* 2. Services Features */}
      <section className="py-5 bg-white shadow-sm">
        <div className="container">
          <div className="row g-4 text-center">
            {services.map((ser, i) => (
              <motion.div key={i} className="col-md-3" whileHover={{ y: -10 }} transition={{ type: 'spring' }}>
                <i className={`fa-solid ${ser.icon} fa-3x mb-3`} style={{ color: '#ff6600' }}></i>
                <h5 className="fw-bold text-dark">{ser.title}</h5>
                <p className="text-muted small">{ser.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Categories Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="fw-bold mb-5 text-dark" style={{ borderRight: '6px solid #ff6600', paddingRight: '15px' }}>تصفح بالأقسام</h2>
          <div className="row g-4">
             {['إلكترونيات', 'ملابس', 'أحذية', 'إكسسوارات'].map((cat, i) => (
               <div key={i} className="col-6 col-md-3">
                 <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="category-card p-4 text-center bg-dark text-white rounded-4 shadow cursor-pointer"
                    style={{ border: '2px solid transparent', transition: '0.3s' }}
                 >
                   <div className="mb-3 d-inline-block p-3 rounded-circle bg-white text-dark">
                      <i className="fa-solid fa-layer-group fa-xl"></i>
                   </div>
                   <h6 className="fw-bold mb-0">{cat}</h6>
                 </motion.div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. Call to Action (CTA) */}
      <section className="py-5 container">
        <motion.div 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          className="rounded-5 p-5 text-center text-white"
          style={{ background: 'linear-gradient(135deg, #333 0%, #111 100%)', border: '1px solid #ff6600' }}
        >
          <h2 className="display-5 fw-bold mb-4">هل أنت مستعد لتجربة تسوق فريدة؟</h2>
          <p className="fs-5 text-secondary mb-4">انضم إلى أكثر من 50 ألف عميل يثقون في منتجاتنا حول العالم</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/products" className="btn btn-lg px-4 py-3 fw-bold" style={{ backgroundColor: '#ff6600', color: '#000', borderRadius: '15px' }}>اذهب للمتجر</Link>
            <button className="btn btn-lg btn-outline-light px-4 py-3 fw-bold" style={{ borderRadius: '15px' }}>تواصل معنا</button>
          </div>
        </motion.div>
      </section>

      {/* 5. Footer Preview */}
      <footer className="py-4 text-center text-dark mt-5 border-top border-secondary">
        <p className="mb-0 fw-bold">جميع الحقوق محفوظة &copy; {new Date().getFullYear()} نور ستور</p>
      </footer>
    </div>
  );
}
