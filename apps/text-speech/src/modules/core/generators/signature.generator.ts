import * as crypto from 'crypto';

export interface Signature {
  hash: string;
  salt: string;
}

export class SignatureGenerator {
  private readonly defaultSecret =
    "Q^@A!Q3F_)(J9OP12Ge8P-#(JOGsKASO_@#c';lMBMSD()Amfps;eo_HS(J#MakpfawSK$Mf68ew44JW{W;#(";

  static async generate(
    text: string,
    secret?: string,
    salt?: string,
  ): Promise<Signature> {
    return new SignatureGenerator().generate(text.toLowerCase(), secret, salt);
  }

  async generate(
    text: string,
    secret?: string,
    salt?: string,
  ): Promise<Signature> {
    const toSign = text.toLowerCase() + (salt || '');

    const hash = await this.hmac(toSign, secret);

    return <Signature>{
      hash: hash,
      salt: salt,
    };
  }

  private async hmac(text: string, secret?: string) {
    const msgBuffer = new TextEncoder().encode(text);
    const hmacBuffer = await crypto.subtle
      .importKey(
        'raw',
        new TextEncoder().encode(secret ?? this.defaultSecret),
        { name: 'HMAC', hash: { name: 'SHA-256' } },
        false,
        ['sign'],
      )
      .then((key) => crypto.subtle.sign('HMAC', key, msgBuffer));

    const hashArray = Array.from(new Uint8Array(hmacBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
}
