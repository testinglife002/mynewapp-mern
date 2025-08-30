import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import newRequest from "../utils/newRequest";

const DashboardDesign = ({ user }) => {
  const [designs, setDesigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDesigns = async () => {
      if (!user?._id) return;
      try {
        const res = await newRequest.get(`/designs/user/${user._id}`);
        setDesigns(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDesigns();
  }, [user]);

  return (
    <div className="dashboard">
      <h2>Saved Designs</h2>
      <div className="gallery">
        {designs.map((design) => (
          <div key={design._id} className="design-card">
            <img
              src={design.thumbnailUrl}
              alt={design.name}
              onClick={() => navigate(`/design/${design._id}`)}
              style={{ cursor: "pointer", width: "150px", height: "100px", objectFit: "cover" }}
            />
            <div className="design-name">{design.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardDesign;
