import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
  comingSoon?: boolean;
}

export const ToolCard = ({ title, description, icon: Icon, color, onClick, comingSoon }: ToolCardProps) => {
  return (
    <Card className="h-full glass-card neon-border hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer group animate-slide-up" onClick={onClick}>
      <CardContent className="p-6 text-center h-full flex flex-col relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-glow-pulse transition-all duration-300 ${color}`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-3">
            <h3 className="text-lg font-bold group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            {comingSoon && (
              <Badge variant="secondary" className="text-xs bg-warning/20 text-warning animate-bounce-slow">
                Soon
              </Badge>
            )}
          </div>
          
          <p className="text-muted-foreground text-sm mb-4 flex-1 leading-relaxed">
            {description}
          </p>
          
          <Button 
            variant="outline" 
            className="w-full glass-card group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary/50 transition-all duration-300 font-medium"
            disabled={comingSoon}
          >
            {comingSoon ? "Coming Soon" : "Select Files"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};