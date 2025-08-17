#!/usr/bin/env python3
"""
Complete Hugo to Astro Post Conversion Tool

This script handles the complete conversion process from Hugo page bundles to Astro MDX posts.
It can:
1. Copy a Hugo post and convert it to Astro MDX format
2. Migrate image assets to the correct Astro directory
3. Convert Hugo shortcodes to Astro components
4. Add necessary component imports

Usage:
    python complete-conversion.py <hugo-post-dir> <astro-post-name> [--dry-run]

Examples:
    python complete-conversion.py /path/to/hugo/content/blog/aiewf2025-my-day-2-highlights aiewf2025-my-day-2-highlights
    python complete-conversion.py /path/to/hugo/content/blog/aiewf2025-my-day-1-highlights aiewf2025-my-day-1-highlights --dry-run
"""

import re
import sys
import argparse
import shutil
from pathlib import Path
from datetime import datetime

class HugoToAstroConverter:
    def __init__(self, dry_run=False):
        self.dry_run = dry_run
        self.astro_root = Path("src")
        self.posts_dir = self.astro_root / "data" / "posts"
        self.assets_dir = self.astro_root / "assets" / "images" / "blog"
    
    def convert_frontmatter(self, content):
        """Convert Hugo TOML frontmatter to Astro YAML"""
        # Extract TOML frontmatter
        toml_match = re.match(r'\+\+\+(.*?)\+\+\+\s*(.*)', content, re.DOTALL)
        if not toml_match:
            print("Warning: No TOML frontmatter found")
            return content
        
        toml_content = toml_match.group(1).strip()
        md_content = toml_match.group(2)
        
        # Convert key TOML fields to YAML
        yaml_lines = ["---"]
        
        # Parse common fields
        for line in toml_content.split('\n'):
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            
            # Handle title
            if line.startswith('title ='):
                title = re.search(r'title = "([^"]*)"', line)
                if title:
                    yaml_lines.append(f'title: "{title.group(1)}"')
            
            # Handle description
            elif line.startswith('description ='):
                desc = re.search(r'description = "([^"]*)"', line)
                if desc:
                    yaml_lines.append(f'description: "{desc.group(1)}"')
            
            # Handle author
            elif line.startswith('author ='):
                author = re.search(r'author = "([^"]*)"', line)
                if author:
                    yaml_lines.append(f'author: "{author.group(1)}"')
            
            # Handle date -> publishDate
            elif line.startswith('date ='):
                date = re.search(r'date = (.+)', line)
                if date:
                    # Convert TOML date format to ISO string
                    date_str = date.group(1).strip()
                    yaml_lines.append(f'publishDate: "{date_str}"')
            
            # Handle categories
            elif line.startswith('categories ='):
                cats = re.search(r'categories = \[(.*?)\]', line)
                if cats:
                    cat_list = [c.strip().strip('"') for c in cats.group(1).split(',')]
                    yaml_lines.append(f'categories: {cat_list}')
            
            # Handle tags  
            elif line.startswith('tags ='):
                tags = re.search(r'tags = \[(.*?)\]', line)
                if tags:
                    tag_list = [t.strip().strip('"') for t in tags.group(1).split(',')]
                    yaml_lines.append(f'tags: {tag_list}')
            
            # Handle draft
            elif line.startswith('draft ='):
                draft = re.search(r'draft = (true|false)', line)
                if draft:
                    yaml_lines.append(f'draft: {draft.group(1)}')
        
        # Handle cover image if present
        cover_match = re.search(r'\[cover\].*?image = "([^"]*)"', toml_content, re.DOTALL)
        if cover_match:
            image_path = cover_match.group(1)
            yaml_lines.append(f'image: "~/assets/images/posts/blog/{image_path}"')
        
        yaml_lines.append("---")
        
        return '\n'.join(yaml_lines) + '\n\n' + md_content
    
    def convert_shortcode(self, match, post_dir):
        """Convert a single Hugo shortcode to Astro component"""
        full_match = match.group(0)
        
        # Extract parameters
        size_match = re.search(r'size="([^"]+)"', full_match)
        imgs_match = re.search(r'imgs="([^"]+)"', full_match)
        
        if not imgs_match:
            print(f"Warning: Could not parse imgs parameter in: {full_match}")
            return full_match
        
        size = size_match.group(1) if size_match else "lg"
        imgs = imgs_match.group(1)
        
        # Split images by comma for galleries
        image_files = [img.strip() for img in imgs.split(',')]
        
        if len(image_files) == 1:
            # Single image - use SingleImage component
            image_name = image_files[0]
            # Generate alt text from filename
            alt_text = Path(image_name).stem.replace('_', ' ').replace('-', ' ').title()
            
            return f'<SingleImage src="{image_name}" alt="{alt_text}" size="{size}" postDir="{post_dir}" />'
        else:
            # Multiple images - use ImageGallery component
            images_array = "['" + "', '".join(image_files) + "']"
            alt_text = f"Gallery of {len(image_files)} images"
            
            return f'<ImageGallery images={{{images_array}}} alt="{alt_text}" size="{size}" postDir="{post_dir}" />'
    
    def add_imports(self, content):
        """Add component imports"""
        imports = [
            "import SingleImage from '~/components/ui/SingleImage.astro';",
            "import ImageGallery from '~/components/ui/ImageGallery.astro';"
        ]
        
        # Find the end of frontmatter
        frontmatter_end = content.find('---', content.find('---') + 1) + 3
        
        imports_text = '\n\n' + '\n'.join(imports)
        content = content[:frontmatter_end] + imports_text + content[frontmatter_end:]
        
        return content
    
    def convert_post(self, hugo_post_dir, astro_post_name):
        """Convert a complete Hugo post to Astro format"""
        hugo_path = Path(hugo_post_dir)
        hugo_md = hugo_path / "index.md"
        
        if not hugo_md.exists():
            print(f"Error: Hugo post not found at {hugo_md}")
            return False
        
        print(f"Converting Hugo post: {hugo_path}")
        print(f"Target Astro post: {astro_post_name}")
        
        # Read Hugo content
        with open(hugo_md, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Convert frontmatter
        content = self.convert_frontmatter(content)
        
        # Convert shortcodes
        hugo_pattern = r'\{\{<\s*imgs\s+[^>]+>\}\}'
        matches = list(re.finditer(hugo_pattern, content))
        
        if matches:
            print(f"Found {len(matches)} Hugo shortcodes to convert")
            
            # Convert shortcodes (process in reverse order to maintain positions)
            for match in reversed(matches):
                converted = self.convert_shortcode(match, astro_post_name)
                content = (
                    content[:match.start()] + 
                    converted + 
                    content[match.end():]
                )
            
            # Add imports
            content = self.add_imports(content)
        
        # Target paths
        astro_mdx = self.posts_dir / f"{astro_post_name}.mdx"
        assets_target = self.assets_dir / astro_post_name
        
        if self.dry_run:
            print(f"\nDRY RUN - Would create:")
            print(f"  Post: {astro_mdx}")
            print(f"  Assets: {assets_target}")
            print(f"  Shortcode conversions: {len(matches)}")
            return True
        
        # Create directories
        self.posts_dir.mkdir(parents=True, exist_ok=True)
        assets_target.mkdir(parents=True, exist_ok=True)
        
        # Write converted post
        with open(astro_mdx, 'w', encoding='utf-8') as f:
            f.write(content)
        
        # Copy image assets
        copied_files = 0
        for file_path in hugo_path.iterdir():
            if file_path.is_file() and file_path.name != "index.md" and not file_path.name.startswith('.'):
                # Skip directories like socialposts
                if file_path.suffix.lower() in ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.mp4', '.webm']:
                    target_file = assets_target / file_path.name
                    shutil.copy2(file_path, target_file)
                    copied_files += 1
        
        print(f"✅ Conversion completed:")
        print(f"   Created: {astro_mdx}")
        print(f"   Copied {copied_files} asset files to: {assets_target}")
        print(f"   Converted {len(matches)} Hugo shortcodes")
        
        return True

def main():
    parser = argparse.ArgumentParser(
        description='Complete Hugo to Astro post conversion',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument('hugo_post_dir', help='Path to the Hugo post directory (containing index.md)')
    parser.add_argument('astro_post_name', help='Name for the Astro post (used for filename and asset directory)')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be done without making changes')
    
    args = parser.parse_args()
    
    converter = HugoToAstroConverter(dry_run=args.dry_run)
    success = converter.convert_post(args.hugo_post_dir, args.astro_post_name)
    
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()