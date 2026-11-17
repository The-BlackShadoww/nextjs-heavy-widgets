"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Category, MonthPoint } from "@/lib/report";

const money = (n: number) => `$${Math.round(n / 1000)}k`;

export function Charts({ revenue, categories }: { revenue: MonthPoint[]; categories: Category[] }) {
  return (
    <div className="charts">
      <figure className="chart-card">
        <figcaption>Revenue and costs, by month</figcaption>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenue} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2f5bea" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#2f5bea" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#ececE7" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickFormatter={money} tickLine={false} axisLine={false} fontSize={12} width={48} />
              <Tooltip formatter={(v) => money(Number(v))} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2f5bea" strokeWidth={2} fill="url(#rev)" />
              <Area type="monotone" dataKey="costs" name="Costs" stroke="#9aa0ab" strokeWidth={2} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </figure>
      <figure className="chart-card">
        <figcaption>Costs by category, this quarter</figcaption>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categories} layout="vertical" margin={{ top: 8, right: 16, bottom: 0, left: 8 }}>
              <CartesianGrid stroke="#ececE7" horizontal={false} />
              <XAxis type="number" tickFormatter={money} tickLine={false} axisLine={false} fontSize={12} />
              <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} fontSize={12} width={72} />
              <Tooltip formatter={(v) => money(Number(v))} />
              <Bar dataKey="value" name="Cost" fill="#2f5bea" radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </figure>
    </div>
  );
}
