import { Injectable, inject } from '@angular/core';
import { ReplaySubject, from, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth as getFirebaseAuth } from 'firebase/auth';
import { firebaseConfig } from '../firebase.config';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, sendEmailVerification } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc, collection, getDocs, updateDoc, query, where } from '@angular/fire/firestore';

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
      
      // Send the native Firebase email verification link (100% Free)
      await sendEmailVerification(cred.user);

      const newUser: User = {
        ...details,
        id: cred.user.uid as any,
        email: details.email.trim().toLowerCase(),
        role
      };
      
      newUser.id = cred.user.uid as any;
      await setDoc(doc(this.firestore, 'users', cred.user.uid), newUser);
      return newUser;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async createAdmin(details: Omit<User, 'id' | 'role'>): Promise<User | null> {
    try {
      // Use a secondary app to create a user without logging out the current admin
      const secondaryApp = initializeApp(firebaseConfig, 'SecondaryApp');
      const secondaryAuth = getFirebaseAuth(secondaryApp);
      
      const cred = await createUserWithEmailAndPassword(secondaryAuth, details.email.trim(), details.password);
      
      const newUser: User = {
        ...details,
        id: cred.user.uid as any,
        email: details.email.trim().toLowerCase(),
        role: 'admin'
      };
      
      newUser.id = cred.user.uid as any;
      await setDoc(doc(this.firestore, 'users', cred.user.uid), newUser);
      
      // Clean up secondary app
      await secondaryAuth.signOut();
      await deleteApp(secondaryApp);
      
      return newUser;
    } catch (e) {
      console.error(e);
      return null;
    }
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

  async getAdmins(): Promise<User[]> {
    const q = query(collection(this.firestore, 'users'), where('role', '==', 'admin'));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as User);
  }
}
