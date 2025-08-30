// src/apps/canva/DashboardCanva.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function DashboardCanva() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const load = async () => {
    const { data } = await api.get('/projectDesigns');
    setProjects(data);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    const { data } = await api.post('/projectDesigns', { name: name || 'Untitled' });
    setName('');
    setProjects((p) => [data.project, ...p]);
    navigate(`/editor/${data.design._id}`);
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4>Your projects</h4>
        <div className="d-flex gap-2">
          <input className="form-control" placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} />
          <button className="btn btn-primary" onClick={create}>New project</button>
        </div>
      </div>

      <div className="row g-3">
        {projects.map((p) => (
          <div key={p._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100" role="button" onClick={() => navigate(`/editor/${p._id}`)}>
              <div className="card-body">
                <div className="text-muted small">{new Date(p?.updatedAt).toLocaleString()}</div>
                <div className="fw-bold mt-1">{p.name}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
