import { useState } from "react";
import { 
  FileText, 
  Archive, 
  GitMerge, 
  Scissors, 
  Globe, 
  FileTextIcon,
  BookOpen,
  Layers,
  Sparkles,
  Presentation,
  Sheet,
  Table2,
  Image,
  FileImage,
  FileArchive,
  Code,
  Zap,
  FileCheck
} from "lucide-react";
import { ToolCard } from "./ToolCard";
import { ConversionModal } from "./ConversionModal";
import { WordToJiraFlow } from "./WordToJiraFlow";
import { JiraToWordFlow } from "./JiraToWordFlow";
import { PdfToJiraFlow } from "./PdfToJiraFlow";
import { JiraToPdfFlow } from "./JiraToPdfFlow";
import { TextToJiraFlow } from "./TextToJiraFlow";
import { useNavigate } from "react-router-dom";

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: typeof FileText;
  color: string;
  type: 'convert' | 'compress' | 'merge' | 'split' | 'jira-to-word' | 'word-to-jira' | 'pdf-to-notion' | 'html-to-pdf' | 'pdf-to-jira' | 'jira-to-pdf' | 'notion-to-pdf' | 'text-to-jira' | 'word-to-notion' | 'notion-to-word';
  route?: string;
  comingSoon?: boolean;
}

