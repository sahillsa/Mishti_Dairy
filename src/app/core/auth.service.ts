import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DUMMY_USERS } from './mock-data';
import { User } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserKey = 'mishti_farmer_current_user';
  private readonly registeredUsersKey = 'mishti_farmer_registered_users';
  private users: User[] = [...DUMMY_USERS, ...this.readJson<User[]>(this.registeredUsersKey, [])];
  private readonly currentUserSubject = new BehaviorSubject<User | null>(
    this.readJson<User | null>(this.currentUserKey, null),
  );

  readonly currentUser$ = this.currentUserSubject.asObservable();

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    const foundUser = this.users.find(
      (user) => user.email.toLowerCase() === normalizedEmail && user.password === password,
    );

    if (!foundUser) {
      return false;
    }

    this.setCurrentUser(foundUser);
    return true;
  }

  register(details: Omit<User, 'id' | 'role'>): User | null {
    const normalizedEmail = details.email.trim().toLowerCase();
    const exists = this.users.some((user) => user.email.toLowerCase() === normalizedEmail);

    if (exists) {
      return null;
    }

    const registeredUsers = this.readJson<User[]>(this.registeredUsersKey, []);
    const newUser: User = {
      ...details,
      id: Date.now(),
      email: normalizedEmail,
      role: 'user',
    };

    registeredUsers.push(newUser);
    this.users = [...DUMMY_USERS, ...registeredUsers];
    this.writeJson(this.registeredUsersKey, registeredUsers);
    this.setCurrentUser(newUser);

    return newUser;
  }

  forgotPassword(email: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    return this.users.some((user) => user.email.toLowerCase() === normalizedEmail);
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.removeItem(this.currentUserKey);
  }

  isAuthenticated(): boolean {
    return Boolean(this.currentUser);
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  getUsers(): User[] {
    return [...this.users];
  }

  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.writeJson(this.currentUserKey, user);
  }

  private readJson<T>(key: string, fallback: T): T {
    try {
      const value = this.storage?.getItem(key);
      return value ? (JSON.parse(value) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  private writeJson(key: string, value: unknown): void {
    try {
      this.storage?.setItem(key, JSON.stringify(value));
    } catch {
      return;
    }
  }

  private removeItem(key: string): void {
    try {
      this.storage?.removeItem(key);
    } catch {
      return;
    }
  }

  private get storage(): Storage | null {
    return typeof localStorage === 'undefined' ? null : localStorage;
  }
}
