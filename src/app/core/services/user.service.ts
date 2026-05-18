import { Injectable } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { ImprestService } from './imprest.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUsers: User[] = [];
  private usersStorageKey = 'erp_users';
  private readonly USERS_PER_PAGE = 20;

  constructor(private imprestService: ImprestService) {
    this.loadUsersFromStorage();
    if (this.baseUsers.length === 0) {
      this.baseUsers = this.getDefaultUsers();
      this.saveUsersToStorage();
    }
    this.updateStorageWeights();
    this.cleanupOrphanedUsers();
  }

  private loadUsersFromStorage(): void {
    const stored = localStorage.getItem(this.usersStorageKey);
    if (stored) {
      try {
        const parsedUsers: User[] = JSON.parse(stored);
        // Deduplicate by username (last entry wins) to guard against corrupted storage
        const byUsername = new Map<string, User>();
        for (const u of parsedUsers) {
          byUsername.set(u.username, u);
        }
        // Also deduplicate by ID to catch duplicate-ID corruption
        const byId = new Map<number, User>();
        for (const u of byUsername.values()) {
          byId.set(u.id, u);
        }
        const deduped = Array.from(byId.values());
        // Replace baseUsers with stored data, but ensure default admin users exist
        const storedMap = new Map(deduped.map(u => [u.username, u]));
        const newBaseUsers: User[] = [];
        // Add stored users first (use deduped array, not the original parsedUsers)
        for (const u of deduped) {
          newBaseUsers.push(u);
        }
        // Ensure default admin users are present (in case storage was cleared)
        for (const def of this.getDefaultUsers()) {
          if (!storedMap.has(def.username)) {
            newBaseUsers.push(def);
          }
        }
        this.baseUsers = newBaseUsers;
      } catch (e) {
        console.error('Failed to load users from storage:', e);
      }
    }
  }

  private getDefaultUsers(): User[] {
    return [
      {
        id: 1,
        username: 'kinuthia',
        email: 'kinuthia@gmail.com',
        password: 'kinuthia123',
        role: 'admin',
        permissions: ['all'],
        department: 'IT',
        status: 'active',
        lastActivity: new Date().toISOString(),
        storageWeight: 0
      },
      {
        id: 2,
        username: 'john',
        email: 'john@gmail.com',
        password: 'john123',
        role: 'employee',
        permissions: ['imprest_request'],
        department: 'Operations',
        status: 'active',
        lastActivity: new Date().toISOString(),
        storageWeight: 0
      },
      {
        id: 3,
        username: 'Jane',
        email: 'jane@gmail.com',
        password: 'jane123',
        role: 'hr',
        permissions: ['employee_manage', 'leave_approve'],
        department: 'Human Resources',
        status: 'active',
        lastActivity: new Date().toISOString(),
        storageWeight: 0
      },
      {
        id: 4,
        username: 'Molly',
        email: 'mollykamweti@gmail.com',
        password: 'molly123',
        role: 'accountant',
        permissions: ['employee_manage', 'imprest_approve', 'imprest_withdraw'],
        department: 'finance',
        status: 'active',
        lastActivity: new Date().toISOString(),
        storageWeight: 0
      },
    ];
  }

  private saveUsersToStorage(): void {
    try {
      localStorage.setItem(this.usersStorageKey, JSON.stringify(this.baseUsers));
    } catch (e) {
      console.error('Failed to save users to storage:', e);
    }
  }

  private updateStorageWeights(): void {
    const imprests = this.imprestService.getImprests();
    const userImprestCount = new Map<string, number>();
    for (const imp of imprests) {
      const creator = imp.createdBy?.trim();
      if (creator) {
        userImprestCount.set(creator, (userImprestCount.get(creator) || 0) + 1);
      }
    }
    for (const user of this.baseUsers) {
      const count = userImprestCount.get(user.username) || 0;
      user.storageWeight = this.calculateUserWeight(user, count);
    }
  }

  private calculateUserWeight(user: User, imprestCount: number): number {
    let weight = 0;
    weight += user.username.length;
    weight += user.email.length;
    weight += user.role.length;
    weight += user.department?.length || 0;
    weight += user.permissions.reduce((acc, p) => acc + p.length, 0);
    weight += imprestCount * 50;
    return weight;
  }

  private cleanupOrphanedUsers(): void {
    const imprests = this.imprestService.getImprests();
    const activeCreators = new Set<string>();
    for (const imp of imprests) {
      const creator = imp.createdBy?.trim();
      if (creator) activeCreators.add(creator);
    }
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - 6);
    const before = this.baseUsers.length;
    this.baseUsers = this.baseUsers.filter(u => {
      if (u.role === 'admin') return true;
      const lastAct = u.lastActivity ? new Date(u.lastActivity) : new Date(u.createdAt || 0);
      return activeCreators.has(u.username) || lastAct > cutoffDate;
    });
    const after = this.baseUsers.length;
    if (before !== after) {
      this.saveUsersToStorage();
    }
  }

  getUsers(page?: number, pageSize?: number): User[] {
    const allUsers = this.getUsersInternal();
    allUsers.sort((a, b) => (b.lastActivity ? new Date(b.lastActivity).getTime() : 0) - (a.lastActivity ? new Date(a.lastActivity).getTime() : 0));
    if (page !== undefined && pageSize !== undefined) {
      const start = page * pageSize;
      return allUsers.slice(start, start + pageSize);
    }
    return allUsers;
  }

  getUsersInternal(): User[] {
    const imprests = this.imprestService.getImprests();
    const userMap = new Map<string, User>();

    for (const u of this.baseUsers) {
      userMap.set(u.username, { ...u });
    }

    let nextId = Math.max(...this.baseUsers.map(u => u.id), 0) + 1;

    for (const imp of imprests) {
      const creator = imp.createdBy?.trim();
      if (creator && !userMap.has(creator)) {
        userMap.set(creator, {
          id: nextId++,
          username: creator,
          email: `${creator}@wholesalers.com`,
          password: 'default123',
          role: 'employee',
          permissions: ['imprest_request'],
          department: 'Unknown',
          status: 'active',
          lastActivity: imp.date,
          storageWeight: 50
        });
      } else if (creator && userMap.has(creator)) {
        const existing = userMap.get(creator)!;
        existing.lastActivity = imp.date;
      }
    }

    return Array.from(userMap.values());
  }

  getUserById(id: number): User | undefined {
    return this.getUsersInternal().find(u => u.id === id);
  }

  addUser(user: User): void {
    const newId = Math.max(...this.baseUsers.map(u => u.id), 0) + 1;
    const newUser: User = {
      ...user,
      id: newId,
      password: user.password || 'default123',
      status: user.status || 'active',
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      isArchived: false,
      storageWeight: this.calculateUserWeight(user, 0)
    };
    this.baseUsers.push(newUser);
    this.saveUsersToStorage();
  }

  updateUser(user: User): void {
    let index = this.baseUsers.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.baseUsers[index] = {
        ...this.baseUsers[index],
        ...user,
        updatedAt: new Date().toISOString()
      };
    } else {
      // User not found in baseUsers (discovered user), add them
      this.baseUsers.push({
        ...user,
        updatedAt: new Date().toISOString()
      });
    }
    this.saveUsersToStorage();
  }

  deleteUser(id: number): void {
    // Find user in full list (including discovered users)
    const allUsers = this.getUsersInternal();
    const user = allUsers.find(u => u.id === id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.role === 'admin') {
      throw new Error('Cannot delete admin user');
    }
    
    // Remove user's imprest records
    const imprests = this.imprestService.getImprests();
    const filtered = imprests.filter(imp => imp.createdBy?.trim() !== user.username);
    localStorage.setItem('imprests', JSON.stringify(filtered));
    
    // Remove from baseUsers if present (manually added users)
    this.baseUsers = this.baseUsers.filter(u => u.id !== id);
    this.saveUsersToStorage();
  }

  getTotalUserCount(): number {
    return this.getUsersInternal().length;
  }

  getTotalPages(pageSize?: number): number {
    const total = this.getTotalUserCount();
    const size = pageSize || this.USERS_PER_PAGE;
    return Math.ceil(total / size);
  }

  searchUsers(query: string): User[] {
    const lower = query.toLowerCase();
    return this.getUsersInternal().filter(u =>
      u.username.toLowerCase().includes(lower) ||
      u.email.toLowerCase().includes(lower) ||
      u.department?.toLowerCase().includes(lower) ||
      u.role.toLowerCase().includes(lower)
    );
  }

  getUsersByRole(role: string): User[] {
    return this.getUsersInternal().filter(u => u.role === role);
  }

  cleanupInactiveUsers(daysInactive: number = 180): number {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysInactive);
    const before = this.baseUsers.length;
    this.baseUsers = this.baseUsers.filter(u => {
      if (u.role === 'admin') return true;
      const lastAct = u.lastActivity ? new Date(u.lastActivity) : new Date(u.createdAt || 0);
      return lastAct > cutoff;
    });
    const after = this.baseUsers.length;
    this.saveUsersToStorage();
    return before - after;
  }

  getUserStorageStats(): { total: number; active: number; totalWeight: number } {
    const all = this.getUsersInternal();
    const totalWeight = all.reduce((acc, u) => acc + (u.storageWeight || 0), 0);
    return {
      total: all.length,
      active: all.filter(u => u.status === 'active').length,
      totalWeight
    };
  }

  compressStorage(): void {
    const imprests = this.imprestService.getImprests();
    localStorage.setItem('imprests_compressed', btoa(JSON.stringify(imprests)));
  }

  getStorageSavings(): { before: number; after: number; saved: number } {
    const imprests = this.imprestService.getImprests();
    const raw = JSON.stringify(imprests);
    const compressed = btoa(raw);
    return {
      before: raw.length,
      after: compressed.length,
      saved: raw.length - compressed.length
    };
  }

  recordUserActivity(username: string): void {
    const user = this.baseUsers.find(u => u.username === username);
    if (user) {
      user.lastActivity = new Date().toISOString();
      this.saveUsersToStorage();
    }
  }
}
