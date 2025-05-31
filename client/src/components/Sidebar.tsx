import { GraduationCap, BarChart3, Download, Upload, FileText, Moon, Sun } from "lucide-react";
import { useLocation } from "wouter";
import { useTheme } from "../contexts/ThemeContext";
import { useCourseProgress } from "../contexts/CourseProgressContext";
import { exportToPDF, downloadJSON, uploadJSON } from "../utils/fileIO";
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

  return (
    <div className="w-60 bg-sidebar border-r border-sidebar-border flex flex-col transition-colors duration-300">
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
                Course Progress
              </a>
            </Button>
          </li>
          <li className="opacity-50">
            <div className="flex items-center px-4 py-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 mr-3 rounded border-2 border-dashed border-muted-foreground/50" />
              Future Page
            </div>
          </li>
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
      </div>
    </div>
  );
}
