## 3.7.0 2020-11-08
* add retry pattern for updatePackages
* remove parallel processing
* add tests
* add flag to enable buildKit

## 3.5.0 2020-02-19
* add option "update" (default falsy), if true "npm update" is used
* fix: Changed master of git-dependency not beeing installed

## 3.4.0 2019-11-30
* update master git-dependency only if it changed on remote
* use npm install (instead of update)
* support build only one composition (and skip all other)

## 3.1.0 2019-11-22
* node_modules folder in source composition folder is not allowed, added check
* collect all child build-processes in order to kill it, if one rejects
  requirement: spawend process must set option {detached:true}
* use npm update instead of install

## 3.0.0 2019-11-18
* introduce extra "\_build" directory per domain (must be ignored by VCS). Docker builds must copy builded application files from there.
* add option to configure build promises as element of "compositions". This promises should resolve to name of composition on success.

## 2.1.0 2019-09-30
* add config key "baseImage" to configure docker base image-id of js stack
* add creation of "js-master" image used as base of all local and dev stack (speed up)
  (depends on "masterPackages" are configured)