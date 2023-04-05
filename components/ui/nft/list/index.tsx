import { useListedNfts } from "@hooks/web3";
import { Nft } from "@_types/nft";
import { FunctionComponent } from "react";
import NftItem from "../item";

const NftList: FunctionComponent = () => {
  // in javascript empty array or object are truthy
  const { nfts } = useListedNfts();
  console.log("nfts in uselistednfts", nfts);
  if (nfts && nfts.data && nfts.data.length > 0) {
    return (
      <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
        {nfts?.data?.map((nft) => (
          <div
            key={nft.meta.image}
            className="flex flex-col rounded-lg shadow-lg overflow-hidden"
          >
            <NftItem item={nft} buyNft={nfts.buyNft} />
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div>
        <h2 className="capitalize text-center mt-3 text-blue-700 ">
          there is no NFT minted
        </h2>
      </div>
    );
  }
};

export default NftList;
