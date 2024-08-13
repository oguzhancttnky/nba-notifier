import React, { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen mt-5">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4">{children}</div>
    </div>
  );
};

export default Layout;
