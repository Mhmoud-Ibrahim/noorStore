// import { useContext, useEffect, useState } from "react";
// import { Helmet } from "react-helmet-async";
// import api from "../component/api";
// import { toast } from "react-toastify";
// import Loading from "../component/Loading.tsx";
// import { MainContext } from "./mainContext";

// export default function OrderManagement() {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [report, setReport] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true); // للتحكم في زر التالي
//   const context = useContext(MainContext);

//   if (!context) return null;
//   const { lastInvoice } = context; // استخراج cartCount من الكونتكس

//   // 1. جلب التقرير اليومي
//   const fetchDailyReport = async () => {
//     try {
//       const res = await api.get("/api/daily-report");
//       setReport(res.data.data);
//     } catch (err) {
//       console.error("خطأ في جلب التقرير اليومي");
//     }
//   };

//   // 2. جلب جميع الطلبات مع نظام ترقيم ذكي
//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const limit = 10;
//       const res = await api.get(`/api/all?page=${page}&limit=${limit}`);

//       const fetchedOrders = res.data.orders || [];
//       setOrders(fetchedOrders);
//       console.log(fetchedOrders);
//       // إذا كانت الطلبات المستلمة أقل من الـ limit، فهذا يعني أننا وصلنا للصفحة الأخيرة
//       if (fetchedOrders.length < limit) {
//         setHasMore(false);
//       } else {
//         setHasMore(true);
//       }
//     } catch (err) {
//       toast.error("فشل في تحميل قائمة العمليات");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // استدعاء البيانات عند تغير الصفحة
//   useEffect(() => {
//     fetchDailyReport();
//     fetchOrders();
//   }, [page]);

//   // 3. إلغاء الطلب وإرجاع المخزون
//   const handleCancel = async (id: string) => {
//     if (
//       !window.confirm(
//         "هل أنت متأكد من إلغاء هذه العملية؟ سيتم إرجاع المنتجات للمخزن.",
//       )
//     )
//       return;
//     try {
//       const res = await api.patch(`/api/cancel/${id}`);
//       if (res.data.message) {
//         toast.success("تم إلغاء العملية وإرجاع المخزون بنجاح 🔄");
//         fetchOrders();
//         fetchDailyReport();
//       }
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "فشل إلغاء الطلب");
//     }
//   };
//   const handlePrintPDF = () => {
//     if (!lastInvoice) return;

//     const printWindow = window.open("", "_blank");
//     if (!printWindow)
//       return toast.error("الرجاء السماح بالنوافذ المنبثقة لفتح الفاتورة");

//     // استخراج بيانات المنتج الأول من المصفوفة
//     const item = lastInvoice.orderItems?.[0];
//     const productTitle = item?.product?.title || "منتج عام";
//     const productPrice = item?.price || lastInvoice.totalAmount;
//     const employeeName = lastInvoice.user?.name || "كاشير النظام";

//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>فاتورة بيع رقم #${lastInvoice._id.slice(-6)}</title>
//           <style>
//             body { font-family: Arial, sans-serif; direction: rtl; text-align: center; color: #000; padding: 10px; width: 80mm; margin: 0 auto; }
//             .header { border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
//             .title { font-size: 18px; font-weight: bold; margin: 5px 0; }
//             .info-line { display: flex; justify-content: space-between; font-size: 12px; margin: 3px 0; text-align: right; }
//             .table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 12px; }
//             .table th { border-bottom: 1px solid #000; padding: 5px; text-align: right; }
//             .table td { padding: 5px; text-align: right; }
//             .total-section { border-top: 1px dashed #000; padding-top: 5px; font-size: 14px; font-weight: bold; display: flex; justify-content: space-between; }
//             .footer { font-size: 10px; margin-top: 20px; border-top: 1px dashed #000; padding-top: 10px; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <div class="title">🧾 فاتورة بيع نقدي</div>
//             <p style="margin:2px 0; font-size:11px;">نظام إدارة الحسابات الكاش الفورية</p>
//           </div>
//           <div class="info-line"><span>رقم الفاتورة:</span> <span>#${lastInvoice._id.slice(-6)}</span></div>
//           <div class="info-line"><span>التاريخ:</span> <span>${new Date(lastInvoice.createdAt).toLocaleString("ar-EG")}</span></div>
//           <div class="info-line"><span>العميل:</span> <span>${lastInvoice.customerName || "زبون نقدي"}</span></div>
//           <div class="info-line"><span>الموظف المسؤول:</span> <span>${employeeName}</span></div>
          
