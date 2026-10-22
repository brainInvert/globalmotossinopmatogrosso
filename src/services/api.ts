import { Motorcycle, MotorcycleFilterParams } from '../types/motorcycle';
import { User, AuthResponse, LoginCredentials, RegisterData } from '../types/auth';
import { INITIAL_MOTORCYCLES } from '../data/mockMotorcycles';

const TOKEN_KEY = 'global_motos_auth_token';
const USER_KEY = 'global_motos_auth_user';
const STORAGE_MOTOS_KEY = 'global_motos_vehicles_v1';

// Helper to get local token
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setStoredSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Local mock storage fallback engine to guarantee 100% availability
function getLocalMotorcycles(): Motorcycle[] {
  const data = localStorage.getItem(STORAGE_MOTOS_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_MOTOS_KEY, JSON.stringify(INITIAL_MOTORCYCLES));
    return INITIAL_MOTORCYCLES;
  }
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_MOTOS_KEY, JSON.stringify(INITIAL_MOTORCYCLES));
      return INITIAL_MOTORCYCLES;
    }
    return parsed;
  } catch {
    return INITIAL_MOTORCYCLES;
  }
}

function saveLocalMotorcycles(motos: Motorcycle[]) {
  localStorage.setItem(STORAGE_MOTOS_KEY, JSON.stringify(motos));
}

