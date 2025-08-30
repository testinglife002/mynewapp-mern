// src/pages/auth/Login.jsx
import { useState } from 'react'
import axios from 'axios'
import newRequest from '../../utils/newRequest';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
   const [form, setForm] = useState({ email: '', password: '' })
   const [error, setError] = useState(null);
   const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        // const res = await axios.post('http://localhost:8800/api/auth/login', form, {
        //                                withCredentials: true
        //                            });
        const res = await newRequest.post("/auth/login", form);
        const user = res.data;
        // Save user data in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user))
        setUser(user)  // ✅ Update global user state
        // localStorage.setItem("currentUser", JSON.stringify(res.data));
        // navigate("/"); 
        alert('Login success!');
        // Role-based navigation
        if (user.role === 'admin') {
            navigate('/dashboard');
        } else if (user.isSeller === true) {
            // navigate('/dashboard/seller');
            navigate('/');
        } else {
            navigate('/'); // or navigate('/');
        }

        } catch (err) {
        console.error(err.response?.data || err.message);
        alert('Login failed: ' + (err.response?.data || 'Server error'));
         setError(err.response.data);
        // console.log(error);
        // setError(err);
        console.log(err.response.data);
        }

  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light"  >
      <div className="p-4 border rounded bg-white shadow w-200" style={{width:'450px', marginLeft:'-3%' }}>
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3"  >
          <input className="bg-dark" placeholder="Email" name="email" onChange={e => setForm({...form, email: e.target.value})} />
          <input className="bg-dark" type="password" placeholder="Password" name="password" onChange={e => setForm({...form, password: e.target.value})} />
          <button type="submit" className="btn btn-info w-100">Login</button>
          {error && <p className="text-danger mb-0 text-center">{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default Login
