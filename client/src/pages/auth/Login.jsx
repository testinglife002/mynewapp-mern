// src/pages/auth/Login.jsx
import { useState } from 'react'
import axios from 'axios'
// import newRequest from '../../utils/newRequest';
import newRequest, { setToken } from '../../utils/newRequest';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
   const [form, setForm] = useState({ email: '', password: '' })
   const [error, setError] = useState(null);
   const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post("/auth/login", form);
      // const user = res.data.user; // ✅ backend sends { user }
      const { token, user } = res.data;
      // ✅ Save token in sessionStorage
      sessionStorage.setItem("accessToken", token);
      // ✅ Set token in Axios for all requests
      setToken(token);
      // Save user info in state if needed
      console.log("Logged in user:", user);

      localStorage.setItem("currentUser", JSON.stringify(user));
      setUser(user);

      alert("Login success!");
      if (user.role === "admin") navigate("/dashboard");
      else navigate("/");
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || "Server error"));
    }
  };


  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light"  >
      <div className="p-4 border rounded bg-white shadow w-200" style={{width:'450px', marginLeft:'-3%' }}>
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3"  >
          <input style={{color:'#fff'}} className="bg-dark" placeholder="Email" name="email" onChange={e => setForm({...form, email: e.target.value})} />
          <input style={{color:'#fff'}}className="bg-dark" type="password" placeholder="Password" name="password" onChange={e => setForm({...form, password: e.target.value})} />
          <button type="submit" className="btn btn-info w-100">Login</button>
          {error && <p className="text-danger mb-0 text-center">{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default Login
