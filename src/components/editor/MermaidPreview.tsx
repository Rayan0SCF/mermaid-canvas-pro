import { useEffect, useMemo, useRef } from "react";
import mermaid from "mermaid";

export default function MermaidPreview({ code, onError }: { code: string; onError?: (msg: string | null) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useMemo(() => `mmd-${Math.random().toString(36).slice(2, 9)}`,[ ]);

  useEffect(() => {
    const config: any = {
      startOnLoad: false,
      securityLevel: 'loose',
      theme: 'base',
      flowchart: {
        defaultRenderer: 'elk',
        htmlLabels: true,
        curve: 'linear',
        nodeSpacing: 60,
        rankSpacing: 140,
        padding: 8,
        useMaxWidth: true,
        elk: {
          'elk.direction': 'RIGHT',
          'elk.algorithm': 'layered',
          'elk.edgeRouting': 'ORTHOGONAL',
          'elk.layered.spacing.nodeNodeBetweenLayers': 80,
          'elk.spacing.nodeNode': 40,
        },
      },
      themeVariables: {
        primaryColor: '#ffffff',
        primaryTextColor: '#111827',
        primaryBorderColor: '#2563eb',
        lineColor: '#1f2937',
        secondaryColor: '#ffffff',
        tertiaryColor: '#ffffff',
        noteBkgColor: '#ffffff',
      },
      themeCSS: `
        .node rect, .node path { rx: 12px; ry: 12px; filter: drop-shadow(0 6px 14px rgba(0,0,0,0.05)); }
        .edgePath .path { stroke-width: 2.2px; }
        .marker { fill: #1f2937; }
      `,
    };
    mermaid.initialize(config as any);
  }, []);

  useEffect(() => {
    const render = async () => {
      if (!containerRef.current) return;
      try {
        onError?.(null);
        const { svg } = await mermaid.render(id, code);
        containerRef.current.innerHTML = svg;
      } catch (e: any) {
        onError?.(e?.message || 'Unknown Mermaid error');
      }
    };
    render();
  }, [code, id, onError]);

  return <div ref={containerRef} className="w-full overflow-auto" />;
}
