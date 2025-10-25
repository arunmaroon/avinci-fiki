# README

This README would normally document whatever steps are necessary to get your application up and running. https://docs.bit.dev/docs/apis/cli-all

### What is this repository for?

- Quick summary
- Version
- [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up?

- npm i -g @teambit/bvm
- bvm install
- bvm config set DEFAULT_LINK bit
- bit init --harmony
- bit login
- bit install react --type peer
- bit install react-dom --type peer
- uncomment teambit.react/react section in workspace.jsonc
- set scope name base-ui in workspace.jsonc
- bit create react-component typography
- bit start ( local development environment will start up) -- bit templates to see list of commands for creation of component/hooks
- bit uninstall
- bit checkout -whichVersion component-id


### How do I get it running for the first time ?

- bit install
- bit compile
- bit start

### Create new component

- run `bit create react <component-name>`

### Follow The 3 steps to export the component

1. bit compile
2. bit tag typography --ver 1.2.0 --message "this is the tag message"
3. bit build ( if build is success then we can export ) -- not mandatory .
4. bit export

### bit link generate symlinks for sourced components absolute path resolution.

bit link

### Remove

bit remove mvloans.base-ui/ui/button --remote

### Contribution guidelines

- Writing tests
- Code review
- Other guidelines

### Who do I talk to?

- Repo owner or admin
- Other community or team contact
