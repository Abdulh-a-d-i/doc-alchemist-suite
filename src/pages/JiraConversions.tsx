import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, FileText, FileTextIcon, BookOpen, Sparkles } from "lucide-react";
import { useState } from "react";
import { JiraToWordFlow } from "@/components/JiraToWordFlow";
import { WordToJiraFlow } from "@/components/WordToJiraFlow";
import { PdfToJiraFlow } from "@/components/PdfToJiraFlow";
import { JiraToPdfFlow } from "@/components/JiraToPdfFlow";
import { TextToJiraFlow } from "@/components/TextToJiraFlow";

const JiraConversions = () => {
  const [showJiraToWord, setShowJiraToWord] = useState(false);
  const [showWordToJira, setShowWordToJira] = useState(false);
  const [showPdfToJira, setShowPdfToJira] = useState(false);
  const [showJiraToPdf, setShowJiraToPdf] = useState(false);
  const [showTextToJira, setShowTextToJira] = useState(false);

  const conversions = [
    {
      id: 'jira-to-word',
      title: 'Jira to Word',
      description: 'Export Jira tickets and content to Word documents with full formatting',
      icon: Layers,
      color: 'from-indigo-500 to-indigo-600',
      onClick: () => setShowJiraToWord(true)
    },
    {
      id: 'word-to-jira',
      title: 'Word to Jira',
      description: 'Import Word documents directly into Jira tickets and issues',
      icon: FileTextIcon,
      color: 'from-pink-500 to-pink-600',
      onClick: () => setShowWordToJira(true)
    },
    {
      id: 'pdf-to-jira',
      title: 'PDF to Jira',
      description: 'Convert PDF documents directly into Jira tickets with smart parsing',
      icon: FileText,
      color: 'from-violet-500 to-violet-600',
      onClick: () => setShowPdfToJira(true)
    },
    {
      id: 'jira-to-pdf',
      title: 'Jira to PDF',
      description: 'Export Jira tickets and workflows to professional PDF reports',
      icon: BookOpen,
      color: 'from-emerald-500 to-emerald-600',
      onClick: () => setShowJiraToPdf(true)
    },
    {
      id: 'text-to-jira',
      title: 'Text → Jira (LLM)',
      description: 'Convert text or meeting transcripts to Jira tasks using AI',
      icon: Sparkles,
      color: 'from-purple-500 to-purple-600',
      onClick: () => setShowTextToJira(true)
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary"></div>
            <span className="text-sm font-mono tracking-wider text-primary uppercase">
              JIRA INTEGRATION SUITE
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary"></div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 gradient-text">
            Jira Conversions
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Seamlessly convert between Jira tickets and document formats. 
            Import, export, and transform your project data with ease.
          </p>
        </div>
      </section>

      {/* Conversions Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {conversions.map((conversion, index) => {
              const Icon = conversion.icon;
              return (
                <Card 
                  key={conversion.id}
                  className="group glass-card border hover-lift cursor-pointer"
                  onClick={conversion.onClick}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-r ${conversion.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-500`}>
                      <Icon className="h-7 w-7 text-white relative z-10" />
                    </div>
                    
                    <h3 className="text-lg font-heading font-semibold mb-3 group-hover:text-primary transition-colors">
                      {conversion.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {conversion.description}
                    </p>
                    
                    <Button 
                      size="sm"
                      className="w-full bg-gradient-to-r from-primary to-primary-hover"
                    >
                      Start Conversion
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modals */}
      <JiraToWordFlow open={showJiraToWord} onOpenChange={setShowJiraToWord} />
      <WordToJiraFlow open={showWordToJira} onOpenChange={setShowWordToJira} />
      <PdfToJiraFlow open={showPdfToJira} onOpenChange={setShowPdfToJira} />
      <JiraToPdfFlow open={showJiraToPdf} onOpenChange={setShowJiraToPdf} />
      <TextToJiraFlow open={showTextToJira} onOpenChange={setShowTextToJira} />
    </div>
  );
};

export default JiraConversions;
