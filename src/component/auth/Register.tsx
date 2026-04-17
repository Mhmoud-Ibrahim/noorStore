import { useFormik } from "formik";
import { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion"; 
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
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,   
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  // دالة التسجيل التقليدي
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

  const handleGoogleLogin = () => {
    window.location.href = "https://noor-server-ts.vercel.app/auth/google"; 
  };

  let validationSchema = Yup.object({
    name: Yup.string().required('name is required').min(4, 'must be at least 4 characters'),
    email: Yup.string().required('email is required').email().matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'email invalid'),
    password: Yup.string().required('password is required').matches(/^[a-zA-Z0-9]{6,10}$/, 'Password must be 6-10 characters')
  });

  let formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema,
    onSubmit: signup
  });

  const togglePassword = () => setShowPassword(!showPassword);

  return <>
    <Helmet>
      <title>Register | Noor Store</title>
      <meta name="description" content="Create a new account" />
    </Helmet>
    
    <form onSubmit={formik.handleSubmit} className="mt-5 d-flex flex-column">
      <motion.div 
        className="container register col-md-4 mt-5 shadow-lg p-4 rounded"
        style={{ backgroundColor: '#1a1a1a', border: '1px solid #ff6600', color: '#fff' }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible" 
        viewport={{ once: true, amount: 0.2 }} 
      >
        <motion.div variants={itemVariants} className="text-center m-auto mt-2">
          <h3 style={{ color: '#ff6600' }}>Register now</h3>
        </motion.div>

        {errorMsg && <div className='alert alert-danger mt-2 small text-center'>{errorMsg}</div>}

        <motion.div variants={itemVariants} className="mt-2">
          <label htmlFor="name">Name:</label>
          <input value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} type="text" id="name" name="name" className="form-control mb-2 bg-light text-dark" />
          {formik.errors.name && formik.touched.name && <div className='text-danger mb-2 small'>{formik.errors.name}</div>}
        </motion.div>

        <motion.div variants={itemVariants}>
          <label htmlFor="email">Email:</label>
          <input value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} type="email" id="email" name="email" className="form-control mb-2 bg-light text-dark" />
          {formik.errors.email && formik.touched.email && <div className='text-danger mb-2 small'>{formik.errors.email}</div>}
        </motion.div>

        <motion.div variants={itemVariants}>
          <label htmlFor="password">Password:</label>
          <div className="d-flex password position-relative">
            <input value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} type={showPassword ? "text" : "password"} id="password" name="password" className="pass form-control mb-2 bg-light text-dark" />
            <span onClick={togglePassword} style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '10px' }}>
              <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} style={{ color: '#ff6600' }}></i>
            </span>
          </div>
          {formik.errors.password && formik.touched.password && <div className='text-danger mb-2 small'>{formik.errors.password}</div>}
        </motion.div>

        <motion.div variants={itemVariants} className="text-center m-auto">
          {loading ? (
            <button disabled type='button' className='btn mt-2 w-100 mb-2' style={{ backgroundColor: '#ff6600', color: '#000' }}> 
              <i className='fas fa-spinner fa-spin'></i>
            </button>
          ) : (
            <button 
              disabled={!(formik.dirty && formik.isValid)} 
              type='submit' 
              className='btn mt-2 mb-2 w-100 fw-bold'
              style={{ backgroundColor: '#ff6600', color: '#000', opacity: !(formik.dirty && formik.isValid) ? 0.6 : 1 }}
            >
              Register
            </button>
          )}

          {/* فاصل OR */}
          <div className="d-flex align-items-center my-3">
            <hr className="flex-grow-1" style={{borderColor: '#444'}} />
            <span className="mx-2 small text-muted">OR</span>
            <hr className="flex-grow-1" style={{borderColor: '#444'}} />
          </div>

          {/* زر Google */}
          <button 
            type="button" 
            onClick={handleGoogleLogin} 
            className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2 mb-2"
          >
            <i className="fab fa-google text-danger"></i> Continue with Google
          </button>
        </motion.div>
      </motion.div>
    </form>
  </>
}
