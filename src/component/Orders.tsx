import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../component/api';
import { toast } from 'react-toastify';
import Loading from '../component/Loading.tsx';

export default function OrderManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // 1. جلب التقرير اليومي (Revenue / Profit)
  const fetchDailyReport = async () => {
    try {
      const res = await api.get('/api/daily-report');
      setReport(res.data.data);
    } catch (err) {
      console.error("خطأ في جلب التقرير");
    }
  };

  // 2. جلب جميع الطلبات
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/getAllOrders?page=${page}&limit=10`);
      setOrders(res.data.orders);
    } catch (err) {
      toast.error("فشل في تحميل العمليات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyReport();
    fetchOrders();
  }, [page]);

  // 3. إلغاء الطلب (Cancel Order)
  const handleCancel = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من إلغاء هذه العملية؟ سيتم إرجاع المنتجات للمخزن.")) return;
    try {
      const res = await api.patch(`/api/cancel/${id}`);
      if (res.data.message) {
        toast.success("تم إلغاء العملية وإرجاع المخزون 🔄");
        fetchOrders(); // تحديث القائمة
        fetchDailyReport(); // تحديث التقرير
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "فشل الإلغاء");
    }
  };

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: '#121212', color: '#fff' }}>
      <Helmet><title>لوحة الإدارة | العمليات والمبيعات</title></Helmet>

      <div className="container mt-5">
        <h2 className="fw-bold mb-4 text-start">
          <i className="fas fa-file-invoice-dollar text-warning me-2"></i> 
          إدارة <span style={{ color: '#ff6600' }}>المبيعات والطلبات</span>
        </h2>

        {/* كروت التقرير اليومي */}
        <div className="row g-3 mb-5">
          <div className="col-md-4">
            <div className="p-4 rounded-4 shadow-sm border-0 bg-dark text-center" style={{ borderBottom: '4px solid #ff6600 !important' }}>
              <small className="text-secondary d-block mb-1">إجمالي مبيعات اليوم</small>
              <h3 className="fw-bold text-white">{report?.totalRevenue || 0} <small style={{fontSize:'14px'}}>ج.م</small></h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 rounded-4 shadow-sm border-0 bg-dark text-center" style={{ borderBottom: '4px solid #28a745 !important' }}>
              <small className="text-secondary d-block mb-1">صافي ربح اليوم</small>
              <h3 className="fw-bold text-success">{report?.netProfit || 0} <small style={{fontSize:'14px'}}>ج.م</small></h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 rounded-4 shadow-sm border-0 bg-dark text-center" style={{ borderBottom: '4px solid #00c3ff !important' }}>
              <small className="text-secondary d-block mb-1">عدد عمليات اليوم</small>
              <h3 className="fw-bold text-info">{report?.totalOrders || 0}</h3>
            </div>
          </div>
        </div>

        {/* جدول العمليات */}
        {loading ? <Loading /> : (
          <div className="table-responsive rounded-4 shadow-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
            <table className="table table-dark table-hover align-middle mb-0 text-start">
              <thead className="text-secondary small">
                <tr>
                  <th className="ps-4">التاريخ / الموظف</th>
                  <th>المنتجات المباعة</th>
                  <th>الإجمالي</th>
                  <th>الحالة</th>
                  <th className="text-center">إلغاء</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="ps-4">
                      <div className="small">{new Date(order.createdAt).toLocaleString('ar-EG')}</div>
                      <div className="text-info fw-bold small">{order.user?.name || 'غير معروف'}</div>
                    </td>
                    <td>
                      {order.orderItems.map((item: any, i: number) => (
                        <div key={i} className="small text-secondary">
                          • {item.product?.title} <span className="text-white">({item.quantity})</span>
                        </div>
                      ))}
                    </td>
                    <td className="fw-bold text-warning">{order.totalAmount} ج.م</td>
                    <td>
                      <span className={`badge rounded-pill ${order.status === 'completed' ? 'bg-success' : 'bg-danger'}`}>
                        {order.status === 'completed' ? 'مكتمل' : 'ملغى'}
                      </span>
                    </td>
                    <td className="text-center">
                      {order.status === 'completed' && (
                        <button onClick={() => handleCancel(order._id)} className="btn btn-sm btn-outline-danger border-0">
                          <i className="fas fa-times-circle"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* الترقيم */}
        <div className="d-flex justify-content-center mt-4 gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn btn-sm btn-dark border-secondary px-3">السابق</button>
          <button onClick={() => setPage(p => p + 1)} className="btn btn-sm btn-dark border-secondary px-3">التالي</button>
        </div>
      </div>

      <style>{`
        .bg-dark { background-color: #1a1a1a !important; }
        .table-hover tbody tr:hover { background-color: #222 !important; }
        .vr { width: 1px; background: #333; height: 20px; }
      `}</style>
    </div>
  );
}
