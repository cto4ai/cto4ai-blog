#!/bin/bash
# Remove duplicate files that have been migrated to the new structure

echo "Removing duplicate files from old locations..."

# Posts (essay)
rm -f src/data/posts/a-day-to-remember.mdx
rm -f src/data/posts/accelerating-launch-with-ai-models.mdx
rm -f src/data/posts/ai-and-law.mdx

# Micro (brief)
rm -f src/data/micro/50-llms.mdx
rm -f src/data/micro/a-day-late.mdx
rm -f src/data/micro/apple-did-it.mdx

# Elsewhere
rm -f src/data/elsewhere/ai-cant-detect-ai.mdx
rm -f src/data/elsewhere/ben-thompson-apple-vision.mdx
rm -f src/data/elsewhere/comparing-art-ais.mdx

# Quote
rm -f src/data/quote/apt-description-of-react.mdx
rm -f src/data/quote/camus-knowledge.mdx
rm -f src/data/quote/gruber-ai-anxiety-at-apple.mdx

echo "✅ Removed 12 duplicate files from old locations"
echo ""
echo "Files removed:"
echo "- 3 from src/data/posts/"
echo "- 3 from src/data/micro/"
echo "- 3 from src/data/elsewhere/"
echo "- 3 from src/data/quote/"