//           <table class="table">
//             <thead>
//               <tr>
//                 <th>البيان</th>
//                 <th>الكمية</th>
//                 <th>السعر</th>
//                 <th>الإجمالي</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>${productTitle}</td>
//                 <td>${item?.quantity || 1}</td>
//                 <td>${productPrice} ج.م</td>
//                 <td>${lastInvoice.totalAmount} ج.م</td>
//               </tr>
//             </tbody>
//           </table>

//           <div class="total-section">
//             <span>المبلغ الإجمالي المدفوع:</span>
//             <span>${lastInvoice.totalAmount} ج.م</span>
//           </div>

//           <div class="footer">
//             <p>شكراً لزيارتكم وثقتكم بنا!</p>
//             <p style="font-size:8px; color:#555;">نظام الحسابات والمستندات الذكية</p>
//           </div>
//           <script>
//             window.onload = function() { window.print(); window.close(); }
//           </script>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//   };

//   return (
//     <div
//       className="min-vh-100 py-5"
//       style={{ backgroundColor: "#121212", color: "#fff" }}
//     >
//       <Helmet>
//         <title>لوحة الإدارة | العمليات والمبيعات</title>
//       </Helmet>

//       <div className="container mt-5">
//         <h2 className="fw-bold mb-4 text-start">
//           📊 إدارة <span style={{ color: "#ff6600" }}>المبيعات والطلبات</span>
//         </h2>

//         {/* كروت التقرير اليومي */}
//         <div className="row g-3 mb-5">
//           <div className="col-md-4">
//             <div
//               className="p-4 rounded-4 shadow-sm text-center bg-dark"
//               style={{ borderBottom: "4px solid #ff6600" }}
//             >
//               <small className="text-secondary d-block mb-1">
//                 إجمالي مبيعات اليوم
//               </small>
//               <h3 className="fw-bold text-white">
//                 {report?.totalRevenue || 0}{" "}
//                 <small style={{ fontSize: "14px" }}>ج.م</small>
//               </h3>
//             </div>
//           </div>
//           <div className="col-md-4">
//             <div
//               className="p-4 rounded-4 shadow-sm text-center bg-dark"
//               style={{ borderBottom: "4px solid #28a745" }}
//             >
//               <small className="text-secondary d-block mb-1">
//                 صافي ربح اليوم
//               </small>
//               <h3 className="fw-bold text-success">
//                 {report?.netProfit || 0}{" "}
//                 <small style={{ fontSize: "14px" }}>ج.م</small>
//               </h3>
//             </div>
//           </div>
//           <div className="col-md-4">
//             <div
//               className="p-4 rounded-4 shadow-sm text-center bg-dark"
//               style={{ borderBottom: "4px solid #00c3ff" }}
//             >
//               <small className="text-secondary d-block mb-1">
//                 عدد عمليات اليوم
//               </small>
//               <h3 className="fw-bold text-info">{report?.totalOrders || 0}</h3>
//             </div>
//           </div>
//         </div>

