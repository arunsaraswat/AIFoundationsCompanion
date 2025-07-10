import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";
import { ChatHelperProvider } from "./ChatHelperContext";
import { ChatHelperButton } from "./ChatHelperButton";
import { ChatHelper } from "./ChatHelper";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <ChatHelperProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Mobile backdrop */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={closeSidebar}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          transition-transform duration-300 ease-in-out
        `}>
          <Sidebar onNavigate={isMobile ? closeSidebar : undefined} />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header with hamburger */}
          {isMobile && (
            <header className="flex items-center justify-between p-4 border-b border-border bg-background">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="p-2"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
              <h1 className="text-lg font-semibold">AI Native Foundations</h1>
              <div className="w-10" /> {/* Spacer for centering */}
            </header>
          )}
          
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>

        {/* Chat Helper Components */}
        <ChatHelperButton />
        <ChatHelper />
      </div>
    </ChatHelperProvider>
  );
}
