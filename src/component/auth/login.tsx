
// import { useFormik } from "formik";
// import { useContext, useState } from 'react';
// import * as Yup from 'yup';

// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion"; 
// import { Helmet } from "react-helmet-async";
// import { MainContext } from "../mainContext.tsx";
// import api from "../api.ts";

// interface LoginValues {
//   email: string;
//   password: string;
// }

// export default function Login() {
//   const [errorMsg, setErrorMsg] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const navigate = useNavigate();
//   const context = useContext(MainContext);
  
//   if (!context) return null;

//   let { setLoading, setUser, loading } = context;

//   const containerVariants = {
//     hidden: { opacity: 0, scale: 0.9 },
//     visible: { 
//       opacity: 1, 
//       scale: 1,
//       transition: { duration: 0.4, staggerChildren: 0.1 } 
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 }
//   };

//   async function signin(values: LoginValues) {
//     setLoading(true);
//     setErrorMsg('');
//     const response = await api.post('/auth/signin', values).catch(err => {
//       setLoading(false);
//       setErrorMsg(err.response?.data?.message || "there is an error");
//       return null;
//     });

//     if (response?.data?.message === 'success') {
//     console.log(response)
//       setUser(response.data.user);
//     navigate('/');
//     }
//     setLoading(false);
//   }

//   let validationSchema = Yup.object({
//     email: Yup.string().required('email is required').email(),
//     password: Yup.string().required('password is required')
//   });

//   let formik = useFormik({
//     initialValues: { email: '', password: '' },
//     validationSchema,
//     onSubmit: signin
//   });

//   const togglePassword = () => setShowPassword(!showPassword);

//   return <>
//     <Helmet>
//       <title>Login</title>
//       <meta name="description" content="Login" />
//     </Helmet>
//     <form onSubmit={formik.handleSubmit} className="mt-5 d-flex flex-column">
//       <motion.div 
//         // تعديل: خلفية سوداء نص أبيض وبوردر برتقالي خفيف
//         className="container login col-md-4 mt-5 p-4 shadow-lg rounded"
//         style={{ backgroundColor: '#1a1a1a', border: '1px solid #ff6600', color: '#fff' }}
//         variants={containerVariants}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true }}
//       >
//         <motion.div variants={itemVariants} className="text-center m-auto mt-2">
//           {/* تعديل: العنوان باللون البرتقالي */}
//           <h3 style={{ color: '#ff6600' }}>Login now</h3>
//         </motion.div>

//         <AnimatePresence>
//           {errorMsg && (
//             <motion.div 
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               className='alert alert-danger mt-2'
//             >
//               {errorMsg}
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <motion.div variants={itemVariants} className="mt-3">
//           <label htmlFor="email">Email:</label>
//           {/* تعديل: الحقول بتنسيق Light (أبيض) */}
//           <input 
//             value={formik.values.email} 
//             onChange={formik.handleChange} 
//             onBlur={formik.handleBlur} 
//             type="email" id="email" name="email" 
//             className="form-control mb-2 bg-light text-dark" 
//           />
//           {formik.errors.email && formik.touched.email && <div className='text-danger mb-2 small'>{formik.errors.email}</div>}
//         </motion.div>

//         <motion.div variants={itemVariants}>
//           <label htmlFor="password">Password:</label>
//           <div className="d-flex password position-relative">
//             <input 
//               value={formik.values.password} 
//               onChange={formik.handleChange} 
//               onBlur={formik.handleBlur} 
//               type={showPassword ? "text" : "password"} 
//               id="password" name="password" 
//               className="pass form-control mb-2 bg-light text-dark" 
//             />
//             <span onClick={togglePassword} style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '10px' }}>
//               {/* تعديل: الأيقونة باللون البرتقالي */}
//               <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} style={{ color: '#ff6600' }}></i>
//             </span>
//           </div>
//           {formik.errors.password && formik.touched.password && <div className='text-danger mb-2 small'>{formik.errors.password}</div>}
//         </motion.div>

//         <motion.div variants={itemVariants} className="text-center m-auto">
//           <motion.button 
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.95 }}
//             disabled={!(formik.dirty && formik.isValid) || loading}
//             type='submit' 
//             // تعديل: الزر برتقالي بالكامل مع نص أسود عند التفعيل
//             className="btn mt-3 mb-2 w-75 fw-bold"
//             style={{ 
//               backgroundColor: '#ff6600', 
//               color: '#000', 
//               border: 'none',
//               opacity: (!(formik.dirty && formik.isValid) || loading) ? 0.6 : 1 
//             }}
//           >
//             {loading ? <i className='fas fa-spinner fa-spin'></i> : 'Login'}
//           </motion.button>
//         </motion.div>
//       </motion.div>
//     </form>
//   </>
// }

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

  async function signup(values: RegisterValues) {
    setLoading(true);
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

  // دالة للتعامل مع تسجيل جوجل
  const handleGoogleLogin = () => {
    window.location.href = "https://vercel.app";
  };

  let validationSchema = Yup.object({
    name: Yup.string().required('Name is required').min(4, 'Must be at least 4 characters'),
    email: Yup.string().required('Email is required').email('Invalid email format'),
    password: Yup.string().required('Password is required').matches(/^[a-zA-Z0-9]{1,10}$/, 'Max 10 characters (letters/numbers)')
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
      <meta name="description" content="Register a new account" />
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

        {errorMsg && <div className='alert alert-danger mt-2'>{errorMsg}</div>}

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

        <motion.div variants={itemVariants} className="text-center d-flex flex-column align-items-center mt-3">
          {loading ? (
            <button disabled type='button' className='btn w-75 mb-2' style={{ backgroundColor: '#ff6600', color: '#000' }}> 
              <i className='fas fa-spinner fa-spin'></i>
            </button>
          ) : (
            <button 
              disabled={!(formik.dirty && formik.isValid)} 
              type='submit' 
              className='btn mb-2 w-75 fw-bold'
              style={{ 
                backgroundColor: '#ff6600', 
                color: '#000', 
                border: 'none',
                opacity: !(formik.dirty && formik.isValid) ? 0.6 : 1 
              }}
            >
              Register
            </button>
          )}

          {/* خط فاصل بين التسجيل العادي وجوجل */}
          <div className="d-flex align-items-center w-75 my-2">
            <hr className="flex-grow-1" style={{ borderColor: '#ff6600' }} />
            <span className="mx-2 small text-muted">OR</span>
            <hr className="flex-grow-1" style={{ borderColor: '#ff6600' }} />
          </div>

          {/* زر جوجل الجديد */}
          <button 
            onClick={handleGoogleLogin}
            type='button' 
            className='btn w-75 fw-bold d-flex align-items-center justify-content-center'
            style={{ 
              backgroundColor: '#fff', 
              color: '#000', 
              border: '1px solid #ff6600' 
            }}
          >
            <i className="fa-brands fa-google me-2" style={{ color: '#DB4437' }}></i>
            Continue with Google
          </button>
        </motion.div>
      </motion.div>
    </form>
  </>
}

