import type { NextPage } from "next";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { BaseLayout } from "@ui";
import { Switch } from "@headlessui/react";
import Link from "next/link";
import { NftMeta, PinataRes } from "@_types/nft";
import { useWeb3 } from "@providers/web3";
import { ethers } from "ethers";
import { toast } from "react-toastify";

const ALLOWED_FIELDS = ["name", "description", "image", "attributes"];

const NftCreate: NextPage = () => {
  const { ethereum, contract } = useWeb3();
  const [nftURI, setNftURI] = useState("");
  const [hasURI, setHasURI] = useState(false);
  const [price, setPrice] = useState(0);
  const [nftMeta, setNftMeta] = useState<NftMeta>({
    name: "",
    description: "",
    image: "",
    attributes: [
      { trait_type: "attack", value: "0" },
      { trait_type: "health", value: "0" },
      { trait_type: "speed", value: "0" },
    ],
  });

  const getSignedData = async () => {
    const messageToSign = await axios.get("/api/verify");
    const accounts = (await ethereum?.request({
      method: "eth_requestAccounts",
    })) as string[];
    const account = accounts[0];
    const signedData = await ethereum?.request({
      method: "personal_sign",
      params: [
        JSON.stringify(messageToSign.data),
        account,
        messageToSign.data.id,
      ],
    });
    return { signedData, account };
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNftMeta({ ...nftMeta, [name]: value });
  };

  const handleAttributeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const attributeIndex = nftMeta.attributes.findIndex(
      (attr) => attr.trait_type == name
    );
    nftMeta.attributes[attributeIndex].value = value;
    setNftMeta({ ...nftMeta, attributes: nftMeta.attributes });
  };

  const uploadMetadata = async () => {
    try {
      const { account, signedData } = await getSignedData();
      const promise = axios.post("/api/verify", {
        address: account,
        signature: signedData,
        nft: nftMeta,
      });
      const res=await toast.promise(promise,{
        pending:"uploading",
        success:"suc",
        error:"error"
      })
      const data=res.data as PinataRes;
      setNftURI()
    } catch (e) {}
  };


  const handleImage=async(e:ChangeEvent<HTMLInputElement>)=>{
    if(!e.target.files ||e.target.files.length===0){
      return
    }
    const file=e.target.files[0]
    const buffer=await file.arrayBuffer()
    const bytes=new Uint8Array(buffer)
    try {
      const {signedData,account}=await getSignedData()
      const promise=axios.post("/api/verify-image",{
        address:account,
        signature:signedData,
        bytes,
        contentType:file.type,
        fileName:file.name.replace(/\./)
      })
      const res=await toast.promise(promise,{})
      const data=res.data as PinataRes;
      setNftMeta
    } catch (error) {
      
    }}
  }
};

export default NftCreate;
