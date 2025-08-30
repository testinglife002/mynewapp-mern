// Tabs.jsx
import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap"; // Bootstrap tabs
import { Box } from "@mui/material"; // MUI layout (optional)

const TabsComponent = ({ tabs, setSelected, children }) => {
  const [key, setKey] = useState(0);

  const handleSelect = (k) => {
    setKey(k);
    setSelected(k);
  };

  return (
    <Box className="w-100 px-2">
      <Tabs
        id="custom-tabs"
        activeKey={key}
        onSelect={handleSelect}
        className="mb-3 border-bottom"
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            eventKey={index}
            title={
              <span className="d-flex align-items-center gap-2">
                {tab.icon}
                {tab.title}
              </span>
            }
            tabClassName="bg-white text-dark px-3 py-2 border-bottom-0 fw-medium"
          />
        ))}
      </Tabs>

      <div className="w-100 mt-2">
        {/* Show only active tab's children */}
        {Array.isArray(children) ? children[key] : children}
      </div>
    </Box>
  );
};

export default TabsComponent;
