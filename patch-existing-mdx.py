#!/usr/bin/env python3
"""
Enhanced Patch for Existing MDX Files with Hugo Shortcode Conversions

This script patches existing MDX files by auto-detecting the file structure and applying 
the appropriate conversion strategy:

1. Empty line replacement - for files with placeholder empty lines
2. Component replacement - for files with existing <Image> components
3. Import cleanup - removes unused static imports after conversion

Usage:
    python patch-existing-mdx-enhanced.py <mdx-file> <hugo-source> <post-dir> [--dry-run]

Examples:
    python patch-existing-mdx-enhanced.py src/data/posts/aiewf2025-my-day-2-highlights.mdx /Users/jackivers/Projects/hugo/craftycto/content/blog/aiewf2025-my-day-2-highlights/index.md aiewf2025-my-day-2-highlights
"""

import re
import sys
import argparse
from pathlib import Path

class MDXPatcher:
    def __init__(self, post_dir, dry_run=False):
        self.post_dir = post_dir
        self.dry_run = dry_run
        self.conversions = []
        
    def convert_shortcode(self, shortcode_text):
        """Convert a Hugo shortcode to Astro component"""
        # Extract parameters
        size_match = re.search(r'size="([^"]+)"', shortcode_text)
        imgs_match = re.search(r'imgs="([^"]+)"', shortcode_text)
        
        if not imgs_match:
            return shortcode_text
        
        size = size_match.group(1) if size_match else "lg"
        imgs = imgs_match.group(1)
        
        # Split images by comma for galleries
        image_files = [img.strip() for img in imgs.split(',')]
        
        if len(image_files) == 1:
            # Single image
            image_name = image_files[0]
            alt_text = Path(image_name).stem.replace('_', ' ').replace('-', ' ').title()
            return f'<SingleImage src="{image_name}" alt="{alt_text}" size="{size}" postDir="{self.post_dir}" />'
        else:
            # Multiple images - gallery
            images_array = "['" + "', '".join(image_files) + "']"
            alt_text = f"Gallery of {len(image_files)} images"
            return f'<ImageGallery images={{{images_array}}} alt="{alt_text}" size="{size}" postDir="{self.post_dir}" />'

    def extract_image_from_shortcode(self, shortcode_text):
        """Extract the first image filename from a Hugo shortcode"""
        imgs_match = re.search(r'imgs="([^"]+)"', shortcode_text)
        if imgs_match:
            imgs = imgs_match.group(1)
            image_files = [img.strip() for img in imgs.split(',')]
            return image_files[0] if image_files else None
        return None

    def detect_file_structure(self, mdx_content):
        """Detect the structure of the existing MDX file"""
        has_static_imports = bool(re.search(r'import\s+\w+\s+from\s+[\'"][^\'"]*/images/blog/', mdx_content))
        has_image_components = bool(re.search(r'<Image\s+src=\{[^}]+\}', mdx_content))
        has_empty_line_pairs = len(re.findall(r'\n\s*\n\s*\n', mdx_content)) > 3
        
        return {
            'has_static_imports': has_static_imports,
            'has_image_components': has_image_components,
            'has_empty_line_pairs': has_empty_line_pairs
        }

    def strategy_empty_line_replacement(self, mdx_content):
        """Replace empty line pairs with converted components"""
        lines = mdx_content.split('\n')
        new_lines = []
        conversion_index = 0
        i = 0
        
        while i < len(lines):
            line = lines[i]
            
            # Look for empty line patterns that indicate missing images
            if (line.strip() == '' and 
                i + 1 < len(lines) and 
                lines[i + 1].strip() == '' and
                conversion_index < len(self.conversions)):
                
                # Replace the empty lines with the converted component
                new_lines.append('')
                new_lines.append(self.conversions[conversion_index]['converted'])
                new_lines.append('')
                conversion_index += 1
                i += 2  # Skip both empty lines
            else:
                new_lines.append(line)
                i += 1
        
        return '\n'.join(new_lines), conversion_index

    def strategy_component_replacement(self, mdx_content, hugo_content):
        """Replace existing <Image> components with our enhanced components"""
        # Find all <Image> components in MDX
        image_pattern = r'<Image\s+src=\{([^}]+)\}[^>]*/?>'
        image_matches = list(re.finditer(image_pattern, mdx_content))
        
        # Map Hugo shortcodes to image filenames for matching
        hugo_pattern = r'\{\{<\s*imgs\s+[^>]+>\}\}'
        hugo_matches = list(re.finditer(hugo_pattern, hugo_content))
        
        # Create mapping of image filenames to conversions
        image_to_conversion = {}
        for i, match in enumerate(hugo_matches):
            shortcode = match.group(0)
            image_file = self.extract_image_from_shortcode(shortcode)
            if image_file and i < len(self.conversions):
                image_to_conversion[image_file] = self.conversions[i]['converted']
        
        # Replace Image components
        updated_content = mdx_content
        conversions_made = 0
        
        # Process in reverse order to maintain positions
        for match in reversed(image_matches):
            # Extract the import variable name
            import_var = match.group(1)
            
            # Find the corresponding image file by looking at imports
            import_pattern = rf'import\s+{re.escape(import_var)}\s+from\s+[\'"]([^\'"]*/)([^/\'"]+)[\'"]'
            import_match = re.search(import_pattern, updated_content)
            
            if import_match:
                image_filename = import_match.group(2)
                if image_filename in image_to_conversion:
                    # Replace the Image component
                    updated_content = (
                        updated_content[:match.start()] + 
                        image_to_conversion[image_filename] + 
                        updated_content[match.end():]
                    )
                    conversions_made += 1
        
        return updated_content, conversions_made

    def cleanup_unused_imports(self, content):
        """Remove unused static imports after component replacement"""
        lines = content.split('\n')
        new_lines = []
        
        # Find all import statements for blog images
        import_pattern = r'import\s+(\w+)\s+from\s+[\'"][^\'"]*images/blog/[^\'"]*[\'"];'
        
        for line in lines:
            import_match = re.match(import_pattern, line)
            if import_match:
                var_name = import_match.group(1)
                # Check if this variable is still used in the content
                if f'{{{var_name}}}' not in content:
                    # Skip this import line as it's no longer used
                    continue
            new_lines.append(line)
        
        return '\n'.join(new_lines)

    def add_imports_if_needed(self, content):
        """Add component imports if they don't exist"""
        has_single = 'import SingleImage' in content
        has_gallery = 'import ImageGallery' in content
        
        if has_single and has_gallery:
            return content
        
        # Find frontmatter end
        frontmatter_end = content.find('---', content.find('---') + 1) + 3
        
        imports = []
        if not has_single:
            imports.append("import SingleImage from '~/components/ui/SingleImage.astro';")
        if not has_gallery:
            imports.append("import ImageGallery from '~/components/ui/ImageGallery.astro';")
        
        if imports:
            imports_text = '\n\n' + '\n'.join(imports)
            content = content[:frontmatter_end] + imports_text + content[frontmatter_end:]
        
        return content

    def patch_file(self, mdx_file, hugo_source):
        """Main patching logic with auto-detection"""
        mdx_path = Path(mdx_file)
        hugo_path = Path(hugo_source)
        
        if not mdx_path.exists():
            print(f"Error: MDX file not found: {mdx_path}")
            return False
        
        if not hugo_path.exists():
            print(f"Error: Hugo source not found: {hugo_path}")
            return False
        
        # Read both files
        with open(mdx_path, 'r', encoding='utf-8') as f:
            mdx_content = f.read()
        
        with open(hugo_path, 'r', encoding='utf-8') as f:
            hugo_content = f.read()
        
        # Find all Hugo shortcodes in the original
        hugo_pattern = r'\{\{<\s*imgs\s+[^>]+>\}\}'
        hugo_matches = list(re.finditer(hugo_pattern, hugo_content))
        
        if not hugo_matches:
            print("No Hugo shortcodes found in source file")
            return True
        
        print(f"Found {len(hugo_matches)} Hugo shortcodes in source")
        
        # Create conversions
        self.conversions = []
        for i, match in enumerate(hugo_matches):
            shortcode = match.group(0)
            converted = self.convert_shortcode(shortcode)
            self.conversions.append({
                'original': shortcode,
                'converted': converted,
                'index': i + 1
            })
        
        if self.dry_run:
            print(f"\nDRY RUN - Conversions that would be made:")
            for conv in self.conversions:
                print(f"\n{conv['index']}. Original Hugo shortcode:")
                print(f"   {conv['original']}")
                print(f"   Would convert to:")
                print(f"   {conv['converted']}")
            return True
        
        # Detect file structure and choose strategy
        structure = self.detect_file_structure(mdx_content)
        print(f"Detected file structure: {structure}")
        
        patched_content = mdx_content
        conversions_made = 0
        
        if structure['has_image_components'] and structure['has_static_imports']:
            print("Using component replacement strategy...")
            patched_content, conversions_made = self.strategy_component_replacement(mdx_content, hugo_content)
            patched_content = self.cleanup_unused_imports(patched_content)
        elif structure['has_empty_line_pairs']:
            print("Using empty line replacement strategy...")
            patched_content, conversions_made = self.strategy_empty_line_replacement(mdx_content)
        else:
            print("No suitable replacement strategy found, trying empty line replacement as fallback...")
            patched_content, conversions_made = self.strategy_empty_line_replacement(mdx_content)
        
        # Add imports if needed
        patched_content = self.add_imports_if_needed(patched_content)
        
        # Write back
        with open(mdx_path, 'w', encoding='utf-8') as f:
            f.write(patched_content)
        
        print(f"✅ Patched {mdx_path} with {conversions_made} converted components")
        return True

def main():
    parser = argparse.ArgumentParser(
        description='Enhanced patch for existing MDX files with Hugo shortcode conversions',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument('mdx_file', help='Path to the existing MDX file')
    parser.add_argument('hugo_source', help='Path to the original Hugo index.md file')
    parser.add_argument('post_dir', help='Post directory name for assets')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be done')
    
    args = parser.parse_args()
    
    patcher = MDXPatcher(args.post_dir, args.dry_run)
    success = patcher.patch_file(args.mdx_file, args.hugo_source)
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()