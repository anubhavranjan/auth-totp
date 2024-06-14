class Authenticator {
    private nowFunc: () => Date;
    private intervalSeconds: number;
    private verificationRange: number;

    private static availableKeyChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

    constructor(nowFunc: (() => Date) | null = null, intervalSeconds: number = 30, verificationRange: number = 2) {
        this.nowFunc = nowFunc ?? (() => new Date());
        this.intervalSeconds = intervalSeconds;
        this.verificationRange = verificationRange;
    }

    async getCode(secret: string): Promise<string> {
        return this.getCodeAtTime(secret, this.nowFunc());
    }

    async getCodeAtTime(secret: string, date: Date): Promise<string> {
        return this.getCodeInternal(secret, this.getInterval(date));
    }

    async checkCode(secret: string, code: string): Promise<boolean> {
        return (await this.checkCodeWithTime(secret, code)).codeMatch;
    }

    async checkCodeWithTime(secret: string, code: string): Promise<{ codeMatch: boolean, usedDateTime: Date }> {
        const baseTime = this.nowFunc();
        let successfulTime = new Date(0);
        let codeMatch = false;

        for (let i = -this.verificationRange; i <= this.verificationRange; i++) {
            const checkTime = new Date(baseTime.getTime() + this.intervalSeconds * i * 1000);
            if (this.constantTimeEquals(await this.getCodeAtTime(secret, checkTime), code)) {
                codeMatch = true;
                successfulTime = checkTime;
            }
        }

        return { codeMatch, usedDateTime: successfulTime };
    }

    private getInterval(dateTime: Date): number {
        return Math.floor(dateTime.getTime() / 1000 / this.intervalSeconds);
    }

    static generateKey(keyLength: number = 16): string {
        const keyChars = new Array(keyLength);
        for (let i = 0; i < keyLength; i++) {
            keyChars[i] = this.availableKeyChars[this.randomInt(this.availableKeyChars.length)];
        }
        return keyChars.join('');
    }

    private async getCodeInternal(secret: string, challengeValue: number): Promise<string> {
        let chlg = challengeValue;
        const challenge = new Uint8Array(8);
        for (let j = 7; j >= 0; j--) {
            challenge[j] = chlg & 0xff;
            chlg >>= 8;
        }

        const key = this.base32ToBytes(secret);
        const hash = await this.hmacSha1(key, challenge);

        const offset = hash[hash.length - 1] & 0xf;

        let truncatedHash = 0;
        for (let j = 0; j < 4; j++) {
            truncatedHash <<= 8;
            truncatedHash |= hash[offset + j];
        }

        truncatedHash &= 0x7FFFFFFF;
        truncatedHash %= 1000000;

        const code = truncatedHash.toString();
        return code.padStart(6, '0');
    }

    private constantTimeEquals(a: string, b: string): boolean {
        let diff = a.length ^ b.length;

        for (let i = 0; i < a.length && i < b.length; i++) {
            diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
        }

        return diff === 0;
    }

    private static randomInt(max: number): number {
        return Math.floor(Math.random() * max);
    }

    private base32ToBytes(base32: string): Uint8Array {
        const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        const buffer = new Uint8Array(Math.ceil(base32.length * 5 / 8));
        let bits = 0;
        let value = 0;
        let index = 0;

        for (let i = 0; i < base32.length; i++) {
            value = (value << 5) | base32Chars.indexOf(base32.charAt(i));
            bits += 5;

            if (bits >= 8) {
                buffer[index++] = (value >>> (bits - 8)) & 0xFF;
                bits -= 8;
            }
        }

        return buffer;
    }

    private async hmacSha1(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            key,
            { name: 'HMAC', hash: 'SHA-1' },
            false,
            ['sign']
        );
        const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
        return new Uint8Array(signature);
    }
}

export default Authenticator;
