const fs = require('fs');

const filepath = 'src/context/StoreContext.jsx';
let content = fs.readFileSync(filepath, 'utf8');

// 1. Update initial states to empty arrays instead of adminDbState
content = content.replace(
    /const \[inventory, setInventory\] = useState\([\s\S]*?\);/,
    'const [inventory, setInventory] = useState([]);'
);
content = content.replace(
    /const \[stockMovements, setStockMovements\] = useState\([\s\S]*?\);/,
    'const [stockMovements, setStockMovements] = useState([]);'
);
content = content.replace(
    /const \[expenses, setExpenses\] = useState\([\s\S]*?\);/,
    'const [expenses, setExpenses] = useState([]);'
);
content = content.replace(
    /const \[customers, setCustomers\] = useState\([\s\S]*?\);/,
    'const [customers, setCustomers] = useState([]);'
);
content = content.replace(
    /const \[orders, setOrders\] = useState\([\s\S]*?\);/,
    'const [orders, setOrders] = useState([]);'
);

// 2. Add useEffect to fetch all these on mount
const fetchEffect = `
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
`;

// Insert the fetch_effect right after the orders state declaration
content = content.replace(
    /(const \[orders, setOrders\] = useState\(\[\]\);)/,
    '$1\n' + fetchEffect
);

fs.writeFileSync(filepath, content, 'utf8');
console.log("Refactored StoreContext.jsx state initialization.");
