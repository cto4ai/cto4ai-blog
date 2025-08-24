#!/bin/bash
# Remove old content files after successful migration to unified structure

echo "============================================================"
echo "Removing old content files after migration"
echo "============================================================"
echo ""

# Count files before removal
POSTS_COUNT=$(ls src/data/posts/*.mdx 2>/dev/null | wc -l | tr -d ' ')
MICRO_COUNT=$(ls src/data/micro/*.mdx 2>/dev/null | wc -l | tr -d ' ')
ELSEWHERE_COUNT=$(ls src/data/elsewhere/*.mdx 2>/dev/null | wc -l | tr -d ' ')
QUOTE_COUNT=$(ls src/data/quote/*.mdx 2>/dev/null | wc -l | tr -d ' ')
TOTAL=$((POSTS_COUNT + MICRO_COUNT + ELSEWHERE_COUNT + QUOTE_COUNT))

echo "Files to remove:"
echo "  - posts: $POSTS_COUNT files"
echo "  - micro: $MICRO_COUNT files"
echo "  - elsewhere: $ELSEWHERE_COUNT files"
echo "  - quote: $QUOTE_COUNT files"
echo "  - TOTAL: $TOTAL files"
echo ""

# Remove the files
echo "Removing posts..."
rm -f src/data/posts/*.mdx

echo "Removing micro..."
rm -f src/data/micro/*.mdx

echo "Removing elsewhere..."
rm -f src/data/elsewhere/*.mdx

echo "Removing quote..."
rm -f src/data/quote/*.mdx

echo ""
echo "✅ Removed $TOTAL old content files"
echo ""

# Check remaining files in old directories
echo "Checking for remaining files in old directories..."
REMAINING_POSTS=$(ls src/data/posts/ 2>/dev/null | wc -l | tr -d ' ')
REMAINING_MICRO=$(ls src/data/micro/ 2>/dev/null | wc -l | tr -d ' ')
REMAINING_ELSEWHERE=$(ls src/data/elsewhere/ 2>/dev/null | wc -l | tr -d ' ')
REMAINING_QUOTE=$(ls src/data/quote/ 2>/dev/null | wc -l | tr -d ' ')

if [ "$REMAINING_POSTS" -eq 0 ] && [ "$REMAINING_MICRO" -eq 0 ] && [ "$REMAINING_ELSEWHERE" -eq 0 ] && [ "$REMAINING_QUOTE" -eq 0 ]; then
    echo "✅ All old directories are empty and ready for removal"
else
    echo "⚠️  Some files remain in old directories:"
    [ "$REMAINING_POSTS" -gt 0 ] && echo "  - posts: $REMAINING_POSTS files"
    [ "$REMAINING_MICRO" -gt 0 ] && echo "  - micro: $REMAINING_MICRO files"
    [ "$REMAINING_ELSEWHERE" -gt 0 ] && echo "  - elsewhere: $REMAINING_ELSEWHERE files"
    [ "$REMAINING_QUOTE" -gt 0 ] && echo "  - quote: $REMAINING_QUOTE files"
fi