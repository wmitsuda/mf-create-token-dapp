import React, { useContext } from "react";
import MainframeSDK from "@mainframe/sdk";

const MainframeContext = React.createContext<MainframeSDK>(null);

const useMainframe = () => useContext(MainframeContext);

export { MainframeContext, useMainframe };
