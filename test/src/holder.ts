import { decodeSdJwt, getClaims } from '@sd-jwt/decode';
import { digest } from '@sd-jwt/crypto-nodejs';



// Example function to decode SD-JWT
export async function decodeAndSaveSdJwt(sdJwt: string) {
    try {
        // Decode the SD-JWT using the provided digest
        console.log("Starting decoding...")
        console.log(sdJwt);

        const decodedSdJwt = await decodeSdJwt(sdJwt, digest);

        // Log the decoded disclosures
        console.log('The decoded Disclosures are:');
        console.log(JSON.stringify(decodedSdJwt.disclosures, null, 2));

        // Save the decoded SD-JWT if necessary (this part depends on your use case)
        // For example, save to localStorage, a database, or any other storage mechanism:
        // localStorage.setItem('decodedSdJwt', JSON.stringify(decodedSdJwt));

        const claims = await getClaims(
            decodedSdJwt.jwt.payload,
            decodedSdJwt.disclosures,
            digest,
        );

        console.log('The claims are:');
        console.log(JSON.stringify(claims, null, 2));

        return decodedSdJwt;
    } catch (error) {
        console.error('Error decoding SD-JWT:', error);
    }
}
