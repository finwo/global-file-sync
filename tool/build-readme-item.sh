#!/usr/bin/env bash
set -ex
TEMPLATE="${1}"
TARGET="${2}"
PAGEDIR="${3}"
tool/template.sh -c config.ini -c "${PAGEDIR}/meta.ini" "${TEMPLATE}" >> "${TARGET}"
