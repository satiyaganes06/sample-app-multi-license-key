#!/bin/bash

set -euo pipefail

# Resolve script-local paths so the script works from any current directory.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ZDEFEND_DIR="${ZDEFEND_DIR:-$SCRIPT_DIR/../../../../react-native/zdefend}"
DEEP_MODE="${1:-}"

if [ ! -d "$ZDEFEND_DIR" ]; then
	echo "zdefend directory not found: $ZDEFEND_DIR"
	exit 1
fi

cd "$ZDEFEND_DIR"
if [ -f "zdefend.tgz" ]; then
	rm -rf zdefend.tgz
fi

if [ "$DEEP_MODE" == "deep" ]; then
	rm -rf node_modules
	corepack yarn 
fi

corepack yarn pack --out zdefend.tgz

ZDEFEND_TARBALL="${ZDEFEND_TARBALL:-$ZDEFEND_DIR/zdefend.tgz}"

#ZDEFEND_TARBALL="../zdefend-react-native-sdk-v5.10.7-2026-04-15-20-50-20.embed.tgz"

cd "$SCRIPT_DIR"

if [ "$DEEP_MODE" == "deep" ]; then
	rm -rf node_modules
	rm -rf ~/.yarn/cache
	rm -rf ~/.yarn/berry/cache
	rm -rf .yarn/cache
	rm -rf .yarn/unplugged
	corepack yarn cache clean --all
    corepack yarn cache clean
	if [ -f "yarn.lock" ]; then
		rm -rf yarn.lock
		touch "yarn.lock"
	fi
fi

if [ ! -f "$ZDEFEND_TARBALL" ]; then
	echo "Missing local package: $ZDEFEND_TARBALL"
	exit 1
fi

PACKAGE_NAME="$(tar -xOzf "$ZDEFEND_TARBALL" package/package.json | node -e 'let s=""; process.stdin.on("data", d => (s += d)); process.stdin.on("end", () => process.stdout.write(JSON.parse(s).name));')"

if [ -z "$PACKAGE_NAME" ]; then
	echo "Unable to resolve package name from tarball: $ZDEFEND_TARBALL"
	exit 1
fi

echo "Using local zdefend tarball: $ZDEFEND_TARBALL"
shasum -a 256 "$ZDEFEND_TARBALL"
echo "Resolved tarball package name: $PACKAGE_NAME"

corepack yarn remove "$PACKAGE_NAME" || true
corepack yarn cache clean
corepack yarn

corepack yarn add "$ZDEFEND_TARBALL"
corepack yarn install --check-cache
corepack yarn why "$PACKAGE_NAME" || echo "Warning: 'yarn why $PACKAGE_NAME' did not return data with the current Yarn version."
corepack yarn node -e "const name=process.argv[1]; const p=require(name + '/package.json'); console.log('Installed ' + name + ':', p.version)" "$PACKAGE_NAME"

