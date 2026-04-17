import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from '../api'; 
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
let navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/forgotPassword', { email });
      if (response.data.status === "success") {
        toast.success("تم إرسال رمز استعادة كلمة المرور لإيميلك");
        console.log("Reset Token:", response.data.resetToken); // للتيست فقط
        setTimeout(() => {
        navigate('/reset-password'); 
    }, 2000);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "فشل في إرسال الرمز";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: '#ddd' }}>
      <Helmet><title>استعادة كلمة المرور | المتجر</title></Helmet>
      <div className="container mt-5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="card shadow-lg p-4 m-auto" 
          style={{ maxWidth: '500px', borderRadius: '15px', border: 'none' }}
        >
          <h2 className="fw-bold mb-4" style={{ borderRight: '5px solid #ff6600', paddingRight: '15px', color: '#333' }}>
            نسيت كلمة المرور؟
          </h2>
          <p className="text-muted mb-4">أدخل بريدك الإلكتروني وسنرسل لك رابطاً لاستعادة حسابك.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="fw-bold text-dark mb-1">البريد الإلكتروني</label>
              <input 
                type="email" 
                className="form-control" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="example@gmail.com"
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }} 
              whileTap={{ scale: 0.99 }}
              type="submit" 
              disabled={loading} 
              className="btn w-100 fw-bold py-2 mt-3 shadow-sm" 
              style={{ backgroundColor: '#ff6600', color: '#fff' }}
            >
              {loading ? <><i className="fas fa-spinner fa-spin me-2"></i> جاري الإرسال...</> : "إرسال رمز الاستعادة"}
            </motion.button>

            <div className="text-center mt-4">
              <Link to="/login" className="text-decoration-none fw-bold" style={{ color: '#ff6600' }}>
                 العودة لتسجيل الدخول
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
