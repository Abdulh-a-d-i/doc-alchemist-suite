import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  title?: string;
  description?: string;
}

export const FileUpload = ({ 
  onFilesSelected, 
  acceptedTypes = ['.pdf'], 
  maxFiles = 1,
  title = "Select PDF files",
  description = "Drag and drop your files here or click to browse"
}: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('FileUpload: onDrop called with files:', acceptedFiles);
    console.log('FileUpload: current uploadedFiles:', uploadedFiles);
    console.log('FileUpload: maxFiles:', maxFiles);
    
    const newFiles = [...uploadedFiles, ...acceptedFiles].slice(0, maxFiles);
    console.log('FileUpload: newFiles after processing:', newFiles);
    
    setUploadedFiles(newFiles);
    onFilesSelected(newFiles);
    
    console.log('FileUpload: files passed to parent component:', newFiles);
  }, [onFilesSelected, uploadedFiles, maxFiles]);

  const removeFile = (index: number) => {
    console.log('FileUpload: removeFile called for index:', index);
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    console.log('FileUpload: files after removal:', newFiles);
    setUploadedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      // Map file extensions to MIME types
      const mimeTypeMap: Record<string, string[]> = {
        '.pdf': ['application/pdf'],
        '.doc': ['application/msword'],
        '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        '.jpg': ['image/jpeg'],
        '.jpeg': ['image/jpeg'],
        '.png': ['image/png'],
        '.gif': ['image/gif'],
        '.bmp': ['image/bmp'],
        '.tiff': ['image/tiff'],
        '.json': ['application/json'],
        '.txt': ['text/plain'],
        '.zip': ['application/zip'],
        '.html': ['text/html'],
        '.md': ['text/markdown']
      };
      
      const mimeTypes = mimeTypeMap[type] || [];
      mimeTypes.forEach(mimeType => {
        acc[mimeType] = [];
      });
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles,
    noClick: true, // Disable automatic click to prevent conflicts
    onDropAccepted: (files) => {
      console.log('FileUpload: onDropAccepted called with files:', files);
    },
    onDropRejected: (rejectedFiles) => {
      console.log('FileUpload: onDropRejected called with rejected files:', rejectedFiles);
    },
    onError: (error) => {
      console.error('FileUpload: dropzone error:', error);
    }
  });

  console.log('FileUpload: Component render - acceptedTypes:', acceptedTypes);
  console.log('FileUpload: Component render - uploadedFiles:', uploadedFiles);

  return (
    <div className="space-y-4">
      <Card 
        {...getRootProps()} 
        className={`border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive 
            ? 'border-primary bg-accent' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <Button 
          type="button" 
          variant="outline" 
          onClick={(e) => {
            e.stopPropagation();
            console.log('FileUpload: Choose Files button clicked, calling open()');
            open();
          }}
        >
          Choose Files
        </Button>
      </Card>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Files:</h4>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <div className="flex items-center space-x-3">
                <File className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
