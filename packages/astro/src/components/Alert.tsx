import type { ReactNode } from "react";

const typeMap: Record<string, string> = {
  info: "usa-alert--info",
  warning: "usa-alert--warning",
  error: "usa-alert--error",
  success: "usa-alert--success",
  danger: "usa-alert--error",
  note: "usa-alert--info",
  tip: "usa-alert--success",
  important: "usa-alert--warning",
  caution: "usa-alert--error",
};

interface AlertProps {
  type?: string;
  children?: ReactNode;
}

export default function Alert({ type = "info", children }: AlertProps) {
  const alertClass = typeMap[type] ?? "usa-alert--info";
  return (
    <div className={`usa-alert ${alertClass}`} role="alert">
      <div className="usa-alert__body">
        <div className="usa-alert__text">{children}</div>
      </div>
    </div>
  );
}
