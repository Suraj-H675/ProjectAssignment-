import { supabase } from '../config/supabase';
import type { Task } from '../types/index';
import { v4 as uuidv4 } from 'uuid';

export const TaskModel = {
  async create(
    title: string,
    description: string,
    userId: string,
    status: Task['status'] = 'pending',
    priority: Task['priority'] = 'medium'
  ): Promise<Task> {
    const id = uuidv4();

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        id,
        title,
        description,
        status,
        priority,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async findByUserId(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async findById(id: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async findAll(userId?: string): Promise<Task[]> {
    let query = supabase.from('tasks').select('*').order('createdAt', { ascending: false });

    if (userId) {
      query = query.eq('userId', userId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async update(
    id: string,
    updates: Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority'>>
  ): Promise<Task | null> {
    const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (updates.title) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.status) updateData.status = updates.status;
    if (updates.priority) updateData.priority = updates.priority;

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    return !error;
  },

  async deleteByUserId(userId: string): Promise<number> {
    const { error, count } = await supabase
      .from('tasks')
      .delete()
      .eq('userId', userId);

    if (error) throw error;
    return count || 0;
  },
};