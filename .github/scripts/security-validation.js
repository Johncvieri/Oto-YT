/**
 * Security Validation Script
 * 
 * This script validates that no sensitive data is being processed or stored inappropriately
 * It runs as part of the backup and sync processes to ensure data security
 */

const fs = require('fs');

// List of sensitive patterns to detect
const SENSITIVE_PATTERNS = [
  'key',
  'token',
  'secret',
  'password',
  'credential',
  'auth',
  'api',
  'session',
  'cookie',
  'email',
  'phone',
  'credit',
  'card',
  'ssn',
  'id_token',
  'access_token',
  'refresh_token'
];

// List of sensitive file extensions
const SENSITIVE_EXTENSIONS = [
  '.env',
  '.pem',
  '.p12',
  '.key',
  '.crt',
  '.cert',
  '.config',
  '.cfg'
];

/**
 * Check if a value contains sensitive information
 */
function containsSensitiveData(value, key = '') {
  if (!value || typeof value !== 'string') {
    return false;
  }

  const lowerKey = key.toLowerCase();
  const lowerValue = value.toLowerCase();

  // Check if key matches sensitive patterns
  for (const pattern of SENSITIVE_PATTERNS) {
    if (lowerKey.includes(pattern)) {
      return true;
    }
  }

  // Check if value matches sensitive patterns and has content that looks like sensitive data
  for (const pattern of SENSITIVE_PATTERNS) {
    if (lowerValue.includes(pattern)) {
      // Additional check: if it's a key/token pattern and has hex/alphanumeric content
      if (pattern === 'key' || pattern === 'token' || pattern === 'secret') {
        if (/[a-zA-Z0-9_\-]{20,}/.test(value)) { // Likely a real key/token
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Redact sensitive information from an object
 */
function redactSensitiveData(obj) {
  if (!obj) return obj;

  if (typeof obj === 'string') {
    // If the entire string is sensitive, redact it
    if (isSensitiveString(obj)) {
      return '[REDACTED]';
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => redactSensitiveData(item));
  }

  if (typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (containsSensitiveData(value, key)) {
        result[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        result[key] = redactSensitiveData(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  return obj;
}

/**
 * Check if a string appears to be sensitive (helper function)
 */
function isSensitiveString(str) {
  // Check for common sensitive patterns
  if (typeof str !== 'string') return false;

  // JWT token pattern
  if (/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(str)) {
    return true;
  }

  // API key pattern (long alphanumeric with specific formats)
  if (str.length > 30 && /[A-Za-z0-9]{20,}/.test(str) && 
      (str.includes('key') || str.includes('token') || str.includes('secret'))) {
    return true;
  }

  // Email pattern (would only be in non-proper backup files)
  if (str.includes('@') && str.includes('.')) {
    return true;
  }

  return false;
}

/**
 * Validate a file for sensitive content
 */
function validateFileForSecurity(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }

  const ext = filePath.split('.').pop().toLowerCase();
  if (SENSITIVE_EXTENSIONS.includes(ext)) {
    throw new Error(`Potentially sensitive file extension detected: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  
  // Validate JSON files for sensitive content
  if (ext === 'json') {
    try {
      const obj = JSON.parse(content);
      const redacted = redactSensitiveData(obj);
      
      // If the redacted version is different, sensitive data was found
      if (JSON.stringify(obj) !== JSON.stringify(redacted)) {
        console.warn(`⚠️ Sensitive data detected and redacted in ${filePath}`);
        return { secure: false, redacted: true, data: redacted };
      }
    } catch (error) {
      // If it's not valid JSON, just do basic string checks
      if (isSensitiveString(content)) {
        throw new Error(`Sensitive string pattern detected in ${filePath}`);
      }
    }
  }

  // Check for sensitive patterns in file content as string
  const lowerContent = content.toLowerCase();
  for (const pattern of SENSITIVE_PATTERNS) {
    if (lowerContent.includes(pattern)) {
      // Check if it's just a reference to the concept (not actual data)
      if (lowerContent.includes('redacted') || lowerContent.includes('[REDACTED]')) {
        continue; // This is OK - it's already been redacted
      }
      
      // If it contains the pattern but looks like real data, flag it
      if (/[A-Za-z0-9_\-]{20,}/.test(content)) {
        throw new Error(`Sensitive data pattern detected in ${filePath}`);
      }
    }
  }

  return { secure: true, redacted: false };
}

/**
 * Security validation for backup data
 */
function validateBackupData(backupData, tableName) {
  if (!backupData) {
    throw new Error('Backup data is null or undefined');
  }

  // For certain tables, we might want to be extra careful
  if (tableName === 'system_config') {
    // Check for sensitive configuration values
    if (Array.isArray(backupData)) {
      for (const item of backupData) {
        if (item.config_key && item.config_value) {
          if (containsSensitiveData(item.config_value, item.config_key)) {
            throw new Error(`Sensitive configuration detected in system_config: ${item.config_key}`);
          }
        }
      }
    }
  }

  // Apply redaction to the data
  const securedData = redactSensitiveData(backupData);
  return securedData;
}

module.exports = {
  containsSensitiveData,
  redactSensitiveData,
  validateFileForSecurity,
  validateBackupData,
  SENSITIVE_PATTERNS,
  SENSITIVE_EXTENSIONS
};