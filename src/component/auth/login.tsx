import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom"; // أضفنا Link هنا

import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import api from "../api.ts";

interface RegisterValues {
  email: string;
  password: string;
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
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
    const response = await api.post("/auth/signin", values).catch((err) => {
      setLoading(false);
      setErrorMsg(err.response?.data?.message || "حدث خطأ ما");
      return null;
    });

    if (response && response.data) {
      if (response.data.message === "success") {
        navigate("/");
      }
    }
    setLoading(false);
  }

  let validationSchema = Yup.object({
    email: Yup.string()
      .required("email is required")
      .email()
      .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "email invalid"),
    password: Yup.string()
      .required("password is required")
      .matches(/^[a-zA-Z0-9]{1,10}$/, "EX:aA1234"),
  });

  let formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: signup,
  });

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <>
      <Helmet>
        <title>Login </title>
        <meta name="description" content="Register " />
      </Helmet>

      <form onSubmit={formik.handleSubmit} className="mt-5 d-flex flex-column">
        <motion.div
          className="container register col-md-4 mt-5 shadow-lg p-4 rounded"
          style={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #ff6600",
            color: "#fff",
          }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            variants={itemVariants}
            className="text-center m-auto mt-2"
          >
            <h3 style={{ color: "#ff6600" }}>Register now</h3>
          </motion.div>

          {errorMsg && (
            <div className="alert alert-danger mt-2">{errorMsg}</div>
          )}

          <motion.div variants={itemVariants}>
            <label htmlFor="email">Email:</label>
            <input
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="email"
              id="email"
              name="email"
              className="form-control mb-2 bg-light text-dark"
            />
            {formik.errors.email && formik.touched.email && (
              <div className="text-danger mb-2 small">
                {formik.errors.email}
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="password">Password:</label>
            <div className="d-flex password position-relative">
              <input
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="pass form-control mb-2 bg-light text-dark"
              />
              <span
                onClick={togglePassword}
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  right: "10px",
                  top: "10px",
                }}
              >
                <i
                  className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                  style={{ color: "#ff6600" }}
                ></i>
              </span>
            </div>
            {formik.errors.password && formik.touched.password && (
              <div className="text-danger mb-2 small">
                {formik.errors.password}
              </div>
            )}
          </motion.div>

          {/* إضافة لينك نسيت كلمة السر بنفس استايلك */}
          <motion.div variants={itemVariants} className="text-end mb-2">
            <Link
              to="/forgot-password"
              style={{
                color: "#ff6600",
                fontSize: "13px",
                textDecoration: "none",
              }}
            >
              Forgot Password?
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center m-auto">
            {loading ? (
              <button
                disabled
                type="button"
                className="btn mt-2 w-75 mb-2"
                style={{
                  backgroundColor: "#ff6600",
                  color: "#000",
                  border: "none",
                }}
              >
                <i className="fas fa-spinner fa-spin"></i>
              </button>
            ) : (
              <button
                disabled={!(formik.dirty && formik.isValid)}
                type="submit"
                className="btn mt-2 mb-2 w-75 fw-bold"
                style={{
                  backgroundColor: "#ff6600",
                  color: "#000",
                  border: "none",
                  opacity: !(formik.dirty && formik.isValid) ? 0.6 : 1,
                }}
              >
                Login
              </button>
            )}
          </motion.div>
        </motion.div>
      </form>
    </>
  );
}