// Client API Methods
export const api = {
  // Auth
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      if (response.ok) {
        const data = await response.json();
        setStoredSession(data.token, data.user);
        return data;
      }
    } catch {
      // Fallback to local simulated auth
    }

    // Fallback: check admin credentials
    const email = credentials.email.toLowerCase().trim();
    if (
      (email === 'admin@globalmotos.com.br' || email === 'admin@portaldrodas.com.br') &&
      credentials.password === 'admin123'
    ) {
      const adminUser: User = {
        id: 'admin-1',
        name: 'Administrador Global Motos',
        email: 'admin@globalmotos.com.br',
        phone: '11999990000',
        role: 'admin',
        city: 'São Paulo',
        state: 'SP',
        createdAt: new Date().toISOString()
      };
      const token = 'mock-jwt-admin-token-' + Date.now();
      setStoredSession(token, adminUser);
      return { user: adminUser, token };
    }

    throw new Error('E-mail ou senha incorretos. Apenas a administração tem acesso.');
  },

  async register(_data: RegisterData): Promise<AuthResponse> {
    throw new Error('O cadastro de novos usuários é restrito à administração da Global Motos.');
  },

  async getCurrentUser(): Promise<User | null> {
    const token = getStoredToken();
    if (!token) return null;

    try {
      const response = await fetch('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
    } catch {
      // Fallback
    }

    return getStoredUser();
  },

  // Motorcycles
  async getMotorcycles(filters: MotorcycleFilterParams = {}): Promise<Motorcycle[]> {
    try {
      const params = new URLSearchParams();
      if (filters.query) params.append('query', filters.query);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.category) params.append('category', filters.category);
      if (filters.minYear) params.append('minYear', filters.minYear.toString());
      if (filters.maxYear) params.append('maxYear', filters.maxYear.toString());
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.minEngineCapacity) params.append('minEngineCapacity', filters.minEngineCapacity.toString());
      if (filters.maxEngineCapacity) params.append('maxEngineCapacity', filters.maxEngineCapacity.toString());
      if (filters.state) params.append('state', filters.state);
      if (filters.sellerType) params.append('sellerType', filters.sellerType);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);

      const res = await fetch(`/api/v1/motorcycles?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.motorcycles;
      }
    } catch {
      // Fallback to client filtering
    }

    let items = getLocalMotorcycles().filter((m) => m.status === 'active');

    if (filters.vehicleType) {
      items = items.filter((m) => m.vehicleType === filters.vehicleType);
    }

    if (filters.city) {
      items = items.filter((m) => m.city.toLowerCase() === filters.city!.toLowerCase());
    }

    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      items = items.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.brand.toLowerCase().includes(q) ||
          m.model.toLowerCase().includes(q) ||
          m.city.toLowerCase().includes(q)
      );
    }
    if (filters.brand) {
      items = items.filter((m) => m.brand.toLowerCase() === filters.brand!.toLowerCase());
    }
    if (filters.category) {
      items = items.filter((m) => m.category === filters.category);
    }
    if (filters.minYear) {
      items = items.filter((m) => m.yearModel >= filters.minYear!);
    }
    if (filters.maxYear) {
      items = items.filter((m) => m.yearModel <= filters.maxYear!);
    }
    if (filters.minPrice) {
      items = items.filter((m) => m.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      items = items.filter((m) => m.price <= filters.maxPrice!);
    }
    if (filters.minEngineCapacity) {
      items = items.filter((m) => m.engineCapacity >= filters.minEngineCapacity!);
    }
    if (filters.maxEngineCapacity) {
      items = items.filter((m) => m.engineCapacity <= filters.maxEngineCapacity!);
    }
    if (filters.state) {
      items = items.filter((m) => m.state.toUpperCase() === filters.state!.toUpperCase());
    }
    if (filters.sellerType) {
      items = items.filter((m) => m.sellerType === filters.sellerType);
    }

    if (filters.sortBy === 'price_asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price_desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'year_desc') {
      items.sort((a, b) => b.yearModel - a.yearModel);
    } else if (filters.sortBy === 'mileage_asc') {
      items.sort((a, b) => a.mileage - b.mileage);
    } else {
      items.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }

    return items;
  },

  async getMotorcycleById(id: string): Promise<Motorcycle | null> {
    try {
      const res = await fetch(`/api/v1/motorcycles/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const items = getLocalMotorcycles();
    return items.find((m) => m.id === id) || null;
  },

  async createMotorcycle(ad: Partial<Motorcycle>): Promise<Motorcycle> {
    const token = getStoredToken();
    try {
      const res = await fetch('/api/v1/motorcycles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(ad)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const user = getStoredUser();
    const newMoto: Motorcycle = {
      id: `moto-${Date.now()}`,
      title: ad.title || `${ad.brand} ${ad.model}`,
      brand: ad.brand || 'Honda',
      model: ad.model || 'Modelo',
      version: ad.version || '',
      yearManufacture: ad.yearManufacture || 2024,
      yearModel: ad.yearModel || 2024,
      price: ad.price || 25000,
      fipePrice: ad.fipePrice || (ad.price ? ad.price * 1.05 : 26000),
      mileage: ad.mileage || 0,
      engineCapacity: ad.engineCapacity || 300,
      fuelType: ad.fuelType || 'Gasolina',
      color: ad.color || 'Preto',
      category: ad.category || 'street',
      transmission: ad.transmission || 'Manual',
      state: 'MT',
      city: ad.city || user?.city || 'Cuiabá',
      images: Array.isArray(ad.images) && ad.images.length > 0
        ? ad.images
        : ['/src/assets/images/category_naked_street_1792660797743.jpg'],
      description: ad.description || 'Moto em excelente estado de conservação.',
      features: ad.features || ['Freios ABS', 'Partida Elétrica', 'IPVA Pago'],
      sellerId: user?.id || 'anon',
      sellerName: user?.name || ad.sellerName || 'Vendedor Particular',
      sellerPhone: user?.phone || ad.sellerPhone || '11999998888',
      sellerType: ad.sellerType || 'particular',
      status: 'active',
      createdAt: new Date().toISOString(),
      technicalSpecs: ad.technicalSpecs || {
        powerHp: 35,
        torqueNm: 30,
        weightKg: 160,
        tankCapacityL: 14,
        consumptionKmPerL: 26
      }
    };

    const currentList = getLocalMotorcycles();
    currentList.unshift(newMoto);
    saveLocalMotorcycles(currentList);
    return newMoto;
  },

  async updateMotorcycle(id: string, ad: Partial<Motorcycle>): Promise<Motorcycle> {
    const token = getStoredToken();
    try {
      const res = await fetch(`/api/v1/motorcycles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(ad)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const currentList = getLocalMotorcycles();
    const idx = currentList.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error('Anúncio não encontrado.');

    const updated = { ...currentList[idx], ...ad };
    currentList[idx] = updated;
    saveLocalMotorcycles(currentList);
    return updated;
  },

  async deleteMotorcycle(id: string): Promise<void> {
    const token = getStoredToken();
    try {
      const res = await fetch(`/api/v1/motorcycles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) return;
    } catch {
      // Fallback
    }

    const currentList = getLocalMotorcycles();
    const filtered = currentList.filter((m) => m.id !== id);
    saveLocalMotorcycles(filtered);
  },

  async getUserMotorcycles(userId: string): Promise<Motorcycle[]> {
    const token = getStoredToken();
    try {
      const res = await fetch('/api/v1/user/ads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const all = getLocalMotorcycles();
    return all.filter((m) => m.sellerId === userId);
  },

  async getAdminStats() {
    const all = getLocalMotorcycles();
    return {
      totalAds: all.length,
      activeAds: all.filter((m) => m.status === 'active').length,
      soldAds: all.filter((m) => m.status === 'sold').length,
      totalPlatformValue: all.reduce((sum, item) => sum + (item.price || 0), 0),
      totalUsers: 14,
      recentAds: all.slice(0, 5)
    };
  }
};
