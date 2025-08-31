#!/usr/bin/env python3
"""
Convert AI chat transcripts from various sources to TypeScript format for use in blog posts.

Supports multiple formats:
- Claude Code (from /export command or copy)
- Cursor exports
- Claude.ai conversations
- ChatGPT exports
- More to be added...
"""

import re
import sys
import argparse
from pathlib import Path
from typing import List, Tuple, Optional
from abc import ABC, abstractmethod


class TranscriptConverter(ABC):
    """Base class for transcript converters."""
    
    @abstractmethod
    def detect(self, content: str) -> bool:
        """Check if this converter can handle the given content."""
        pass
    
    @abstractmethod
    def convert(self, content: str) -> str:
        """Convert the content to markdown format suitable for TypeScript."""
        pass
    
    @abstractmethod
    def get_source_name(self) -> str:
        """Get the name of the source (e.g., 'Claude Code', 'Cursor')."""
        pass


class ClaudeCodeConverter(TranscriptConverter):
    """Converter for Claude Code transcripts."""
    
    def detect(self, content: str) -> bool:
        """Detect Claude Code format by looking for specific patterns."""
        indicators = [
            "Welcome to Claude Code",
            "⏺",  # Claude Code's special bullet character
            "/export",
            "from Claude Code",
            "Claude Code session"
        ]
        return any(indicator in content for indicator in indicators)
    
    def convert(self, content: str) -> str:
        """Convert Claude Code transcript to clean markdown."""
        lines = content.split('\n')
        output = []
        
        # Clean up the welcome message if present
        if "Welcome to Claude Code" in content[:200]:
            # Skip the welcome box
            for i, line in enumerate(lines):
                if "What's new:" in line or (i > 10 and '>' in line):
                    lines = lines[i:]
                    break
        
        in_code_block = False
        code_block_indent = 0
        
        for line in lines:
            # Remove line numbers if present (format: "   123→content")
            line = re.sub(r'^\s*\d+→', '', line)
            
            # Handle Claude Code's special formatting
            line = line.replace('⏺', '**Claude:**')
            line = re.sub(r'^\s*⎿\s*', '  ', line)  # Sub-bullet indicator
            
            # Clean up box drawing characters
            if '╭' in line or '│' in line or '╰' in line or '─' in line:
                # This is likely a plan or output box
                if 'Plan:' in line or 'User rejected' in line:
                    # Extract the content from the box
                    continue  # Skip box drawing lines
                elif '│' in line:
                    # Extract content from inside the box
                    content = re.sub(r'^.*│\s*', '', line)
                    content = re.sub(r'\s*│.*$', '', content)
                    if content.strip():
                        output.append(content)
                continue
            
            # Handle user prompts (lines starting with >)
            if line.strip().startswith('>'):
                if line.strip() == '>':
                    continue
                output.append('\n---\n')
                output.append('**User**\n')
                # Remove the > and clean up
                user_content = line.strip()[1:].strip()
                if user_content:
                    output.append(user_content + '\n')
                continue
            
            # Handle code blocks
            if '```' in line:
                if not in_code_block:
                    in_code_block = True
                    code_block_indent = len(line) - len(line.lstrip())
                else:
                    in_code_block = False
                    code_block_indent = 0
            
            # Clean up tool usage indicators
            line = re.sub(r'^\s*Read\([^)]+\)$', '[Reading file]', line)
            line = re.sub(r'^\s*Write\([^)]+\)$', '[Writing file]', line)
            line = re.sub(r'^\s*Bash\([^)]+\)$', '[Running command]', line)
            line = re.sub(r'^\s*Search\([^)]+\)$', '[Searching]', line)
            line = re.sub(r'^\s*Task\([^)]+\)$', '[Running task]', line)
            
            # Escape backticks for TypeScript template literal
            if not in_code_block:
                line = line.replace('`', '\\`')
            else:
                # In code blocks, we need to escape the backticks differently
                if '```' in line:
                    line = line.replace('```', '\\`\\`\\`')
            
            output.append(line + '\n')
        
        return ''.join(output).strip()
    
    def get_source_name(self) -> str:
        return "Claude Code"


