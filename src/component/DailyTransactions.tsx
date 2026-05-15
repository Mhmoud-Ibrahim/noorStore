import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import api from "../component/api";
import { toast } from "react-toastify";

export default function DailyTransactions() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [txType, setTxType] = useState<"sale" | "expense">("sale");
  const [lastInvoice, setLastInvoice] = useState<any>(null); // لحفظ بيانات آخر فاتورة للطباعة

  // حقول الاستمارة مطابقة لبيانات الباك إند
  const [formData, setFormData] = useState({
    customerName: "",
    productId: "",
    quantity: 1,
    amount: 0,
    notes: ""
  });

  // جلب قائمة المنتجات لتحديث حقول الاختيار والمخزون المباشر
  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/product"); // تأكد من مسار جلب المنتجات لديك في السيرفر
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("فشل في تحديث قائمة المنتجات");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // إرسال البيانات وحفظ المعاملة
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (txType === "sale" && !formData.productId) {
      return toast.error("برجاء اختيار المنتج من القائمة أولاً");
    }

    try {
      setLoading(true);
      const res = await api.post("/api/transactions", { ...formData, type: txType });
      
      if (res.data.message === "success") {
        toast.success("تم تسجيل المعاملة بنجاح وتحديث الحسابات والمخزن 💸");
        
        if (txType === "sale") {
          setLastInvoice(res.data.invoiceData); // حفظ الفاتورة الراجعة لطباعتها
        } else {
          setLastInvoice(null);
        }

        // إعادة تهيئة الحقول للعملية التالية
        setFormData({ customerName: "", productId: "", quantity: 1, amount: 0, notes: "" });
        fetchProducts(); // تحديث أرقام المخزن في الواجهة فوراً
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء حفظ المعاملة");
    } finally {
      setLoading(false);
    }
  };

  // دالة توليد وطباعة الفاتورة كاشير حرارية احترافية PDF
  const handlePrintPDF = () => {
    if (!lastInvoice) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return toast.error("الرجاء السماح بالنوافذ المنبثقة لفتح الفاتورة");

    // استخراج بيانات المنتج الأول من المصفوفة
    const item = lastInvoice.orderItems?.[0];
    const productTitle = item?.product?.title || "منتج عام";
    const productPrice = item?.price || lastInvoice.totalAmount;
    const employeeName = lastInvoice.user?.name || "كاشير النظام";

    printWindow.document.write(`
      <html>
        <head>
          <title>فاتورة بيع رقم #${lastInvoice._id.slice(-6)}</title>
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
          <div class="info-line"><span>رقم الفاتورة:</span> <span>#${lastInvoice._id.slice(-6)}</span></div>
          <div class="info-line"><span>التاريخ:</span> <span>${new Date(lastInvoice.createdAt).toLocaleString('ar-EG')}</span></div>
          <div class="info-line"><span>العميل:</span> <span>${lastInvoice.customerName || 'زبون نقدي'}</span></div>
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
                <td>${lastInvoice.totalAmount} ج.م</td>
              </tr>
            </tbody>
          </table>

          <div class="total-section">
            <span>المبلغ الإجمالي المدفوع:</span>
            <span>${lastInvoice.totalAmount} ج.م</span>
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

  const selectedProduct = products.find(p => p._id === formData.productId);

  return (
    <div className="min-vh-100 py-5 text-white" style={{ backgroundColor: '#121212' }}>
      <Helmet><title>الحسابات اليومية | الكاشير الفوري</title></Helmet>

      <div className="container mt-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0">
            📝 دفتر <span style={{ color: '#ff6600' }}>المعاملات الكاش والمصاريف</span>
          </h2>
          {/* زر طباعة الـ PDF يظهر بنبض تفاعلي عند وجود عملية كاش ناجحة */}
          {lastInvoice && (
            <button onClick={handlePrintPDF} className="btn btn-success fw-bold px-4 rounded-pill shadow animation-pulse">
              🖨️ طباعة فاتورة العملية الأخيرة (PDF)
            </button>
          )}
        </div>

        <div className="row g-4">
          {/* استمارة الإدخال */}
          <div className="col-md-5">
            <div className="p-4 rounded-4 bg-dark shadow-sm" style={{ border: '1px solid #333' }}>
              <h5 className="fw-bold mb-4" style={{ color: '#ff6600' }}>➕ إضافة حركة خزينة فورية</h5>
              
              <div className="btn-group w-100 mb-4" role="group">
                <button type="button" className={`btn fw-bold ${txType === 'sale' ? 'btn-warning text-dark' : 'btn-outline-secondary text-white'}`} onClick={() => setTxType('sale')}>🛒 بيع كاش مالي</button>
                <button type="button" className={`btn fw-bold ${txType === 'expense' ? 'btn-danger text-white' : 'btn-outline-secondary text-white'}`} onClick={() => setTxType('expense')}>📉 سحب مصاريف</button>
              </div>

              <form onSubmit={handleSubmit}>
                {txType === 'sale' ? (
                  <>
                    <div className="mb-3">
                      <label className="small text-light opacity-75 mb-2">اسم المشتري / العميل</label>
                      <input type="text" className="form-control bg-black text-white border-secondary" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} placeholder="زبون محل افتراضي..." />
                    </div>
                    <div className="mb-3">
                      <label className="small text-light opacity-75 mb-2">اختر الصنف المباع من المخزن</label>
                      <select className="form-select bg-black text-white border-secondary" value={formData.productId} onChange={e => setFormData({...formData, productId: e.target.value})}>
                        <option value="">-- اضغط لتحديد صنف البضاعة --</option>
                        {products.map(p => (
                          <option key={p._id} value={p._id} disabled={p.stock <= 0}>{p.title} ({p.stock <= 0 ? 'نفذ المخزون ❌' : `متاح: ${p.stock} قطعة`})</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="small text-light opacity-75 mb-2">الكمية المسحوبة للبيع</label>
                      <input type="number" min="1" className="form-control bg-black text-white border-secondary" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <label className="small text-light opacity-75 mb-2">قيمة المبلغ المدفوع مخصوماً (ج.م)</label>
                      <input type="number" min="1" className="form-control bg-black text-white border-secondary" value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value) || 0})} placeholder="المبلغ المخصوم..." />
                    </div>
                    <div className="mb-3">
                      <label className="small text-light opacity-75 mb-2">بيان تفصيلي للمصروفات النقدية</label>
                      <input type="text" className="form-control bg-black text-white border-secondary" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="مثال: فاتورة كهرباء، إيجار، مستلزمات..." />
                    </div>
                  </>
                )}

                {txType === 'sale' && (
                  <div className="mb-3">
                    <label className="small text-light opacity-75 mb-2">ملاحظات الفاتورة</label>
                    <textarea rows={2} className="form-control bg-black text-white border-secondary" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="شروط مخصصة للبيع أو تعليقات..."></textarea>
                  </div>
                )}

                <button type="submit" disabled={loading} className={`btn w-100 fw-bold py-2 mt-2 ${txType === 'sale' ? 'btn-warning text-dark' : 'btn-danger'}`}>
                  {loading ? "جاري الحفظ والتحديث..." : "⚡ تأكيد وحفظ حركة الخزينة فورا"}
                </button>
              </form>
            </div>
          </div>

          {/* لوحة مراقبة الأرباح الفورية والمخزن */}
          <div className="col-md-7">
            <div className="p-4 rounded-4 h-100" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
              <h5 className="fw-bold mb-4 text-secondary">🔍 تفاصيل جرد ومطابقة الحسابات والربحية التقديرية للصنف</h5>
              
              {txType === 'sale' && selectedProduct ? (
                <div className="text-start">
                  <div className="d-flex align-items-center gap-4 mb-4 p-3 rounded-3 bg-black" style={{ borderRight: '4px solid #ff6600' }}>
                    <img src={selectedProduct.imageCover || "https://placehold.co"} alt={selectedProduct.title} className="rounded-3 object-fit-cover" style={{ width: '85px', height: '85px' }} />
                    <div>
                      <h4 className="fw-bold text-warning mb-1">{selectedProduct.title}</h4>
                      <span className={`badge ${selectedProduct.stock > 5 ? 'bg-success' : 'bg-danger'}`}>المخزون الحالي بالمستودع: {selectedProduct.stock} قطعة</span>
                    </div>
                  </div>

                  <div className="row g-3 text-center">
                    <div className="col-6 col-sm-3">
                      <div className="p-3 bg-black rounded-3"><small className="text-light opacity-50 d-block mb-1">سعر البيع</small><span className="fw-bold text-white">{selectedProduct.price} ج.م</span></div>
                    </div>
                    <div className="col-6 col-sm-3">
                      <div className="p-3 bg-black rounded-3"><small className="text-light opacity-50 d-block mb-1">سعر الجملة</small><span className="fw-bold text-muted">{selectedProduct.costPrice || 0} ج.م</span></div>
                    </div>
                    <div className="col-6 col-sm-3">
                      <div className="p-3 bg-black rounded-3" style={{ border: '1px solid #ff6600' }}><small className="text-warning d-block mb-1">المطلوب نقداً</small><span className="fw-bold text-warning">{(selectedProduct.price * formData.quantity)} ج.م</span></div>
                    </div>
                    <div className="col-6 col-sm-3">
                      <div className="p-3 bg-black rounded-3" style={{ border: '1px solid #28a745' }}><small className="text-success d-block mb-1">الربح الصافي</small><span className="fw-bold text-success">{((selectedProduct.price - (selectedProduct.costPrice || 0)) * formData.quantity)} ج.م</span></div>
                    </div>
                  </div>
                </div>
              ) : txType === 'expense' && formData.amount > 0 ? (
                <div className="text-center py-5">
                  <div className="display-4 text-danger mb-3">📉</div>
                  <h4 className="fw-bold text-danger">تنبيه: سيتم خصم {formData.amount} ج.م مباشرة من الصندوق لإجمالي المصاريف</h4>
                  <p className="text-secondary mt-2">بيان السحب: {formData.notes || 'لم يُحدد تفاصيل بعد'}</p>
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <div className="fs-1 mb-3">📋</div>
                  <p className="fw-bold">بانتظار اختيار منتج أو تدوين قيمة المصاريف لحساب الحسابات والربحية التقديرية بدقة هنا قبل الترحيل.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-dark { background-color: #1a1a1a !important; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }
        .animation-pulse { animation: pulse 2s infinite; }
      `}</style>
    </div>
  );
}
