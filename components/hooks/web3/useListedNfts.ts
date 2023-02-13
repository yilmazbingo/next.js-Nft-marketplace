import { CryptoHookFactory } from "@_types/hooks";
import { Nft } from "@_types/nft";
import { ethers } from "ethers";
import { useCallback } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";

export type UseListedNftsResponse = {
  buyNft: (token: number, value: number) => Promise<void>;
};
type ListedNftsHookFactory = CryptoHookFactory<Nft[], UseListedNftsResponse>;

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>;

export const hookFactory: ListedNftsHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useListedNfts" : null,
      async () => {
        const nfts = [] as Nft[];
        const coreNfts = await contract!.getAllNftsOnSale();
        // console.log("corenfts", coreNfts);
        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];
          // debugger;
          const tokenURI = await contract!.tokenURI(item.tokenId);
          console.log("tokenUri is saved like this in blockchain", tokenURI);

          const metaRes = await fetch(tokenURI, {
            headers: {
              Accept: "text/plain",
            },
          });

          // const metaRes = await fetch("/api/meta", {
          //   method: "POST",
          //   body: JSON.stringify(tokenURI),
          // });
          console.log("metaRes", metaRes);
          let meta;
          try {
            meta = await metaRes.json();
          } catch (error) {
            console.log("error in json fetch", error);
          }

          console.log("meta", meta);
          nfts.push({
            price: parseFloat(ethers.utils.formatEther(item.price)),
            tokenId: item.tokenId.toNumber(),
            creator: item.creator,
            isListed: item.isListed,
            meta,
          });
        }
        console.log("nfts---", nfts);
        return nfts;
      }
    );
    // React Hook useCallback has an unnecessary dependency: 'contract'. Either exclude it or remove the dependency array. Outer scope values like 'contract' aren't valid dependencies because mutating them doesn't re-render the component.
    // since contract is passed from outer scope, I need to create a new constant as inner obj
    const _contract = contract;
    const buyNft = useCallback(
      async (tokenId: number, value: number) => {
        try {
          // we send value in wei
          console.log("_contract", ethers.utils.parseEther(value.toString()));
          const result = _contract!.buyNft(tokenId, {
            value: ethers.utils.parseEther(value.toString()),
          });
          console.log("result", result);
          await toast.promise(result, {
            pending: "Processing transaction",
            success: "Nft is yours! Go to profile page",
            error: "Error purchasing nft",
          });
        } catch (error: any) {
          // if (error.code === -32603 && error.data.code === -32000) {
          //   // This was your error code
          //   toast.error("Error message because of insufficient funds ...");
          // } else {
          //   toast.error("Error message for the other types of errors");
          // }
          console.error("eror in buying nfts", error);
        }
      },
      [_contract]
    );
    return {
      ...swr,
      buyNft,
      data: data || [],
    };
  };
