# Katze Web

Hi there, seems like you stumbled upon our Github repository! This is the repository that stores the client for Katze.

## Rationale

The build process for Katze client is intentionally minimalist, allowing for extreme predictability and robustness.

It also uses [Lucia](https://lucia.js.org) for logic and [Tailwind](https://tailwindcss.com/) for styling. These technologies allow a very consistent design process during development. It is separate from the Rust server, which handles persistent storage and authentication.

## Usage

```bash
# Build CSS & JavaScript for production
yarn dev
# Build CSS & JavaScript for production
yarn build
```

## License

[MIT](LICENSE)
