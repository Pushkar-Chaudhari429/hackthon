import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#26406b"
      }
    }
  },
  scales: {
    x: {
      ticks: { color: "#6c7ea4" },
      grid: { color: "rgba(170,190,224,0.18)" }
    },
    y: {
      ticks: { color: "#6c7ea4" },
      grid: { color: "rgba(170,190,224,0.18)" }
    }
  }
};

function TrafficCharts({ labels, currentSeries, predictedSeries }) {
  const trafficData = {
    labels,
    datasets: [
      {
        label: "Traffic Requests/min",
        data: currentSeries,
        borderColor: "#2a7fff",
        pointRadius: 0,
        tension: 0.35,
        fill: true,
        backgroundColor: "rgba(42,127,255,0.18)"
      }
    ]
  };

  const predictData = {
    labels,
    datasets: [
      {
        label: "Current",
        data: currentSeries,
        borderColor: "#1d4f9a",
        pointRadius: 0,
        tension: 0.3
      },
      {
        label: "Predicted",
        data: predictedSeries,
        borderColor: "#22b59a",
        pointRadius: 0,
        borderDash: [7, 5],
        tension: 0.3
      }
    ]
  };

  return (
    <>
      <div className="card">
        <h3>Real-Time Traffic</h3>
        <div className="chart-wrap">
          <Line data={trafficData} options={chartOptions} />
        </div>
      </div>
      <div className="card">
        <h3>Current vs Predicted Traffic</h3>
        <div className="small-chart">
          <Line data={predictData} options={chartOptions} />
        </div>
      </div>
    </>
  );
}

export default TrafficCharts;
