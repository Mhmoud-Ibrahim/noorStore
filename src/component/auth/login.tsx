import { useFormik } from "formik";
import { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion"; 
import { Helmet } from "react-helmet-async";
import api from "../api.ts";

interface RegisterValues {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  let navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  async function signup(values: RegisterValues) {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await api.post('/auth/signup', values);
      if (response.data.message === 'success') {
        navigate('/login');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  }

  // دالة تسجيل جوجل - توجه المستخدم للباك إند مباشرة
  const handleGoogleLogin = () => {
    window.location.href = "https://vercel.app"; 
  };

  let validationSchema = Yup.object({
    name: Yup.string().required('Name is required').min(4, 'Min 4 characters'),
    email: Yup.string().required('Email is required').email('Invalid format'),
    password: Yup.string().required('Password is required').min(6, 'Min 6 characters')
  });

  let formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema,
    onSubmit: signup
  });

  return (
    <>
      <Helmet>
        <title>Register | Noor Store</title>
      </Helmet>
      
      <div className="d-flex justify-content-center align-items-center my-5">
        <motion.div 
          className="container col-md-4 shadow-lg p-4 rounded"
          style={{ backgroundColor: '#1a1a1a', border: '1px solid #ff6600', color: '#fff' }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h3 variants={itemVariants} className="text-center mb-4" style={{ color: '#ff6600' }}>
            Create Account
          </motion.h3>

          <AnimatePresence>
            {errorMsg && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className='alert alert-danger py-2 small'>
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={formik.handleSubmit}>
            <motion.div variants={itemVariants} className="mb-3">
              <label>Full Name:</label>
              <input {...formik.getFieldProps('name')} type="text" className="form-control bg-light text-dark" />
              {formik.touched.name && formik.errors.name && <div className='text-danger small'>{formik.errors.name}</div>}
            </motion.div>

            <motion.div variants={itemVariants} className="mb-3">
              <label>Email:</label>
              <input {...formik.getFieldProps('email')} type="email" className="form-control bg-light text-dark" />
              {formik.touched.email && formik.errors.email && <div className='text-danger small'>{formik.errors.email}</div>}
            </motion.div>

            <motion.div variants={itemVariants} className="mb-4">
              <label>Password:</label>
              <div className="position-relative">
                <input 
                  {...formik.getFieldProps('password')} 
                  type={showPassword ? "text" : "password"} 
                  className="form-control bg-light text-dark" 
                />
                <span onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '7px' }}>
                  <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} style={{ color: '#ff6600' }}></i>
                </span>
              </div>
              {formik.touched.password && formik.errors.password && <div className='text-danger small'>{formik.errors.password}</div>}
            </motion.div>

            <motion.button 
              disabled={!(formik.dirty && formik.isValid) || loading}
              type='submit' className="btn w-100 fw-bold" style={{ backgroundColor: '#ff6600', color: '#000' }}
            >
              {loading ? <i className='fas fa-spinner fa-spin'></i> : 'Register'}
            </motion.button>

            <div className="d-flex align-items-center my-3">
              <hr className="flex-grow-1" style={{borderColor: '#444'}} />
              <span className="mx-2 small text-muted">OR</span>
              <hr className="flex-grow-1" style={{borderColor: '#444'}} />
            </div>

            <button type="button" onClick={handleGoogleLogin} className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2">
              <i className="fab fa-google text-danger"></i> Continue with Google
            </button>
          </form>
        </motion.div>
      </div>
    </>
  );
}
