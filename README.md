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
        # please use --concurrency=1 if you provide your own command
      bootstrap_command: lerna bootstrap --concurrency 1  # this is the default
      # optional contents to put in ~/.npmrc
      npmrc: |
        registry=https://skimdb.npmjs.com/registry

      # github options
      github_labels:  # list of label names
      - bug
      github_assignees:  # list of usernames
      - davegaeddert
      github_milestone: 3  # milestone number
      github_base_branch: develop  # branch to make PR against (if something other than your default branch)

      # gitlab options
      gitlab_assignee_id: 1  # assignee user ID
      gitlab_labels:  # labels for MR as a list of strings
      - dependencies
      - update
      gitlab_milestone_id: 1  # the ID of a milestone
      gitlab_target_project_id: 1  # The target project (numeric id)
      gitlab_remove_source_branch: true  # flag indicating if a merge request should remove the source branch when merging
      gitlab_target_branch: develop  # branch to make PR against (if something other than your default branch)
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
