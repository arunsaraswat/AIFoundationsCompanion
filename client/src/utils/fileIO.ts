export function downloadJSON(data: string, filename: string): void {
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function uploadJSON(callback: (data: string) => void): void {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  
  input.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        callback(result);
      }
    };
    reader.readAsText(file);
  };
  
  input.click();
}

export function exportToPDF(filename: string): void {
  const element = document.getElementById("root");
  if (!element) {
    alert("Could not find content to export");
    return;
  }
  
  // Check if html2pdf is available
  if (typeof window !== "undefined" && (window as any).html2pdf) {
    const options = {
      margin: 1,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    (window as any).html2pdf().set(options).from(element).save();
  } else {
    alert("PDF export functionality is not available. Please ensure html2pdf.js is loaded.");
  }
}
