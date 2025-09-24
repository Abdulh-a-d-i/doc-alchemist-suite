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
    <Card className="group h-full glass-card neon-border hover-lift cursor-pointer relative overflow-hidden" onClick={onClick}>
      <CardContent className="p-6 text-center h-full flex flex-col relative">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl floating opacity-30"></div>
        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full blur-lg floating-delayed opacity-20"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-500 ${color}`}>
            {/* Icon glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
            <Icon className="h-7 w-7 text-white relative z-10 drop-shadow-lg" />
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-3">
            <h3 className="text-lg font-heading font-semibold group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            {comingSoon && (
              <Badge variant="secondary" className="text-xs bg-warning/20 text-warning border-warning/30 pulse-glow">
                Soon
              </Badge>
            )}
          </div>
          
          <p className="text-muted-foreground text-sm mb-4 flex-1 leading-relaxed">
            {description}
          </p>
          
          <Button 
            variant={comingSoon ? "secondary" : "default"}
            size="sm"
            className={`w-full transition-all duration-500 ${
              comingSoon 
                ? "glass-card border-muted" 
                : "bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary border-primary/30 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/25"
            }`}
            disabled={comingSoon}
          >
            {comingSoon ? (
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                Coming Soon
              </span>
            ) : (
              <span className="font-medium">
                Select Files
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};