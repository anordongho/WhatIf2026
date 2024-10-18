import express, { Request, Response } from "express";
import path from "path";

import { Holder } from "./holder";
import { Issuer } from "./issuer";
import { VCVerifier } from "./verifier";

// import { ethers } from 'ethers';
// import { deployDID } from "./deploy-did";
// import { Jwt } from "./jwt";
// import { generateSalt, digest } from '@sd-jwt/crypto-nodejs';
// import { unpack, createHashMapping } from '@sd-jwt/decode';
// import { SDJwt, listKeys, pack } from './sdjwt';
// import { publicEncrypt, privateDecrypt, constants, randomBytes } from "crypto";
// import { VCInfo, parseToVCInfo } from "./myType";

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen('8001', () => {
  console.log('Server started');
});

// const issuerKeyPair = generateKeyPairUtil();    // Issuer keys
// const holderKeyPair = generateKeyPairUtil();    // Holder keys
// const verifierKeyPair = generateKeyPairUtil();  // Verifier keys

// Fixed key pairs for testing (decomment the code above in real)

const issuerKeyPair = {
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDQxj6iIPIvvkWO\nHCSFP0Nt0HLwgIwLFNuLcpykRnB5vn1qGh0PrX78YZW2UwfeEy7xnX2eyz+8/yRm\nKO/k+NiZsepVH4sQDlQTlqydbgQw6mdaHXtktrRfZ8nu0r4dm3JF1YtluovCyKjG\nOGC430scPhwyqzHMrygL6JtCULvAqgND6XIFA5CxbaXh1Ms7zv6frwPiCDg+VLLy\nCrRwaYb9Xub9Nwd/Xltx1rX1B+0Dv4C1jvrDg1w0dXg/N9C/+WDnzoTycjkG+YnM\nY8BJ2Nlb0byjjaTjE1zNW8tZcugiA8zLDdqoRR5WkXk0xPjckx66Y2JTkbVA19gy\n7XIqmfGfAgMBAAECggEAWQN1d/3xFM8c69ru7UsMbllWcFl2nFDvzHR4+ge4dAf2\nhBMPOfyArI3U3dBoBdULCmRaR6akDeqA8/fXVLqO63TykwmoapeZXGK9RUA/lDWV\nDFSOpGHL5POlIukCuy/oWIMUdLLFXS7d2un1v00hQrDup+HbEUjLG8y4yd0PODTf\nNYRQrl1V10gtgwn5rkh1KiTkP9H3WMzuOcZXfMsgjMrSvNXGezwVfCjw7/qsvYLk\nmqdzRV6ymbqJVhA+JlvwjCFe/ERg8aNQnuS4WkxgR5BlpiwTRh28UbWyupPmGOHq\n4Ady52HiYF/U5qE8DrftBlVP12szCYP8Lws/4hGcOQKBgQD2dHSyMqI6oDtrVpNF\n73lH4ea4Z2jsA0KJY+1Inc5moMD/J3x3oDrNcpLyqEjKCvNAGEGxF4iFeEbar1hr\ns1X7zfseolCvlyU1wX4zG35TyZUxuWebkFIZWUFDtHmOs1vmNod03xpR2EaZiTGm\n+Bd3knW9G9cQtCv09gqzr9W8iQKBgQDY3DH0Tq+FIAGBFQ+zvH/49y4Ekf8MqPjI\nxPTBNCGC4MLnnRF6/yYvx+WVqDYNl2YfIfi4vrYOziDota6gDLJuGgFTeIRTQlbe\n3hHxLjf6Gomi2nwR0Hr/pzBfMXCJWF/iDgdYGrnwOd8Hdtuj8eL+j35K9sW/Q1F8\n1BJ9o7XC5wKBgQCx6F05Kd38LiDWmleT24wUPNl9coDGJpBId48ZpXkSkqbfSdTK\n0irAlh3H930cBI2WTixVt2RA3RNg18UfcgT20bmeYpOWPaiJxpTgNc+akmEV1P4a\nyTLKw6ieRFCfl5AWfnSIBGmOfW5xdR0Xp+3gziQaEFfO4hD9MwOEtMC46QKBgAxA\nzNXICGTWPR+FCCEYuoZfuQrrEOUvOvdlIYs1HdueRYT+u/keJ5M1kURWf89eyZdi\nvQH7TKAjh3p+oYJLlV1hPMfxnFB0BCKNm6fr+5+3FiXMgIwlIn4FfVcznO81vh0w\nu7t/rxfivTZXwetOhIvrobAsp1m6PQV3mh/dOyzrAoGBAIBBS1Qj/n3D44rngFV9\neL/98pwS2M1Xdkis1vmBA44D6PFm2Bj/s2pRWVJenNL/hj9Qq9hrQfaWo2PIokZC\nwmJHMP9Xh12a2Uu8KEfHqQvnlIn2/sLFSsLfYASGTejFglpiPctyzSyoHyn9dq2I\nc150/fsjZfwufYscgV4ZoP5s\n-----END PRIVATE KEY-----\n",
  publicKey: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0MY+oiDyL75FjhwkhT9D\nbdBy8ICMCxTbi3KcpEZweb59ahodD61+/GGVtlMH3hMu8Z19nss/vP8kZijv5PjY\nmbHqVR+LEA5UE5asnW4EMOpnWh17ZLa0X2fJ7tK+HZtyRdWLZbqLwsioxjhguN9L\nHD4cMqsxzK8oC+ibQlC7wKoDQ+lyBQOQsW2l4dTLO87+n68D4gg4PlSy8gq0cGmG\n/V7m/TcHf15bcda19QftA7+AtY76w4NcNHV4PzfQv/lg586E8nI5BvmJzGPASdjZ\nW9G8o42k4xNczVvLWXLoIgPMyw3aqEUeVpF5NMT43JMeumNiU5G1QNfYMu1yKpnx\nnwIDAQAB\n-----END PUBLIC KEY-----\n"
}

