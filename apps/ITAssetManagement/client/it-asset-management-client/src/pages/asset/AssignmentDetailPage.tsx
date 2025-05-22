import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useDarkMode } from "../../context/DarkModeContext";


const AssignmentDetailPage = () => {
      const { keycloak } = useKeycloak();
      const { darkMode } = useDarkMode();
    
      const { id } = useParams();
  return (
    <div>{id}</div>
  )
}

export default AssignmentDetailPage