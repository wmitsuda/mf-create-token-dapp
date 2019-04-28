import React, { useContext } from "react";

const MainframeContext = React.createContext();

const useMainframe = () => useContext(MainframeContext);

export { MainframeContext, useMainframe };
