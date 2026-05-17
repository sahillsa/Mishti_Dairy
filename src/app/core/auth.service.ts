import { Injectable, inject } from '@angular/core';
import { ReplaySubject, from, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc, collection, getDocs, updateDoc } from '@angular/fire/firestore';

import { User } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly firestore = inject(Firestore);
  private readonly authInstance = inject(Auth);
  
  private _currentUser: User | null = null;
  private readonly currentUserSubject = new ReplaySubject<User | null>(1);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const authInjection = inject(Auth);
    authState(authInjection).pipe(
      switchMap(firebaseUser => {
        if (firebaseUser) {
          return docData(doc(this.firestore, 'users', firebaseUser.uid)) as Observable<User>;
        } else {
          return of(null);
        }
      })
    ).subscribe(user => {
      this._currentUser = user;
      this.currentUserSubject.next(user);
    });
  }

  get currentUser(): User | null {
    return this._currentUser;
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      await signInWithEmailAndPassword(this.authInstance, email.trim(), password);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async register(details: Omit<User, 'id' | 'role'>, role: 'user' | 'admin' = 'user'): Promise<User | null> {
    try {
      const cred = await createUserWithEmailAndPassword(this.authInstance, details.email.trim(), details.password);
      const newUser: User = {
        ...details,
        id: cred.user.uid as any, // Firebase UID is string, models might expect number but it's usually loosely typed
        email: details.email.trim().toLowerCase(),
        role
      };
      // For compatibility with any models expecting a string or number, we'll store the UID as string in Firestore
      newUser.id = cred.user.uid as any;
      await setDoc(doc(this.firestore, 'users', cred.user.uid), newUser);
      return newUser;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async createAdmin(details: Omit<User, 'id' | 'role'>): Promise<User | null> {
    // Note: This will log the current admin out and log them in as the new admin due to Firebase client SDK limits.
    return this.register(details, 'admin');
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<boolean> {
    try {
      await updateDoc(doc(this.firestore, 'users', userId), data as any);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async forgotPassword(email: string): Promise<boolean> {
    try {
      await sendPasswordResetEmail(this.authInstance, email.trim());
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.authInstance);
  }

  isAuthenticated(): boolean {
    return Boolean(this.currentUser);
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  async getUsers(): Promise<User[]> {
    const snap = await getDocs(collection(this.firestore, 'users'));
    return snap.docs.map(d => d.data() as User);
  }
}
