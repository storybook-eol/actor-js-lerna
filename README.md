# actor-js-lerna
[![Docker](https://img.shields.io/badge/dockerhub-actor--js--lerna-22B8EB.svg)](https://hub.docker.com/r/dependencies/actor-js-lerna/)
[![GitHub release](https://img.shields.io/github/release/dependencies-io/actor-js-lerna.svg)](https://github.com/dependencies-io/actor-js-lerna/releases)
[![Build Status](https://travis-ci.org/dependencies-io/actor-js-lerna.svg?branch=master)](https://travis-ci.org/dependencies-io/actor-js-lerna)
[![license](https://img.shields.io/github/license/dependencies-io/actor-js-lerna.svg)](https://github.com/dependencies-io/actor-js-lerna/blob/master/LICENSE)

A [dependencies.io](https://www.dependencies.io)
[actor](https://www.dependencies.io/docs/actors/) for JS monorepo dependencies using [Lerna](https://lernajs.io/).

## Usage

### dependencies.yml

```yaml
collectors:
- ...
  actors:
  - type: js-lerna
    versions: "L.Y.Y"
    settings:
      # by default we autodetect npm/yarn and do basic install
      root_install_command: npm run your-install-script

      # please use --concurrency=1 if you provide your own command
      bootstrap_command: lerna bootstrap --concurrency 1  # this is the default

      # optional contents to put in ~/.npmrc
      npmrc: |
        registry=https://skimdb.npmjs.com/registry

      # false by default, set to true if you want all dependency updates in a single PR
      batch_mode: false

      # Settings to configure the PR itself can be found
      # on the dependencies-io/pullrequest repo
      # https://github.com/dependencies-io/pullrequest/tree/0.6.0#dependenciesyml
```

### Works well with

- [js-lerna collector](https://www.dependencies.io/docs/collectors/js-lerna/) ([GitHub repo](https://github.com/dependencies-io/collector-js-lerna/))

## Resources

- https://github.com/lerna/lerna

## Support

Any questions or issues with this specific actor should be discussed in [GitHub
issues](https://github.com/dependencies-io/actor-js-lerna/issues). If there is
private information which needs to be shared then you can instead use the
[dependencies.io support](https://app.dependencies.io/support).
