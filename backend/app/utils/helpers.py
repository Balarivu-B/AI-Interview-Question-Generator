import hashlib
import os
import uuid
from datetime import datetime, timedelta
import jwt
from typing import Dict, Any, List
from app.config.settings import settings

# ----------------- Hashing Utilities -----------------

def hash_password(password: str) -> str:
    """Hash password using PBKDF2-HMAC-SHA256 (standard library)."""
    salt = os.urandom(16)
    iterations = 100000
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, iterations)
    # Store iterations, salt, and key in hex format
    return f"{iterations}:{salt.hex()}:{key.hex()}"

def verify_password(stored_hash: str, password: str) -> bool:
    """Verify stored password hash against the candidate password."""
    try:
        parts = stored_hash.split(":")
        if len(parts) != 3:
            return False
        iterations = int(parts[0])
        salt = bytes.fromhex(parts[1])
        original_key = bytes.fromhex(parts[2])
        
        new_key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, iterations)
        return original_key == new_key
    except Exception:
        return False

# ----------------- Local JWT Token Utilities -----------------

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """Create local JWT access token for mock/fallback mode."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.LOCAL_JWT_SECRET, algorithm="HS256")
    return encoded_jwt

def decode_access_token(token: str) -> Dict[str, Any]:
    """Decode and validate a local JWT access token."""
    try:
        payload = jwt.decode(token, settings.LOCAL_JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.PyJWTError:
        return {}

# ----------------- Rich Mock Question Bank -----------------
# This provides realistic mock data when OpenAI is not configured, ensuring the app works.
MOCK_QUESTION_BANK = {
    "python": {
        "Technical": [
            {
                "question": "What is the difference between list and tuple in Python?",
                "answer": "Lists are mutable, meaning their elements can be modified, added, or removed after creation. They are defined using square brackets []. Tuples are immutable, meaning they cannot be changed once created. They are defined using parentheses () and are generally faster and consume less memory than lists.",
                "hint": "Think about mutability, memory allocation, and syntax.",
                "difficulty": "Easy"
            },
            {
                "question": "Explain Python generators and the yield keyword.",
                "answer": "Generators are special functions that return an iterator, yielding values one at a time using the 'yield' keyword instead of 'return'. They allow lazy evaluation, generating items on-the-fly and saving memory, which is ideal for working with extremely large datasets.",
                "hint": "Consider memory optimization, lazy loading, and state preservation.",
                "difficulty": "Medium"
            },
            {
                "question": "How does memory management work in Python?",
                "answer": "Python uses automatic memory management, which includes a private heap space where all objects and data structures are stored. The Python interpreter handles this heap, and it features a built-in Garbage Collector that uses reference counting and a generational cyclic garbage collector to reclaim unused memory.",
                "hint": "Mention the private heap, reference counting, and garbage collection.",
                "difficulty": "Hard"
            },
            {
                "question": "What are decorators in Python and how do you write one?",
                "answer": "Decorators are a structural design pattern that allows modifying or extending the behavior of a function or class without permanently changing its source code. They are represented by the '@decorator_name' syntax and wrap another function to perform pre- and post-processing.",
                "hint": "Think of functions as first-class citizens and wrappers.",
                "difficulty": "Medium"
            },
            {
                "question": "What is the Global Interpreter Lock (GIL) and how does it affect multi-threading?",
                "answer": "The GIL is a mutex in the CPython implementation that prevents multiple native threads from executing Python bytecodes at once. This means only one thread can execute Python code at a time, making multi-threaded CPU-bound programs run no faster (or even slower). To bypass this, programmers use multiprocessing or asynchronous programming.",
                "hint": "It relates to CPython, CPU-bound tasks, concurrency vs parallelism.",
                "difficulty": "Hard"
            }
        ],
        "Behavioral": [
            {
                "question": "Describe a time when you refactored a complex piece of Python code. What was the impact?",
                "answer": "In my previous project, we had a legacy script that processed XML logs synchronously. It was hard to maintain and took 4 hours to run. I refactored it to use asyncio and split the logic into clean, modular classes. The execution time dropped to 15 minutes, and bug occurrences decreased by 30%.",
                "hint": "Structure your answer using the STAR method: Situation, Task, Action, Result.",
                "difficulty": "Medium"
            }
        ]
    },
    "react": {
        "Technical": [
            {
                "question": "What is the Virtual DOM and how does React use it to render interfaces?",
                "answer": "The Virtual DOM is a lightweight, in-memory representation of the real DOM. When state changes, React creates a new virtual DOM tree, compares it with the previous tree using a diffing algorithm (reconciliation), and updates only the changed elements in the real DOM, optimizing performance.",
                "hint": "Think about diffing, reconciliation, and batching updates.",
                "difficulty": "Easy"
            },
            {
                "question": "Explain the React Component Lifecycle and how Hooks map to it.",
                "answer": "In class components, lifecycle methods like componentDidMount, componentDidUpdate, and componentWillUnmount manage component phases. In functional components, the useEffect hook handles these phases. A blank dependency array [] acts like componentDidMount, returning a cleanup function acts like componentWillUnmount, and dependencies act like componentDidUpdate.",
                "hint": "Discuss mounting, updating, unmounting, and the useEffect hook.",
                "difficulty": "Medium"
            },
            {
                "question": "What are the rules of Hooks, and why are they necessary?",
                "answer": "The two main rules are: 1) Only call Hooks at the top level (not inside loops, conditions, or nested functions), and 2) Only call Hooks from React Function Components or Custom Hooks. These rules ensure React can correctly preserve hook state across multiple render calls by maintaining their execution order.",
                "hint": "Think about render order and state array indexes.",
                "difficulty": "Medium"
            },
            {
                "question": "What is React Fiber and how does it improve application performance?",
                "answer": "React Fiber is a rewrite of the core rendering engine in React 16. Its primary goal is to enable incremental rendering — the ability to split rendering work into chunks and spread it over multiple frames. This makes UI updates fluid and prevents long-running render operations from blocking the main browser thread.",
                "hint": "Relates to concurrency, scheduling, splitting render tasks.",
                "difficulty": "Hard"
            }
        ]
    },
    "default": {
        "Technical": [
            {
                "question": "Explain the concept of RESTful Web Services and their core constraints.",
                "answer": "REST (Representational State Transfer) is an architectural style for designing networked applications. Core constraints include: statelessness (every request contains all info needed), client-server separation, uniform interface (HTTP verbs like GET, POST, PUT, DELETE), cacheability, and a layered system.",
                "hint": "Mention HTTP methods, statelessness, and client-server architecture.",
                "difficulty": "Medium"
            },
            {
                "question": "What is database indexing and how does it improve query performance?",
                "answer": "An index is a data structure (commonly a B-Tree) that improves the speed of data retrieval operations on a database table at the cost of additional writes and storage space. It acts like an index in a book, allowing the query planner to quickly locate rows without scanning the entire table.",
                "hint": "Think about B-trees, table scans, and write overhead.",
                "difficulty": "Medium"
            }
        ],
        "Behavioral": [
            {
                "question": "Tell me about a time you had a conflict with a team member. How did you resolve it?",
                "answer": "We disagreed on whether to use SQL or NoSQL for a project. I scheduled a call to understand their concerns about write scaling. We list-compared the read/write load requirements. Based on data, we agreed on PostgreSQL with JSONB, which satisfied both of us. The project launched successfully.",
                "hint": "Focus on communication, objective decision-making, and teamwork.",
                "difficulty": "Easy"
            }
        ],
        "Situational": [
            {
                "question": "Your production server goes down during peak hours, and your team lead is offline. What steps do you take?",
                "answer": "First, I would verify the outage and isolate the issue (e.g. check system health logs, database connection pools, memory limits). Second, I would check the recent deployment history for breaking changes. If a rollback is possible and safe, I would trigger it. Third, I would communicate status updates to stakeholders while working on a fix, and document a post-mortem afterwards.",
                "hint": "Focus on triage, communication, safety, and systemic resolution.",
                "difficulty": "Hard"
            }
        ],
        "HR": [
            {
                "question": "Why do you want to join our company, and where do you see yourself in 5 years?",
                "answer": "I want to join because of your focus on scalable AI infrastructure, which aligns with my passion for high-performance backends. In 5 years, I see myself taking on leadership roles, designing core systems, and helping mentor junior engineers while continuing to grow technically.",
                "hint": "Align your personal goals with company values and outline a path of growth.",
                "difficulty": "Easy"
            }
        ],
        "Mixed": [
            {
                "question": "What is the difference between synchronous and asynchronous programming?",
                "answer": "Synchronous programming executes operations sequentially, blocking execution of subsequent code until the current operation finishes. Asynchronous programming allows operations to run in the background (non-blocking), enabling the program to perform other tasks while waiting for I/O operations to complete.",
                "hint": "Think about blocking operations, thread blocking, and event loops.",
                "difficulty": "Easy"
            }
        ]
    }
}

def generate_mock_questions(role: str, skill: str, difficulty: str, q_type: str, count: int) -> List[Dict[str, Any]]:
    """Generate mock interview questions based on input params."""
    skill_clean = skill.strip().lower()
    q_type_clean = q_type.strip()
    diff_clean = difficulty.strip().capitalize()
    
    # Pick database category
    cat = "default"
    if "python" in skill_clean or "django" in skill_clean or "fastapi" in skill_clean:
        cat = "python"
    elif "react" in skill_clean or "javascript" in skill_clean or "typescript" in skill_clean or "next" in skill_clean:
        cat = "react"
    
    # Try to grab questions by type, fallback to Technical
    questions_list = []
    if cat in MOCK_QUESTION_BANK:
        questions_list = MOCK_QUESTION_BANK[cat].get(q_type_clean, MOCK_QUESTION_BANK[cat].get("Technical", []))
    
    # If not enough, append from default
    if len(questions_list) < count:
        default_list = MOCK_QUESTION_BANK["default"].get(q_type_clean, MOCK_QUESTION_BANK["default"].get("Technical", []))
        questions_list = questions_list + default_list
    
    # Slice or loop to meet target count
    result = []
    for i in range(count):
        item = questions_list[i % len(questions_list)]
        
        # Customize the mock template slightly to match role and skill
        q_text = item["question"]
        if "Explain the concept of RESTful Web Services" in q_text and skill:
            q_text = f"In {skill}, explain the concept of RESTful Web Services and how you would build them."
        
        result.append({
            "id": str(uuid.uuid4()),
            "question": q_text,
            "answer": item["answer"],
            "hint": item["hint"],
            "difficulty": diff_clean
        })
        
    return result
