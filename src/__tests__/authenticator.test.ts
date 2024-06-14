// src/__tests__/authenticator.test.ts

import Authenticator from '../authenticator';

let key: string = '';
let otp: string = '';
let authenticator: Authenticator;

describe('TotpAuthUnitTest', () => {
    beforeAll(() => {
        authenticator = new Authenticator();
    });

    afterAll(() => {
        // Clean up any resources if needed
    });

    it('GenerateKey', () => {
        key = Authenticator.generateKey();
        console.log('Generated Key:', key); // Debug log
        expect(key).not.toBe('');
    });

    it('GenerateOtp', async () => {
        otp = await authenticator.getCode(key);
        console.log('Generated OTP:', otp); // Debug log
        expect(otp).not.toBe('');
    });

    it('Validate', async () => {
        const valid = await authenticator.checkCode(key, otp);
        console.log('Validation Result:', valid); // Debug log
        expect(valid).toBe(true);
    });
});
