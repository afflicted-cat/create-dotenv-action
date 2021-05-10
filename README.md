# Create Dotenv Action

[![Tests](https://github.com/weyheyhey/create-dotenv-action/actions/workflows/tests.yml/badge.svg?branch=master)](https://github.com/weyheyhey/create-dotenv-action/actions/workflows/tests.yml)

The action looks for env variables starting with `^` and creates an env file, writing the found variables into it, discarding the `^` character

## Usage

```yaml
name: Build

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Create .env.production
        uses: weyheyhey/create-dotenv-action@1
        with:
          wildecard: "^"
          filename: ".env.production"
        env:
          ^ENV_ONE: value-one
          ^ENV_TWO: ${{ secrets.ENV_TWO }}
```

## Options

### `filename`

- Default: ".env"

Name of the generated file. The file is created relative to `GITHUB_WORKSPACE` (inside the GitHub workspace directory).

```yaml
with:
  filename: ".env.production"
```

### `wildecard`

- Default: "^"

The key that env variables must start with to get into the .env file.

```yaml
with:
  wildecard: "PUBLIC_"
  env:
    PUBLIC_ENV_ONE: value-one
    PUBLIC_ENV_TWO: ${{ secrets.ENV_TWO }}
```

When writing variables to a `.env` file, this value will be discarded. For example, for the previous config, the following file will be generated:

```dotenv
ENV_ONE=value-one
ENV_TWO=value-two
```
