import { v4 as uuidv4 } from "uuid";
import { getIronSession } from "iron-session";
import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import {
  withSession,
  contractAddress,
  addressCheckMiddleware,
  pinataApiKey,
  pinataSecretApiKey,
} from "./utils";
import { NftMeta } from "@_types/nft";

declare module "iron-session" {
  interface IronSessionData {
    messageSession?: {
      contractAddress: string;
      id: string;
    };
  }
}
// the purpose of session is to have req.session.messageSession
export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
      try {
        const { body } = req;
        console.log("request received ", body);

        const nft = body.nft as NftMeta;
        if (!nft.name || !nft.description || !nft.attributes) {
          return res.status(422).send({ message: "Form data is missing" });
        }
        // if address is not verified, it will return reject
        await addressCheckMiddleware(req, res);
        const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
        const jsonResponse = await axios.post(
          url,
          {
            pinataMetadata: {
              name: uuidv4(),
            },
            pinataContent: nft,
          },
          {
            headers: {
              Accept: "text/plain",
              pinata_api_key: pinataApiKey,
              pinata_secret_api_key: pinataSecretApiKey,
            },
          }
        );
        return res.status(200).send(jsonResponse.data);
      } catch (error) {
        console.error("error in verify post req", error);
        // 422 Unprocessable Entity
        res.status(422).send({ message: "Cannot create JSON" });
      }
    } else if (req.method === "GET") {
      // creating a message is the first step of verification
      // message could be anything
      try {
        const message = { contractAddress, id: uuidv4() };
        // this will be stored on the browser by iron-session
        req.session.messageSession = {
          ...message,
        };
        await req.session.save();
        return res.json(message);
      } catch (error) {
        res.status(422).send({ message: "Cannot generate a message" });
      }
    } else {
      return res.status(200).json({ message: "Invalid api Route" });
    }
  }
);
