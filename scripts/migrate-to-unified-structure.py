#!/usr/bin/env python3
"""
Phase 3: Migrate content to unified structure
Moves content from type-based directories to unified /src/data/content/ structure
"""

import os
import json
import shutil
import re
from pathlib import Path
from datetime import datetime
import argparse

class ContentMigrator:
    def __init__(self, project_root, dry_run=False, test_mode=False):
        self.project_root = Path(project_root)
        self.dry_run = dry_run
        self.test_mode = test_mode
        self.migration_map = []
        self.errors = []
        
        # Define paths
        self.old_content_dirs = {
            'posts': self.project_root / 'src' / 'data' / 'posts',
            'micro': self.project_root / 'src' / 'data' / 'micro',
            'elsewhere': self.project_root / 'src' / 'data' / 'elsewhere',
            'quote': self.project_root / 'src' / 'data' / 'quote'
        }
        
        self.new_content_dir = self.project_root / 'src' / 'data' / 'content'
        self.old_images_dir = self.project_root / 'src' / 'assets' / 'images' / 'blog'
        self.new_images_dir = self.project_root / 'src' / 'assets' / 'images' / 'content'
        
        # Migration report path
        self.report_dir = self.project_root / 'docs' / 'issues'
        
    def extract_slug_from_file(self, file_path):
        """Extract slug from MDX filename"""
        # Remove .mdx extension and use filename as slug
        return file_path.stem
    
    def get_post_images_dir(self, slug):
        """Get the images directory for a post"""
        # Check multiple possible image locations
        possible_dirs = [
            self.old_images_dir / slug,
            self.project_root / 'src' / 'assets' / 'images' / 'micro' / slug,
            self.project_root / 'src' / 'assets' / 'images' / 'elsewhere' / slug,
        ]
        
        for img_dir in possible_dirs:
            if img_dir.exists() and img_dir.is_dir():
                return img_dir
        return None
    
    def migrate_content_file(self, old_path, content_type):
        """Migrate a single content file"""
        slug = self.extract_slug_from_file(old_path)
        new_content_path = self.new_content_dir / slug / 'index.mdx'
        
        migration_entry = {
            'content_type': content_type,
            'slug': slug,
            'old_content_path': str(old_path.relative_to(self.project_root)),
            'new_content_path': str(new_content_path.relative_to(self.project_root)),
            'images_migrated': False,
            'status': 'pending'
        }
        
        try:
            # Create new directory
            if not self.dry_run:
                new_content_path.parent.mkdir(parents=True, exist_ok=True)
                
                # Copy content file
                shutil.copy2(old_path, new_content_path)
                print(f"  ✅ Migrated content: {slug}")
            else:
                print(f"  [DRY RUN] Would migrate: {slug}")
            
            # Check for associated images
            old_images_dir = self.get_post_images_dir(slug)
            if old_images_dir:
                new_images_path = self.new_images_dir / slug
                migration_entry['old_images_path'] = str(old_images_dir.relative_to(self.project_root))
                migration_entry['new_images_path'] = str(new_images_path.relative_to(self.project_root))
                
                if not self.dry_run:
                    # Copy images directory
                    if old_images_dir.exists():
                        shutil.copytree(old_images_dir, new_images_path, dirs_exist_ok=True)
                        migration_entry['images_migrated'] = True
                        print(f"    📷 Migrated images: {slug}")
                else:
                    print(f"    [DRY RUN] Would migrate images: {slug}")
                    migration_entry['images_migrated'] = True
            
            migration_entry['status'] = 'success'
            
        except Exception as e:
            migration_entry['status'] = 'error'
            migration_entry['error'] = str(e)
            self.errors.append(f"{slug}: {e}")
            print(f"  ❌ Error migrating {slug}: {e}")
        
        self.migration_map.append(migration_entry)
        return migration_entry['status'] == 'success'
    
    def migrate_content_type(self, content_type, limit=None):
        """Migrate all content of a specific type"""
        content_dir = self.old_content_dirs[content_type]
        
        if not content_dir.exists():
            print(f"⚠️  Directory not found: {content_dir}")
            return 0
        
        mdx_files = sorted(content_dir.glob('*.mdx'))
        
        if limit:
            mdx_files = mdx_files[:limit]
        
        print(f"\n📁 Migrating {content_type} ({len(mdx_files)} files)")
        print("-" * 50)
        
        success_count = 0
        for mdx_file in mdx_files:
            if self.migrate_content_file(mdx_file, content_type):
                success_count += 1
        
        return success_count
    
    def run_migration(self):
        """Run the full migration"""
        print("=" * 60)
        print(f"Content Migration to Unified Structure")
        print(f"Mode: {'DRY RUN' if self.dry_run else 'LIVE'}")
        print(f"Test Mode: {'YES (3 files per type)' if self.test_mode else 'NO'}")
        print("=" * 60)
        
        total_success = 0
        limit = 3 if self.test_mode else None
        
        # Migrate each content type
        for content_type in self.old_content_dirs.keys():
            count = self.migrate_content_type(content_type, limit)
            total_success += count
        
        # Save migration map
        self.save_migration_map()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"Migration {'Test' if self.test_mode else 'Complete'}")
        print(f"Successfully migrated: {total_success} files")
        if self.errors:
            print(f"Errors: {len(self.errors)}")
            for error in self.errors[:5]:  # Show first 5 errors
                print(f"  - {error}")
        print("=" * 60)
        
        return total_success
    
    def save_migration_map(self):
        """Save the migration map for rollback"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        map_file = self.report_dir / f'migration_map_{timestamp}.json'
        
        self.report_dir.mkdir(parents=True, exist_ok=True)
        
        with open(map_file, 'w') as f:
            json.dump({
                'timestamp': timestamp,
                'dry_run': self.dry_run,
                'test_mode': self.test_mode,
                'migrations': self.migration_map,
                'errors': self.errors
            }, f, indent=2)
        
        print(f"\n📄 Migration map saved: {map_file}")
        return map_file
    
    def rollback(self, map_file_path):
        """Rollback a migration using the map file"""
        print("=" * 60)
        print("Rollback Migration")
        print("=" * 60)
        
        with open(map_file_path, 'r') as f:
            migration_data = json.load(f)
        
        rollback_count = 0
        for entry in migration_data['migrations']:
            if entry['status'] == 'success':
                try:
                    # Remove new content file
                    new_content = self.project_root / entry['new_content_path']
                    if new_content.exists():
                        new_content.unlink()
                        # Remove directory if empty
                        if not any(new_content.parent.iterdir()):
                            new_content.parent.rmdir()
                        print(f"  ✅ Rolled back content: {entry['slug']}")
                    
                    # Remove new images directory
                    if entry.get('images_migrated'):
                        new_images = self.project_root / entry['new_images_path']
                        if new_images.exists():
                            shutil.rmtree(new_images)
                            print(f"    📷 Rolled back images: {entry['slug']}")
                    
                    rollback_count += 1
                    
                except Exception as e:
                    print(f"  ❌ Error rolling back {entry['slug']}: {e}")
        
        print(f"\n✅ Rolled back {rollback_count} migrations")

def main():
    parser = argparse.ArgumentParser(description='Migrate content to unified structure')
    parser.add_argument('--dry-run', action='store_true', help='Perform dry run without making changes')
    parser.add_argument('--test', action='store_true', help='Test mode - migrate only 3 files per type')
    parser.add_argument('--rollback', type=str, help='Rollback using specified migration map file')
    parser.add_argument('--root', type=str, 
                       default='/Users/jackivers/Projects/cto4ai-blog',
                       help='Project root directory')
    
    args = parser.parse_args()
    
    migrator = ContentMigrator(args.root, dry_run=args.dry_run, test_mode=args.test)
    
    if args.rollback:
        # Perform rollback
        map_file = Path(args.rollback)
        if not map_file.exists():
            print(f"❌ Migration map file not found: {map_file}")
            return 1
        migrator.rollback(map_file)
    else:
        # Perform migration
        migrator.run_migration()
    
    return 0

if __name__ == "__main__":
    exit(main())