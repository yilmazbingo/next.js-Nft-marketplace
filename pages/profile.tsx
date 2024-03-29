/* eslint-disable @next/next/no-img-element */

import type { NextPage } from "next";
import { BaseLayout, SideBar } from "@ui";

import { Nft } from "@_types/nft";
import { useOwnedNfts } from "@hooks/web3";
import { useEffect, useState } from "react";

const tabs = [{ name: "Your Collection", href: "#", current: true }];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Profile: NextPage = () => {
  const [activeNft, setActiveNft] = useState<Nft>();
  const { nfts } = useOwnedNfts();
  // console.log("nfts from useOwnedNfts", nfts);

  useEffect(() => {
    if (nfts.data && nfts.data.length > 0) {
      setActiveNft(nfts.data[0]);
    }
    return () => setActiveNft(undefined);
  }, [nfts.data]);
  return (
    <BaseLayout>
      <div className="h-full flex">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex items-stretch overflow-hidden">
            <main className="flex-1 overflow-y-auto">
              <div className="pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex">
                  <h1 className="flex-1 text-2xl font-bold text-gray-900">
                    Your NFTs
                  </h1>
                </div>
                <div className="mt-3 sm:mt-2">
                  <div className="hidden sm:block">
                    <div className="flex items-center border-b border-gray-200">
                      <nav
                        className="flex-1 -mb-px flex space-x-6 xl:space-x-8"
                        aria-label="Tabs"
                      >
                        {tabs.map((tab) => (
                          <a
                            key={tab.name}
                            href={tab.href}
                            aria-current={tab.current ? "page" : undefined}
                            className={classNames(
                              tab.current
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                              "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                            )}
                          >
                            {tab.name}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
                <section
                  className="mt-8 pb-16"
                  aria-labelledby="gallery-heading"
                >
                  <ul
                    role="list"
                    className="grid  grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
                  >
                    {(nfts.data as Nft[]).map((nft) => (
                      <li
                        key={nft.tokenId}
                        onClick={() => setActiveNft(nft)}
                        className="relative"
                      >
                        <div
                          className={classNames(
                            nft.tokenId === activeNft?.tokenId
                              ? "ring-2 ring-offset-2 ring-indigo-500"
                              : "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500",
                            "group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 overflow-hidden"
                          )}
                        >
                          <img
                            src={nft.meta && nft.meta.image}
                            alt=""
                            className={classNames(
                              nft.tokenId === activeNft?.tokenId
                                ? ""
                                : "group-hover:opacity-75",
                              "object-cover pointer-events-none, h-52"
                            )}
                          />
                          <button
                            type="button"
                            className="absolute inset-0 focus:outline-none"
                          >
                            <span className="sr-only">
                              View details for {nft.meta.name}
                            </span>
                          </button>
                        </div>
                        <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none text-white">
                          {nft.meta.name}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </main>
            <SideBar activeNft={activeNft} nfts={nfts} />
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Profile;
