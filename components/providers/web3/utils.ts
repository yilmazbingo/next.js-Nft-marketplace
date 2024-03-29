import { setupHooks, Web3Hooks } from "@hooks/web3/setupHooks";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Web3Dependencies } from "@_types/hooks";
import { NftMarketContract } from "@_types/nftMarketContract";
import { Contract, ethers, providers } from "ethers";

const a = ethers.Signer;
declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};
// we cannot do this in interface
export type Web3State = {
  isLoading: Boolean;
  hooks: Web3Hooks;
} & Nullable<Web3Dependencies>;

export const createDefaultState = () => {
  return {
    ethereum: null,
    provider: null,
    contract: null,
    isLoading: true,
    hooks: setupHooks({ isLoading: true } as any),
  };
};

export const createWeb3State = ({
  ethereum,
  provider,
  contract,
  isLoading,
}: Web3Dependencies) => {
  return {
    ethereum,
    provider,
    contract,
    isLoading,
    hooks: setupHooks({ ethereum, provider, contract, isLoading }),
  };
};
const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

export const loadContract = async (
  name: string,
  provider: providers.Web3Provider
): Promise<Contract> => {
  // you need to know which network your contract is deployed
  if (!NETWORK_ID) {
    return Promise.reject("Network Id is not defined");
  }

  const res = await fetch(`/contracts/${name}.json`);

  const Artifact = await res.json();
  if (Artifact.networks[NETWORK_ID].address) {
    console.log(
      "Artifact.networks[NETWORK_ID].address",
      Artifact.networks[NETWORK_ID].address
    );
    const contract = new ethers.Contract(
      Artifact.networks[NETWORK_ID].address,
      Artifact.abi,
      provider
    );
    return contract;
  } else {
    return Promise.reject(`Contract ${name} cannot be loaded`);
  }
};
