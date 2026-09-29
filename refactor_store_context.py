import re
import os

filepath = 'src/context/StoreContext.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update initial states to empty arrays instead of adminDbState
content = re.sub(
    r'const \[inventory, setInventory\] = useState\([\s\S]*?\);',
    r'const [inventory, setInventory] = useState([]);',
    content
)
content = re.sub(
    r'const \[stockMovements, setStockMovements\] = useState\([\s\S]*?\);',
    r'const [stockMovements, setStockMovements] = useState([]);',
    content
)
content = re.sub(
    r'const \[expenses, setExpenses\] = useState\([\s\S]*?\);',
    r'const [expenses, setExpenses] = useState([]);',
    content
)
content = re.sub(
    r'const \[customers, setCustomers\] = useState\([\s\S]*?\);',
    r'const [customers, setCustomers] = useState([]);',
    content
)
content = re.sub(
    r'const \[orders, setOrders\] = useState\([\s\S]*?\);',
    r'const [orders, setOrders] = useState([]);',
    content
)

# 2. Add useEffect to fetch all these on mount
fetch_effect = """
  // Fetch Admin Data from APIs
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [invRes, ordRes, custRes, expRes] = await Promise.all([
          fetch('/api/inventory'),
          fetch('/api/orders'),
          fetch('/api/customers'),
          fetch('/api/expenses')
        ]);
        if (invRes.ok) setInventory(await invRes.json());
        if (ordRes.ok) setOrders(await ordRes.json());
        if (custRes.ok) setCustomers(await custRes.json());
        if (expRes.ok) setExpenses(await expRes.json());
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      }
    };
    fetchAdminData();
  }, []);
"""

# Insert the fetch_effect right after the state declarations
content = re.sub(
    r'(const \[orders, setOrders\] = useState\(\[\]\);)',
    r'\1\n' + fetch_effect,
    content
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Refactored StoreContext.jsx state initialization.")