//         {/* جدول العمليات */}
//         {loading ? (
//           <Loading />
//         ) : (
//           <div
//             className="table-responsive rounded-4 shadow-lg"
//             style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
//           >
//             <table className="table table-dark table-hover align-middle mb-0 text-start">
//               <thead className="text-secondary small">
//                 <tr>
//                   <th className="ps-4">التاريخ / الموظف</th>
//                   <th> صورة المنتج</th>
//                   <th>المنتجات المباعة</th>
//                   <th>الإجمالي</th>
//                   <th>طباعة الفاتورة PDF</th>
//                   <th>الحالة</th>
//                   <th className="text-center">إلغاء</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.length === 0 ? (
//                   <tr>
//                     <td colSpan={5} className="text-center py-4 text-secondary">
//                       لا توجد طلبات مسجلة حتى الآن
//                     </td>
//                   </tr>
//                 ) : (
//                   orders.map((order) => (
//                     <tr key={order._id}>
//                       <td className="ps-4">
//                         <div className="small">
//                           {new Date(order.createdAt).toLocaleString("ar-EG")}
//                         </div>
//                         <div className="text-info fw-bold small">
//                           {order.user?.name || "غير معروف"}
//                         </div>
//                       </td>
//                       <td className="ps-4">
//                         <img
//                           src={
//                             order.orderItems[0].product?.imageCover ||
//                             "https://placehold.co"
//                           }
//                           alt={order.orderItems[0].product?.title}
//                           className="rounded-3 object-fit-cover"
//                           style={{ width: "85px", height: "85px" }}
//                         />
//                       </td>
//                       <td>
//                         {order.orderItems?.map((item: any, i: number) => (
//                           <div key={i} className="small text-secondary">
//                             • {item.product?.title || "منتج محذوف"}{" "}
//                             <span className="text-white">
//                               ({item.quantity})
//                             </span>
//                           </div>
//                         ))}
//                       </td>
//                       <td className="fw-bold text-warning">
//                         {order.totalAmount} ج.م
//                       </td>
//                       <td className="fw-bold text-warning">
//                         {lastInvoice && (
//                           <button
//                             onClick={handlePrintPDF}
//                             className="btn btn-success fw-bold px-4 rounded-pill shadow animation-pulse"
//                           >
//                             🖨️ طباعة فاتورة العملية الأخيرة (PDF)
//                           </button>
//                         )}
//                       </td>
//                       <td>
//                         <span
//                           className={`badge rounded-pill ${order.status === "completed" ? "bg-success" : "bg-danger"}`}
//                         >
//                           {order.status === "completed" ? "مكتمل" : "ملغى"}
//                         </span>
//                       </td>
//                       <td className="text-center">
//                         {order.status === "completed" && (
//                           <button
//                             onClick={() => handleCancel(order._id)}
//                             className="btn btn-sm btn-outline-danger border-0"
//                           >
//                             ❌
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* الترقيم الذكي */}
//         <div className="d-flex justify-content-center mt-4 gap-2">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage((p) => p - 1)}
//             className="btn btn-sm btn-dark border-secondary px-3"
//           >
//             السابق
//           </button>
//           <button
//             disabled={!hasMore}
//             onClick={() => setPage((p) => p + 1)}
//             className="btn btn-sm btn-dark border-secondary px-3"
//           >
//             التالي
//           </button>
//         </div>
//       </div>

