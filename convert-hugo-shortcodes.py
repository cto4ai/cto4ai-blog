#!/usr/bin/env python3
"""
Hugo to Astro Image Shortcode Converter

This script converts Hugo {{< imgs >}} shortcodes to Astro SingleImage/ImageGallery components.

Usage:
    python convert-hugo-shortcodes.py <mdx-file-path> [--post-dir <directory-name>] [--dry-run]

Examples:
    python convert-hugo-shortcodes.py src/data/posts/aiewf2025-my-day-2-highlights.mdx --post-dir aiewf2025-my-day-2-highlights
    python convert-hugo-shortcodes.py src/data/posts/aiewf2025-my-day-1-highlights.mdx --post-dir aiewf2025-my-day-1-highlights --dry-run
"""

import re
import sys
import argparse
from pathlib import Path

def convert_shortcode(match, post_dir):
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
        # Generate alt text from filename (remove extension and replace underscores/hyphens with spaces)
        alt_text = Path(image_name).stem.replace('_', ' ').replace('-', ' ').title()
        
        return f'<SingleImage src="{image_name}" alt="{alt_text}" size="{size}" postDir="{post_dir}" />'
    else:
        # Multiple images - use ImageGallery component
        images_array = "['" + "', '".join(image_files) + "']"
        alt_text = f"Gallery of {len(image_files)} images"
        
        return f'<ImageGallery images={{{images_array}}} alt="{alt_text}" size="{size}" postDir="{post_dir}" />'

def add_imports(content):
    """Add component imports if they don't exist"""
    has_single_import = 'import SingleImage' in content
    has_gallery_import = 'import ImageGallery' in content
    
    if has_single_import and has_gallery_import:
        return content
    
    # Find the end of frontmatter
    frontmatter_end = content.find('---', content.find('---') + 1) + 3
    
    imports_to_add = []
    if not has_single_import:
        imports_to_add.append("import SingleImage from '~/components/ui/SingleImage.astro';")
    if not has_gallery_import:
        imports_to_add.append("import ImageGallery from '~/components/ui/ImageGallery.astro';")
    
    if imports_to_add:
        imports_text = '\n\n' + '\n'.join(imports_to_add)
        content = content[:frontmatter_end] + imports_text + content[frontmatter_end:]
    
    return content

def convert_file(file_path, post_dir, dry_run=False):
    """Convert all Hugo shortcodes in a file"""
    file_path = Path(file_path)
    
    if not file_path.exists():
        print(f"Error: File {file_path} does not exist")
        return False
    
    print(f"Processing: {file_path}")
    
    # Read file content
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to match Hugo imgs shortcodes
    hugo_pattern = r'\{\{<\s*imgs\s+[^>]+>\}\}'
    
    # Find all matches
    matches = list(re.finditer(hugo_pattern, content))
    
    if not matches:
        print("No Hugo shortcodes found in file")
        return True
    
    print(f"Found {len(matches)} Hugo shortcodes to convert")
    
    if dry_run:
        print("\nDRY RUN - Conversions that would be made:")
        for i, match in enumerate(matches, 1):
            original = match.group(0)
            converted = convert_shortcode(match, post_dir)
            print(f"\n{i}. Original:")
            print(f"   {original}")
            print(f"   Converted:")
            print(f"   {converted}")
        return True
    
    # Perform conversions
    converted_content = content
    conversions_made = 0
    
    # Convert shortcodes (process in reverse order to maintain positions)
    for match in reversed(matches):
        original = match.group(0)
        converted = convert_shortcode(match, post_dir)
        
        if converted != original:
            converted_content = (
                converted_content[:match.start()] + 
                converted + 
                converted_content[match.end():]
            )
            conversions_made += 1
    
    # Add imports if needed
    converted_content = add_imports(converted_content)
    
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(converted_content)
    
    print(f"✅ Converted {conversions_made} shortcodes and saved to {file_path}")
    return True

def main():
    parser = argparse.ArgumentParser(
        description='Convert Hugo {{< imgs >}} shortcodes to Astro components',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument('file_path', help='Path to the MDX file to convert')
    parser.add_argument('--post-dir', required=True, help='Post directory name (e.g., aiewf2025-my-day-2-highlights)')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be converted without making changes')
    
    args = parser.parse_args()
    
    success = convert_file(args.file_path, args.post_dir, args.dry_run)
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()