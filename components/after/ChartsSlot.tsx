"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Category, MonthPoint } from "@/lib/report";
import { ChartsSkeleton } from "../Skeletons";

const Charts = dynamic(() => import("../charts/Charts").then((m) => m.Charts), {
  ssr: false,
  loading: () => <ChartsSkeleton />,
});

/** Loads the charting library only when the charts are about to scroll into view. */
export function ChartsSlot({ revenue, categories }: { revenue: MonthPoint[]; categories: Category[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{visible ? <Charts revenue={revenue} categories={categories} /> : <ChartsSkeleton />}</div>;
}
