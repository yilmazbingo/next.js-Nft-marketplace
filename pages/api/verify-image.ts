import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

import {
  addressCheckMiddleware,
  withSession,
  pinataApiKey,
  pinataSecretApiKey,
  pinataJWTKey,
} from "./utils";
import FormData from "form-data";
import { FileReq } from "@_types/nft";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};
export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
      const { bytes, fileName, contentType } = req.body as FileReq;
      if (!bytes || !fileName || !contentType) {
        return res.status(422).send({ message: "Image data is missing" });
      }
      await addressCheckMiddleware(req, res);
      // we are getting bytes, we have to restructure. Convert bytes values to buffer
      const buffer = Buffer.from(Object.values(bytes));
      // pinata expects form data
      // It replicates the functionality of the HTML form element.
      const formData = new FormData();
      formData.append("file", buffer, {
        contentType,
        filename: fileName + "-" + uuidv4(),
      });
      try {
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

        const fileRes = await axios.post(url, formData, {
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": `multipart/form-data: boundary=${formData.getBoundary()}`,
            // Accept: "text/plain",
            // --those are old api---
            // pinata_api_key: pinataApiKey,
            // pinata_secret_api_key: pinataSecretApiKey,
            Authorization: `Bearer ${pinataJWTKey}`,
          },
        });
        console.log("fileRes", fileRes.data);
        // we need to create formData
        return res.status(200).send(fileRes.data);
      } catch (error: any) {
        console.error("errro in uploading image", error.response.data);
      }
    } else {
      return res.status(422).send({ message: "Invalid endpoint" });
    }
  }
);
