import { useCallback, useRef, useState } from "react";
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
  acceptedTypes = [".pdf"],
  maxFiles = 1,
  title = "Select PDF files",
  description = "Drag and drop your files here or click to browse",
}: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...uploadedFiles, ...acceptedFiles].slice(0, maxFiles);
      setUploadedFiles(newFiles);
      onFilesSelected(newFiles);
    },
    [onFilesSelected, uploadedFiles, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      const mimeTypeMap: Record<string, string[]> = {
        ".pdf": ["application/pdf"],
        ".doc": ["application/msword"],
        ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        ".jpg": ["image/jpeg"],
        ".jpeg": ["image/jpeg"],
        ".png": ["image/png"],
        ".gif": ["image/gif"],
        ".bmp": ["image/bmp"],
        ".tiff": ["image/tiff"],
        ".json": ["application/json"],
        ".txt": ["text/plain"],
        ".zip": ["application/zip"],
        ".html": ["text/html"],
        ".md": ["text/markdown"],
      };
      const mimeTypes = mimeTypeMap[type] || [];
      mimeTypes.forEach((mimeType) => {
        acc[mimeType] = [];
      });
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles,
    noClick: true, // we handle clicks manually
  });

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  return (
    <div className="space-y-4">
      <Card className="border-2 border-dashed p-8 text-center transition-colors">
        {/* Dropzone area */}
        <div
          {...getRootProps()}
          className={`cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-accent border-2 border-dashed"
              : "border-muted-foreground/25 hover:border-primary/50 border-2 border-dashed"
          } p-6 rounded-lg`}
        >
          {/* Hidden input with ref */}
          <input {...getInputProps()} ref={inputRef} />

          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4">{description}</p>
        </div>

        {/* Real working button */}
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          className="mt-4"
        >
          Choose Files
        </Button>
      </Card>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Files:</h4>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-accent rounded-lg"
            >
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
