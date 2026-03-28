
// import { Link } from 'react-router-dom';
// import 'aos/dist/aos.css';
// import { useContext, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import 'react-toastify/dist/ReactToastify.css';
// import { MainContext } from './mainContext.tsx';

// function Navbar() {
//     const context = useContext(MainContext);
//     const [isMenuOpen, setIsMenuOpen] = useState(false);

//     if (!context) return null;
//     const { logout, user } = context;

//     return (
//         <nav className="navbar py-2 fixed-top shadow" style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #ff6600', transition: '0.3s' }}>
//             <div className="container d-flex align-items-center justify-content-between position-relative">
                
//                 <div className="d-flex align-items-center gap-2">
//                     {user && (
//                         <button 
//                             className="btn d-lg-none p-0 border-0 text-white" 
//                             onClick={() => setIsMenuOpen(!isMenuOpen)}
//                         >
//                             <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'} fs-4`} style={{ color: '#ff6600' }}></i>
//                         </button>
//                     )} 
//                     <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
//                         <Link className="navbar-brand fw-bold m-0" to="home" style={{ color: '#ff6600' }}>
//                             <small>NOOR</small>
//                         </Link>
//                     </motion.div>
//                 </div>
//                 {/* الروابط: تظهر فقط في الشاشات الكبيرة */}
//                 <ul className="navbar-nav d-none d-lg-flex flex-row gap-3 mb-0 mx-auto">
//                     {['home', 'products', 'about', 'contact'].map((item) => (
//                         <motion.li key={item} whileHover={{ scale: 1.05 }} className="nav-item rounded-pill px-2 border" style={{ borderColor: '#ff6600' }}>
//                             <Link className="nav-link text-white text-capitalize small" to={item}>{item.replace('-', ' ')}</Link>
//                         </motion.li>
//                     ))}
//                 </ul>
//                 <div className="d-flex align-items-center ms-lg-0">
//                     {!user ? (
//                         <div className="d-flex gap-2">
//                             <Link className="nav-link btn btn-sm px-2 text-white border-0" to="login">Login</Link>
//                             <Link className="nav-link btn btn-sm px-3 text-dark fw-bold" style={{ backgroundColor: '#ff6600', borderRadius: '5px' }} to="register">Register</Link>
//                         </div>
//                     ) : (
//                         <div className="d-flex align-items-center gap-2">
//                             <Link to="/profile" className="text-decoration-none">
//                                 <div className="rounded-circle overflow-hidden border border-2" style={{ width: '35px', height: '35px', borderColor: '#ff6600' }}>
//                                     {user.userImage ? <img src={user.userImage} alt="me" className="w-100 h-100 object-fit-cover" /> : <div className="w-100 h-100 bg-secondary d-flex align-items-center justify-content-center"><i className="fa-solid fa-user text-white"></i></div>}
//                                 </div>
//                             </Link>
//                             <button onClick={logout} className="btn btn-sm py-1 rounded-pill px-3 fw-bold" style={{ backgroundColor: '#ff6600', color: '#000', fontSize: '12px' }}>
//                                 Logout
//                             </button>
//                         </div>
//                     )}
//                 </div>

//                 {/* القائمة المنسدلة للشاشات الصغيرة (Mobile Menu) */}
//                 <AnimatePresence>
//                     {isMenuOpen && user && (
//                         <motion.div 
//                             initial={{ height: 0, opacity: 0 }}
//                             animate={{ height: 'auto', opacity: 1 }}
//                             exit={{ height: 0, opacity: 0 }}
//                             className="position-absolute start-0 w-100 d-lg-none overflow-hidden"
//                             style={{ top: '100%', backgroundColor: '#1a1a1a', borderBottom: '1px solid #ff6600' }}
//                         >
//                             <ul className="list-unstyled p-3 mb-0">
//                                 {['home', 'products',  'orders'].map((item) => (
//                                     <li key={item} className="py-2 border-bottom border-secondary">
//                                         <Link 
//                                             onClick={() => setIsMenuOpen(false)} 
//                                             className="text-white text-decoration-none text-capitalize d-block" 
//                                             to={item}
//                                         >
//                                             {item.replace('-', ' ')}
//                                         </Link>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </div>
//         </nav>
//     );
// }

