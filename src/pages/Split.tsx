// Fixed src/pages/Split.tsx
import { useState } from "react";
import { Header } from "@/components/Header";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors, ArrowLeft, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { pdfApi } from "@/services/pdfApi";
import { useNavigate } from "react-router-dom";

const Split = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validatePageRange = (pageRange: string): boolean => {
    // Simple validation for page ranges like "1-3,5,7-10"
    const pattern = /^(\d+(-\d+)?)(,\d+(-\d+)?)*$/;
    return pattern.test(pageRange.replace(/\s/g, ''));
  };

  const handleSplit = async () => {
    if (files.length === 0) {
      toast({
        title: "Error",
        description: "Please select a PDF file to split",
        variant: "destructive",
      });
      return;
    }

    if (!pages.trim()) {
      toast({
        title: "Error",
        description: "Please specify pages to extract",
        variant: "destructive",
      });
      return;
    }

    if (!validatePageRange(pages.trim())) {
      toast({
        title: "Error", 
        description: "Invalid page range format. Use format like: 1-3, 5, 7-10",
        variant: "destructive",
      });
      return
