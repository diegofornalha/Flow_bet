export function Stats() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {stat.value}
              </div>
              <div className="text-white">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const stats = [
  {
    value: "100K+",
    label: "Apostas Realizadas"
  },
  {
    value: "50K+",
    label: "Usuários Ativos"
  },
  {
    value: "1M+",
    label: "FLOW Distribuídos"
  }
]; 