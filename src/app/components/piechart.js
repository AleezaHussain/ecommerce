import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ pending, accepted, rejected }) => {
  const total = pending + accepted + rejected;

  // Define ring properties
  const outerRadius = 90; // Outer edge of the first ring
  const thickness = 40; // Fixed thickness for each ring

  // Color definitions (matching the legend colors)
  const pendingColor = "#1976d2"; // Blue
  const acceptedColor = "#2E7D32"; // Green
  const rejectedColor = "#d32f2f"; // Red
  const greyColor = "#ededed"; // Grey for background

  const datasets = [
    {
      label: "Pending",
      data: [pending, total - pending],
      backgroundColor: [pendingColor, greyColor],
      borderWidth: 3,
      borderRadius: 10,
      borderAlign: "inner",
      circumference: 360,
      cutout: `${outerRadius - 1 * thickness}%`,
      hoverBackgroundColor: [pendingColor, greyColor],
      hoverBorderWidth: 0,
    },
    {
      label: "Accepted",
      data: [accepted, total - accepted],
      backgroundColor: [acceptedColor, greyColor],
      borderWidth: 3,
      borderRadius: 10,
      borderAlign: "inner",
      circumference: 360,
      cutout: `${outerRadius - 1 * thickness}%`,
      hoverBackgroundColor: [acceptedColor, greyColor],
      hoverBorderWidth: 0,
    },
    {
      label: "Rejected",
      data: [rejected, total - rejected],
      backgroundColor: [rejectedColor, greyColor],
      borderWidth: 3,
      borderRadius: 10,
      borderAlign: "inner",
      circumference: 360,
      cutout: `${outerRadius - 1 * thickness}%`,
      hoverBackgroundColor: [rejectedColor, greyColor],
      hoverBorderWidth: 0,
    },
  ];

  const chartData = {
    labels: ["Pending", "Accepted", "Rejected"],
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    rotation: 0,
    circumference: 360,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
      },
    },
    hover: {
      mode: null,
    },
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Pie data={chartData} options={options} />
      {/* Center text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "18px", fontWeight: "bold", color: "#555" }}>Total</p>
        <p style={{ fontSize: "20px", fontWeight: "bold", color: "#333" }}>{total}</p>
      </div>
    </div>
  );
};

export default PieChart;