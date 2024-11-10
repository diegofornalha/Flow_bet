import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { flowMainnet, flowTestnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'FlowBets',
  projectId: '5baff35427233022905a6376b28cfb13',
  chains: [flowMainnet, flowTestnet],
  ssr: true,
});