import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, CheckCircle2, Circle, Trash2,
  Edit2, X, Loader2, LogOut, AlertCircle, Flame, Calendar, ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './Dashboard.module.css';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

const statusConfig = {
  pending: { icon: Circle, label: 'Todo', color: '#8a8a8e' },
  in_progress: { icon: Flame, label: 'In Progress', color: '#f59e0b' },
  completed: { icon: CheckCircle2, label: 'Done', color: '#22c55e' },
};

const priorityConfig = {
  low: { color: '#22c55e', label: 'Low' },
  medium: { color: '#f59e0b', label: 'Medium' },
  high: { color: '#ef4444', label: 'High' },
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export function Dashboard() {
  const { user, logout, token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending' as Task['status'],
    priority: 'medium' as Task['priority'],
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(data.data);
      }
    } catch {
      setError('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setTasks([data.data, ...tasks]);
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    setError('');

    try {
      const res = await fetch(`${API_URL}/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setTasks(tasks.map((t) => (t.id === editingTask.id ? data.data : t)));
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const openModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
      });
    } else {
      setEditingTask(null);
      setFormData({ title: '', description: '', status: 'pending', priority: 'medium' });
    }
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setError('');
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    highPriority: tasks.filter((t) => t.priority === 'high' && t.status !== 'completed').length,
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logoMark}>
            <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="16" fill="url(#logoGrad)" />
              <path d="M20 32h24M32 20v24" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="64" y2="64">
                  <stop stopColor="#f59e0b" />
                  <stop offset="1" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className={styles.userInfo}>
            <h1>TaskFlow</h1>
            <span>{user?.email}</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.roleTag}>{user?.role}</span>
          <button className={styles.logoutButton} onClick={logout}>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Stats */}
        <div className={styles.statsGrid}>
          <motion.div
            className={styles.statCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className={styles.statIcon}>
              <Calendar size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stats.total}</span>
              <span className={styles.statLabel}>Total Tasks</span>
            </div>
          </motion.div>

          <motion.div
            className={styles.statCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className={styles.statIcon} style={{ color: '#22c55e' }}>
              <CheckCircle2 size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stats.completed}</span>
              <span className={styles.statLabel}>Completed</span>
            </div>
          </motion.div>

          <motion.div
            className={styles.statCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.statIcon} style={{ color: '#f59e0b' }}>
              <Flame size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stats.inProgress}</span>
              <span className={styles.statLabel}>In Progress</span>
            </div>
          </motion.div>

          <motion.div
            className={styles.statCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className={styles.statIcon} style={{ color: '#ef4444' }}>
              <AlertCircle size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stats.highPriority}</span>
              <span className={styles.statLabel}>High Priority</span>
            </div>
          </motion.div>
        </div>

        {/* Search and Actions */}
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <motion.button
            className={styles.addButton}
            onClick={() => openModal()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={20} />
            New Task
          </motion.button>
        </div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.errorBanner}
          >
            <AlertCircle size={18} />
            {error}
            <button onClick={() => setError('')}><X size={16} /></button>
          </motion.div>
        )}

        {/* Tasks List */}
        {isLoading ? (
          <div className={styles.loadingState}>
            <Loader2 className={styles.spinner} size={32} />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <CheckCircle2 size={48} strokeWidth={1} />
            </div>
            <h3>No tasks yet</h3>
            <p>Create your first task to get started</p>
          </div>
        ) : (
          <div className={styles.tasksList}>
            <AnimatePresence>
              {filteredTasks.map((task, index) => {
                const status = statusConfig[task.status];
                const priority = priorityConfig[task.priority];
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={task.id}
                    className={`${styles.taskCard} ${task.status === 'completed' ? styles.completed : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    <div className={styles.taskHeader}>
                      <div className={styles.taskStatus} style={{ color: status.color }}>
                        <StatusIcon size={18} />
                        <span>{status.label}</span>
                      </div>
                      <span className={styles.taskPriority} style={{ color: priority.color }}>
                        {priority.label}
                      </span>
                    </div>

                    <h3 className={styles.taskTitle}>{task.title}</h3>

                    {task.description && (
                      <p className={styles.taskDescription}>{task.description}</p>
                    )}

                    <div className={styles.taskFooter}>
                      <span className={styles.taskDate}>
                        {new Date(task.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <div className={styles.taskActions}>
                        <motion.button
                          className={styles.taskAction}
                          onClick={() => openModal(task)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit2 size={16} />
                        </motion.button>
                        <motion.button
                          className={`${styles.taskAction} ${styles.deleteAction}`}
                          onClick={() => handleDeleteTask(task.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2>{editingTask ? 'Edit Task' : 'New Task'}</h2>
                <button className={styles.modalClose} onClick={closeModal}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
                {error && <div className={styles.formError}>{error}</div>}

                <div className={styles.formGroup}>
                  <label>Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Task title"
                    required
                    autoFocus
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional description..."
                    rows={3}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                    >
                      <option value="pending">Todo</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className={styles.submitButton}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                  <ArrowUpRight size={18} />
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}