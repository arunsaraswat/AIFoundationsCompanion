import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import PdfViewer from "./PdfViewer";

interface PDFViewerButtonProps {
  lessonId: number;
  subLessonId: string;
  exerciseId: string;
  stepId: string;
  title?: string;
  pdfPath?: string;
  buttonText?: string;
}

export default function PDFViewerButton({ 
  lessonId, 
  subLessonId, 
  exerciseId, 
  stepId, 
  title = "PDF Document",
  pdfPath = "/assets/document.pdf",
  buttonText 
}: PDFViewerButtonProps) {
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Button 
        onClick={() => setIsPdfViewerOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
      >
        <FileText className="h-4 w-4" />
        {buttonText || title}
      </Button>
      
      <PdfViewer
        isOpen={isPdfViewerOpen}
        onClose={() => setIsPdfViewerOpen(false)}
        title={title}
        pdfPath={pdfPath}
      />
    </div>
  );
}