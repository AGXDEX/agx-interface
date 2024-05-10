import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import "./AllocationChart.scss";

interface RingChartProps {
  data: { name: string; value: number }[];
}
const style = { width: "100%", height: "250px" };

const RingChart: React.FC<RingChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);

      const option: echarts.EChartOption = {
        title: {
          text: "Target allocation",
          left: "center",
          top: "0",
          textStyle: { color: "#fff" },
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {d}%",
        },
        legend: {
          bottom: "-2%",
          left: "center",
          textStyle: {
            color: "#ADADAD",
          },
        },
        series: [
          {
            type: "pie",
            radius: ["50%", "70%"],

            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
              fontSize: 14,
              color: "#fff",
            },
            // emphasis: {
            //   label: {
            //     show: true,
            //     fontSize: 20,
            //     fontWeight: 'bold'
            //   }
            // },
            // data: [
            //   {
            //     value: 1048,
            //     name: "$USDC",
            //     // itemStyle: {
            //     //   color: "#2775CA",
            //     // },
            //   },
            //   { value: 735, name: "$USDT" },
            //   { value: 735, name: "$ETH" },
            //   { value: 580, name: "$pufETH" },
            //   { value: 484, name: "$ezETH" },
            //   { value: 300, name: "$WBTC" },
            // ],
            data: data,
          },
        ],
      };

      chartInstance.current.setOption(option);

      return () => {
        if (chartInstance.current) {
          chartInstance.current.dispose();
        }
      };
    }
  }, [data]);

  return <div ref={chartRef} style={style} className="chart" />;
};

export default RingChart;
