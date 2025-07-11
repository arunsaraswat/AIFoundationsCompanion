import { createContext, useContext, useState, ReactNode } from "react";
import PdfViewer from "../components/PdfViewer";

interface PdfViewerContextType {
  openPdf: (title: string, pdfPath: string) => void;
  closePdf: () => void;
}

const PdfViewerContext = createContext<PdfViewerContextType | undefined>(undefined);

export function PdfViewerProvider({ children }: { children: ReactNode }) {
  const [pdfState, setPdfState] = useState<{ isOpen: boolean; title: string; pdfPath: string }>({
    isOpen: false,
    title: "",
    pdfPath: ""
  });

  const openPdf = (title: string, pdfPath: string) => {
    setPdfState({ isOpen: true, title, pdfPath });
  };

  const closePdf = () => {
    setPdfState({ isOpen: false, title: "", pdfPath: "" });
  };

  return (
    <PdfViewerContext.Provider value={{ openPdf, closePdf }}>
      {children}
      <PdfViewer
        isOpen={pdfState.isOpen}
        onClose={closePdf}
        title={pdfState.title}
        pdfPath={pdfState.pdfPath}
      />
    </PdfViewerContext.Provider>
  );
}

export function usePdfViewer() {
  const context = useContext(PdfViewerContext);
  if (!context) {
    throw new Error("usePdfViewer must be used within a PdfViewerProvider");
  }
  return context;
}