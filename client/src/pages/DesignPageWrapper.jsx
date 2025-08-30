import React from "react";
import { useParams } from "react-router-dom";
import DesignPage from "./DesignPage";
import DesignedPage from "../components/canva/DesignedPage";

const DesignPageWrapper = ({user}) => {
  const { designId } = useParams();
  // const userId = localStorage.getItem("userId"); // from auth

  return <DesignedPage user={user} designId={designId} />;
};

export default DesignPageWrapper;
