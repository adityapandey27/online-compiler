export interface CodeTemplate {
  id: string;
  title: string;
  description: string;
  language: string;
  category: string;
  code: string;
  tags: string[];
}

export const templates: CodeTemplate[] = [
  // JavaScript Templates
  {
    id: 'js-hello-world',
    title: 'Hello World',
    description: 'Basic Hello World program in JavaScript',
    language: 'javascript',
    category: 'Basics',
    code: `// Simple Hello World program
console.log("Hello, World!");`,
    tags: ['basic', 'console', 'output']
  },
  {
    id: 'js-fibonacci',
    title: 'Fibonacci Sequence',
    description: 'Generate Fibonacci sequence up to n terms',
    language: 'javascript',
    category: 'Algorithms',
    code: `// Function to generate Fibonacci sequence
function fibonacci(n) {
  const sequence = [0, 1];
  
  for (let i = 2; i < n; i++) {
    sequence[i] = sequence[i-1] + sequence[i-2];
  }
  
  return sequence;
}

// Generate first 10 terms
const result = fibonacci(10);
console.log("Fibonacci sequence:", result);`,
    tags: ['algorithm', 'math', 'sequence']
  },
  {
    id: 'js-fetch-api',
    title: 'Fetch API Example',
    description: 'Basic example of using Fetch API to get data',
    language: 'javascript',
    category: 'Web APIs',
    code: `// Fetch data from an API
async function fetchData() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    const data = await response.json();
    console.log('Data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Call the function
fetchData();`,
    tags: ['api', 'fetch', 'async', 'http']
  },
  {
    id: 'js-sorting',
    title: 'Sorting Algorithms',
    description: 'Implementation of common sorting algorithms',
    language: 'javascript',
    category: 'Algorithms',
    code: `// Bubble Sort
function bubbleSort(arr) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// Quick Sort
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = [];
  const middle = [];
  const right = [];
  
  for (let val of arr) {
    if (val < pivot) left.push(val);
    else if (val > pivot) right.push(val);
    else middle.push(val);
  }
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

// Test the sorting algorithms
const testArray = [64, 34, 25, 12, 22, 11, 90];
console.log("Original array:", testArray);
console.log("Bubble sort:", bubbleSort([...testArray]));
console.log("Quick sort:", quickSort([...testArray]));`,
    tags: ['algorithm', 'sorting', 'bubble-sort', 'quick-sort']
  },
  {
    id: 'js-dom-manipulation',
    title: 'DOM Manipulation',
    description: 'Basic DOM manipulation examples',
    language: 'javascript',
    category: 'Web Development',
    code: `// Create and append elements
function createAndAppendElements() {
  // Create a container
  const container = document.createElement('div');
  container.id = 'container';
  container.className = 'container';
  
  // Create a heading
  const heading = document.createElement('h1');
  heading.textContent = 'DOM Manipulation Example';
  
  // Create a button
  const button = document.createElement('button');
  button.textContent = 'Click Me';
  button.addEventListener('click', () => {
    alert('Button clicked!');
  });
  
  // Append elements to container
  container.appendChild(heading);
  container.appendChild(button);
  
  // Append container to body
  document.body.appendChild(container);
  
  console.log('Elements created and appended to the DOM');
}

// Call the function
createAndAppendElements();`,
    tags: ['dom', 'web', 'elements', 'events']
  },
  {
    id: 'js-local-storage',
    title: 'Local Storage',
    description: 'Using localStorage to save and retrieve data',
    language: 'javascript',
    category: 'Web Storage',
    code: `// Save data to localStorage
function saveToLocalStorage(key, data) {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    console.log('Data saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
}

// Retrieve data from localStorage
function getFromLocalStorage(key) {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
}

// Example usage
const userData = {
  name: 'John Doe',
  email: 'john@example.com',
  preferences: {
    theme: 'dark',
    notifications: true
  }
};

// Save user data
saveToLocalStorage('userData', userData);

// Retrieve user data
const retrievedData = getFromLocalStorage('userData');
console.log('Retrieved data:', retrievedData);`,
    tags: ['storage', 'localStorage', 'json', 'data']
  },
  
  // Python Templates
  {
    id: 'py-hello-world',
    title: 'Hello World',
    description: 'Basic Hello World program in Python',
    language: 'python3',
    category: 'Basics',
    code: `# Simple Hello World program
print("Hello, World!")`,
    tags: ['basic', 'print', 'output']
  },
  {
    id: 'py-fibonacci',
    title: 'Fibonacci Sequence',
    description: 'Generate Fibonacci sequence up to n terms',
    language: 'python3',
    category: 'Algorithms',
    code: `# Function to generate Fibonacci sequence
def fibonacci(n):
    sequence = [0, 1]
    
    for i in range(2, n):
        sequence.append(sequence[i-1] + sequence[i-2])
    
    return sequence

# Generate first 10 terms
result = fibonacci(10)
print("Fibonacci sequence:", result)`,
    tags: ['algorithm', 'math', 'sequence']
  },
  {
    id: 'py-requests',
    title: 'HTTP Requests',
    description: 'Basic example of making HTTP requests with requests library',
    language: 'python3',
    category: 'Web APIs',
    code: `# Make HTTP requests with requests library
import requests

def fetch_data():
    try:
        response = requests.get('https://jsonplaceholder.typicode.com/posts/1')
        data = response.json()
        print('Data:', data)
        return data
    except Exception as e:
        print('Error fetching data:', e)

# Call the function
fetch_data()`,
    tags: ['api', 'http', 'requests']
  },
  {
    id: 'py-file-operations',
    title: 'File Operations',
    description: 'Reading and writing files in Python',
    language: 'python3',
    category: 'File I/O',
    code: `# File operations in Python
def write_to_file(filename, content):
    try:
        with open(filename, 'w') as file:
            file.write(content)
        print(f"Successfully wrote to {filename}")
    except Exception as e:
        print(f"Error writing to file: {e}")

def read_from_file(filename):
    try:
        with open(filename, 'r') as file:
            content = file.read()
        print(f"Successfully read from {filename}")
        return content
    except Exception as e:
        print(f"Error reading from file: {e}")
        return None

# Example usage
sample_text = "This is a sample text that will be written to a file.\\nIt contains multiple lines.\\nThis is the third line."

# Write to file
write_to_file('sample.txt', sample_text)

# Read from file
content = read_from_file('sample.txt')
if content:
    print("File content:")
    print(content)`,
    tags: ['file', 'io', 'read', 'write']
  },
  {
    id: 'py-list-comprehension',
    title: 'List Comprehension',
    description: 'Examples of list comprehension in Python',
    language: 'python3',
    category: 'Python Features',
    code: `# List comprehension examples

# Basic list comprehension
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squares = [x**2 for x in numbers]
print("Squares:", squares)

# List comprehension with condition
even_squares = [x**2 for x in numbers if x % 2 == 0]
print("Even squares:", even_squares)

# Nested list comprehension
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [item for sublist in matrix for item in sublist]
print("Flattened matrix:", flattened)

# Dictionary comprehension
square_dict = {x: x**2 for x in range(1, 6)}
print("Square dictionary:", square_dict)

# Set comprehension
unique_squares = {x**2 for x in numbers}
print("Unique squares:", unique_squares)`,
    tags: ['python', 'list', 'comprehension', 'functional']
  },
  {
    id: 'py-decorators',
    title: 'Decorators',
    description: 'Examples of Python decorators',
    language: 'python3',
    category: 'Python Features',
    code: `# Function decorator
def timer(func):
    def wrapper(*args, **kwargs):
        import time
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f} seconds to execute")
        return result
    return wrapper

# Class decorator
def singleton(cls):
    instances = {}
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

# Example usage of function decorator
@timer
def slow_function():
    import time
    time.sleep(1)
    return "Function executed"

# Example usage of class decorator
@singleton
class Database:
    def __init__(self):
        print("Database initialized")
    
    def query(self, sql):
        print(f"Executing query: {sql}")
        return "Query result"

# Test the decorators
print(slow_function())

db1 = Database()
db2 = Database()  # This won't create a new instance
print(db1 is db2)  # Should print True`,
    tags: ['python', 'decorator', 'design-pattern', 'singleton']
  },
  
  // Java Templates
  {
    id: 'java-hello-world',
    title: 'Hello World',
    description: 'Basic Hello World program in Java',
    language: 'java',
    category: 'Basics',
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    tags: ['basic', 'console', 'output']
  },
  {
    id: 'java-fibonacci',
    title: 'Fibonacci Sequence',
    description: 'Generate Fibonacci sequence in Java',
    language: 'java',
    category: 'Algorithms',
    code: `public class Main {
    public static int[] fibonacci(int n) {
        int[] sequence = new int[n];
        sequence[0] = 0;
        sequence[1] = 1;
        
        for (int i = 2; i < n; i++) {
            sequence[i] = sequence[i-1] + sequence[i-2];
        }
        
        return sequence;
    }
    
    public static void main(String[] args) {
        int[] result = fibonacci(10);
        
        System.out.print("Fibonacci sequence: ");
        for (int num : result) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
}`,
    tags: ['algorithm', 'math', 'sequence']
  },
  {
    id: 'java-sorting',
    title: 'Sorting Algorithms',
    description: 'Implementation of sorting algorithms in Java',
    language: 'java',
    category: 'Algorithms',
    code: `public class Main {
    // Bubble Sort
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n-1; i++) {
            for (int j = 0; j < n-i-1; j++) {
                if (arr[j] > arr[j+1]) {
                    // Swap arr[j] and arr[j+1]
                    int temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                }
            }
        }
    }
    
    // Quick Sort
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi-1);
            quickSort(arr, pi+1, high);
        }
    }
    
    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = (low-1);
        
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        
        int temp = arr[i+1];
        arr[i+1] = arr[high];
        arr[high] = temp;
        
        return i+1;
    }
    
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        
        System.out.print("Original array: ");
        printArray(arr);
        
        // Create a copy for bubble sort
        int[] bubbleArr = arr.clone();
        bubbleSort(bubbleArr);
        System.out.print("Bubble sorted array: ");
        printArray(bubbleArr);
        
        // Create a copy for quick sort
        int[] quickArr = arr.clone();
        quickSort(quickArr, 0, quickArr.length-1);
        System.out.print("Quick sorted array: ");
        printArray(quickArr);
    }
    
    private static void printArray(int[] arr) {
        for (int num : arr) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
}`,
    tags: ['algorithm', 'sorting', 'bubble-sort', 'quick-sort']
  },
  {
    id: 'java-file-io',
    title: 'File I/O',
    description: 'Reading and writing files in Java',
    language: 'java',
    category: 'File I/O',
    code: `import java.io.*;

public class Main {
    public static void writeToFile(String filename, String content) {
        try (FileWriter writer = new FileWriter(filename)) {
            writer.write(content);
            System.out.println("Successfully wrote to " + filename);
        } catch (IOException e) {
            System.out.println("Error writing to file: " + e.getMessage());
        }
    }
    
    public static String readFromFile(String filename) {
        StringBuilder content = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new FileReader(filename))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\\n");
            }
            System.out.println("Successfully read from " + filename);
            return content.toString();
        } catch (IOException e) {
            System.out.println("Error reading from file: " + e.getMessage());
            return null;
        }
    }
    
    public static void main(String[] args) {
        String sampleText = "This is a sample text that will be written to a file.\\n" +
                           "It contains multiple lines.\\n" +
                           "This is the third line.";
        
        // Write to file
        writeToFile("sample.txt", sampleText);
        
        // Read from file
        String content = readFromFile("sample.txt");
        if (content != null) {
            System.out.println("File content:");
            System.out.println(content);
        }
    }
}`,
    tags: ['file', 'io', 'read', 'write']
  },
  
  // C++ Templates
  {
    id: 'cpp-hello-world',
    title: 'Hello World',
    description: 'Basic Hello World program in C++',
    language: 'cpp',
    category: 'Basics',
    code: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
    tags: ['basic', 'console', 'output']
  },
  {
    id: 'cpp-fibonacci',
    title: 'Fibonacci Sequence',
    description: 'Generate Fibonacci sequence in C++',
    language: 'cpp',
    category: 'Algorithms',
    code: `#include <iostream>
#include <vector>

std::vector<int> fibonacci(int n) {
    std::vector<int> sequence(n);
    sequence[0] = 0;
    sequence[1] = 1;
    
    for (int i = 2; i < n; i++) {
        sequence[i] = sequence[i-1] + sequence[i-2];
    }
    
    return sequence;
}

int main() {
    int n = 10;
    std::vector<int> result = fibonacci(n);
    
    std::cout << "Fibonacci sequence: ";
    for (int num : result) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}`,
    tags: ['algorithm', 'math', 'sequence']
  },
  {
    id: 'cpp-sorting',
    title: 'Sorting Algorithms',
    description: 'Implementation of sorting algorithms in C++',
    language: 'cpp',
    category: 'Algorithms',
    code: `#include <iostream>
#include <vector>
#include <algorithm>

// Bubble Sort
void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                std::swap(arr[j], arr[j+1]);
            }
        }
    }
}

// Quick Sort
int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return (i + 1);
}

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

void printArray(const std::vector<int>& arr) {
    for (int num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
}

int main() {
    std::vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    
    std::cout << "Original array: ";
    printArray(arr);
    
    // Create a copy for bubble sort
    std::vector<int> bubbleArr = arr;
    bubbleSort(bubbleArr);
    std::cout << "Bubble sorted array: ";
    printArray(bubbleArr);
    
    // Create a copy for quick sort
    std::vector<int> quickArr = arr;
    quickSort(quickArr, 0, quickArr.size() - 1);
    std::cout << "Quick sorted array: ";
    printArray(quickArr);
    
    return 0;
}`,
    tags: ['algorithm', 'sorting', 'bubble-sort', 'quick-sort']
  },
  {
    id: 'cpp-file-io',
    title: 'File I/O',
    description: 'Reading and writing files in C++',
    language: 'cpp',
    category: 'File I/O',
    code: `#include <iostream>
#include <fstream>
#include <string>

void writeToFile(const std::string& filename, const std::string& content) {
    std::ofstream file(filename);
    if (file.is_open()) {
        file << content;
        file.close();
        std::cout << "Successfully wrote to " << filename << std::endl;
    } else {
        std::cout << "Error opening file for writing" << std::endl;
    }
}

std::string readFromFile(const std::string& filename) {
    std::string content;
    std::ifstream file(filename);
    
    if (file.is_open()) {
        std::string line;
        while (std::getline(file, line)) {
            content += line + "\\n";
        }
        file.close();
        std::cout << "Successfully read from " << filename << std::endl;
    } else {
        std::cout << "Error opening file for reading" << std::endl;
    }
    
    return content;
}

int main() {
    std::string sampleText = "This is a sample text that will be written to a file.\\n"
                            "It contains multiple lines.\\n"
                            "This is the third line.";
    
    // Write to file
    writeToFile("sample.txt", sampleText);
    
    // Read from file
    std::string content = readFromFile("sample.txt");
    if (!content.empty()) {
        std::cout << "File content:" << std::endl;
        std::cout << content;
    }
    
    return 0;
}`,
    tags: ['file', 'io', 'read', 'write']
  },
  
  // TypeScript Templates
  {
    id: 'ts-hello-world',
    title: 'Hello World',
    description: 'Basic Hello World program in TypeScript',
    language: 'typescript',
    category: 'Basics',
    code: `// Simple Hello World program
console.log("Hello, World!");`,
    tags: ['basic', 'console', 'output']
  },
  {
    id: 'ts-interfaces',
    title: 'TypeScript Interfaces',
    description: 'Examples of TypeScript interfaces and types',
    language: 'typescript',
    category: 'TypeScript Features',
    code: `// Basic interface
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

// Interface with optional properties
interface Config {
  apiUrl: string;
  timeout: number;
  retries?: number;
  debug?: boolean;
}

// Interface with readonly properties
interface Point {
  readonly x: number;
  readonly y: number;
}

// Interface extending another interface
interface Employee extends User {
  department: string;
  salary: number;
}

// Type alias
type ID = string | number;
type Status = 'pending' | 'approved' | 'rejected';

// Function type
type MathOperation = (a: number, b: number) => number;

// Example usage
const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  isActive: true
};

const config: Config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  debug: true
};

const point: Point = {
  x: 10,
  y: 20
};

const employee: Employee = {
  id: 2,
  name: 'Jane Smith',
  email: 'jane@example.com',
  isActive: true,
  department: 'Engineering',
  salary: 75000
};

// Function using the type
const add: MathOperation = (a, b) => a + b;
console.log(add(5, 3)); // Output: 8

console.log('User:', user);
console.log('Config:', config);
console.log('Point:', point);
console.log('Employee:', employee);`,
    tags: ['typescript', 'interface', 'type', 'type-safety']
  },
  {
    id: 'ts-generics',
    title: 'TypeScript Generics',
    description: 'Examples of generic types and functions in TypeScript',
    language: 'typescript',
    category: 'TypeScript Features',
    code: `// Generic function
function identity<T>(arg: T): T {
  return arg;
}

// Generic interface
interface GenericIdentityFn<T> {
  (arg: T): T;
}

// Generic class
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
  
  constructor(zeroValue: T, addFn: (x: T, y: T) => T) {
    this.zeroValue = zeroValue;
    this.add = addFn;
  }
}

// Generic constraints
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// Example usage
const num = identity<number>(42);
console.log(num); // Output: 42

const str = identity('Hello');
console.log(str); // Output: Hello

const myIdentity: GenericIdentityFn<number> = identity;
console.log(myIdentity(100)); // Output: 100

const numberClass = new GenericNumber<number>(
  0,
  (x, y) => x + y
);
console.log(numberClass.add(5, 10)); // Output: 15

const stringClass = new GenericNumber<string>(
  '',
  (x, y) => x + y
);
console.log(stringClass.add('Hello, ', 'World!')); // Output: Hello, World!

console.log(loggingIdentity('Hello')); // Output: 5, Hello
console.log(loggingIdentity([1, 2, 3])); // Output: 3, [1, 2, 3]`,
    tags: ['typescript', 'generic', 'type-safety', 'reusability']
  }
]; 