// export default Navbar;
import { Link } from 'react-router-dom';
import 'aos/dist/aos.css';
import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import { MainContext } from './mainContext.tsx';

function Navbar() {
    const context = useContext(MainContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (!context) return null;
    const { logout, user, cartCount } = context; // استخراج cartCount من الكونتكس

    return (
        <nav className="navbar py-2 fixed-top shadow" style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #ff6600', transition: '0.3s' }}>
            <div className="container d-flex align-items-center justify-content-between position-relative">
                
                <div className="d-flex align-items-center gap-2">
                    {user && (
                        <button 
                            className="btn d-lg-none p-0 border-0 text-white" 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'} fs-4`} style={{ color: '#ff6600' }}></i>
                        </button>
                    )} 
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <Link className="navbar-brand fw-bold m-0" to="home" style={{ color: '#ff6600' }}>
                            <small>NOOR</small>
                        </Link>
                    </motion.div>
                </div>

                {/* الروابط: تظهر فقط في الشاشات الكبيرة */}
                <ul className="navbar-nav d-none d-lg-flex flex-row gap-3 mb-0 mx-auto">
                    {['home', 'products', 'about', 'contact'].map((item) => (
                        <motion.li key={item} whileHover={{ scale: 1.05 }} className="nav-item rounded-pill px-2 border" style={{ borderColor: '#ff6600' }}>
                            <Link className="nav-link text-white text-capitalize small" to={item}>{item.replace('-', ' ')}</Link>
                        </motion.li>
                    ))}
                </ul>

                <div className="d-flex align-items-center ms-lg-0 gap-3">
                    {!user ? (
                        <div className="d-flex gap-2">
                            <Link className="nav-link btn btn-sm px-2 text-white border-0" to="login">Login</Link>
                            <Link className="nav-link btn btn-sm px-3 text-dark fw-bold" style={{ backgroundColor: '#ff6600', borderRadius: '5px' }} to="register">Register</Link>
                        </div>
                    ) : (
                        <div className="d-flex align-items-center gap-3">
                            {/* عدد العناصر في السلة */}    
                            <Link to="/cart" className="text-decoration-none position-relative px-2">
                                <i className="fa-solid fa-cart-shopping fs-5 text-white"></i>
                                {cartCount > 0 && (
                                    <span 
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                        style={{ fontSize: '10px', padding: '4px 6px', border: '1px solid #1a1a1a' }}
                                    >
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* صورة المستخدم */}
                            <Link to="/profile" className="text-decoration-none">
                                <div className="rounded-circle overflow-hidden border border-2" style={{ width: '35px', height: '35px', borderColor: '#ff6600' }}>
                                    {user.userImage ? (
                                        <img src={user.userImage} alt="me" className="w-100 h-100 object-fit-cover" />
                                    ) : (
                                        <div className="w-100 h-100 bg-secondary d-flex align-items-center justify-content-center">
                                            <i className="fa-solid fa-user text-white"></i>
                                        </div>
                                    )}
                                </div>
                            </Link>

                            <button onClick={logout} className="btn btn-sm py-1 rounded-pill px-3 fw-bold" style={{ backgroundColor: '#ff6600', color: '#000', fontSize: '12px' }}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* القائمة المنسدلة للشاشات الصغيرة (Mobile Menu) */}
                <AnimatePresence>
                    {isMenuOpen && user && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="position-absolute start-0 w-100 d-lg-none overflow-hidden"
                            style={{ top: '100%', backgroundColor: '#1a1a1a', borderBottom: '1px solid #ff6600' }}
                        >
                            <ul className="list-unstyled p-3 mb-0">
                                {['home', 'products', 'cart', 'orders'].map((item) => (
                                    <li key={item} className="py-2 border-bottom border-secondary">
                                        <Link 
                                            onClick={() => setIsMenuOpen(false)} 
                                            className="text-white text-decoration-none text-capitalize d-block" 
                                            to={item}
                                        >
                                            {item.replace('-', ' ')}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}

export default Navbar;
