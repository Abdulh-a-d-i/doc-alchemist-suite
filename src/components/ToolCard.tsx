import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
}

export const ToolCard = ({ title, description, icon: Icon, color, onClick }: ToolCardProps) => {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group" onClick={onClick}>
      <CardContent className="p-6 text-center h-full flex flex-col">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${color}`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 flex-1">
          {description}
        </p>
        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          Select Files
        </Button>
      </CardContent>
    </Card>
  );
};