const tools: Tool[] = [
  {
    id: 'pdf-to-word',
    title: 'PDF → Word',
    description: 'Convert PDF files to editable Word documents with precision',
    icon: FileTextIcon,
    color: 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-lg shadow-blue-500/50',
    type: 'convert'
  },
  {
    id: 'word-to-pdf',
    title: 'Word → PDF',
    description: 'Transform Word documents to professional PDF format',
    icon: FileText,
    color: 'bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 shadow-lg shadow-red-500/50',
    type: 'convert'
  },
  {
    id: 'pdf-to-pptx',
    title: 'PDF → PowerPoint',
    description: 'Convert PDF documents to editable PowerPoint presentations',
    icon: Presentation,
    color: 'bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 shadow-lg shadow-orange-500/50',
    type: 'convert'
  },
  {
    id: 'pptx-to-pdf',
    title: 'PowerPoint → PDF',
    description: 'Transform PowerPoint presentations to PDF format',
    icon: Presentation,
    color: 'bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600 shadow-lg shadow-rose-500/50',
    type: 'convert'
  },
  {
    id: 'pdf-to-xlsx',
    title: 'PDF → Excel',
    description: 'Extract tables and data from PDF to Excel spreadsheets',
    icon: Sheet,
    color: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 shadow-lg shadow-green-500/50',
    type: 'convert'
  },
  {
    id: 'xlsx-to-pdf',
    title: 'Excel → PDF',
    description: 'Convert Excel spreadsheets to professional PDF documents',
    icon: Table2,
    color: 'bg-gradient-to-br from-emerald-600 via-green-600 to-lime-600 shadow-lg shadow-emerald-500/50',
    type: 'convert'
  },
  {
    id: 'pdf-to-csv',
    title: 'PDF → CSV',
    description: 'Extract table data from PDF to CSV format',
    icon: Table2,
    color: 'bg-gradient-to-br from-lime-500 via-green-500 to-emerald-600 shadow-lg shadow-lime-500/50',
    type: 'convert'
  },
  {
    id: 'csv-to-pdf',
    title: 'CSV → PDF',
    description: 'Convert CSV data files to formatted PDF documents',
    icon: FileCheck,
    color: 'bg-gradient-to-br from-teal-500 via-cyan-500 to-sky-600 shadow-lg shadow-teal-500/50',
    type: 'convert'
  },
  {
    id: 'pdf-to-jpg',
    title: 'PDF → JPG',
    description: 'Convert PDF pages to high-quality JPG images',
    icon: Image,
    color: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-lg shadow-yellow-500/50',
    type: 'convert'
  },
  {
    id: 'jpg-to-pdf',
    title: 'JPG → PDF',
    description: 'Transform JPG images into PDF documents',
    icon: FileImage,
    color: 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 shadow-lg shadow-amber-500/50',
    type: 'convert'
  },
  {
    id: 'pdf-to-pdfa',
    title: 'PDF → PDF/A',
    description: 'Convert PDF to archival PDF/A format for long-term preservation',
    icon: FileArchive,
    color: 'bg-gradient-to-br from-slate-500 via-gray-600 to-zinc-700 shadow-lg shadow-slate-500/50',
    type: 'convert'
  },
  {
    id: 'html-to-pdf',
    title: 'HTML → PDF',
    description: 'Convert web pages and HTML content to professional PDFs',
    icon: Code,
    color: 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-lg shadow-cyan-500/50',
    type: 'html-to-pdf'
  },
  {
    id: 'compress-pdf',
    title: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining crystal-clear quality',
    icon: Archive,
    color: 'bg-gradient-to-br from-green-500 via-teal-500 to-cyan-600 shadow-lg shadow-green-500/50',
    type: 'compress',
    route: '/compress'
  },
  {
    id: 'merge-pdf',
    title: 'Merge PDF',
    description: 'Seamlessly combine multiple PDF files into one document',
    icon: GitMerge,
    color: 'bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 shadow-lg shadow-purple-500/50',
    type: 'merge',
    route: '/merge'
  },
  {
    id: 'split-pdf',
    title: 'Split PDF',
    description: 'Extract and separate specific pages with precision',
    icon: Scissors,
    color: 'bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 shadow-lg shadow-orange-500/50',
    type: 'split',
    route: '/split'
  },
  {
    id: 'pdf-to-jira',
    title: 'PDF → Jira',
    description: 'Convert PDF documents directly into Jira tickets and issues',
    icon: Zap,
    color: 'bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 shadow-lg shadow-violet-500/50',
    type: 'pdf-to-jira'
  },
  {
    id: 'word-to-jira',
    title: 'Word → Jira',
    description: 'Import Word documents directly into Jira format',
    icon: Zap,
    color: 'bg-gradient-to-br from-pink-500 via-rose-500 to-red-600 shadow-lg shadow-pink-500/50',
    type: 'word-to-jira'
  },
  {
    id: 'text-to-jira',
    title: 'Text → Jira (LLM)',
    description: 'Convert text or meeting transcripts to Jira tasks using AI',
    icon: Sparkles,
    color: 'bg-gradient-to-br from-purple-400 via-fuchsia-500 to-pink-600 shadow-lg shadow-purple-500/50',
    type: 'text-to-jira'
  },
  {
    id: 'jira-to-word',
    title: 'Jira → Word',
    description: 'Export Jira tickets and content to Word documents',
    icon: Layers,
    color: 'bg-gradient-to-br from-indigo-500 via-blue-500 to-sky-600 shadow-lg shadow-indigo-500/50',
    type: 'jira-to-word'
  },
  {
    id: 'jira-to-pdf',
    title: 'Jira → PDF',
    description: 'Export Jira tickets and workflows to professional PDF reports',
    icon: FileText,
    color: 'bg-gradient-to-br from-sky-400 via-cyan-500 to-teal-600 shadow-lg shadow-sky-500/50',
    type: 'jira-to-pdf'
  },
  {
    id: 'pdf-to-notion',
    title: 'PDF → Notion',
    description: 'Transform PDF files into Notion-compatible format',
    icon: BookOpen,
    color: 'bg-gradient-to-br from-slate-500 via-gray-600 to-neutral-700 shadow-lg shadow-slate-500/50',
    type: 'pdf-to-notion'
  },
  {
    id: 'word-to-notion',
    title: 'Word → Notion',
    description: 'Import Word documents into Notion as pages',
    icon: BookOpen,
    color: 'bg-gradient-to-br from-stone-500 via-neutral-600 to-zinc-700 shadow-lg shadow-stone-500/50',
    type: 'word-to-notion'
  },
  {
    id: 'notion-to-word',
    title: 'Notion → Word',
    description: 'Export Notion pages and databases to Word documents',
    icon: FileTextIcon,
    color: 'bg-gradient-to-br from-zinc-500 via-slate-600 to-gray-700 shadow-lg shadow-zinc-500/50',
    type: 'notion-to-word'
  },
  {
    id: 'notion-to-pdf',
    title: 'Notion → PDF',
    description: 'Transform Notion pages and databases into beautiful PDF documents',
    icon: BookOpen,
    color: 'bg-gradient-to-br from-neutral-600 via-stone-600 to-amber-700 shadow-lg shadow-neutral-500/50',
    type: 'notion-to-pdf'
  }
];

export const ToolsGrid = () => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showWordToJira, setShowWordToJira] = useState(false);
  const [showJiraToWord, setShowJiraToWord] = useState(false);
  const navigate = useNavigate();

  const [showPdfToJira, setShowPdfToJira] = useState(false);
  const [showJiraToPdf, setShowJiraToPdf] = useState(false);
  const [showTextToJira, setShowTextToJira] = useState(false);

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
    } else if (tool.type === 'text-to-jira') {
      setShowTextToJira(true);
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

      <TextToJiraFlow
        open={showTextToJira}
        onOpenChange={setShowTextToJira}
      />
    </>
  );
};