import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import MobileNav from "./MobileNav";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      <MobileNav />
      <main className="md:ml-64 p-4 md:p-8 pb-24 md:pb-8">{children}</main>
    </div>
  );
};

export default AppLayout;
