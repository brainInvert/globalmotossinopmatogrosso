import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'global-motos-super-secret-key-2026';
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'global_motos_database.json');

// Interface definition for server state
interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  salt: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
  city?: string;
  state?: string;
  createdAt: string;
}

interface StoredMotorcycle {
  id: string;
  vehicleType?: 'moto' | 'carro';
  title: string;
  brand: string;
  model: string;
  version?: string;
  yearManufacture: number;
  yearModel: number;
  price: number;
  fipePrice: number;
  mileage: number;
  engineCapacity: number;
  fuelType: 'Gasolina' | 'Flex' | 'Elétrica' | 'Diesel' | 'Híbrido';
  color: string;
  category: 'street' | 'trail' | 'custom' | 'scooter' | 'sport' | 'touring' | 'picape' | 'suv' | 'sedan' | 'hatchback';
  transmission: 'Manual' | 'Automático' | 'CVT' | 'Quickshifter' | 'Semi-Automático';
  state: string;
  city: string;
  images: string[];
  description: string;
  features: string[];
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerType: 'particular' | 'concessionaria';
  featured?: boolean;
  status: 'active' | 'pending' | 'sold';
  createdAt: string;
  technicalSpecs: {
    powerHp: number;
    torqueNm: number;
    weightKg: number;
    tankCapacityL: number;
    consumptionKmPerL: number;
    cylinderCount?: number;
    cooling?: string;
    frontBrake?: string;
    rearBrake?: string;
  };
}

interface DatabaseSchema {
  users: StoredUser[];
  motorcycles: StoredMotorcycle[];
}

// Helpers for Crypto & JWT
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function generateToken(payload: { userId: string; email: string; role: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

// Database initialisation
function initDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading database file, re-creating initial data:', e);
    }
  }

  // Create default admin
  const adminSalt = crypto.randomBytes(16).toString('hex');

  const initialUsers: StoredUser[] = [
    {
      id: 'admin-1',
      name: 'Administrador Global Motos',
      email: 'admin@globalmotos.com.br',
      phone: '11999990000',
      salt: adminSalt,
      passwordHash: hashPassword('admin123', adminSalt),
      role: 'admin',
      city: 'São Paulo',
      state: 'SP',
      createdAt: new Date().toISOString()
    }
  ];

  const db: DatabaseSchema = {
    users: initialUsers,
    motorcycles: []
  };

  saveDatabase(db);
  return db;
}

function saveDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database:', err);
  }
}

// Global in-memory DB reference
let db: DatabaseSchema = initDatabase();

// Express App
const app = express();
app.use(express.json({ limit: '10mb' }));

// Auth Middleware
interface AuthRequest extends Request {
  user?: { userId: string; email: string; role: string };
}

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }

  req.user = decoded;
  next();
}

// Health Check Endpoint for Cloud Run
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------------- API ROUTES ---------------- //

// Auth Endpoints
app.post('/api/v1/auth/register', (req: Request, res: Response) => {
  return res.status(403).json({
    error: 'O cadastro no sistema é exclusivo para a administração da Global Motos.'
  });
});

app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Informe e-mail e senha.' });
  }

  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  }

  const hash = hashPassword(password, user.salt);
  if (hash !== user.passwordHash) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  }

  const token = generateToken({ userId: user.id, email: user.email, role: user.role });

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    city: user.city,
    state: user.state,
    createdAt: user.createdAt
  };

  res.json({ user: safeUser, token });
});

app.get('/api/v1/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = db.users.find((u) => u.id === req.user?.userId);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      city: user.city,
      state: user.state,
      createdAt: user.createdAt
    }
  });
});

// Motorcycles Endpoints
app.get('/api/v1/motorcycles', (req: Request, res: Response) => {
  const {
    query,
    brand,
    category,
    minYear,
    maxYear,
    minPrice,
    maxPrice,
    minMileage,
    maxMileage,
    minEngineCapacity,
    maxEngineCapacity,
    state,
    sellerType,
    sortBy
  } = req.query;

  let results = [...db.motorcycles];

  // Default active unless seller or admin
  results = results.filter((m) => m.status === 'active');

  if (query && typeof query === 'string' && query.trim() !== '') {
    const q = query.toLowerCase().trim();
    results = results.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.brand.toLowerCase().includes(q) ||
        m.model.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q)
    );
  }

  if (brand && typeof brand === 'string' && brand !== '') {
    results = results.filter((m) => m.brand.toLowerCase() === brand.toLowerCase());
  }

  if (category && typeof category === 'string' && category !== '') {
    results = results.filter((m) => m.category === category);
  }

  if (minYear) {
    results = results.filter((m) => m.yearModel >= parseInt(minYear as string, 10));
  }
  if (maxYear) {
    results = results.filter((m) => m.yearModel <= parseInt(maxYear as string, 10));
  }

  if (minPrice) {
    results = results.filter((m) => m.price >= parseInt(minPrice as string, 10));
  }
  if (maxPrice) {
    results = results.filter((m) => m.price <= parseInt(maxPrice as string, 10));
  }

  if (minMileage) {
    results = results.filter((m) => m.mileage >= parseInt(minMileage as string, 10));
  }
  if (maxMileage) {
    results = results.filter((m) => m.mileage <= parseInt(maxMileage as string, 10));
  }

  if (minEngineCapacity) {
    results = results.filter((m) => m.engineCapacity >= parseInt(minEngineCapacity as string, 10));
  }
  if (maxEngineCapacity) {
    results = results.filter((m) => m.engineCapacity <= parseInt(maxEngineCapacity as string, 10));
  }

  if (state && typeof state === 'string' && state !== '') {
    results = results.filter((m) => m.state.toUpperCase() === state.toUpperCase());
  }

  if (sellerType && typeof sellerType === 'string' && sellerType !== '') {
    results = results.filter((m) => m.sellerType === sellerType);
  }

  // Sort
  if (sortBy === 'price_asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'year_desc') {
    results.sort((a, b) => b.yearModel - a.yearModel);
  } else if (sortBy === 'mileage_asc') {
    results.sort((a, b) => a.mileage - b.mileage);
  } else {
    // Recent / featured first
    results.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  res.json({ total: results.length, motorcycles: results });
});

