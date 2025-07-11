import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { usePdfViewer } from "../contexts/PdfViewerContext";

interface PDFLinkProps {
  href: string;
  title: string;
  variant?: "button" | "link";
  buttonText?: string;
  className?: string;
}

export default function PDFLink({ 
  href, 
  title, 
  variant = "link",
  buttonText,
  className = ""
}: PDFLinkProps) {
  const { openPdf } = usePdfViewer();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openPdf(title, href);
  };

  if (variant === "button") {
    return (
      <Button 
        onClick={handleClick}
        className={className || "flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"}
      >
        <FileText className="h-4 w-4" />
        {buttonText || title}
      </Button>
    );
  }

  // Link variant
  return (
    <a
      href={href}
      onClick={handleClick}
      className={className || "inline-flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90 transition-colors cursor-pointer"}
    >
      <FileText className="h-3 w-3" />
      {buttonText || title}
    </a>
  );
}