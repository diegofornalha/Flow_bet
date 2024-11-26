export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sobre */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Sobre Flow Betting</h3>
            <p className="text-sm">
              Plataforma de apostas descentralizada construída na blockchain Flow.
              Aposte com segurança e transparência.
            </p>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Links Úteis</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://flow.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Flow Blockchain
                </a>
              </li>
              <li>
                <a href="https://flowscan.org" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  FlowScan Explorer
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://discord.gg/flow" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Discord
                </a>
              </li>
              <li>
                <a href="https://twitter.com/flow_blockchain" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>© 2024 Flow Betting. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
} 