app.get('/api/v1/motorcycles/:id', (req: Request, res: Response) => {
  const item = db.motorcycles.find((m) => m.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Motocicleta não encontrada.' });
  }
  res.json(item);
});

// Create new motorcycle ad
app.post('/api/v1/motorcycles', authenticateToken, (req: AuthRequest, res: Response) => {
  const adData = req.body;

  if (!adData.brand || !adData.model || !adData.price || !adData.yearModel) {
    return res.status(400).json({ error: 'Preencha marca, modelo, ano e preço.' });
  }

  const seller = db.users.find((u) => u.id === req.user?.userId);

  const newAd: StoredMotorcycle = {
    ...adData,
    id: `moto-${Date.now()}`,
    sellerId: req.user?.userId || 'unknown',
    sellerName: seller?.name || adData.sellerName || 'Vendedor Cadastrado',
    sellerPhone: seller?.phone || adData.sellerPhone || '11999998888',
    sellerType: adData.sellerType || 'particular',
    status: 'active',
    createdAt: new Date().toISOString(),
    images: Array.isArray(adData.images) && adData.images.length > 0
      ? adData.images
      : ['/src/assets/images/category_naked_street_1792660797743.jpg'],
    features: Array.isArray(adData.features) ? adData.features : [],
    technicalSpecs: adData.technicalSpecs || {
      powerHp: 50,
      torqueNm: 40,
      weightKg: 180,
      tankCapacityL: 14,
      consumptionKmPerL: 25
    }
  };

  db.motorcycles.unshift(newAd);
  saveDatabase(db);

  res.status(201).json(newAd);
});

// Update ad
app.put('/api/v1/motorcycles/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const idx = db.motorcycles.findIndex((m) => m.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Anúncio não encontrado.' });
  }

  const existing = db.motorcycles[idx];
  if (existing.sellerId !== req.user?.userId && req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Você não tem permissão para editar este anúncio.' });
  }

  const updated: StoredMotorcycle = {
    ...existing,
    ...req.body,
    id: existing.id,
    sellerId: existing.sellerId,
    createdAt: existing.createdAt
  };

  db.motorcycles[idx] = updated;
  saveDatabase(db);

  res.json(updated);
});

// Delete ad
app.delete('/api/v1/motorcycles/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const idx = db.motorcycles.findIndex((m) => m.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Anúncio não encontrado.' });
  }

  const existing = db.motorcycles[idx];
  if (existing.sellerId !== req.user?.userId && req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Você não tem permissão para remover este anúncio.' });
  }

  db.motorcycles.splice(idx, 1);
  saveDatabase(db);

  res.json({ message: 'Anúncio removido com sucesso.' });
});

// Toggle status (active/sold)
app.patch('/api/v1/motorcycles/:id/status', authenticateToken, (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const idx = db.motorcycles.findIndex((m) => m.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Anúncio não encontrado.' });
  }

  const existing = db.motorcycles[idx];
  if (existing.sellerId !== req.user?.userId && req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Você não tem permissão para alterar o status.' });
  }

  existing.status = status;
  db.motorcycles[idx] = existing;
  saveDatabase(db);

  res.json(existing);
});

// User's own ads
app.get('/api/v1/user/ads', authenticateToken, (req: AuthRequest, res: Response) => {
  const userAds = db.motorcycles.filter((m) => m.sellerId === req.user?.userId);
  res.json(userAds);
});

// Admin stats and moderation
app.get('/api/v1/admin/stats', authenticateToken, (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito ao administrador.' });
  }

  const total = db.motorcycles.length;
  const active = db.motorcycles.filter((m) => m.status === 'active').length;
  const sold = db.motorcycles.filter((m) => m.status === 'sold').length;
  const totalValue = db.motorcycles.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const totalUsers = db.users.length;

  res.json({
    totalAds: total,
    activeAds: active,
    soldAds: sold,
    totalPlatformValue: totalValue,
    totalUsers,
    recentAds: db.motorcycles.slice(0, 5)
  });
});

// Start Server & mount Vite in dev or static files in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa'
      });
      app.use(vite.middlewares);
      console.log('Vite middleware attached in development mode.');
    } catch (e) {
      console.warn('Vite middleware could not be loaded directly:', e);
    }
  } else {
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      app.get('*', (_req, res) => {
        res.status(200).send('Global Motos API is running. Build frontend with npm run build.');
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Global Motos Server running at http://0.0.0.0:${PORT}`);
  });
}

// Only start when executed directly
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
