import { useState, type ReactNode } from "react";

interface CodeGroupProps {
  labels?: string;
  children?: ReactNode;
}

/**
 * Tabbed code block component for showing multiple code alternatives.
 * Usage in markdown:
 *   ::code-group{labels="npm,pnpm,yarn"}
 *   ```bash
 *   npm install @starsandstripes/astro
 *   ```
 *   ```bash
 *   pnpm add @starsandstripes/astro
 *   ```
 *   ```bash
 *   yarn add @starsandstripes/astro
 *   ```
 *   ::
 */
export default function CodeGroup({ labels = "", children }: CodeGroupProps) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = labels.split(",").map((l) => l.trim());

  // Children are expected to be multiple code blocks
  const childArray = Array.isArray(children) ? children : [children];

  return (
    <div className="code-group margin-y-2">
      <div
        className="code-group__tabs display-flex border-bottom-1px border-base-lighter"
        role="tablist"
        aria-label="Code alternatives"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab}
            role="tab"
            aria-selected={i === activeTab}
            aria-controls={`code-panel-${i}`}
            className={`code-group__tab padding-x-2 padding-y-1 border-0 bg-transparent font-sans-xs cursor-pointer ${
              i === activeTab
                ? "border-bottom-2px border-primary text-primary font-bold"
                : "text-base"
            }`}
            onClick={() => setActiveTab(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight")
                setActiveTab((i + 1) % tabs.length);
              if (e.key === "ArrowLeft")
                setActiveTab((i - 1 + tabs.length) % tabs.length);
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      {childArray.map((child, i) => (
        <div
          key={i}
          id={`code-panel-${i}`}
          role="tabpanel"
          aria-labelledby={tabs[i]}
          hidden={i !== activeTab}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