const holderKeyPair = {
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDGvUy0iipi6O6w\ncgbnh32EU4is50b0HUcveTyJrMgapTd5eFk3OB+61/CtaCWxX5qldtMYOK8uYU5k\n1e+GZz1YOYCeDmnTnqpAb04INdDZW3g0sYeTmRGBHScll+N2RdkusYKhz2rj2MvP\nF5EkNJWbshaXE13NtmUQbsAmsryN9kTYrr0BFeq6RtS5uu+4MuPQEKJJGYK5GztD\nSIPmIXNOhJfNw47RY5yq1QZBc+NsEw/aFXyBslksD5t93OfECn29q5snSa780UA8\nTxWmtBrmw/mGJL0cWG+1+Ymlhpp7h9qF6C3XUGfbtHBTV9Uoh2+mDhwtppqUSfRo\n8wREMNLJAgMBAAECggEAMZRZFfMgBuPgZBFWSp1hAUmLn8LkzxKcxymiIiCCHS+Z\nasrMyvtL4yNq7f+844abwGqn1/OQNGxfD8XVRvzrb16NCSFEYmBDTebWmzK9wvPQ\nRakCTx6RINpCgVzmiIN9Xmo3UiG6I1Ra5/OTqGob5qcjfpX8wUye4t4WPrE5W9qi\n6cj06HyKTkW8DIMx0PESKNoVV9TM0oDhtKjXReomc3WuhM+F2DlOAiB1u0AoCiJ0\nFztu6C91eHYl5aJhkTi4+34/22rM6W5wtALwVrcLKpeJ3zNdHtvU+MLblSaj2Q0M\ndls5iqSTMsOqt51hQx5UQJGaUsUQEVc2d2EH6Ln5eQKBgQDv4RpKv9AyuXcqCgHK\nuYtajEcjN2uKe+gXJzfqk9NyF7KN2B1HJvr+WIIj6MKx0UqKFNi2vc085gmoq1yB\nWxt+MuoMSG3vTdgkkbkbnYojasZD7lQzjhPFTZLuGCsbCfitU8+5/prFQnjYXo5P\nB331pq9aJ1wRluoVdtJp3q60FQKBgQDUGGysCqZ6/qxaXW/QJl9l+RI/gcHQUnfK\nR3nQTux9LzVnnCnf+4fALNjPG3qlCdhrcEzj5anZtHUBQSbvYFs3D9Jchw3JV0Bp\nkMV+P9HmfEkMWaASJQIdNeoTC7y73V20eWYkIkTSa6eQO39AlY3r6S9g6nP7+7/f\neArNfgXM5QKBgBi/J0A445ioC4QZvi+UzqyLtjcK25xQxhPFZv5bO8AUc8YwWmzh\nt5kPtnVP6O4BQmhWWDkaAZdbv/lXnFZ3+LEfPYgA3N6IMFktc2RG715SAJw3dRZQ\nfPeo1hScB65la/Mtp0tv2bWp8t+XeaTrh/IUvRhW4SerYwDN3k0vvOQ1AoGAcJim\n2I6u4wzgoviHq5EzhAc+UMiqA9ZEEfbwDE5Z7ftp9p9I+8ekwbkNQKXt7j/TzPXJ\nXBNIoHLUyt2ztdEJm6mim8x23TSc1W4t6mAnJp1EinHqMLfE74z3vzSz9WgHnw/z\n0ar/rlXIlyF+5OKAfYVFycWt3VBBBHnOAlms6qECgYEA1QfjxmITh/V9BK3eANLd\nrPcHhP4b3/c1HdMkpdW2nPtd4i/49Fwl5QGBlpAp5yDlivOfUjS0IHo8NLYJo4Xh\nSA7/DtI6Lg2yJYVnKQjXW1jqkZjXGIh/na5JHnuB+fYjX7/xfOe2PDkzoW7gHz8P\ntbeVKNwGxOYFut2Cg2EJS5I=\n-----END PRIVATE KEY-----\n",
  publicKey: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxr1MtIoqYujusHIG54d9\nhFOIrOdG9B1HL3k8iazIGqU3eXhZNzgfutfwrWglsV+apXbTGDivLmFOZNXvhmc9\nWDmAng5p056qQG9OCDXQ2Vt4NLGHk5kRgR0nJZfjdkXZLrGCoc9q49jLzxeRJDSV\nm7IWlxNdzbZlEG7AJrK8jfZE2K69ARXqukbUubrvuDLj0BCiSRmCuRs7Q0iD5iFz\nToSXzcOO0WOcqtUGQXPjbBMP2hV8gbJZLA+bfdznxAp9vaubJ0mu/NFAPE8VprQa\n5sP5hiS9HFhvtfmJpYaae4fahegt11Bn27RwU1fVKIdvpg4cLaaalEn0aPMERDDS\nyQIDAQAB\n-----END PUBLIC KEY-----\n"
}

