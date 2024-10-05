import express, { Request, Response } from "express";
import { SDJwtVcInstance } from '@sd-jwt/sd-jwt-vc';
import { ethers } from 'ethers';
import path from "path";
import { Jwt } from "./jwt";
import type { DisclosureFrame, Signer } from '@sd-jwt/types';
import { generateSalt, digest } from '@sd-jwt/crypto-nodejs';
import { unpack, createHashMapping } from '@sd-jwt/decode';
import Crypto from "node:crypto";
import { SDJwt, listKeys, pack } from './sdjwt';
import { deployDID } from "./deploy-did";

import { VCInfo, parseToVCInfo } from "./myType";
import { decodeSdJwtHolder } from "./holder";
import { generateKeyPairUtil, generateSignerVerifierUtil } from "./crypto-utils";


const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen('8001', () => {
  console.log('Server started');
});

const issuerKeyPair = generateKeyPairUtil();    // Issuer keys
const holderKeyPair = generateKeyPairUtil();    // Holder keys
const verifierKeyPair = generateKeyPairUtil();  // Verifier keys

const { signer, verifier } = generateSignerVerifierUtil(issuerKeyPair.privateKey, issuerKeyPair.publicKey);

// SD-JWT 생성기 설정
const sdJwt = new SDJwtVcInstance({
  signer,
  verifier,
  signAlg: 'RS256', // Using RS256 for RSA signature algorithm
  hasher: digest,   // Assuming digest function is already defined
  hashAlg: 'SHA-256',
  saltGenerator: generateSalt, // Assuming saltGenerator is defined
});

// JWT 발급 API
app.post('/issue-vc', async (req: Request, res: Response) => {
  try {
    const payload = req.body.payload;

    if (!payload) {
      return res.status(400).json({ error: 'Payload is required' });
    }

    const VC_REGISTRY_ADDRESS = "Seoul, Kwanak 1";

    const vcInfo: VCInfo = parseToVCInfo(payload, VC_REGISTRY_ADDRESS);

    const disclosureFrame: DisclosureFrame<typeof vcInfo> = {
      _sd: ['gender', 'birth_date', 'email', 'name', 'phone_number']
    };

    // JWT 생성
    // const jwt = new Jwt({
    //   header: {
    //     alg: 'HS256',
    //     typ: 'JWT'
    //   },
    //   payload: vcInfo
    // });

    // // JWT 서명
    // await jwt.sign(signer);

    const credential = await sdJwt.issue(
      {
        iss: 'Issuer',
        iat: new Date().getTime(),
        vct: 'ExampleCredentials',
        ...vcInfo,
      },
      disclosureFrame,
    )

    // console.log(jwt);
    // credential is the encoded sdjwt. 
    console.log(credential);
    // console.log(encoded);

    return res.status(200).json({ sdjwt: credential });

  } catch (error) {
    console.error('Error issuing JWT:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// decode the response received from issue-vc. Returns disclosures decoded
// The holder will save the decoded disclosures on their local storage.
app.post('/decode-sdjwt', async (req: Request, res: Response) => {
  try {
    const { sdjwt } = req.body;

    // Decode the SD-JWT using the holder function
    const decodedSdJwt = await decodeSdJwtHolder(sdjwt);

    // Send the decoded disclosures back to the client

    if (decodedSdJwt) {
      // Send the decoded disclosures back to the client
      res.status(200).json({ decodedDisclosures: decodedSdJwt.disclosures });
    } else {
      // Handle case when decoding failed or returned undefined
      res.status(500).json({ error: 'Failed to decode SD-JWT' });
    }
  } catch (error) {
    console.error('Error decoding SD-JWT:', error);
    res.status(500).json({ error: 'Failed to decode SD-JWT' });
  }
});