import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PdfViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfPath: string;
}

export default function PdfViewer({ isOpen, onClose, title, pdfPath }: PdfViewerProps) {
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full h-[90vh] flex flex-col" style={{ zIndex: 100 }}>
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden p-0">
          <iframe
            src={pdfPath}
            className="w-full h-full border-0"
            title={title}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}