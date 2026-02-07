"use client";

import React, { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { motion, useInView } from "framer-motion";

interface DataPoint {
    date: Date;
    value: number;
}

export function LiveImpactChart() {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const isInView = useInView(containerRef, { once: false, margin: "-10%" });

    const data: DataPoint[] = useMemo(() => {
        return Array.from({ length: 20 }, (_, i) => ({
            date: new Date(2025, 0, i + 1),
            value: 30 + Math.random() * 40 + (i * 2), // Upward trend
        }));
    }, []);

    useEffect(() => {
        if (!svgRef.current || !containerRef.current || !isInView) return;

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = containerRef.current.clientWidth - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .html("") // Clear previous
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.date) as [Date, Date])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);

        // Area generator
        const area = d3.area<DataPoint>()
            .x(d => x(d.date))
            .y0(height)
            .y1(d => y(d.value))
            .curve(d3.curveCardinal);

        // Line generator
        const line = d3.line<DataPoint>()
            .x(d => x(d.date))
            .y(d => y(d.value))
            .curve(d3.curveCardinal);

        // Gradient
        const gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "chart-gradient")
            .attr("x1", "0%").attr("y1", "0%")
            .attr("x2", "0%").attr("y2", "100%");

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#10b981")
            .attr("stop-opacity", 0.3);

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#10b981")
            .attr("stop-opacity", 0);

        // Add area
        svg.append("path")
            .datum(data)
            .attr("fill", "url(#chart-gradient)")
            .attr("d", area)
            .attr("opacity", 0)
            .transition()
            .duration(1000)
            .attr("opacity", 1);

        // Add path with animation
        const path = svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#10b981")
            .attr("stroke-width", 3)
            .attr("stroke-linecap", "round")
            .attr("d", line);

        const totalLength = path.node()?.getTotalLength() || 0;

        path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(2000)
            .ease(d3.easeExpOut)
            .attr("stroke-dashoffset", 0);

        // Add axes
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(5).tickSize(0).tickPadding(10))
            .call(g => g.select(".domain").attr("stroke", "currentColor").attr("stroke-opacity", 0.1))
            .call(g => g.selectAll(".tick text").attr("fill", "currentColor").attr("fill-opacity", 0.5).attr("font-size", "10px"));

        svg.append("g")
            .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickPadding(10))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").attr("stroke", "currentColor").attr("stroke-opacity", 0.05).attr("stroke-dasharray", "2,2"))
            .call(g => g.selectAll(".tick text").attr("fill", "currentColor").attr("fill-opacity", 0.5).attr("font-size", "10px"));

    }, [data, isInView]);

    return (
        <div ref={containerRef} className="w-full bg-card/30 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 overflow-hidden transition-colors duration-500">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h4 className="text-xl font-black tracking-tight text-foreground">System Impact</h4>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Active Resolution Efficiency</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                </div>
            </div>
            <svg ref={svgRef} className="overflow-visible text-foreground" />
        </div>
    );
}
