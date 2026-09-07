import { useState, useCallback, useEffect } from 'react';
import { usersApi } from '../api';
import { UserModel } from '../models/UserModel';

export function useUserController() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usersApi.list();
      setUsers(data.map(u => new UserModel({ ...u, joined: u.joinedAt })));
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserStatus = useCallback(async (userId, status) => {
    const updated = await usersApi.updateStatus(userId, status);
    const model = new UserModel({ ...updated, joined: updated.joinedAt });
    setUsers(prev => prev.map(u => (u.id === userId ? model : u)));
    return model;
  }, []);

  return { users, loading, error, refetchUsers: fetchUsers, updateUserStatus };
}
