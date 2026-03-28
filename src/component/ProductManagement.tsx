import { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import api from '../component/api';
import { MainContext } from '../component/mainContext.tsx';
import { toast } from 'react-toastify';
import Loading from './Loading.tsx';


interface IProduct {
    _id: string;
    title: string;
    price: number;
    stock: number;
    imageCover: string;
    category: { name: string };
}

export default function ProductManagement() {
    const context = useContext(MainContext);
    const user = context?.user;

    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    // جلب المنتجات مع دعم البحث والصفحات بناءً على ApiFeatures في الباك إند
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/api/product?page=${page}&limit=8&keyword=${searchTerm}`);
            setProducts(res.data.products);
        } catch (err) {
            toast.error("خطأ في تحميل المنتجات");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, searchTerm]);

    // دالة الحذف (تستخدم deleteProduct API)
    const handleDelete = async (id: string) => {
        if (!window.confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟")) return;
        try {
            const res = await api.delete(`/api/product/${id}`);
            if (res.data.message === "success") {
                setProducts(products.filter(p => p._id !== id));
                toast.success("تم حذف المنتج بنجاح 🗑️");
            }
        } catch (err) {
            toast.error("فشل في الحذف، تأكد من الصلاحيات");
        }
    };

    // حماية الصفحة: فقط للمسؤولين
    if (user?.role !== 'admin' && user?.role !== 'employee') {
        return <div className="text-center mt-5 text-white">غير مسموح لك بالدخول هنا 🚫</div>;
    }

    return (
        <div className="min-vh-100 py-5" style={{ backgroundColor: '#121212', color: '#fff' }}>
            <Helmet><title>لوحة الإدارة | إدارة المنتجات</title></Helmet>

            <div className="container mt-5">
                {/* رأس الصفحة */}
                <div className="row mb-4 align-items-center">
                    <div className="col-md-6 text-start">
                        <h2 className="fw-bold m-0"><i className="fas fa-box-open text-warning me-2"></i> إدارة <span style={{ color: '#ff6600' }}>المنتجات</span></h2>
                    </div>
                    <div className="col-md-6 text-md-end mt-3 mt-md-0">
                        <Link to="/addProduct" className="btn btn-warning fw-bold px-4 rounded-pill shadow">
                            <i className="fas fa-plus-circle me-2"></i> إضافة منتج جديد
                        </Link>
                    </div>
                </div>

                {/* شريط البحث */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="ابحث عن منتج بالاسم..."
                        className="form-control bg-dark text-white border-secondary shadow-none p-3 rounded-3"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? <Loading /> : (
                    <div className="table-responsive rounded-4 shadow-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
                        <table className="table table-dark table-hover align-middle mb-0">
                            <thead className="text-secondary small text-uppercase">
                                <tr>
                                    <th className="ps-4">المنتج</th>
                                    <th>التصنيف</th>
                                    <th>السعر</th>
                                    <th>المخزون</th>
                                    <th className="text-center">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {products.map((p) => (
                                        <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center gap-3">
                                                    <img src={p.imageCover} className="rounded-3 border border-secondary" style={{ width: '50px', height: '50px', objectFit: 'cover' }} alt="" />
                                                    <span className="fw-bold text-truncate" style={{ maxWidth: '200px' }}>{p.title}</span>
                                                </div>
                                            </td>
                                            <td><span className="badge bg-dark border border-secondary">{p.category?.name || 'غير محدد'}</span></td>
                                            <td className="text-warning fw-bold">{p.price} ج.م</td>
                                            <td>
                                                <span className={`fw-bold ${p.stock < 5 ? 'text-danger' : 'text-success'}`}>
                                                    {p.stock} قطعة
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex justify-content-center gap-2">
                                                    {/* رابط التعديل */}
                                                    <Link to={`/updateProduct/${p._id}`} className="btn btn-sm btn-outline-info border-0">
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    {/* زر الحذف (متاح للأدمن فقط حسب الراوت) */}
                                                    <button onClick={() => handleDelete(p._id)} className="btn btn-sm btn-outline-danger border-0">
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* التحكم في الصفحات */}
                <div className="d-flex justify-content-center mt-5 gap-3">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn btn-dark border-secondary px-4">السابق</button>
                    <span className="align-self-center fw-bold text-warning">صفحة {page}</span>
                    <button disabled={products.length < 8} onClick={() => setPage(p => p + 1)} className="btn btn-dark border-secondary px-4">التالي</button>
                </div>
            </div>

            <style>{`
        .table-hover tbody tr:hover { background-color: #222 !important; transition: 0.3s; }
        .form-control::placeholder { color: #555; }
        .btn-outline-info:hover { background: #0dcaf0; color: #000; }
        .btn-outline-danger:hover { background: #dc3545; color: #fff; }
      `}</style>
        </div>
    );
}
