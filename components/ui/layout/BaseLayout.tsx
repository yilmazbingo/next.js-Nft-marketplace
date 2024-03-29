import { FunctionComponent, ReactNode } from "react";

import Navbar from "./navbar";

interface BaseLayoutProps {
  children?: ReactNode;
}

const BaseLayout: FunctionComponent<BaseLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      {/* min-h-screen even we have less content, it will take full 100% height */}
      <div className="py-16 bg-gray-700 overflow-hidden min-h-screen ">
        <div className="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </>
  );
};

export default BaseLayout;
