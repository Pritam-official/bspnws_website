"use client";

import React, { useEffect, useState } from 'react';
import { Loader2, Trash2, Search, Power, PowerOff } from 'lucide-react';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to remove this user?')) return;
        try {
            const res = await fetch('/api/admin/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        const action = currentStatus === false ? 'activate' : 'deactivate';
        if (!confirm(`Are you sure you want to ${action} this user?`)) return;
        
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isActive: currentStatus === false ? true : false }),
            });
            if (res.ok) {
                fetchUsers();
            } else {
                const data = await res.json();
                alert(data.error || `Failed to ${action} user`);
            }
        } catch (error) {
            console.error('Toggle status error:', error);
            alert(`An error occurred while trying to ${action} user`);
        }
    };


    const filtered = users.filter(u =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.membershipCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Users</h1>
                    <p className="text-sm text-gray-400 font-bold mt-1">Manage users who have created an account ({users.length} total)</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all w-full sm:w-72"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden lg:table-cell">Membership Code</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden md:table-cell">Email</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:table-cell">Role</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:table-cell">Status</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:table-cell">Joined</th>
                                <th className="text-right px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u) => (
                                <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white text-xs font-black shadow-sm overflow-hidden flex-shrink-0">
                                                {u.profilePic ? (
                                                    <img src={u.profilePic} alt={`${u.firstName} ${u.lastName}`} className="w-full h-full object-cover" />
                                                ) : (
                                                    u.firstName?.charAt(0) || 'U'
                                                )}
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{u.firstName} {u.lastName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium hidden lg:table-cell">{u.membershipCode}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{u.phone}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium hidden md:table-cell">{u.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium hidden sm:table-cell capitalize">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${u.role === 'staff' ? 'bg-pink-100 text-pink-700' : 'bg-green-50 text-green-600'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium hidden sm:table-cell">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${u.isActive === false ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                            {u.isActive === false ? 'Inactive' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium hidden sm:table-cell">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleToggleStatus(u._id, u.isActive)}
                                                className={`p-2 rounded-lg transition-colors group ${u.isActive === false ? 'hover:bg-green-50' : 'hover:bg-orange-50'}`} 
                                                title={u.isActive === false ? "Activate Account" : "Deactivate Account"}
                                            >
                                                {u.isActive === false ? (
                                                    <Power className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                                                ) : (
                                                    <PowerOff className="w-4 h-4 text-gray-400 group-hover:text-orange-600" />
                                                )}
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(u._id)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors group" 
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-sm text-gray-400 font-bold">No users found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
