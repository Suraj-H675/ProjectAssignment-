import { supabase } from '../config/supabase';
import type { User, Role } from '../types/index';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const UserModel = {
  async create(email: string, password: string, name: string, role: Role = 'user'): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const id = uuidv4();

    const { data, error } = await supabase
      .from('users')
      .insert({
        id,
        email,
        password: hashedPassword,
        name,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, role, createdAt, updatedAt')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async update(id: string, updates: Partial<Pick<User, 'name' | 'email'>>): Promise<User | null> {
    const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (updates.name) updateData.name = updates.name;
    if (updates.email) updateData.email = updates.email;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select('id, email, name, role, createdAt, updatedAt')
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('users').delete().eq('id', id);
    return !error;
  },

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  },
};