import { useState } from 'react';
import axios from 'axios';
import './Register.css'; // optional for toggle switch
import { useNavigate } from 'react-router-dom';
import newRequest from '../../utils/newRequest';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', img: '', isSeller: false, isAdmin:false });
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSeller = (e) => {
    setForm((prev) => ({ ...prev, isSeller: e.target.checked }));
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file',file);
    data.append('upload_preset','mynewapp');
    try {
        const res = await axios.post('https://api.cloudinary.com/v1_1/dxiykhyyz/image/upload',data);
        const {url} = res.data;
        return url || res.data.secure_url;
    } catch (error) {
        console.log(error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const url = await upload(file);
    // Upload image first (if file selected)
    let imageUrl = '';
    if (file) {
      imageUrl = await uploadToCloudinary(file);
      if (!imageUrl) {
        alert('Image upload failed. Try again.');
        return;
      }
    }
    try {
      if (!form.username || !form.email || !form.password) {
        alert('All fields are required');
        return;
      }
      // await axios.post('/api/auth/register', form, {
      //  withCredentials: true,
      // });
      console.log(form);
      await newRequest.post('/auth/register', {
        ...form,
        img: imageUrl,
      })
      alert('Registered successfully');
      navigate('/login');
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data || 'Server error'));
      setError(err.response?.data);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light"  >
      <div className="p-4 border rounded bg-white shadow w-200" style={{width:'450px', marginLeft:'-3%' }}>
        <h3 className="text-center mb-4">Register</h3>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3"  >
          <input style={{color:'white'}} className="bg-dark" placeholder="Username" name="username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <input style={{color:'white'}} className="bg-dark" placeholder="Email" name="email" onChange={e => setForm({...form, email: e.target.value})} />
          <input style={{color:'white'}} className="bg-dark" type="password" placeholder="Password" name="password" onChange={e => setForm({...form, password: e.target.value})} />
          <input style={{color:'white'}} className="bg-dark" placeholder="Image" type='file' onChange={(e)=>setFile(e.target.files[0])} />
          <div className="d-flex align-items-center">
            <label className="switch me-2 ">
              <input style={{color:'white'}} type="checkbox" onChange={handleSeller} />
              <span style={{color:'white'}} className="slider round bg-dark"></span>
            </label>
            <label className="mb-0">I want to become a seller</label>
          </div>
          <button type="submit" className="btn btn-primary w-100">Register</button>
          {error && <p className="text-danger mb-0 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;
