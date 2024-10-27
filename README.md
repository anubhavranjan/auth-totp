# Authenticator Package 🔐

A simple and efficient Time-based One-Time Password (TOTP) authenticator package for Node.js and browser environments. Generate and validate one-time passwords with ease! 🚀

## Features ✨

- Generate secure keys 🔑
- Create TOTP codes based on a secret key 📟
- Validate TOTP codes for authentication ✅
- Compatible with Node.js and browser environments 🌐

## Installation 📦

Install the package using npm:

```bash
npm install auth-totp
```

## Usage 📖

Here's how you can use the Authenticator package in your project:

### Node.js

```javascript
const Authenticator = require("auth-totp");

const authenticator = new Authenticator();
const secret = Authenticator.generateKey();
const code = await authenticator.getCode(secret);
const isValid = await authenticator.checkCode(secret, code);

console.log(`Secret: ${secret}`);
console.log(`Generated Code: ${code}`);
console.log(`Is Code Valid: ${isValid}`);
```

### TypeScript / ES6

```typescript
import Authenticator from "auth-totp";

const authenticator = new Authenticator();
const secret = Authenticator.generateKey();
const code = await authenticator.getCode(secret);
const isValid = await authenticator.checkCode(secret, code);

console.log(`Secret: ${secret}`);
console.log(`Generated Code: ${code}`);
console.log(`Is Code Valid: ${isValid}`);
```

## API Reference 📚

### `Authenticator`

#### Methods

- `generateKey(keyLength: number = 16): string`

  - Generates a secure key of the specified length.

- `getCode(secret: string): Promise<string>`

  - Generates a TOTP code based on the provided secret.

- `checkCode(secret: string, code: string): Promise<boolean>`
  - Validates the provided TOTP code against the secret.

## Testing 🧪

Run tests using Jest:

```bash
npm test
```

Ensure all tests are passing to verify the functionality.

## Contributing 🤝

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License 📄

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements 🙌

- Inspired by the need for secure authentication mechanisms.
- Utilizes the Web Crypto API for secure cryptographic operations.

## Support 💬

If you have any questions or need support, feel free to open an issue or reach out via email.

---

Happy coding! 😃