//       <style>{`
//         .bg-dark { background-color: #1a1a1a !important; }
//         .table-hover tbody tr:hover { background-color: #222 !important; }
//       `}</style>
//     </div>
//   );
// }
import {  useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import api from "../component/api";
import { toast } from "react-toastify";
import Loading from "../component/Loading.tsx";

export default function OrderManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // للتحكم في زر التالي
  
  // 1. جلب التقرير اليومي
  const fetchDailyReport = async () => {
    try {
      const res = await api.get("/api/daily-report");
      setReport(res.data.data);
    } catch (err) {
      console.error("خطأ في جلب التقرير اليومي");
    }
  };

  // 2. جلب جميع الطلبات مع نظام ترقيم ذكي
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const limit = 10;
      const res = await api.get(`/api/all?page=${page}&limit=${limit}`);

      const fetchedOrders = res.data.orders || [];
      setOrders(fetchedOrders);
      console.log(fetchedOrders);
      // إذا كانت الطلبات المستلمة أقل من الـ limit، فهذا يعني أننا وصلنا للصفحة الأخيرة
      if (fetchedOrders.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      toast.error("فشل في تحميل قائمة العمليات");
    } finally {
      setLoading(false);
    }
  };

  // استدعاء البيانات عند تغير الصفحة
  useEffect(() => {
    fetchDailyReport();
    fetchOrders();
  }, [page]);

  // 3. إلغاء الطلب وإرجاع المخزون
  const handleCancel = async (id: string) => {
    if (
      !window.confirm(
        "هل أنت متأكد من إلغاء هذه العملية؟ سيتم إرجاع المنتجات للمخزن.",
      )
    )
      return;
    try {
      const res = await api.patch(`/api/cancel/${id}`);
      if (res.data.message) {
        toast.success("تم إلغاء العملية وإرجاع المخزون بنجاح 🔄");
        fetchOrders();
        fetchDailyReport();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "فشل إلغاء الطلب");
    }
  };

  // 💡 التعديل هنا: الدالة الآن تستقبل كائن الـ order المختار وتطبع بياناته هو فقط
  const handlePrintPDF = (order: any) => {
    if (!order) return toast.error("لا توجد بيانات لهذه الفاتورة");

    const printWindow = window.open("", "_blank");
    if (!printWindow)
      return toast.error("الرجاء السماح بالنوافذ المنبثقة لفتح الفاتورة");

    // استخراج بيانات المنتج الأول من مصفوفة الطلب المختار
    const item = order.orderItems?.[0];
    const productTitle = item?.product?.title || "منتج عام";
    const productPrice = item?.price || order.totalAmount;
    const employeeName = order.user?.name || "كاشير النظام";

    printWindow.document.write(`
      <html>
        <head>
          <title>فاتورة بيع رقم #${order._id.slice(-6)}</title>
          <style>
            body { font-family: Arial, sans-serif; direction: rtl; text-align: center; color: #000; padding: 10px; width: 80mm; margin: 0 auto; }
            .header { border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
            .title { font-size: 18px; font-weight: bold; margin: 5px 0; }
            .info-line { display: flex; justify-content: space-between; font-size: 12px; margin: 3px 0; text-align: right; }
            .table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 12px; }
            .table th { border-bottom: 1px solid #000; padding: 5px; text-align: right; }
            .table td { padding: 5px; text-align: right; }
            .total-section { border-top: 1px dashed #000; padding-top: 5px; font-size: 14px; font-weight: bold; display: flex; justify-content: space-between; }
            .footer { font-size: 10px; margin-top: 20px; border-top: 1px dashed #000; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">🧾 فاتورة بيع نقدي</div>
            <p style="margin:2px 0; font-size:11px;">نظام إدارة الحسابات الكاش الفورية</p>
          </div>
          <div class="info-line"><span>رقم الفاتورة:</span> <span>#${order._id.slice(-6)}</span></div>
          <div class="info-line"><span>التاريخ:</span> <span>${new Date(order.createdAt).toLocaleString("ar-EG")}</span></div>
          <div class="info-line"><span>العميل:</span> <span>${order.customerName || "زبون نقدي"}</span></div>
          <div class="info-line"><span>الموظف المسؤول:</span> <span>${employeeName}</span></div>
          
          <table class="table">
            <thead>
              <tr>
                <th>البيان</th>
                <th>الكمية</th>
                <th>السعر</th>
                <th>الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${productTitle}</td>
                <td>${item?.quantity || 1}</td>
                <td>${productPrice} ج.م</td>
                <td>${order.totalAmount} ج.م</td>
              </tr>
            </tbody>
          </table>

          <div class="total-section">
            <span>المبلغ الإجمالي المدفوع:</span>
            <span>${order.totalAmount} ج.م</span>
          </div>

          <div class="footer">
            <p>شكراً لزيارتكم وثقتكم بنا!</p>
            <p style="font-size:8px; color:#555;">نظام الحسابات والمستندات الذكية</p>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div
      className="min-vh-100 py-5"
      style={{ backgroundColor: "#121212", color: "#fff" }}
    >
      <Helmet>
        <title>لوحة الإدارة | العمليات والمبيعات</title>
      </Helmet>

      <div className="container mt-5">
        <h2 className="fw-bold mb-4 text-start">
          📊 إدارة <span style={{ color: "#ff6600" }}>المبيعات والطلبات</span>
        </h2>

        {/* كروت التقرير اليومي */}
        <div className="row g-3 mb-5">
          <div className="col-md-4">
            <div
              className="p-4 rounded-4 shadow-sm text-center bg-dark"
              style={{ borderBottom: "4px solid #ff6600" }}
            >
              <small className="text-secondary d-block mb-1">
                إجمالي مبيعات اليوم
              </small>
              <h3 className="fw-bold text-white">
                {report?.totalRevenue || 0}{" "}
                <small style={{ fontSize: "14px" }}>ج.م</small>
              </h3>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="p-4 rounded-4 shadow-sm text-center bg-dark"
              style={{ borderBottom: "4px solid #28a745" }}
            >
              <small className="text-secondary d-block mb-1">
                صافي ربح اليوم
              </small>
              <h3 className="fw-bold text-success">
                {report?.netProfit || 0}{" "}
                <small style={{ fontSize: "14px" }}>ج.م</small>
              </h3>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="p-4 rounded-4 shadow-sm text-center bg-dark"
              style={{ borderBottom: "4px solid #00c3ff" }}
            >
              <small className="text-secondary d-block mb-1">
                عدد عمليات اليوم
              </small>
              <h3 className="fw-bold text-info">{report?.totalOrders || 0}</h3>
            </div>
          </div>
        </div>

        {/* جدول العمليات */}
        {loading ? (
          <Loading />
        ) : (
          <div
            className="table-responsive rounded-4 shadow-lg"
            style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
          >
            <table className="table table-dark table-hover align-middle mb-0 text-start">
          
               <thead className="text-secondary small">
                <tr>
                  <th>رقم الطلب</th>
                  <th>التاريخ</th>
                  <th> صورة المنتج</th>                  
                   <th>اسم المنتج</th>
                  <th>العميل</th>
                  <th>الإجمالي</th>
                  <th>الحالة</th>
                  <th className="text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>({order._id.slice(-6)})</td>
                     <td>{new Date(order.createdAt).toLocaleDateString("ar-EG")}</td>
                      <td className="ps-4">
                         <img
                          src={
                             order.orderItems[0].product?.imageCover ||
                             "https://via.placeholder.com/150"
                           }
                           alt={order.orderItems[0].product?.title}
                           className="rounded-3 object-fit-cover"
                           style={{ width: "85px", height: "85px" }}
                         />
                       </td>
                    <td>{order.orderItems?.[0]?.product?.title || "منتج عام"}</td>
                    <td>{order.customerName || "زبون نقدي"}</td>
                    <td>{order.totalAmount} ج.م</td>
                   
                    <td>
                      <span className={`badge ${order.status === "cancelled" ? "bg-danger" : "bg-success"}`}>
                        {order.status === "cancelled" ? "ملغي ❌" : "مكتمل  "}
                      </span>
                    </td>
                    <td className="text-center">
                      {/* 💡 التعديل هنا: يتم تمرير كائن الطلب الحالي (order) عند الضغط على زر الطباعة */}
                      <button
                        className="btn btn-sm btn-outline-info me-2"
                        onClick={() => handlePrintPDF(order)}
                      >
                        🖨️ طباعة الفاتورة
                      </button>
                      {order.status !== "cancelled" && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleCancel(order._id)}
                        >
                          إلغاء الطلب
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* أزرار التنقل بين الصفحات (Pagination) */}
        <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
          <button
            className="btn btn-outline-light"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            السابق
          </button>
          <span className="text-secondary">الصفحة {page}</span>
          <button
            className="btn btn-outline-light"
            disabled={!hasMore}
            onClick={() => setPage((prev) => prev + 1)}
          >
            التالي
          </button>
        </div>

      </div>
    </div>
  );
}

