# Download Release Action

This GitHub action updates meta releases, called _download releases_, to always provide the latest version for download.  

## Principle

The action scans for published non-draft releases with tags `vX.Y.Z`, find the latest for each major `X` version, and ensure the related _download release_ tagged `download-latest_vX` refers to the latest version.
If not, it downloads the `dd-java-agent.jar `attachment from the latest version, upload it to the _download release_ and update its body to refers to the latest version.

## Usage

Add the action in your workflow as any other action: 

```yaml
jobs:
  update-download-release:
    name: Update download releases
    runs-on: ubuntu-latest
    steps:
      - name: Update releases
        uses: DataDog/download-release-action@latest
```

The action has two inputs:
* `github-token` to provide a custom GitHub token (default `${{ github.token }}`),
* `debug` to log all GitHub client calls (default `false`).

They can be configured with a `with` map:
```yaml
- name: Update releases
  uses: DataDog/download-release-action@latest
  with:
    - github-token: ${{ env.MY_TOKEN }}
    - debug: true
```

## Development

> First, you'll need to have a reasonably modern version of `node` handy. This won't work with versions older than 16, for instance.

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:  
```
export GITHUB_REPOSITORY="owner/repo"
$ npm test
```
