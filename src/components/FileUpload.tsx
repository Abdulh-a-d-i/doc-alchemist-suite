import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Import cn from shadcn utils if available, or use classnames library

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

  return (
    <Card className="border-2 border-dashed p-8 text-center">
      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>

      <label className="relative inline-block cursor-pointer">
        <Button 
          type="button" 
          className="mt-4 select-none pointer-events-none" // Prevent text selection and pass clicks through
        >
          Choose Files
        </Button>
        <input
          type="file"
          accept={acceptedTypes.join(",")}
          multiple={maxFiles > 1}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </label>
    </Card>
  );
}






// // src/components/FileUpload.tsx
// import { useCallback, useState } from "react";
// import { useDropzone } from "react-dropzone";
// import { Upload, File, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";

// interface FileUploadProps {
//   onFilesSelected: (files: File[]) => void;
//   acceptedTypes?: string[];
//   maxFiles?: number;
//   title?: string;
//   description?: string;
// }

// export const FileUpload = ({
//   onFilesSelected,
//   acceptedTypes = [".pdf"],
//   maxFiles = 1,
//   title = "Select files",
//   description = "Drag and drop your files here or click to browse",
// }: FileUploadProps) => {
//   const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

//   const onDrop = useCallback(
//     (acceptedFiles: File[]) => {
//       const newFiles = [...uploadedFiles, ...acceptedFiles].slice(0, maxFiles);
//       setUploadedFiles(newFiles);
//       onFilesSelected(newFiles);
//     },
//     [onFilesSelected, uploadedFiles, maxFiles]
//   );

//   // Map extensions to MIME types
//   const buildAccept = (types: string[]) => {
//     const map: Record<string, string[]> = {
//       ".pdf": ["application/pdf"],
//       ".doc": ["application/msword"],
//       ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
//       ".jpg": ["image/jpeg"],
//       ".jpeg": ["image/jpeg"],
//       ".png": ["image/png"],
//       ".gif": ["image/gif"],
//       ".bmp": ["image/bmp"],
//       ".tiff": ["image/tiff"],
//       ".json": ["application/json"],
//       ".txt": ["text/plain"],
//       ".zip": ["application/zip"],
//       ".html": ["text/html"],
//       ".md": ["text/markdown"],
//     };

//     return types.reduce((acc, type) => {
//       (map[type] || []).forEach((mime) => (acc[mime] = []));
//       return acc;
//     }, {} as Record<string, string[]>);
//   };

//   const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
//     onDrop,
//     accept: buildAccept(acceptedTypes),
//     maxFiles,
//     noClick: true,     // disable auto-click
//     noKeyboard: true,  // disable Enter/Space
//   });

//   const removeFile = (i: number) => {
//     const newFiles = uploadedFiles.filter((_, idx) => idx !== i);
//     setUploadedFiles(newFiles);
//     onFilesSelected(newFiles);
//   };

//   return (
//     <div className="space-y-4">
//       <Card className="border-2 border-dashed p-8 text-center transition-colors">
//         {/* Dropzone area */}
//         <div
//           {...getRootProps()}
//           className={`cursor-pointer transition-colors ${
//             isDragActive
//               ? "border-primary bg-accent"
//               : "border-muted-foreground/25 hover:border-primary/50"
//           } border-2 border-dashed p-6 rounded-lg`}
//         >
//           <input {...getInputProps()} />

//           <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
//           <h3 className="text-lg font-medium mb-2">{title}</h3>
//           <p className="text-muted-foreground mb-4">{description}</p>
//         </div>

//         {/* Working button */}
//         <Button type="button" onClick={open} className="mt-4">
//           Choose Files
//         </Button>
//       </Card>

//       {/* File list */}
//       {uploadedFiles.length > 0 && (
//         <div className="space-y-2">
//           <h4 className="text-sm font-medium">Selected Files:</h4>
//           {uploadedFiles.map((file, idx) => (
//             <div
//               key={idx}
//               className="flex items-center justify-between p-3 bg-accent rounded-lg"
//             >
//               <div className="flex items-center space-x-3">
//                 <File className="h-4 w-4 text-muted-foreground" />
//                 <span className="text-sm font-medium">{file.name}</span>
//                 <span className="text-xs text-muted-foreground">
//                   {(file.size / 1024 / 1024).toFixed(2)} MB
//                 </span>
//               </div>
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => removeFile(idx)}
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };
