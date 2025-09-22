import { useState } from "react";
import { 
  FileText, 
  Archive, 
  GitMerge, 
  Scissors, 
  Globe, 
  FileTextIcon,
  BookOpen,
  Layers
} from "lucide-react";
import { ToolCard } from "./ToolCard";
import { ConversionModal } from "./ConversionModal";

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: typeof FileText;
  color: string;
  type: 'convert' | 'compress' | 'merge' | 'split' | 'jira-to-word' | 'word-to-jira' | 'notion-to-pdf' | 'html-to-pdf';
}

const tools: Tool[] = [
  {
    id: 'pdf-to-word',
    title: 'PDF to Word',
    description: 'Convert PDF files to editable Word documents',
    icon: FileTextIcon,
    color: 'bg-blue-500',
    type: 'convert'
  },
  {
    id: 'word-to-pdf',
    title: 'Word to PDF',
    description: 'Convert Word documents to PDF format',
    icon: FileText,
    color: 'bg-red-500',
    type: 'convert'
  },
  {
    id: 'compress-pdf',
    title: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining quality',
    icon: Archive,
    color: 'bg-green-500',
    type: 'compress'
  },
  {
    id: 'merge-pdf',
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one',
    icon: GitMerge,
    color: 'bg-purple-500',
    type: 'merge'
  },
  {
    id: 'split-pdf',
    title: 'Split PDF',
    description: 'Extract pages from PDF files',
    icon: Scissors,
    color: 'bg-orange-500',
    type: 'split'
  },
  {
    id: 'html-to-pdf',
    title: 'HTML to PDF',
    description: 'Convert HTML content or web pages to PDF',
    icon: Globe,
    color: 'bg-cyan-500',
    type: 'html-to-pdf'
  },
  {
    id: 'jira-to-word',
    title: 'Jira to Word',
    description: 'Convert Jira content to Word documents',
    icon: Layers,
    color: 'bg-indigo-500',
    type: 'jira-to-word'
  },
  {
    id: 'word-to-jira',
    title: 'Word to Jira',
    description: 'Convert Word documents to Jira format',
    icon: FileTextIcon,
    color: 'bg-pink-500',
    type: 'word-to-jira'
  },
  {
    id: 'notion-to-pdf',
    title: 'Notion to PDF',
    description: 'Convert Notion pages to PDF documents',
    icon: BookOpen,
    color: 'bg-gray-700',
    type: 'notion-to-pdf'
  }
];

export const ToolsGrid = () => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            color={tool.color}
            onClick={() => setSelectedTool(tool)}
          />
        ))}
      </div>

      {selectedTool && (
        <ConversionModal
          tool={selectedTool}
          open={!!selectedTool}
          onOpenChange={(open) => !open && setSelectedTool(null)}
        />
      )}
    </>
  );
};