import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Tool {
  id: string;
  title: string;
  description: string;
  route?: string;
  keywords: string[];
  comingSoon?: boolean;
}

const tools: Tool[] = [
  {
    id: 'pdf-to-word',
    title: 'PDF to Word',
    description: 'Convert PDF files to editable Word documents',
    keywords: ['pdf', 'word', 'convert', 'docx', 'edit'],
    comingSoon: true
  },
  {
    id: 'word-to-pdf',
    title: 'Word to PDF',
    description: 'Convert Word documents to PDF format',
    keywords: ['word', 'pdf', 'convert', 'docx', 'document'],
    comingSoon: true
  },
  {
    id: 'compress-pdf',
    title: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining quality',
    keywords: ['compress', 'reduce', 'size', 'optimize', 'shrink'],
    route: '/compress'
  },
  {
    id: 'merge-pdf',
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one',
    keywords: ['merge', 'combine', 'join', 'unite', 'multiple'],
    route: '/merge'
  },
  {
    id: 'split-pdf',
    title: 'Split PDF',
    description: 'Extract pages from PDF files',
    keywords: ['split', 'extract', 'pages', 'separate', 'divide'],
    route: '/split'
  },
  {
    id: 'html-to-pdf',
    title: 'HTML to PDF',
    description: 'Convert HTML content or web pages to PDF',
    keywords: ['html', 'web', 'page', 'convert', 'website'],
    comingSoon: true
  },
  {
    id: 'jira-to-word',
    title: 'Jira to Word',
    description: 'Convert Jira content to Word documents',
    keywords: ['jira', 'word', 'tickets', 'issues', 'export'],
    comingSoon: true
  },
  {
    id: 'word-to-jira',
    title: 'Word to Jira',
    description: 'Convert Word documents to Jira format',
    keywords: ['word', 'jira', 'import', 'tickets', 'convert'],
    comingSoon: true
  },
  {
    id: 'notion-to-pdf',
    title: 'Notion to PDF',
    description: 'Convert Notion pages to PDF documents',
    keywords: ['notion', 'pdf', 'export', 'pages', 'documents'],
    comingSoon: true
  }
];

interface SearchBarProps {
  onToolSelect?: (tool: Tool) => void;
}

export const SearchBar = ({ onToolSelect }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const filteredTools = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchTerms = query.toLowerCase().split(' ');
    
    return tools.filter(tool => {
      const searchText = `${tool.title} ${tool.description} ${tool.keywords.join(' ')}`.toLowerCase();
      return searchTerms.every(term => searchText.includes(term));
    });
  }, [query]);

  const handleToolClick = (tool: Tool) => {
    if (tool.route) {
      navigate(tool.route);
    } else if (onToolSelect) {
      onToolSelect(tool);
    }
    setQuery("");
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length > 0);
          }}
          onFocus={() => setIsOpen(query.length > 0)}
          placeholder="Search PDF tools..."
          className="pl-10 pr-10 glass-card border-primary/20 focus:border-primary/50 focus:ring-primary/20"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Results */}
          <Card className="absolute top-full left-0 right-0 mt-2 z-50 glass-card border-primary/20 animate-slide-up">
            <CardContent className="p-0">
              {filteredTools.length > 0 ? (
                <div className="max-h-80 overflow-y-auto">
                  {filteredTools.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => handleToolClick(tool)}
                      className="p-4 hover:bg-accent/10 cursor-pointer border-b border-border/10 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-foreground">{tool.title}</h4>
                        {tool.comingSoon && (
                          <Badge variant="secondary" className="text-xs bg-warning/20 text-warning">
                            Coming Soon
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tool.keywords.slice(0, 3).map((keyword) => (
                          <Badge key={keyword} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted-foreground mb-2">No tools found</p>
                  <Badge variant="secondary" className="bg-warning/20 text-warning">
                    Coming Soon
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};