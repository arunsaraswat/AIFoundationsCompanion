import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PdfViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfPath: string;
}

export default function PdfViewer({ isOpen, onClose, title, pdfPath }: PdfViewerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 w-full h-full">
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