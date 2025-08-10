import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, ChevronLeft } from "lucide-react";

export function AppHeader({ projectName, onBack }: { projectName?: string; onBack?: () => void }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:glass border-b">
      <div className="container max-w-4xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onBack} aria-label="Back to dashboard">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold">{projectName || 'Mermaid Mobile Studio'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
            {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
