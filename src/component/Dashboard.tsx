import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

import { toast } from "react-toastify";
import api from "./api";
import Loading from "./Loading";

// تعريف الأنواع المستلمة من الباك إند
interface DashboardData {
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    productCost: number;
    netProfit: number;
    profitMargin: string;
    ordersCount: number;
  };
  topSellingProducts: Array<{ _id: string; title: string; totalSold: number; currentStock: number }>;
  lowStockAlerts: Array<{ _id: string; title: string; stock: number; price: number }>;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({ from: "", to: "" });

  // جلب البيانات من الباك إند
  const fetchStats = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (dates.from) params.append("from", dates.from);
      if (dates.to) params.append("to", dates.to);

      const res = await api.get(`/api/dashboard/stats?${params.toString()}`);
      if (res.data.message === "success") {
        setData(res.data.data);
      }
    } catch (err) {
      toast.error("فشل في جلب بيانات لوحة التحكم");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-vh-100 py-5 text-white" style={{ backgroundColor: "#121212" }}>
      <Helmet><title>لوحة التحكم | الإحصائيات</title></Helmet>

      <div className="container mt-4">
        {/* فلتر التواريخ */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 p-3 rounded-3" style={{ backgroundColor: "#1a1a1a", border: "1px solid #ff6600" }}>
          <h4 className="fw-bold mb-3 mb-md-0" style={{ color: "#ff6600" }}>📊 إحصائيات النظام</h4>
          <div className="d-flex gap-2">
            <input type="date" className="form-control bg-dark text-white border-secondary" onChange={(e) => setDates({ ...dates, from: e.target.value })} />
            <input type="date" className="form-control bg-dark text-white border-secondary" onChange={(e) => setDates({ ...dates, to: e.target.value })} />
            <button className="btn btn-warning fw-bold text-dark px-4" onClick={fetchStats}>تصفية</button>
          </div>
        </div>

        {/* كروت الإحصائيات السريعة */}
        {data && (
          <>
            <div className="row g-4 mb-5">
              {[
                { title: "إجمالي المبيعات", value: `${data.summary.totalRevenue} ج.م`, color: "#00ffcc" },
                { title: "صافي الأرباح", value: `${data.summary.netProfit} ج.م`, color: "#ff6600" },
                { title: "هامش الربح", value: data.summary.profitMargin, color: "#ffcc00" },
                { title: "عدد الطلبات", value: data.summary.ordersCount, color: "#00bcff" },
                { title: "المصروفات الخارجية", value: `${data.summary.totalExpenses} ج.م`, color: "#ff4444" },
                { title: "تكلفة البضاعة المباعة", value: `${data.summary.productCost} ج.م`, color: "#b55dff" },
              ].map((card, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="col-md-4 col-sm-6">
                  <div className="p-4 rounded-4 shadow text-center" style={{ backgroundColor: "#1a1a1a", borderLeft: `5px solid ${card.color}` }}>
                    <p className="text-secondary small mb-1">{card.title}</p>
                    <h3 className="fw-bold" style={{ color: card.color }}>{card.value}</h3>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* الجداول والتحليلات */}
            <div className="row g-4">
              {/* الأكثر مبيعاً */}
              <div className="col-md-6">
                <div className="p-4 rounded-4 h-100" style={{ backgroundColor: "#1a1a1a" }}>
                  <h5 className="fw-bold mb-3" style={{ color: "#ff6600" }}>🔥 الأكثر مبيعاً</h5>
                  <div className="table-responsive">
                    <table className="table table-dark table-hover border-secondary text-center align-middle">
                      <thead>
                        <tr>
                          <th>المنتج</th>
                          <th>الكمية المباعة</th>
                          <th>المخزون الحالي</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.topSellingProducts.map((p) => (
                          <tr key={p._id}>
                            <td>{p.title}</td>
                            <td className="text-warning fw-bold">{p.totalSold}</td>
                            <td>{p.currentStock}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* تنبيهات المخزون المنخفض */}
              <div className="col-md-6">
                <div className="p-4 rounded-4 h-100" style={{ backgroundColor: "#1a1a1a" }}>
                  <h5 className="fw-bold mb-3 text-danger">⚠️ تنبيهات المخزون (أقل من 5 قطع)</h5>
                  <div className="table-responsive">
                    <table className="table table-dark table-hover border-secondary text-center align-middle">
                      <thead>
                        <tr>
                          <th>المنتج</th>
                          <th>المخزون</th>
                          <th>السعر</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.lowStockAlerts.map((p) => (
                          <tr key={p._id}>
                            <td>{p.title}</td>
                            <td className="text-danger fw-bold">{p.stock}</td>
                            <td>{p.price} ج.م</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