const verifierKeyPair = {
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC9SOU/OksN2epW\nt1licDop2W6bs/MJLVKHFh0G1UxJtwgMXItemDZuTuO4L/tLsLLZcLQHNR0cyYcC\nOqV1XxL4D1PvX+mTt93y5xYSIGWyR3cuVu8aKxINCudg5u7Na2+k9O84MtU6peAg\nwW8K7q7WuCThx5vgPhUQtr0NGs99mUNZPqP4htXzauDyP7x/LwYmHSvHy/qHHWBQ\n8cpU4MgWh4/n4il1FfQC+MAQ8BZ00sst1W/myyBX/MjWAaoVx+c05zknHViejCE+\niIQKiqss7RzC5dJFAFYLsqkDtCEAekDqvlrgE7wTZwbwjYLcASAVStGE71wvo7RH\nRk7V+aVZAgMBAAECggEAF7lJMlGGEqhbXJ8CTvot8AzWdiFptp69lzzISpD1TM/p\n7FK1DRgaylyM4grxfh0ZbXNYvQaFLZR8nWToU/ukjv6s0HW++sqywL0B4Se6V0vp\nvh8bPLZlPsk9EsIe8BQlHBGu4eZNH1qm6rQTzNT5iOPvi3TPLp3ZWgztSPUxSFZz\ng/pYBn9d4gOh7p26/wloA/4gRCLCURl3EYyNX0tK69nDGZEWFJKTKy2bnQ5EQqmz\nTYb0AVflTCFc4Y5+w9itWjru9ZlCVbHQlDW9SiyzVGQwHpVkmNXgzpDmtJGONrUX\nwZ16NzJCpoDlYVdMeI7WJx7CDByhS1lxGb6fzlZzeQKBgQD9rxoer+qjtPEhC8UP\nFVMPvSrBw5ViwXD2d0/bzBnittOBCeeCBx5M/4AWdg/1057XsjGgrGrSJV0AJKlo\nR03tYHhrovgYyEjFIX+HdcyDLQSXZct+2rGyXqDqLYeDEvtSiiJAKuMcKqtCOC/J\nTZOHW41TZTkf+cAR3iSYQogqJwKBgQC/A0hcndZ3JA/JLhwhg+bWg67mXKGalN+1\nPbAtXs5ueE2tpi+F576wPxl0ueu+HX7QSgPg69cXaBW/gE71oB5PQnDikWpg1/EC\nims9CR456trarEfKtnZ7JWFd7QrO6bcUEQjxPE/rnpJiGkT8EdjJWKjy6HbMks3d\nxtN/8U7kfwKBgQCNbOjq4re0vFMRUTZyyjicNaF4lEjb3WvUe3+R0Z88vR/8eEEQ\nRFeoJWiLHRaYvXl4VmdEY9rJfPrz8XxgHiBbjcSUfS5C4qVvANXP9uQk3RwKKz3f\nYpxeDFM5OlipwhNKWKfvjfk+4qrHJ/u8BfuRIoEPVQcbxGhHjcho+e5fUQKBgQCP\nMjvOSvmbyaoX7Pxj18l3KbM1uV3hUBhBfCSWbsudH41EUCCyZyCaakOAMV1c4inO\npp4vwT43qu0a6mrHUylFzA5qnA8+2MQyXmi0kiBZ1QoLAzqy6oT6HvTWgD0pDycT\n4Q1uJAPaJL+i0gTDX/HASDooGEPva2LwDv1BnjrBqwKBgQCyablZXnPxiOYVPTOS\niEv3qMycGm/jwqkDH8Hrs8HDTpxxvjihpNbxCmVl0SC+Og0M5cWU7fycb2Sr8fV/\nrEbtdyOQQ5qgVej4hUrYjwE7IG4jNCT/HVsM5UAW/AtyplmcNwXpG0Iv/feqTrxB\nnqVBZKsxJK+XRVVab90o5npAoQ==\n-----END PRIVATE KEY-----\n",
  publicKey: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvUjlPzpLDdnqVrdZYnA6\nKdlum7PzCS1ShxYdBtVMSbcIDFyLXpg2bk7juC/7S7Cy2XC0BzUdHMmHAjqldV8S\n+A9T71/pk7fd8ucWEiBlskd3LlbvGisSDQrnYObuzWtvpPTvODLVOqXgIMFvCu6u\n1rgk4ceb4D4VELa9DRrPfZlDWT6j+IbV82rg8j+8fy8GJh0rx8v6hx1gUPHKVODI\nFoeP5+IpdRX0AvjAEPAWdNLLLdVv5ssgV/zI1gGqFcfnNOc5Jx1YnowhPoiECoqr\nLO0cwuXSRQBWC7KpA7QhAHpA6r5a4BO8E2cG8I2C3AEgFUrRhO9cL6O0R0ZO1fml\nWQIDAQAB\n-----END PUBLIC KEY-----\n"
}

