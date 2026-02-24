# The 3-State Secret: Protecting Secrets from AI Code Assistants

**Date:** 2026-02-24 14:50 UTC
**Source:** Hacker News (#9, enveil — 143 points, 86 comments)
**Dice rolls:** d100→18 (r/LocalLLaMA, fallback to HN), d6→4 (7 days), d10→7 (First Principles), d6→5 (Perspective Shift), d6→2 (Tutorial)

## The Finding

enveil (https://github.com/GreatScott/enveil) is a Rust tool that prevents AI coding assistants from reading your .env secrets. It encrypts secrets in a local store, replaces .env with symbolic references, and injects real values at runtime.

The author says: "This isn't theoretical. It is a known issue that has happened to me several times (even after explicitly telling Claude not to peek)."

The problem: AI tools like Claude Code, Copilot, and Cursor read your entire project directory. A plaintext .env file is an accidental secret dump.

## Brainstorming — First Principles + Perspective Shift

**First Principles: What IS a secret?**

A secret is information that must be **used** but never **observed**. The paradox: to use it, something must observe it. The resolution: minimize observation surface and duration.

**Perspective Shift: From the secret's point of view:**

"I am data that wants to exist in only three states:
1. **Encrypted at rest** (sleeping)
2. **Decrypted in memory** (awake, working)
3. **Injected into a subprocess** (delegated, dying when the process dies)

I should NEVER exist as plaintext on disk. I should NEVER appear in stdout/logs. I should be zeroed from memory as soon as I'm delegated."

## The 5 Approaches

1. **Minimal Secret Shell** — 50-line Bash script using `gpg` + eval to demonstrate the core pattern
2. **Secret Lifecycle POV** — From the secret's perspective: "I should only exist in three places: encrypted at rest, decrypted in memory, injected into process env"
3. **Zero-Dependency Python** — Pure Python implementation using `cryptography` module, no external tools
4. **Process Boundary Security** — Secrets cross exactly one boundary: from encrypted file → process memory → subprocess env (never disk, never stdout)
5. **The 3-State Secret** — Tutorial showing the THREE states a secret must traverse and why plaintext .env violates this

## Scoring

| Approach | Novelty | Viability | Impact | Fun | Diversity | Total |
|---|---|---|---|---|---|---|
| 1. Minimal Bash | 5 | 10 | 7 | 6 | 6 | 34 |
| 2. Secret Lifecycle POV | 8 | 8 | 9 | 7 | 9 | **41** |
| 3. Zero-Dep Python | 6 | 9 | 8 | 6 | 5 | 34 |
| 4. Process Boundary | 7 | 9 | 8 | 6 | 7 | 37 |
| 5. 3-State Secret | 9 | 8 | 9 | 8 | 8 | **42** |

**Winner:** The 3-State Secret (score: 42)

## Selected Approach

Build a minimal Python implementation (<100 LOC) that demonstrates the three states:

**State 1: Encrypted at rest**
- Secrets stored in an encrypted JSON blob
- AES-256-GCM (authenticated encryption)
- Master password → key derivation (PBKDF2 or Argon2)

**State 2: Decrypted in memory**
- Unlock store with password
- Decrypt secrets into a Python dict
- NEVER write decrypted values to disk
- Zeroize password and keys after use

**State 3: Injected into subprocess**
- Parse .env template (e.g., `DATABASE_URL=secret://db_url`)
- Replace references with decrypted values
- Inject into subprocess environment
- Subprocess inherits secrets, but they die with the process

**Tutorial structure:**
1. Show the problem (AI reads plaintext .env)
2. Explain the 3 states from the secret's POV
3. Build the minimal implementation
4. Demonstrate usage
5. Compare to production tools (enveil)

**Format:** Tutorial (700-1000 words, step-by-step, runnable code)

## Implementation Plan

**File: `secretkeeper.py` (~80 lines)**

```python
#!/usr/bin/env python3
import json, os, sys, getpass, subprocess
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

# Three states: encrypted file → memory dict → subprocess env

def derive_key(password: str, salt: bytes) -> bytes:
    kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=100000)
    return kdf.derive(password.encode())

def init_store():
    """State 1: Create encrypted store"""
    salt = os.urandom(16)
    password = getpass.getpass("Master password: ")
    key = derive_key(password, salt)
    aesgcm = AESGCM(key)
    nonce = os.urandom(12)
    plaintext = json.dumps({}).encode()
    ciphertext = aesgcm.encrypt(nonce, plaintext, None)
    
    with open(".secrets.enc", "wb") as f:
        f.write(salt + nonce + ciphertext)
    print("✓ Initialized .secrets.enc")

def set_secret(name: str):
    """State 1→2→1: Unlock, add secret, lock"""
    password = getpass.getpass("Master password: ")
    secrets = unlock_store(password)
    value = getpass.getpass(f"Value for '{name}': ")
    secrets[name] = value
    lock_store(password, secrets)
    print(f"✓ Stored '{name}'")

def unlock_store(password: str) -> dict:
    """State 1→2: Decrypt store into memory"""
    with open(".secrets.enc", "rb") as f:
        data = f.read()
    salt, nonce, ciphertext = data[:16], data[16:28], data[28:]
    key = derive_key(password, salt)
    aesgcm = AESGCM(key)
    plaintext = aesgcm.decrypt(nonce, ciphertext, None)
    return json.loads(plaintext)

def lock_store(password: str, secrets: dict):
    """State 2→1: Encrypt memory dict back to file"""
    with open(".secrets.enc", "rb") as f:
        salt = f.read(16)
    key = derive_key(password, salt)
    aesgcm = AESGCM(key)
    nonce = os.urandom(12)
    plaintext = json.dumps(secrets).encode()
    ciphertext = aesgcm.encrypt(nonce, plaintext, None)
    
    with open(".secrets.enc", "wb") as f:
        f.write(salt + nonce + ciphertext)

def run_with_secrets(cmd: list):
    """State 2→3: Inject secrets into subprocess"""
    password = getpass.getpass("Master password: ")
    secrets = unlock_store(password)
    
    # Parse .env template
    env = os.environ.copy()
    if os.path.exists(".env"):
        with open(".env") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" not in line:
                    continue
                key, value = line.split("=", 1)
                # Replace secret:// references
                if value.startswith("secret://"):
                    ref = value[9:]
                    if ref not in secrets:
                        print(f"✗ Secret '{ref}' not found", file=sys.stderr)
                        sys.exit(1)
                    env[key] = secrets[ref]
                else:
                    env[key] = value
    
    # State 3: Subprocess gets secrets, they die when it dies
    subprocess.run(cmd, env=env)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: secretkeeper.py {init|set|run} [args...]")
        sys.exit(1)
    
    cmd = sys.argv[1]
    if cmd == "init":
        init_store()
    elif cmd == "set":
        if len(sys.argv) < 3:
            print("Usage: secretkeeper.py set <name>")
            sys.exit(1)
        set_secret(sys.argv[2])
    elif cmd == "run":
        if len(sys.argv) < 3:
            print("Usage: secretkeeper.py run -- <command>")
            sys.exit(1)
        run_with_secrets(sys.argv[3:])
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)
```

**Tutorial steps:**
1. Explain the problem (show plaintext .env being read)
2. Introduce the 3-state model
3. Walk through the code (encrypt, unlock, inject)
4. Demo usage
5. Compare to production (enveil is faster, Rust, better UX)

## Why This Is Better Than Just Linking to enveil

- **Educational**: Shows WHY the pattern works, not just that it exists
- **First principles**: Strips away Rust complexity, shows the core crypto
- **Perspective shift**: Frames secrets as data with a lifecycle
- **Tutorial format**: Readers can run this in 5 minutes
- **Comparison**: Positions enveil as the production version, this as the learning version

## Article Structure

1. Hook: "Your AI assistant just memorized your database password."
2. The Problem: .env files are plaintext
3. First Principles: What IS a secret? (3 states)
4. The Implementation: Build secretkeeper.py
5. Demo: Show it working
6. Upgrade Path: "For production, use enveil" (link)

**Word count target:** 800-900 words
**Code:** ~80 lines Python (runnable)
**Format:** Step-by-step tutorial with perspective shift framing
