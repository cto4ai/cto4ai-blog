#!/bin/bash

echo "Fixing image paths in frontmatter..."

# Find all MDX files with old image paths and fix them
for file in src/data/content/*/index.mdx; do
    if grep -q "~/assets/images/posts" "$file"; then
        # Extract the directory name (slug)
        dir=$(dirname "$file")
        slug=$(basename "$dir")
        
        echo "Fixing: $file (slug: $slug)"
        
        # Replace the old path with the new one
        sed -i '' "s|~/assets/images/posts/blog/|~/assets/images/content/$slug/|g" "$file"
        sed -i '' "s|~/assets/images/posts/|~/assets/images/content/$slug/|g" "$file"
    fi
done

echo "Done fixing image paths!"