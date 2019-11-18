## 3.0.0 2019-11-18
* introduce extra "\_build" directory per domain (must be ignored by VCS). Docker builds must copy builded application files from there.
* add option to configure build promises as element of "compositions". This promises should resolve to name of composition on success.

## 2.1.0 2019-09-30
* add config key "baseImage" to configure docker base image-id of js stack
* add creation of "js-master" image used as base of all local and dev stack (speed up)
  (depends on "masterPackages" are configured)