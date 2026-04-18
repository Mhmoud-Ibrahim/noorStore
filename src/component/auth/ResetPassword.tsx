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
    token: "", // أضفنا خانة للتوكن هنا
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // بنبعت التوكن في الرابط والباسورد في الـ body
      const response = await api.patch(
        `/auth/forgotPassword/${formData.token}`,
        {
          password: formData.password,
        },
      );

      if (response.data.message === "success") {
        toast.success("تم تغيير كلمة المرور بنجاح!");
        navigate("/login");
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "الرمز غير صحيح أو منتهي الصلاحية";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: "#ddd" }}>
      <Helmet>
        <title>تعيين كلمة المرور | المتجر</title>
      </Helmet>
      <div className="container mt-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card shadow-lg p-4 m-auto"
          style={{ maxWidth: "500px", borderRadius: "15px", border: "none" }}
        >
          <h2
            className="fw-bold mb-4"
            style={{
              borderRight: "5px solid #ff6600",
              paddingRight: "15px",
              color: "#333",
            }}
          >
            استكمال الاستعادة
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="fw-bold text-dark mb-1">
                رمز التحقق (Token)
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="انسخ الرمز المرسل لإيميلك"
                value={formData.token}
                onChange={(e) =>
                  setFormData({ ...formData, token: e.target.value })
                }
                required
              />
            </div>
            // تعديل في الجزء الخاص بالـ Input في صفحة ResetPassword
            <div className="mb-3">
              <label className="fw-bold text-dark mb-1">رمز التحقق (OTP)</label>
              <input
                type="text"
                className="form-control text-center fw-bold"
                placeholder="000000"
                maxLength={6} // تحديد 6 أرقام فقط
                value={formData.token}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    token: e.target.value.replace(/\D/g, ""),
                  })
                } // يقبل أرقام فقط
                required
                style={{ letterSpacing: "5px", fontSize: "1.2rem" }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="btn w-100 fw-bold py-2 mt-3 shadow-sm"
              style={{ backgroundColor: "#ff6600", color: "#fff" }}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i> جاري
                  التحديث...
                </>
              ) : (
                "تحديث كلمة المرور"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
