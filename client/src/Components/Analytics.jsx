import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Analytics = ({ suppliers }) => {
  // SAFETY CHECK
  if (!suppliers || suppliers.length === 0) {
    return (
      <div className="mt-10 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="px-8 py-8 md:px-10 md:py-10">
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl"></div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">
                Supplier Analytics
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Performance overview of available suppliers
              </p>
            </div>
          </div>

          <div className="mt-10 flex min-h-[220px] flex-col items-center justify-center rounded-3xl bg-slate-50 px-6 py-10 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-sm"></div>

            <p className="font-semibold text-slate-600">
              No supplier data available.
            </p>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
              Supplier analytics will appear here once supplier information is
              available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // CHART DATA
  // Existing supplier data and fields remain unchanged.
  const chartData = suppliers.map((supplier) => ({
    name: supplier.supplierName,
    score: supplier.score || 0,
    rating: supplier.rating,
    stock: supplier.stock,
  }));

  // DISPLAY-ONLY STATISTICS
  const bestScore = Math.max(
    ...suppliers.map((supplier) => supplier.score || 0),
  );

  const averageScore =
    suppliers.reduce((total, supplier) => total + (supplier.score || 0), 0) /
    suppliers.length;

  return (
    <div className="mt-10 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      {/* ================= HEADER ================= */}
      {/* ================= ANALYTICS HEADER ================= */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-white px-6 py-8 md:px-8">
        <div className="flex flex-col items-center text-center gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-800">
              Supplier Analytics
            </h2>
            <br />

            <p className="mt-3 text-base md:text-lg text-slate-500">
              Visual comparison of supplier recommendation scores
            </p>
          </div>
          <br />
          <br />
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="px-6 py-8 md:px-8 md:py-10">
        {/* ================= SUMMARY CARDS ================= */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {/* Total Suppliers */}
          <div className="rounded-3xl bg-slate-50 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-base font-semibold text-slate-500">
              Total Suppliers - {suppliers.length}
            </p>
          </div>

          {/* Best Score */}
          <div className="rounded-3xl bg-emerald-50 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-base font-semibold text-slate-500">
              Best Score - {bestScore.toFixed(2)}
            </p>
          </div>

          {/* Average Score */}
          <div className="rounded-3xl bg-amber-50 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-base font-semibold text-slate-500">
              Average Score - {averageScore.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      {/* ================= CHART SECTION ================= */}
      <div className="mt-10 rounded-3xl border border-slate-100 bg-slate-50/60 p-6 md:p-8">
        {/* Chart heading */}
        <br />
        <br />
        <br />
        <br />
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />

            <h2 className="text-3xl font-bold text-slate-800 md:text-4xl">
              Recommendation Score
            </h2>
          </div>

          <p className="mt-3 text-base leading-6 text-slate-500">
            Compare the recommendation scores of available suppliers.
          </p>
        </div>
        {/* Chart */}
        <br />
        <br />
        <br />
        <br />
        <div className="h-[360px] w-full md:h-[430px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 20,
                left: 5,
                bottom: 65,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill: "#64748b",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
                angle={-25}
                textAnchor="end"
                interval={0}
              />

              <YAxis
                tick={{
                  fill: "#64748b",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{
                  fill: "rgba(16, 185, 129, 0.06)",
                }}
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.10)",
                  padding: "14px 16px",
                }}
                labelStyle={{
                  fontWeight: "700",
                  color: "#1e293b",
                  marginBottom: "6px",
                }}
                itemStyle={{
                  color: "#059669",
                  fontWeight: "600",
                }}
              />

              <Bar
                dataKey="score"
                name="Recommendation Score"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
                maxBarSize={55}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
