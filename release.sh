#!/bin/bash

# SmartWriter Analyzer — Release Helper Script
# Automatiza a criação de releases para publicação

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         SmartWriter Analyzer — Release Helper              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if version argument provided
if [ -z "$1" ]; then
    echo -e "${RED}✗ Usage: ./release.sh <version>${NC}"
    echo "  Example: ./release.sh 1.0.0"
    exit 1
fi

VERSION=$1
MANIFEST="manifest.json"
MAIN_JS="main.js"
STYLES_CSS="styles.css"
README="README.md"
LICENSE="LICENSE"

# Validate version format (semver: x.y.z)
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo -e "${RED}✗ Invalid version format. Use semver (x.y.z)${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Validate Environment${NC}"
echo ""

# Check required files exist
echo -n "Checking $MANIFEST... "
if [ -f "$MANIFEST" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ $MANIFEST not found${NC}"
    exit 1
fi

echo -n "Checking $README... "
if [ -f "$README" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ $README not found${NC}"
    exit 1
fi

echo -n "Checking $LICENSE... "
if [ -f "$LICENSE" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ $LICENSE not found${NC}"
    exit 1
fi

# Check git
echo -n "Checking Git repository... "
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Not a Git repository${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 2: Update manifest.json${NC}"
echo ""

# Update version in manifest.json
if grep -q "\"version\":" "$MANIFEST"; then
    echo "Updating version in $MANIFEST..."
    # macOS sed requires -i ''
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" "$MANIFEST"
    else
        sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" "$MANIFEST"
    fi
    echo -e "${GREEN}✓ Version updated to $VERSION${NC}"
else
    echo -e "${RED}✗ Could not find version in $MANIFEST${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 3: Build Plugin${NC}"
echo ""

echo "Building plugin with npm run build..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 4: Verify Build Artifacts${NC}"
echo ""

echo -n "Checking $MAIN_JS... "
if [ -f "$MAIN_JS" ]; then
    SIZE=$(du -h "$MAIN_JS" | cut -f1)
    echo -e "${GREEN}✓ ($SIZE)${NC}"
else
    echo -e "${RED}✗ $MAIN_JS not found${NC}"
    exit 1
fi

echo -n "Checking $STYLES_CSS... "
if [ -f "$STYLES_CSS" ]; then
    SIZE=$(du -h "$STYLES_CSS" | cut -f1)
    echo -e "${GREEN}✓ ($SIZE)${NC}"
else
    echo -e "${RED}✗ $STYLES_CSS not found${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 5: Verify manifest.json${NC}"
echo ""

MANIFEST_VERSION=$(grep "\"version\":" "$MANIFEST" | cut -d'"' -f4)
echo -n "Version in manifest: $MANIFEST_VERSION... "
if [ "$MANIFEST_VERSION" = "$VERSION" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Version mismatch${NC}"
    exit 1
fi

MANIFEST_ID=$(grep "\"id\":" "$MANIFEST" | cut -d'"' -f4)
echo -n "Plugin ID: $MANIFEST_ID... "
if [ "$MANIFEST_ID" = "smartwriter-analyzer" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Invalid ID${NC}"
    exit 1
fi

echo -n "Description length: "
DESC_LENGTH=$(grep "\"description\":" "$MANIFEST" | wc -c)
if [ "$DESC_LENGTH" -lt 250 ]; then
    echo -e "${GREEN}✓ ($DESC_LENGTH chars)${NC}"
else
    echo -e "${RED}✗ Description too long (max 250)${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 6: Git Commit & Tag${NC}"
echo ""

echo "Staging changes..."
git add manifest.json main.js styles.css

echo "Creating commit..."
COMMIT_MSG="chore(release): bump version to $VERSION"
git commit -m "$COMMIT_MSG"
echo -e "${GREEN}✓ Commit created${NC}"

echo ""
echo "Creating git tag..."
TAG_NAME="v$VERSION"
git tag "$TAG_NAME" -m "SmartWriter Analyzer $VERSION"
echo -e "${GREEN}✓ Tag created: $TAG_NAME${NC}"

echo ""
echo -e "${YELLOW}Step 7: Ready for Release${NC}"
echo ""

echo "Next steps:"
echo ""
echo "1. Push commits and tags:"
echo -e "   ${BLUE}git push origin main${NC}"
echo -e "   ${BLUE}git push origin $TAG_NAME${NC}"
echo ""
echo "2. Create GitHub release:"
echo -e "   ${BLUE}gh release create $TAG_NAME \\${NC}"
echo -e "   ${BLUE}  --title \"SmartWriter Analyzer $VERSION\" \\${NC}"
echo -e "   ${BLUE}  --notes \"See CHANGELOG.md for details\" \\${NC}"
echo -e "   ${BLUE}  ./main.js ./manifest.json ./styles.css${NC}"
echo ""
echo "3. Submit to Obsidian (when ready):"
echo -e "   ${BLUE}https://github.com/obsidianmd/obsidian-releases/edit/master/community-plugins.json${NC}"
echo ""
echo -e "${GREEN}✓ Release $VERSION prepared successfully!${NC}"
echo ""
