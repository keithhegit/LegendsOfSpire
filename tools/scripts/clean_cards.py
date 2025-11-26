import codecs

file_path = r'c:\Users\Og\Desktop\lolsprire\legends-spire-clean\src\data\cards.js'

try:
    with open(file_path, 'rb') as f:
        content_bytes = f.read()
    
    # Decode as utf-8, ignoring errors to strip bad bytes
    content = content_bytes.decode('utf-8', errors='ignore')
    
    # Remove BOM if present
    if content.startswith('\ufeff'):
        content = content[1:]
    
    # Write back as utf-8
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Cleaned cards.js encoding.")
    
except Exception as e:
    print(f"Error: {e}")