// console.log("issuer(government) key info: " + JSON.stringify(issuerKeyPair));
// console.log("holder(me) key info: " + JSON.stringify(holderKeyPair));
// console.log("verifier(선관위) key info: " + JSON.stringify(verifierKeyPair));

const issuer = new Issuer(issuerKeyPair);
const holder = new Holder(holderKeyPair);
const vcVerifier = new VCVerifier(verifierKeyPair);

// JWT 발급 API
app.post('/issue-vc', async (req: Request, res: Response) => {
  try {
    const { formContents } = req.body;

    if (!formContents) {
      return res.status(400).json({ error: 'Form contents are required' });
    }

    const encryptedPayload = holder.encryptFormContents(formContents);

    const credential = await issuer.issueVC(encryptedPayload);

    if (!credential) {
      return res.status(500).json({ error: 'Failed to issue VC' });
    }

    // credential is the encoded sdjwt. 
    // console.log(credential);

    // test code: verify the vc using vcVerifier's sdJwtInstance
    const { payload, header, kb } = await vcVerifier.verifyVC(credential);
    console.log("verified payload: ", payload);


    // encrypt the encoded sdjwt (credential) - since credential is too big for RSA, we need to use aes
    // Generate AES symmetric key and IV, encrypt the data using symmetric key and IV, encrypt the symmetric key & return. 
    const vcEncrypted = issuer.encryptCredential(credential);

    console.log("encrypted symmetric key original: ", vcEncrypted.encryptedSymmetricKey)

    return res.status(200).json(vcEncrypted);

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
    const decodedSdJwt = await holder.decodeVC(sdjwt);

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

app.post('/decrypt-holder-aes', async (req: Request, res: Response) => {
  try {
    const vcEncrypted = req.body;

    const decryptedData = holder.decryptCredential(vcEncrypted);

    // Respond with the decrypted data and status 200
    res.status(200).json({ sdjwt: decryptedData });

  } catch (error) {
    console.error('Error while decrypting:', error);
    res.status(500).json({ error: 'Failed to decrypt the data' });
  }
});

// based on the selections, holder makes vp (doesn't present it yet)
app.post('/make-vp', async (req: Request, res: Response) => {
  try {
    // get the selection information(presentation frame) & sdjwt(encoded) from request, 
    // make presentation and signature & return. 
    const selections = req.body.selections;
    const sdjwt = req.body.sdjwt;

    const vp = await holder.makeVP(sdjwt, selections)
    console.log("the result vp: ", vp);
    res.status(200).json({ vp: vp });

  } catch (error) {
    console.error('Error while making VP:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});