# global-file-sync

Update common files

---

This command updates all files synchronized with a uuid in it's store.

## Install

```
npm install -g global-file-sync
```

## Usage

```
global-file-sync
global-file-sync --init <filename>
```

### Update all files

```
global-file-sync
```

Update all files in the current (and sub) directories which have a registered
header.

### Initialize a synchronized file

```
global-file-sync --init <filename>
```

Create the given file in the current directory from the registered content.

### Register a new file

This command does not have support for a local registry yet. For now, create a
PR in the repository to create a new registry entry.

## Global registry

| Name | ID | Source |
| --- | --- | --- |
| .editorconfig | 2d0e4a3f-ac19-430c-bf1b-46c68651ce21 | https://github.com/finwo/global-file-sync/tree/master/doc/2d0e4a3f-ac19-430c-bf1b-46c68651ce21 |
| tool/ini.sh | c90839f9-835f-4f11-b6cd-86d17220195d | https://github.com/finwo/global-file-sync/tree/master/doc/c90839f9-835f-4f11-b6cd-86d17220195d |
| tool/template.sh | e660cc6c-638a-4f9b-9527-ff96a19bbeed | https://github.com/finwo/global-file-sync/tree/master/doc/e660cc6c-638a-4f9b-9527-ff96a19bbeed |
| .github/FUNDING.yml | f4d2ed80-57b6-46e6-b245-5049428a931d | https://github.com/finwo/global-file-sync/tree/master/doc/f4d2ed80-57b6-46e6-b245-5049428a931d |

