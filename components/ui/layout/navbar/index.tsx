/* eslint-disable @next/next/no-img-element */

import { Fragment } from "react";
import { Disclosure, Menu } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { ActiveLink } from "../../..";
import { useAccount, useNetwork } from "@hooks/web3";
import Walletbar from "./Walletbar";
import { useRouter } from "next/router";

const navigation = [
  { name: "Marketplace", href: "/", current: true },
  { name: "Create", href: "/nft/create", current: false },
];

function classNames(...classes: string[]) {
  // filter(Boolean) will skip null values
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { account } = useAccount();
  const { network } = useNetwork();
  const router = useRouter();

  return (
    // The button will automatically open/close the panel when clicked, and all components will receive the appropriate aria-* related attributes like aria-expanded and aria-controls.
    <Disclosure as="nav" className="bg-black">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex itemsuseEffe justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button. icons will show on mobile*/}
                {/* inline-flex makes the flex container display inline */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  {/*  .sr-only class hides an element to all devices except screen readers: */}
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    // aria hidden hides elements from screen readers
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                {/* If the size of all flex items is larger than the flex container, items shrink to fit according to flex-shrink. */}
                <div
                  className="flex-shrink-0 flex items-center"
                  onClick={() => router.push("/")}
                >
                  <img
                    className="hidden lg:block h-10 w-auto"
                    src="/images/page_logo.png"
                    alt="Workflow"
                  />
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      // link will navigate without reloading
                      <ActiveLink
                        key={item.name}
                        href={item.href}
                        activeClass="bg-gray-900 text-white"
                      >
                        <a
                          className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </a>
                      </ActiveLink>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div className="text-gray-300 self-center mr-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
                    <svg
                      className="-ml-0.5 mr-1.5 h-2 w-2 text-indigo-400"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx={4} cy={4} r={3} />
                    </svg>
                    {network.isLoading
                      ? "Loading..."
                      : account.isInstalled
                      ? network.data
                      : "Install web3 wallet"}
                  </span>
                </div>
                <Menu>
                  <Walletbar
                    isInstalled={account.isInstalled}
                    isLoading={account.isLoading || false}
                    connect={account.connect}
                    account={account.data}
                  />
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
