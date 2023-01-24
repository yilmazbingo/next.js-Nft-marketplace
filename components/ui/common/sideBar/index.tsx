import { useState, useEffect } from "react";
import { Nft } from "@_types/nft";
import { CryptoSWRResponse, UseOwnedNftsResponse } from "@_types/hooks";

type SideBarProps = {
  activeNft: Nft | undefined;
  nfts?: CryptoSWRResponse<Nft[], UseOwnedNftsResponse>;
  ref?: React.MutableRefObject<HTMLDivElement>;
};

export default function SideBar({ activeNft, nfts }: SideBarProps) {
  const [downloadURL, setDownloadURL] = useState("");
  console.log("ActiveNft", activeNft);
  const download = async () => {
    const result = await fetch(activeNft!.meta.image, {
      method: "GET",
      headers: {},
    });
    // const b = await result.json();  ailed to execute 'blob' on 'Response': body stream already read
    const blob = await result.blob();
    console.log("blob", blob);
    const url = URL.createObjectURL(blob);
    setDownloadURL(url);
  };
  const handleDownload = async () => {
    try {
      await download();
      URL.revokeObjectURL(downloadURL);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <aside className="hidden w-96 bg-white p-8 border-l border-gray-200 overflow-y-auto lg:block">
      {activeNft && (
        <div className="pb-16 space-y-6">
          <div>
            <div className="block w-full aspect-w-10 aspect-h-7 rounded-lg overflow-hidden">
              <img src={activeNft.meta.image} alt="" className="object-cover" />
            </div>
            <div className="mt-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  <span className="sr-only">Details for </span>
                  {activeNft.meta.name}
                </h2>
                <p className="text-sm font-medium text-gray-500">
                  {activeNft.meta.description}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Information</h3>
            <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
              {activeNft.meta.attributes.map((attr) => (
                <div
                  key={attr.trait_type}
                  className="py-3 flex justify-between text-sm font-medium"
                >
                  <dt className="text-gray-500">{attr.trait_type}: </dt>
                  <dd className="text-gray-900 text-right">{attr.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex">
            <button
              onClick={handleDownload}
              type="button"
              className="flex-1 bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <a href={downloadURL} download={activeNft.meta.name}>
                Download Image
              </a>
            </button>

            <button
              disabled={activeNft.isListed}
              onClick={() => nfts?.listNft(activeNft.tokenId, activeNft.price)}
              type="button"
              className="disabled:text-gray-400 disabled:cursor-not-allowed flex-1 ml-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {activeNft.isListed ? "Nft is listed" : "List Nft"}
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
