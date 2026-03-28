import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

export default function Contact() {

    // إعداد Formik للتعامل مع رسائل التواصل
    const formik = useFormik({
        initialValues: { name: '', email: '', subject: '', message: '' },
        validationSchema: Yup.object({
            name: Yup.string().min(3, 'الاسم قصير جداً').required('الاسم مطلوب'),
            email: Yup.string().email('بريد غير صالح').required('البريد مطلوب'),
            subject: Yup.string().required('الموضوع مطلوب'),
            message: Yup.string().min(10, 'الرسالة قصيرة جداً').required('محتوى الرسالة مطلوب'),
        }),
        onSubmit: (values, { resetForm }) => {
            console.log("رسالة تواصل جديدة:", values);
            toast.success("تم إرسال رسالتك بنجاح، سنرد عليك قريباً! 📧");
            resetForm();
        },
    });

    const contactDetails = [
        { icon: 'fas fa-phone-alt', title: 'اتصل بنا', detail: '01012345678', color: '#ff6600' },
        { icon: 'fas fa-envelope', title: 'البريد الإلكتروني', detail: 'info@noorstore.com', color: '#ff6600' },
        { icon: 'fas fa-map-marker-alt', title: 'موقعنا', detail: 'القاهرة، مصر', color: '#ff6600' },
    ];

    return (
        <div style={{ backgroundColor: '#ddd', minHeight: '100vh', paddingBottom: '50px' }}>
            <Helmet><title>نور ستور | اتصل بنا</title></Helmet>

            {/* Hero Section */}
            <section className="py-5 text-white" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)', borderBottom: '4px solid #ff6600' }}>
                <div className="container text-center">
                    <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="fw-bold">
                        تواصل <span style={{ color: '#ff6600' }}>معنا</span>
                    </motion.h1>
                    <p className="text-secondary">نحن هنا للإجابة على استفساراتك في أي وقت</p>
                </div>
            </section>

            <div className="container mt-5">
                <div className="row g-4 justify-content-center">

                    {/* معلومات التواصل السريع */}
                    <div className="col-lg-4">
                        <div className="d-flex flex-column gap-3">
                            {contactDetails.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="p-4 rounded-4 shadow-sm bg-white d-flex align-items-center gap-3"
                                    style={{ borderRight: `5px solid ${item.color}` }}
                                >
                                    <div className="rounded-circle p-3 shadow-sm" style={{ backgroundColor: '#fff2eb' }}>
                                        <i className={`${item.icon} fs-4`} style={{ color: item.color }}></i>
                                    </div>
                                    <div>
                                        <h6 className="fw-bold m-0 text-dark">{item.title}</h6>
                                        <small className="text-muted">{item.detail}</small>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* خريطة توضيحية أو صورة */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="mt-4 rounded-4 overflow-hidden shadow-sm border"
                            style={{ height: '200px' }}
                        >
                            <img
                                src="https://images.unsplash.com"
                                className="w-100 h-100 object-fit-cover"
                                alt="map"
                            />
                        </motion.div>
                    </div>

                    {/* نموذج المراسلة */}
                    <div className="col-lg-7">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-4 p-md-5 rounded-4 shadow-lg bg-white h-100"
                        >
                            <h4 className="fw-bold mb-4">أرسل لنا <span style={{ color: '#ff6600' }}>رسالة</span></h4>

                            <form onSubmit={formik.handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">الاسم</label>
                                        <input
                                            className={`form-control bg-light border-0 p-3 rounded-3 ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                                            {...formik.getFieldProps('name')}
                                            placeholder="أدخل اسمك"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">البريد الإلكتروني</label>
                                        <input
                                            className={`form-control bg-light border-0 p-3 rounded-3 ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                            {...formik.getFieldProps('email')}
                                            placeholder="example@mail.com"
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">الموضوع</label>
                                        <input
                                            className={`form-control bg-light border-0 p-3 rounded-3 ${formik.touched.subject && formik.errors.subject ? 'is-invalid' : ''}`}
                                            {...formik.getFieldProps('subject')}
                                            placeholder="بخصوص ماذا تريد مراسلتنا؟"
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">الرسالة</label>
                                        <textarea
                                            rows={4}
                                            className={`form-control bg-light border-0 p-3 rounded-3 ${formik.touched.message && formik.errors.message ? 'is-invalid' : ''}`}
                                            {...formik.getFieldProps('message')}
                                            placeholder="اكتب استفسارك هنا..."
                                        />
                                    </div>
                                    <div className="col-12 mt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="btn btn-dark w-100 p-3 fw-bold rounded-3 shadow"
                                            style={{ backgroundColor: '#1a1a1a', border: 'none' }}
                                        >
                                            إرسال الرسالة <i className="fas fa-paper-plane ms-2" style={{ color: '#ff6600' }}></i>
                                        </motion.button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>

                </div>
            </div>

            <footer className="py-3 text-center text-secondary small bg-white border-top mt-5">
                © {new Date().getFullYear()} نور ستور - جميع الحقوق محفوظة
            </footer>
        </div>
    );
}
