/* eslint-disable @typescript-eslint/naming-convention */
export const up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
    },
    email: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
    },
    password: {
      type: 'varchar(255)',
      notNull: true,
    },
    name: {
      type: 'varchar(255)',
      notNull: true,
    },
    role: {
      type: 'varchar(50)',
      notNull: true,
      default: 'user',
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
    },
    updatedAt: {
      type: 'timestamp',
      notNull: true,
    },
  });

  pgm.createTable('tasks', {
    id: {
      type: 'uuid',
      primaryKey: true,
    },
    title: {
      type: 'varchar(200)',
      notNull: true,
    },
    description: {
      type: 'text',
    },
    status: {
      type: 'varchar(50)',
      notNull: true,
      default: 'pending',
    },
    priority: {
      type: 'varchar(50)',
      notNull: true,
      default: 'medium',
    },
    userId: {
      type: 'uuid',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
    },
    updatedAt: {
      type: 'timestamp',
      notNull: true,
    },
  });

  pgm.createIndex('tasks', 'userId');
  pgm.createIndex('tasks', 'status');
};

export const down = (pgm) => {
  pgm.dropTable('tasks');
  pgm.dropTable('users');
};