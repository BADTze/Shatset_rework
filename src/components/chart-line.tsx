'use client';

import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts'; 

export const ChartLineGeneral = ({
  categories,
  series,
}: {
  categories: string[];
  series: { name: string; data: number[] }[];
}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  const option: EChartsOption = {
    xAxis: {
      type: 'category',
      data: categories || [],
      axisLabel: {
        color: '#44BDE1', 
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#44BDE1', 
      },
    },
    series: series.map((s) => ({
      name: s.name,
      type: 'line',
      smooth: true, 
      data: s.data,
      areaStyle: {
        opacity: 0.1, 
      },
    })),
    tooltip: {
      trigger: 'axis', 
    },
    grid: {
      containLabel: true, 
    },
  };

  return (
    <ReactECharts
      option={option} 
      style={{ height: '100%', width: '100%' }} 
    />
  );
};