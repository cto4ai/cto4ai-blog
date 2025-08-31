export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  metadata?: {
    source?: 'claude-code' | 'cursor' | 'claude-ai' | 'chatgpt' | 'unknown';
    exportDate?: string;
    exportInfo?: string;
  };
}

/**
 * Detect the source of the transcript based on patterns
 */
function detectSource(text: string): ChatMessage['metadata']['source'] {
  if (text.includes('from Claude Code')) return 'claude-code';
  if (text.includes('from Cursor')) return 'cursor';
  if (text.includes('Human:') && text.includes('Assistant:')) return 'claude-ai';
  if (text.includes('ChatGPT')) return 'chatgpt';
  return 'unknown';
}

/**
 * Extract export information from header
 */
function extractExportInfo(text: string): { exportInfo?: string; exportDate?: string } {
  const exportMatch = text.match(/_Exported on (.+?) at (.+?) from (.+?)_/);
  if (exportMatch) {
    return {
      exportInfo: exportMatch[0].replace(/_/g, ''),
      exportDate: `${exportMatch[1]} ${exportMatch[2]}`,
    };
  }
  return {};
}

/**
 * Parse Claude Code export format
 */
function parseClaudeCodeExport(text: string): ChatMessage[] {
  const messages: ChatMessage[] = [];
  const { exportInfo, exportDate } = extractExportInfo(text);
  
  // Split by separator lines
  const parts = text.split(/\n---\n/);
  
  for (const part of parts) {
    const trimmedPart = part.trim();
    
    // Skip empty parts or header
    if (!trimmedPart || trimmedPart.startsWith('#') || trimmedPart.startsWith('_Exported')) {
      continue;
    }
    
    // Check for user message
    if (trimmedPart.startsWith('**User**')) {
      const content = trimmedPart.replace(/^\*\*User\*\*\n?/, '').trim();
      messages.push({
        role: 'user',
        content,
        metadata: messages.length === 0 ? { source: 'claude-code', exportDate, exportInfo } : { source: 'claude-code' },
      });
    }
    // Check for assistant message
    else if (trimmedPart.startsWith('**Assistant**') || trimmedPart.startsWith('**Claude**')) {
      const content = trimmedPart.replace(/^\*\*(Assistant|Claude)\*\*\n?/, '').trim();
      messages.push({
        role: 'assistant',
        content,
        metadata: { source: 'claude-code' },
      });
    }
  }
  
  return messages;
}

/**
 * Parse Cursor export format
 */
function parseCursorExport(text: string): ChatMessage[] {
  const messages: ChatMessage[] = [];
  const { exportInfo, exportDate } = extractExportInfo(text);
  
  // Remove the header/title and export info line
  let cleanedText = text;
  cleanedText = cleanedText.replace(/^#.*?\n/, ''); // Remove title
  cleanedText = cleanedText.replace(/_Exported on.*?_\n?/, ''); // Remove export info
  
  // Split by message markers (looking for **User** or **Cursor**//**Assistant** at the start of a line)
  const messageParts: string[] = [];
  const lines = cleanedText.split('\n');
  let currentMessage = '';
  let currentRole: 'user' | 'assistant' | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this line starts a new message
    if (line.startsWith('**User**')) {
      // Save previous message if exists
      if (currentRole && currentMessage) {
        messageParts.push(`**${currentRole === 'user' ? 'User' : 'Cursor'}**\n${currentMessage}`);
      }
      currentRole = 'user';
      currentMessage = '';
    } else if (line.startsWith('**Cursor**') || line.startsWith('**Assistant**')) {
      // Save previous message if exists
      if (currentRole && currentMessage) {
        messageParts.push(`**${currentRole === 'user' ? 'User' : 'Cursor'}**\n${currentMessage}`);
      }
      currentRole = 'assistant';
      currentMessage = '';
    } else if (line === '---' && currentRole) {
      // This is a separator, save current message and reset
      if (currentMessage) {
        messageParts.push(`**${currentRole === 'user' ? 'User' : 'Cursor'}**\n${currentMessage}`);
      }
      currentRole = null;
      currentMessage = '';
    } else if (currentRole) {
      // Add line to current message
      currentMessage += (currentMessage ? '\n' : '') + line;
    }
  }
  
  // Don't forget the last message
  if (currentRole && currentMessage) {
    messageParts.push(`**${currentRole === 'user' ? 'User' : 'Cursor'}**\n${currentMessage}`);
  }
  
  // Now process each message part
  for (const part of messageParts) {
    const trimmedPart = part.trim();
    
    if (trimmedPart.startsWith('**User**')) {
      const content = trimmedPart.replace(/^\*\*User\*\*\n?/, '').trim();
      messages.push({
        role: 'user',
        content,
        metadata: messages.length === 0 ? { source: 'cursor', exportDate, exportInfo } : { source: 'cursor' },
      });
    } else if (trimmedPart.startsWith('**Cursor**') || trimmedPart.startsWith('**Assistant**')) {
      const content = trimmedPart.replace(/^\*\*(Cursor|Assistant)\*\*\n?/, '').trim();
      messages.push({
        role: 'assistant',
        content,
        metadata: { source: 'cursor' },
      });
    }
  }
  
  return messages;
}

/**
 * Parse Claude.ai format
 */
