import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import api from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    token: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // إرسال الـ OTP في الرابط والباسورد في الـ body
      const response = await api.patch(
        `/auth/resetPassword/${formData.token}`,
        { password: formData.password }
      );

      if (response.data.message === "success") {
        toast.success("تم تغيير كلمة المرور بنجاح!");
        navigate("/login");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "الرمز غير صحيح أو منتهي الصلاحية";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: "#ddd" }}>
      <Helmet><title>تعيين كلمة المرور | المتجر</title></Helmet>
      <div className="container mt-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card shadow-lg p-4 m-auto"
          style={{ maxWidth: "500px", borderRadius: "15px", border: "none" }}
        >
          <h2 className="fw-bold mb-4" style={{ borderRight: "5px solid #ff6600", paddingRight: "15px", color: "#333" }}>
            استكمال الاستعادة
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4 text-center">
              <label className="fw-bold text-dark mb-2 d-block text-start">رمز التحقق (OTP)</label>
              <input
                type="text"
                className="form-control text-center fw-bold"
                placeholder="000000"
                maxLength={6}
                value={formData.token}
                onChange={(e) => setFormData({ ...formData, token: e.target.value.replace(/\D/g, "") })}
                required
                style={{ letterSpacing: "8px", fontSize: "1.5rem", border: "2px solid #ff6600" }}
              />
              <small className="text-muted mt-2 d-block text-start">أدخل الـ 6 أرقام المرسلة إلى إيميلك</small>
            </div>

            <div className="mb-3 text-start">
              <label className="fw-bold text-dark mb-1">كلمة المرور الجديدة</label>
              <input
                type="password"
                className="form-control shadow-none"
                placeholder="أدخل كلمة المرور الجديدة"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="btn w-100 fw-bold py-2 mt-3 shadow-sm text-white"
              style={{ backgroundColor: "#ff6600" }}
            >
              {loading ? <><i className="fas fa-spinner fa-spin me-2"></i> جاري التحديث...</> : "تحديث كلمة المرور"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
