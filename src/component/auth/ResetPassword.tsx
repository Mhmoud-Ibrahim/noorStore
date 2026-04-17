import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from '../api'; 
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.patch(`/auth/resetPassword/${token}`, { password });
      if (response.data.message === "success") {
        toast.success("تم تغيير كلمة المرور بنجاح! يمكنك الدخول الآن.");
        navigate('/login');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "الرمز منتهي الصلاحية أو غير صحيح";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: '#ddd' }}>
      <Helmet><title>تعيين كلمة المرور الجديدة | المتجر</title></Helmet>
      <div className="container mt-5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="card shadow-lg p-4 m-auto" 
          style={{ maxWidth: '500px', borderRadius: '15px', border: 'none' }}
        >
          <h2 className="fw-bold mb-4" style={{ borderRight: '5px solid #ff6600', paddingRight: '15px', color: '#333' }}>
            كلمة مرور جديدة
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="fw-bold text-dark mb-1">كلمة المرور الجديدة</label>
              <input 
                type="password" 
                className="form-control" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="أدخل 6 أرقام أو حروف على الأقل"
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
              {loading ? <><i className="fas fa-spinner fa-spin me-2"></i> جاري الحفظ...</> : "تغيير كلمة المرور"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}