function parseClaudeAI(text: string): ChatMessage[] {
  const messages: ChatMessage[] = [];
  
  // Split by role markers
  const parts = text.split(/\n(?=Human:|Assistant:)/);
  
  for (const part of parts) {
    const trimmedPart = part.trim();
    
    if (trimmedPart.startsWith('Human:')) {
      const content = trimmedPart.replace(/^Human:\s*/, '').trim();
      messages.push({
        role: 'user',
        content,
        metadata: messages.length === 0 ? { source: 'claude-ai' } : undefined,
      });
    } else if (trimmedPart.startsWith('Assistant:')) {
      const content = trimmedPart.replace(/^Assistant:\s*/, '').trim();
      messages.push({
        role: 'assistant',
        content,
        metadata: { source: 'claude-ai' },
      });
    }
  }
  
  return messages;
}

/**
 * Parse ChatGPT format
 */
function parseChatGPT(text: string): ChatMessage[] {
  const messages: ChatMessage[] = [];
  
  // Try to parse various ChatGPT formats
  // Format 1: "User:" and "ChatGPT:" or "Assistant:"
  const parts = text.split(/\n(?=User:|ChatGPT:|Assistant:)/);
  
  for (const part of parts) {
    const trimmedPart = part.trim();
    
    if (trimmedPart.startsWith('User:')) {
      const content = trimmedPart.replace(/^User:\s*/, '').trim();
      messages.push({
        role: 'user',
        content,
        metadata: messages.length === 0 ? { source: 'chatgpt' } : undefined,
      });
    } else if (trimmedPart.startsWith('ChatGPT:') || trimmedPart.startsWith('Assistant:')) {
      const content = trimmedPart.replace(/^(ChatGPT|Assistant):\s*/, '').trim();
      messages.push({
        role: 'assistant',
        content,
        metadata: { source: 'chatgpt' },
      });
    }
  }
  
  // If no messages found, try another format
  if (messages.length === 0) {
    // Format 2: Numbered format like "1. User: ..." 
    const numberedParts = text.split(/\n\d+\.\s+/);
    for (const part of numberedParts) {
      const trimmedPart = part.trim();
      if (trimmedPart.startsWith('User:')) {
        const content = trimmedPart.replace(/^User:\s*/, '').trim();
        messages.push({
          role: 'user',
          content,
          metadata: messages.length === 0 ? { source: 'chatgpt' } : undefined,
        });
      } else if (trimmedPart.includes('ChatGPT:') || trimmedPart.includes('Assistant:')) {
        const content = trimmedPart.replace(/^(ChatGPT|Assistant):\s*/, '').trim();
        messages.push({
          role: 'assistant',
          content,
          metadata: { source: 'chatgpt' },
        });
      }
    }
  }
  
  return messages;
}

/**
 * Generic fallback parser for unknown formats
 */
function parseGeneric(text: string): ChatMessage[] {
  const messages: ChatMessage[] = [];
  
  // Try to split by common patterns
  const lines = text.split('\n');
  let currentMessage: Partial<ChatMessage> | null = null;
  let contentBuffer: string[] = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check for role indicators
    if (trimmedLine.match(/^(User|Human|You):/i)) {
      if (currentMessage && contentBuffer.length > 0) {
        currentMessage.content = contentBuffer.join('\n').trim();
        messages.push(currentMessage as ChatMessage);
      }
      currentMessage = { role: 'user', metadata: messages.length === 0 ? { source: 'unknown' } : undefined };
      contentBuffer = [trimmedLine.replace(/^[^:]+:\s*/, '')];
    } else if (trimmedLine.match(/^(Assistant|AI|Claude|ChatGPT|Bot):/i)) {
      if (currentMessage && contentBuffer.length > 0) {
        currentMessage.content = contentBuffer.join('\n').trim();
        messages.push(currentMessage as ChatMessage);
      }
      currentMessage = { role: 'assistant', metadata: { source: 'unknown' } };
      contentBuffer = [trimmedLine.replace(/^[^:]+:\s*/, '')];
    } else if (trimmedLine && currentMessage) {
      contentBuffer.push(trimmedLine);
    }
  }
  
  // Add the last message
  if (currentMessage && contentBuffer.length > 0) {
    currentMessage.content = contentBuffer.join('\n').trim();
    messages.push(currentMessage as ChatMessage);
  }
  
  return messages;
}

/**
 * Auto-detect and parse transcript
 */
export function autoDetectAndParse(text: string): ChatMessage[] {
  const source = detectSource(text);
  
  switch (source) {
    case 'claude-code':
      return parseClaudeCodeExport(text);
    case 'cursor':
      return parseCursorExport(text);
    case 'claude-ai':
      return parseClaudeAI(text);
    case 'chatgpt':
      return parseChatGPT(text);
    default:
      // Try each parser and return the one with results
      let messages = parseClaudeCodeExport(text);
      if (messages.length > 0) return messages;
      
      messages = parseCursorExport(text);
      if (messages.length > 0) return messages;
      
      messages = parseClaudeAI(text);
      if (messages.length > 0) return messages;
      
      messages = parseChatGPT(text);
      if (messages.length > 0) return messages;
      
      // Fallback to generic parser
      return parseGeneric(text);
  }
}

/**
 * Main export function - parse any transcript format
 */
export function parseTranscript(text: string): ChatMessage[] {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  return autoDetectAndParse(text);
}

// Export individual parsers for specific use cases
export {
  parseClaudeCodeExport,
  parseCursorExport,
  parseClaudeAI,
  parseChatGPT,
  parseGeneric,
};