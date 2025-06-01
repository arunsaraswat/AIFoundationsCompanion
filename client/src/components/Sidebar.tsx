import { GraduationCap, BarChart3, Download, Upload, FileText, Moon, Sun, RefreshCw, Zap, Brain, Cog, Users, TrendingUp, Target } from "lucide-react";
import { useLocation } from "wouter";
import { useTheme } from "../contexts/ThemeContext";
import { useCourseProgress } from "../contexts/CourseProgressContext";
import { exportToPDF, downloadJSON, uploadJSON } from "../utils/fileIO";
import { clearCourseData } from "../utils/storage";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Sidebar() {
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

  return (
    <div className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
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
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Button
              variant={location === "/" ? "default" : "ghost"}
              className="w-full justify-start text-sm font-medium"
              asChild
            >
              <a href="/">
                <BarChart3 className="mr-3" size={16} />
                Dashboard
              </a>
            </Button>
          </li>
          
          <div className="py-2">
            <div className="text-xs font-medium text-muted-foreground mb-2">Lessons</div>
            <div className="space-y-1">
              <Button
                variant={location === "/lesson/1" ? "default" : "ghost"}
                className="w-full justify-start text-sm"
                asChild
              >
                <a href="/lesson/1">
                  <Zap className="mr-3" size={16} />
                  <span className="truncate">Lesson 1: EDGE + AI-Native</span>
                </a>
              </Button>
              
              <Button
                variant={location === "/lesson/2" ? "default" : "ghost"}
                className="w-full justify-start text-sm"
                asChild
              >
                <a href="/lesson/2">
                  <Brain className="mr-3" size={16} />
                  <span className="truncate">Lesson 2: AI Technical</span>
                </a>
              </Button>
              
              <Button
                variant={location === "/lesson/3" ? "default" : "ghost"}
                className="w-full justify-start text-sm"
                asChild
              >
                <a href="/lesson/3">
                  <Cog className="mr-3" size={16} />
                  <span className="truncate">Lesson 3: Operating Model</span>
                </a>
              </Button>
              
              <Button
                variant={location === "/lesson/4" ? "default" : "ghost"}
                className="w-full justify-start text-sm"
                asChild
              >
                <a href="/lesson/4">
                  <Users className="mr-3" size={16} />
                  <span className="truncate">Lesson 4: In Practice</span>
                </a>
              </Button>
              
              <Button
                variant={location === "/lesson/5" ? "default" : "ghost"}
                className="w-full justify-start text-sm"
                asChild
              >
                <a href="/lesson/5">
                  <TrendingUp className="mr-3" size={16} />
                  <span className="truncate">Lesson 5: Change Mgmt</span>
                </a>
              </Button>
              
              <Button
                variant={location === "/lesson/6" ? "default" : "ghost"}
                className="w-full justify-start text-sm"
                asChild
              >
                <a href="/lesson/6">
                  <Target className="mr-3" size={16} />
                  <span className="truncate">Lesson 6: Taking Action</span>
                </a>
              </Button>
            </div>
          </div>
        </ul>
      </nav>

      {/* Utilities */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
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
