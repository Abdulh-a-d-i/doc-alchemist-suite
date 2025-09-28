import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  title?: string;
  description?: string;
}

export function FileUpload({
  onFilesSelected,
  acceptedTypes = [".pdf"],
  maxFiles = 1,
  title = "Select files",
  description = "Drag and drop your files here or click the button below",
}: FileUploadProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, maxFiles);
    onFilesSelected(files);
    e.target.value = ''; // Reset to allow re-selecting same file
  };

  const handleButtonClick = () => {
    const input = document.getElementById('file-input-hidden') as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  return (
    <Card className="border-2 border-dashed p-8 text-center">
      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>

      <Button 
        type="button" 
        onClick={handleButtonClick}
        className="mt-4"
      >
        Choose Files
      </Button>
      
      <input
        id="file-input-hidden"
        type="file"
        accept={acceptedTypes.join(",")}
        multiple={maxFiles > 1}
        onChange={handleChange}
        className="hidden"
      />
    </Card>
  );
}