class CursorConverter(TranscriptConverter):
    """Converter for Cursor transcripts."""
    
    def detect(self, content: str) -> bool:
        """Detect Cursor format."""
        indicators = [
            "from Cursor",
            "**Cursor**",
            "_Exported on",
            "Cursor (1."  # Version number pattern
        ]
        return any(indicator in content for indicator in indicators)
    
    def convert(self, content: str) -> str:
        """Convert Cursor transcript to clean markdown."""
        # Cursor format is already pretty clean
        lines = content.split('\n')
        output = []
        
        for line in lines:
            # Remove line numbers if present
            line = re.sub(r'^\s*\d+→', '', line)
            
            # Escape backticks for TypeScript template literal
            if '```' in line:
                line = line.replace('```', '\\`\\`\\`')
            elif '`' in line:
                line = line.replace('`', '\\`')
            
            output.append(line + '\n')
        
        return ''.join(output).strip()
    
    def get_source_name(self) -> str:
        return "Cursor"


class ClaudeAIConverter(TranscriptConverter):
    """Converter for Claude.ai web interface transcripts."""
    
    def detect(self, content: str) -> bool:
        """Detect Claude.ai format."""
        indicators = [
            "Human:",
            "Assistant:",
            "Claude 3",
            "Anthropic"
        ]
        return ("Human:" in content and "Assistant:" in content)
    
    def convert(self, content: str) -> str:
        """Convert Claude.ai transcript to markdown."""
        content = content.replace("Human:", "\n---\n\n**User**\n\n")
        content = content.replace("Assistant:", "\n---\n\n**Claude**\n\n")
        
        # Escape backticks
        content = content.replace('`', '\\`')
        
        return content.strip()
    
    def get_source_name(self) -> str:
        return "Claude.ai"


class ChatGPTConverter(TranscriptConverter):
    """Converter for ChatGPT transcripts."""
    
    def detect(self, content: str) -> bool:
        """Detect ChatGPT format."""
        indicators = [
            "ChatGPT",
            "GPT-4",
            "GPT-3.5",
            "OpenAI"
        ]
        # Look for common ChatGPT patterns
        return any(indicator in content for indicator in indicators)
    
    def convert(self, content: str) -> str:
        """Convert ChatGPT transcript to markdown."""
        # ChatGPT exports vary, but often use "User" and "ChatGPT" or similar
        content = re.sub(r'^User\s*$', '\n---\n\n**User**\n', content, flags=re.MULTILINE)
        content = re.sub(r'^ChatGPT\s*$', '\n---\n\n**ChatGPT**\n', content, flags=re.MULTILINE)
        
        # Escape backticks
        content = content.replace('`', '\\`')
        
        return content.strip()
    
    def get_source_name(self) -> str:
        return "ChatGPT"


class TranscriptProcessor:
    """Main processor that manages all converters."""
    
    def __init__(self):
        self.converters = [
            ClaudeCodeConverter(),
            CursorConverter(),
            ClaudeAIConverter(),
            ChatGPTConverter(),
        ]
    
    def process(self, input_file: Path, output_file: Path, export_name: str = None) -> None:
        """Process a transcript file and convert it to TypeScript format."""
        
        # Read input file
        try:
            with open(input_file, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"Error reading {input_file}: {e}")
            sys.exit(1)
        
        # Detect format and convert
        converter = None
        for conv in self.converters:
            if conv.detect(content):
                converter = conv
                print(f"Detected format: {conv.get_source_name()}")
                break
        
        if not converter:
            print("Warning: Could not detect format, using generic conversion")
            # Fall back to basic escaping
            converted = content.replace('`', '\\`')
            source = "Unknown"
        else:
            converted = converter.convert(content)
            source = converter.get_source_name()
        
        # Generate TypeScript export
        if not export_name:
            # Generate from filename
            export_name = input_file.stem.replace('-', '_').replace(' ', '_')
            export_name = re.sub(r'[^a-zA-Z0-9_]', '', export_name)
            export_name = f"{export_name}Transcript"
        
        typescript_content = f"""export const {export_name} = `# {source} Conversation
_{source} session_

---

{converted}`;"""
        
        # Write output file
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(typescript_content)
            print(f"Successfully converted to {output_file}")
            print(f"Export name: {export_name}")
        except Exception as e:
            print(f"Error writing {output_file}: {e}")
            sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="Convert AI chat transcripts to TypeScript format for blog posts"
    )
    parser.add_argument(
        "input",
        type=Path,
        help="Input transcript file"
    )
    parser.add_argument(
        "output",
        type=Path,
        help="Output TypeScript file"
    )
    parser.add_argument(
        "--export-name",
        help="Name for the TypeScript export (default: generated from filename)"
    )
    parser.add_argument(
        "--format",
        choices=["claude-code", "cursor", "claude-ai", "chatgpt", "auto"],
        default="auto",
        help="Force a specific format (default: auto-detect)"
    )
    
    args = parser.parse_args()
    
    processor = TranscriptProcessor()
    processor.process(args.input, args.output, args.export_name)


if __name__ == "__main__":
    main()