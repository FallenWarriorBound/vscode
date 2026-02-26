# API Documentation

This folder contains the OpenAPI specification used to describe the public API.
The specification is stored in `openapi.yaml` and can be rendered into HTML docs
using [Redoc](https://github.com/Redocly/redoc). Ensure Node.js is installed
before running the commands below.

## Regenerate documentation

1. Install the CLI if it is not already available:

   ```bash
   npm install -g @redocly/cli
   ```

2. Generate static HTML documentation:

   ```bash
   redocly build-docs openapi.yaml -o index.html
   ```

The generated `index.html` can be served from any static host.
