import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import RightPanel from "./RightPanel.jsx";
import MobileHeader from "./MobileHeader.jsx";
import MobileBottomNav from "./MobileBottomNav.jsx";

export default function PaymentLayout({ children }) {
  
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      
      {/* ===== MOBILE LAYOUT ===== */}
      <div className="lg:hidden">
        <MobileHeader />

        <main className="pt-16 pb-20 px-4">
          {children}
        </main>

        <MobileBottomNav />
      </div>

      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden lg:block">
        {/* LEFT SIDEBAR - Same as Dashboard */}
        <Sidebar
          collapsed={leftCollapsed}
          setCollapsed={setLeftCollapsed}
        />

        {/* RIGHT PANEL - Standard Dashboard Right Panel */}
        <RightPanel
          collapsed={rightCollapsed}
          setCollapsed={setRightCollapsed}
        />

        {/* MAIN CONTENT AREA */}
        <main
          className={`
            transition-all duration-300 p-6
            ${leftCollapsed ? "ml-20" : "ml-64"}
            ${rightCollapsed ? "mr-1" : "mr-80"}
          `}
        >
          {children}
        </main>
      </div>

    </div>
  );
}