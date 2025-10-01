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
import { WordToJiraFlow } from "./WordToJiraFlow";
import { JiraToWordFlow } from "./JiraToWordFlow";
import { PdfToJiraFlow } from "./PdfToJiraFlow";
import { JiraToPdfFlow } from "./JiraToPdfFlow";
import { useNavigate } from "react-router-dom";

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: typeof FileText;
  color: string;
  type: 'convert' | 'compress' | 'merge' | 'split' | 'jira-to-word' | 'word-to-jira' | 'pdf-to-notion' | 'html-to-pdf' | 'pdf-to-jira' | 'jira-to-pdf' | 'notion-to-pdf';
  route?: string;
  comingSoon?: boolean;
}

const tools: Tool[] = [
  {
    id: 'jira-to-word',
    title: 'Jira to Word',
    description: 'Export Jira tickets and content to Word documents',
    icon: Layers,
    color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    type: 'jira-to-word'
  },
  {
    id: 'word-to-jira',
    title: 'Word to Jira',
    description: 'Import Word documents directly into Jira format',
    icon: FileTextIcon,
    color: 'bg-gradient-to-r from-pink-500 to-pink-600',
    type: 'word-to-jira'
  },
  {
    id: 'pdf-to-notion',
    title: 'PDF to Notion',
    description: 'Transform PDF files into Notion-compatible format',
    icon: BookOpen,
    color: 'bg-gradient-to-r from-gray-600 to-gray-700',
    type: 'pdf-to-notion'
  },
  {
    id: 'pdf-to-jpg',
    title: 'PDF to JPG',
    description: 'Convert PDF pages to high-quality JPG images',
    icon: FileTextIcon,
    color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    type: 'convert'
  },
  {
    id: 'jpg-to-pdf',
    title: 'JPG to PDF',
    description: 'Transform JPG images into PDF documents',
    icon: FileText,
    color: 'bg-gradient-to-r from-teal-500 to-teal-600',
    type: 'convert'
  },
  {
    id: 'pdf-to-jira',
    title: 'PDF to Jira',
    description: 'Convert PDF documents directly into Jira tickets and issues',
    icon: Layers,
    color: 'bg-gradient-to-r from-violet-500 to-violet-600',
    type: 'pdf-to-jira'
  },
  {
    id: 'jira-to-pdf',
    title: 'Jira to PDF',
    description: 'Export Jira tickets and workflows to professional PDF reports',
    icon: FileText,
    color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    type: 'jira-to-pdf'
  },
  {
    id: 'notion-to-pdf',
    title: 'Notion to PDF',
    description: 'Transform Notion pages and databases into beautiful PDF documents',
    icon: BookOpen,
    color: 'bg-gradient-to-r from-slate-500 to-slate-600',
    type: 'notion-to-pdf'
  },
  {
    id: 'pdf-to-word',
    title: 'PDF to Word',
    description: 'Convert PDF files to editable Word documents with precision',
    icon: FileTextIcon,
    color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    type: 'convert'
  },
  {
    id: 'word-to-pdf',
    title: 'Word to PDF',
    description: 'Transform Word documents to professional PDF format',
    icon: FileText,
    color: 'bg-gradient-to-r from-red-500 to-red-600',
    type: 'convert'
  },
  {
    id: 'compress-pdf',
    title: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining crystal-clear quality',
    icon: Archive,
    color: 'bg-gradient-to-r from-green-500 to-green-600',
    type: 'compress',
    route: '/compress'
  },
  {
    id: 'merge-pdf',
    title: 'Merge PDF',
    description: 'Seamlessly combine multiple PDF files into one document',
    icon: GitMerge,
    color: 'bg-gradient-to-r from-purple-500 to-purple-600',
    type: 'merge',
    route: '/merge'
  },
  {
    id: 'split-pdf',
    title: 'Split PDF',
    description: 'Extract and separate specific pages with precision',
    icon: Scissors,
    color: 'bg-gradient-to-r from-orange-500 to-orange-600',
    type: 'split',
    route: '/split'
  },
  {
    id: 'html-to-pdf',
    title: 'HTML to PDF',
    description: 'Convert web pages and HTML content to professional PDFs',
    icon: Globe,
    color: 'bg-gradient-to-r from-cyan-500 to-cyan-600',
    type: 'html-to-pdf'
  }
];

export const ToolsGrid = () => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showWordToJira, setShowWordToJira] = useState(false);
  const [showJiraToWord, setShowJiraToWord] = useState(false);
  const navigate = useNavigate();

  const [showPdfToJira, setShowPdfToJira] = useState(false);
  const [showJiraToPdf, setShowJiraToPdf] = useState(false);

  const handleToolClick = (tool: Tool) => {
    if (tool.route) {
      navigate(tool.route);
    } else if (tool.type === 'word-to-jira') {
      setShowWordToJira(true);
    } else if (tool.type === 'jira-to-word') {
      setShowJiraToWord(true);
    } else if (tool.type === 'pdf-to-jira') {
      setShowPdfToJira(true);
    } else if (tool.type === 'jira-to-pdf') {
      setShowJiraToPdf(true);
    } else if (!tool.comingSoon) {
      setSelectedTool(tool);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool, index) => (
          <div 
            key={tool.id} 
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ToolCard
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              color={tool.color}
              onClick={() => handleToolClick(tool)}
              comingSoon={tool.comingSoon}
            />
          </div>
        ))}
      </div>

      {selectedTool && (
        <ConversionModal
          tool={selectedTool}
          open={!!selectedTool}
          onOpenChange={(open) => !open && setSelectedTool(null)}
        />
      )}

      <WordToJiraFlow
        open={showWordToJira}
        onOpenChange={setShowWordToJira}
      />

      <JiraToWordFlow
        open={showJiraToWord}
        onOpenChange={setShowJiraToWord}
      />

      <PdfToJiraFlow
        open={showPdfToJira}
        onOpenChange={setShowPdfToJira}
      />

      <JiraToPdfFlow
        open={showJiraToPdf}
        onOpenChange={setShowJiraToPdf}
      />
    </>
  );
};