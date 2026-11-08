#!/bin/sh
# credits: https://github.com/LCE-Hub/LCE-Emerald-Launcher/blob/main/pkg/AppImage/AppImage.sh
set -eu
ARCH="$(uname -m)"
SHARUN_REPO="https://raw.githubusercontent.com/pkgforge-dev/Anylinux-AppImages"
_commits_json=$(mktemp)
wget -qO "$_commits_json" \
    "https://api.github.com/repos/pkgforge-dev/Anylinux-AppImages/commits?path=useful-tools/&per_page=100"

STABLE_SHA=$(node -e "
const data = JSON.parse(require('fs').readFileSync('$_commits_json', 'utf8'));
const now = Date.now(), h24 = 864e5;
for (let i = 0; i < data.length; i++) {
    const t = new Date(data[i].commit.committer.date).getTime();
    if (now - t < h24) continue;
    const prev = data[i - 1];
    if (!prev || new Date(prev.commit.committer.date).getTime() - t >= h24) {
        process.stdout.write(data[i].sha);
        process.exit(0);
    }
}
process.stderr.write('No settled commit found in last 100 commits\n');
process.exit(1);
")
rm -f "$_commits_json"
echo "Pinning sharun scripts to settled commit $STABLE_SHA"
SHARUN="$SHARUN_REPO/$STABLE_SHA/useful-tools/quick-sharun.sh"

# icons: copy the main one next to the script, sized ones go in after deploy
ICON_SRC="$PWD/src-tauri/icons"
cp "$ICON_SRC/icon.png" ./smarker.png

export OUTNAME=smarker-anylinux-"$ARCH".AppImage
export DESKTOP="$PWD/smarker.desktop"
export ICON="$PWD/smarker.png"
export DEPLOY_OPENGL=1
rm -rf AppDir dist appinfo
wget --retry-connrefused --tries=30 "$SHARUN" -O ./quick-sharun
chmod +x ./quick-sharun

# fix 1: quick-sharun's plain `ln` dies on "File exists" for gst helpers
sed -i 's|ln "\$APPDIR"/sharun "\$gstlibdir"|ln -f "$APPDIR"/sharun "$gstlibdir"|' ./quick-sharun

# fix 2: on Void the webkit helpers live in /usr/libexec, so pass them explicitly
./quick-sharun "$PWD/src-tauri/target/release/smarker" /usr/libexec/webkit2gtk-4.1/WebKit*Process

# fix 3: quick-sharun patched /usr/lib -> /tmp/XXX inside libwebkit, which also mangles
# /usr/libexec and /usr/lib64 into /tmp/XXXexec and /tmp/XXX64. Put the helpers where
# those paths point and make the startup hook create the extra symlinks.
HOOK=AppDir/bin/01-path-mapping-hardcoded.hook
EXECDIR=$(grep -a -h -o '/tmp/[A-Za-z0-9_=-]*exec/webkit2gtk-4.1' AppDir/lib/libwebkit2gtk-4.1.so.0 | head -n1 | sed 's|/webkit2gtk-4.1$||')
LIB64DIR=$(grep -a -h -o '/tmp/[A-Za-z0-9_=-]*64/webkit2gtk-4.1' AppDir/lib/libwebkit2gtk-4.1.so.0 | head -n1 | sed 's|/webkit2gtk-4.1$||')
[ -f "$HOOK" ] || { echo "hook not found: $HOOK"; exit 1; }
[ -n "$EXECDIR" ] || { echo "could not find the exec path in libwebkit"; exit 1; }
mkdir -p AppDir/lib/webkit2gtk-4.1
for p in WebKitWebProcess WebKitNetworkProcess WebKitGPUProcess; do
  ln -f AppDir/sharun "AppDir/lib/webkit2gtk-4.1/$p"
done
printf 'LC_ALL=C ln -sfn "$APPDIR"/lib %s || :\n' "$EXECDIR" "$LIB64DIR" >> "$HOOK"

# sized icons for launchers / integration tools
for s in 32x32 64x64 128x128; do
  mkdir -p "AppDir/share/icons/hicolor/$s/apps"
  cp "$ICON_SRC/$s.png" "AppDir/share/icons/hicolor/$s/apps/smarker.png"
done
mkdir -p AppDir/share/icons/hicolor/256x256/apps AppDir/share/icons/hicolor/512x512/apps
cp "$ICON_SRC/128x128@2x.png" AppDir/share/icons/hicolor/256x256/apps/smarker.png
cp "$ICON_SRC/icon.png" AppDir/share/icons/hicolor/512x512/apps/smarker.png

./quick-sharun --make-appimage
mkdir -p ./dist
mv -v ./*.AppImage* ./dist
echo "All Done!"
