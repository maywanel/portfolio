#!/usr/bin/env bash
# Custom Maven launcher for the Mohamed El Messaadi portfolio backend.
# Downloads Apache Maven locally on first run and reuses it afterwards.

set -euo pipefail

PROJECT_DIR=$(cd "$(dirname "$0")" && pwd)
MAVEN_VERSION=${PORTFOLIO_MAVEN_VERSION:-3.9.6}
MAVEN_DIST_NAME="apache-maven-${MAVEN_VERSION}"
MAVEN_ARCHIVE="${MAVEN_DIST_NAME}-bin.tar.gz"
MAVEN_DOWNLOAD_URL="https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/${MAVEN_VERSION}/${MAVEN_ARCHIVE}"
MAVEN_HOME="${PROJECT_DIR}/.maven/${MAVEN_DIST_NAME}"
MAVEN_CMD="${MAVEN_HOME}/bin/mvn"
LOCAL_REPO="${PROJECT_DIR}/.maven/repository"

# Prefer a system Maven if explicitly requested.
if [ "${PORTFOLIO_USE_SYSTEM_MAVEN:-0}" = "1" ] && command -v mvn >/dev/null 2>&1; then
  exec mvn "$@"
fi

if ! command -v java >/dev/null 2>&1; then
  echo "Error: Java runtime not found. Install JDK 17 and ensure 'java' is available." >&2
  exit 1
fi

if [ ! -x "${MAVEN_CMD}" ]; then
  echo "Downloading Maven ${MAVEN_VERSION} locally..."
  mkdir -p "${PROJECT_DIR}/.maven"

  tmp_dir=$(mktemp -d)
  cleanup() { rm -rf "${tmp_dir}"; }
  trap cleanup EXIT INT TERM

  archive_path="${tmp_dir}/${MAVEN_ARCHIVE}"

  if command -v curl >/dev/null 2>&1; then
    curl -fSL "${MAVEN_DOWNLOAD_URL}" -o "${archive_path}"
  elif command -v wget >/dev/null 2>&1; then
    wget -q "${MAVEN_DOWNLOAD_URL}" -O "${archive_path}"
  else
    echo "Error: Neither curl nor wget is available to download Maven." >&2
    exit 1
  fi

  tar -xzf "${archive_path}" -C "${PROJECT_DIR}/.maven"
fi

if [ ! -x "${MAVEN_CMD}" ]; then
  echo "Error: Maven executable not found at ${MAVEN_CMD}." >&2
  exit 1
fi

export MAVEN_USER_HOME="${PROJECT_DIR}/.maven/user-home"
export MAVEN_OPTS="-Dmaven.repo.local=${LOCAL_REPO} ${MAVEN_OPTS:-}"

exec "${MAVEN_CMD}" "$@"
