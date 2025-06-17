import { GraduationCap, BarChart3, Download, Upload, FileText, Moon, Sun, RefreshCw, Globe, Brain, Cog, Users, TrendingUp, Target } from "lucide-react";
import { useLocation } from "wouter";
import { useTheme } from "../contexts/ThemeContext";
import { useCourseProgress } from "../contexts/CourseProgressContext";
import { exportToPDF, downloadJSON, uploadJSON } from "../utils/fileIO";
import { clearCourseData } from "../utils/storage";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps = {}) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { exportData, importData } = useCourseProgress();

  const handleExportJSON = () => {
    const data = exportData();
    downloadJSON(data, "ai-native-foundations-state.json");
  };

  const handleImportJSON = () => {
    uploadJSON((data) => {
      try {
        importData(data);
      } catch (error) {
        alert(error instanceof Error ? error.message : "Failed to import data");
      }
    });
  };

  const handleExportPDF = () => {
    exportToPDF("ai-native-foundations.pdf");
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all progress data? This action cannot be undone.")) {
      clearCourseData();
      window.location.reload();
    }
  };

  const handleNavigation = (href: string) => {
    window.location.href = href;
    onNavigate?.();
  };

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col transition-colors duration-300 h-full overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <GraduationCap className="text-primary-foreground text-lg" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">AI Native Foundations</h1>
            <p className="text-xs text-muted-foreground">Class Companion</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 min-h-0">
        <ul className="space-y-2">
          <li>
            <Button
              variant={location === "/" ? "default" : "ghost"}
              className="w-full justify-start text-sm font-medium"
              onClick={() => handleNavigation("/")}
            >
              <BarChart3 className="mr-3" size={16} />
              Dashboard
            </Button>
          </li>
          
          <div className="py-2">
            <div className="text-xs font-medium text-muted-foreground mb-2">Lessons</div>
            <div className="space-y-1">
              <Button
                variant={location === "/lesson/1" ? "default" : "ghost"}
                className="w-full justify-start text-sm h-auto py-3 min-h-[48px]"
                onClick={() => handleNavigation("/lesson/1")}
              >
                <div className="flex items-start min-w-0 w-full">
                  <Globe className="mr-3 mt-0.5 flex-shrink-0" size={16} />
                  <span className="text-left leading-relaxed break-words whitespace-normal flex-1">Lesson 1: EDGE + AI-Native Foundations</span>
                </div>
              </Button>
              
              <Button
                variant={location === "/lesson/2" || location === "/exercise/agent-design" ? "default" : "ghost"}
                className="w-full justify-start text-sm h-auto py-3 min-h-[48px]"
                onClick={() => handleNavigation("/lesson/2")}
              >
                <div className="flex items-start min-w-0 w-full">
                  <Brain className="mr-3 mt-0.5 flex-shrink-0" size={16} />
                  <span className="text-left leading-relaxed break-words whitespace-normal flex-1">Lesson 2: AI Technical Literacy</span>
                </div>
              </Button>
              
              <Button
                variant={location === "/lesson/3" ? "default" : "ghost"}
                className="w-full justify-start text-sm h-auto py-3 min-h-[48px]"
                onClick={() => handleNavigation("/lesson/3")}
              >
                <div className="flex items-start min-w-0 w-full">
                  <Cog className="mr-3 mt-0.5 flex-shrink-0" size={16} />
                  <span className="text-left leading-relaxed break-words whitespace-normal flex-1">Lesson 3: The AI-Native Success Factors</span>
                </div>
              </Button>
              
              <Button
                variant={location === "/lesson/4" || location === "/exercise/workflow-enhancer" ? "default" : "ghost"}
                className="w-full justify-start text-sm h-auto py-3 min-h-[48px]"
                onClick={() => handleNavigation("/lesson/4")}
              >
                <div className="flex items-start min-w-0 w-full">
                  <Users className="mr-3 mt-0.5 flex-shrink-0" size={16} />
                  <span className="text-left leading-relaxed break-words whitespace-normal flex-1">Lesson 4: Improve My Workflow With AI</span>
                </div>
              </Button>
              
              <Button
                variant={location === "/lesson/5" ? "default" : "ghost"}
                className="w-full justify-start text-sm h-auto py-3 min-h-[48px]"
                onClick={() => handleNavigation("/lesson/5")}
              >
                <div className="flex items-start min-w-0 w-full">
                  <TrendingUp className="mr-3 mt-0.5 flex-shrink-0" size={16} />
                  <span className="text-left leading-relaxed break-words whitespace-normal flex-1">Lesson 5: Change Management</span>
                </div>
              </Button>
              
              <Button
                variant={location === "/lesson/6" ? "default" : "ghost"}
                className="w-full justify-start text-sm h-auto py-3 min-h-[48px]"
                onClick={() => handleNavigation("/lesson/6")}
              >
                <div className="flex items-start min-w-0 w-full">
                  <Target className="mr-3 mt-0.5 flex-shrink-0" size={16} />
                  <span className="text-left leading-relaxed break-words whitespace-normal flex-1">Lesson 6: Taking Action</span>
                </div>
              </Button>
            </div>
          </div>
        </ul>
      </nav>

      {/* Utilities */}
      <div className="p-4 border-t border-sidebar-border space-y-2 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sm"
          onClick={handleExportJSON}
        >
          <Download className="mr-3" size={16} />
          Export → JSON
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sm"
          onClick={handleImportJSON}
        >
          <Upload className="mr-3" size={16} />
          Import ← JSON
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sm"
          onClick={handleExportPDF}
        >
          <FileText className="mr-3" size={16} />
          Export as PDF
        </Button>
        
        <Separator className="my-2" />
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sm"
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <>
              <Moon className="mr-3" size={16} />
              Dark Mode
            </>
          ) : (
            <>
              <Sun className="mr-3" size={16} />
              Light Mode
            </>
          )}
        </Button>
        
        <Separator className="my-2" />
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sm text-destructive hover:text-destructive"
          onClick={handleClearData}
        >
          <RefreshCw className="mr-3" size={16} />
          Clear All Data
        </Button>
      </div>
    </div>
  );
}
