"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ReactNode;
}) {
  const uniqueId = React.useId();
  const chartId = "chart-" + (id || uniqueId.replace(/:/g, ""));

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children as any}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color,
  );

  if (!colorConfig.length) {
    return null;
  }

  const nl = String.fromCharCode(10);

  const styleString = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const selectors = colorConfig
        .map(([key, itemConfig]) => {
          const color =
            itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
            itemConfig.color;
          return color ? "  --color-" + key + ": " + color + ";" : null;
        })
        .filter(Boolean)
        .join(nl);
      return prefix + " [data-chart=" + id + "] {" + nl + selectors + nl + "}";
    })
    .join(nl);

  return (
    <style dangerouslySetInnerHTML={{ __html: styleString }} />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: any) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }
    const [item] = payload;
    const key = "" + (labelKey || item?.dataKey || item?.name || "value");
    const itemConfig = config[key as keyof typeof config];
    const value =
      !labelKey && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }
    return value ? <div className={cn("font-medium", labelClassName)}>{value as any}</div> : null;
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

  if (!active || !payload?.length) return null;

  return (
    <div className={cn("bg-white border rounded-lg p-2 shadow-sm text-xs", className)}>
      {tooltipLabel}
      <div className="grid gap-1 mt-1">
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: color || item.color }} 
            />
            <span className="text-slate-500">{(config[item.dataKey as keyof typeof config]?.label || item.name) as any}:</span>
            <span className="font-bold">{item.value as any}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({ payload, config }: any) {
  if (!payload?.length) return null;
  return (
    <div className="flex gap-4 justify-center mt-2 text-xs">
      {payload.map((item: any, index: number) => (
        <div key={index} className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span>{(config[item.dataKey as keyof typeof config]?.label || item.value) as any}</span>
        </div>
      ))}
    </div>
  );
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};