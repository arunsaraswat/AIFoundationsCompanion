import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";
import PdfViewer from "./PdfViewer";

interface PDFLinkProps {
  href: string;
  title?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: "button" | "link";
  icon?: boolean;
}

export default function PDFLink({ 
  href, 
  title, 
  children, 
  className = "",
  variant = "link",
  icon = true
}: PDFLinkProps) {
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  
  // Determine if this is a PDF based on the URL
  const isPDF = href?.endsWith('.pdf');
  const isExternal = href?.startsWith('http') && !isPDF;
  
  // For non-PDF links, just return a regular link
  if (!isPDF) {
    return (
      <a 
        href={href}
        target={isExternal ? "_blank" : "_self"}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className={className}
      >
        {icon && isExternal && <ExternalLink className="h-4 w-4 inline mr-2" />}
        {children || title || "Open Link"}
      </a>
    );
  }
  
  // Extract title from children or use provided title
  const displayTitle = title || (typeof children === 'string' ? children : 'PDF Document');
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPdfViewerOpen(true);
  };
  
  if (variant === "button") {
    return (
      <>
        <Button 
          onClick={handleClick}
          className={className || "inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"}
        >
          {icon && <FileText className="h-4 w-4" />}
          {children || displayTitle}
        </Button>
        
        <PdfViewer
          isOpen={isPdfViewerOpen}
          onClose={() => setIsPdfViewerOpen(false)}
          title={displayTitle}
          pdfPath={href}
        />
      </>
    );
  }
  
  return (
    <>
      <a 
        href={href}
        onClick={handleClick}
        className={className || "inline-flex items-center gap-2 text-primary hover:underline cursor-pointer"}
      >
        {icon && <FileText className="h-4 w-4" />}
        {children || displayTitle}
      </a>
      
      <PdfViewer
        isOpen={isPdfViewerOpen}
        onClose={() => setIsPdfViewerOpen(false)}
        title={displayTitle}
        pdfPath={href}
      />
    </>
  );
}