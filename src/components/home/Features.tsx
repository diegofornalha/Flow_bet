export function Features() {
  return (
    <section className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white">
            Por que escolher Flow Betting?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-700 rounded-lg p-6 text-white hover:bg-gray-600 transition-colors"
            >
              <div className="text-green-400 mb-4 text-3xl">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: "🔒",
    title: "100% Seguro",
    description: "Todas as apostas são registradas na blockchain Flow, garantindo total transparência e segurança."
  },
  {
    icon: "⚡",
    title: "Rápido & Eficiente",
    description: "Apostas processadas instantaneamente com taxas mínimas na rede Flow."
  },
  {
    icon: "🎯",
    title: "Odds Competitivas",
    description: "As melhores odds do mercado, atualizadas em tempo real."
  }
]; 