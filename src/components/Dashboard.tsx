'use client';
import React, { useEffect, useState } from 'react';
import { getAccounts, addAccount, getGroups, addGroup, getWhatsAppGroups } from '../lib/api';
import { Plus, Trash, RefreshCw, Instagram, Twitter, MessageCircle } from 'lucide-react';

export default function Dashboard() {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [waGroups, setWaGroups] = useState<any[]>([]);

    const [newUsername, setNewUsername] = useState('');
    const [newPlatform, setNewPlatform] = useState('INSTAGRAM');

    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupPlatform, setNewGroupPlatform] = useState('INSTAGRAM');
    const [selectedWaGroup, setSelectedWaGroup] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const accs = await getAccounts();
            setAccounts(accs);

            const grpsInsta = await getGroups('INSTAGRAM');
            const grpsTwitter = await getGroups('TWITTER');
            setGroups([...grpsInsta, ...grpsTwitter]);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchWaGroups = async () => {
        try {
            const wa = await getWhatsAppGroups();
            setWaGroups(wa);
        } catch (e) {
            alert('Failed to fetch WhatsApp groups. Make sure backend is running and authenticated.');
        }
    };

    const handleAddAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUsername) return;
        try {
            await addAccount(newUsername, newPlatform);
            setNewUsername('');
            fetchData();
        } catch (e) {
            alert('Error adding account');
        }
    };

    const handleAddGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGroupName || !selectedWaGroup) return;
        try {
            await addGroup(newGroupName, newGroupPlatform, selectedWaGroup);
            setNewGroupName('');
            fetchData();
        } catch (e) {
            alert('Error adding group');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Social Sentinel</h1>
                    <p className="text-slate-500">Automated Social Media Notifications</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchData} className="p-2 bg-white border rounded hover:bg-slate-100"><RefreshCw size={20} /></button>
                </div>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* ACCOUNTS SECTION */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <span className="bg-blue-100 p-2 rounded-lg text-blue-600"><Instagram size={20} /></span>
                            Monitored Accounts
                        </h2>
                    </div>

                    <form onSubmit={handleAddAccount} className="flex gap-2 mb-6">
                        <select
                            value={newPlatform}
                            onChange={(e) => setNewPlatform(e.target.value)}
                            className="border p-2 rounded bg-slate-50"
                        >
                            <option value="INSTAGRAM">Instagram</option>
                            <option value="TWITTER">Twitter</option>
                        </select>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="Username to monitor..."
                            className="border p-2 rounded flex-1 bg-slate-50"
                        />
                        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center">
                            <Plus size={20} />
                        </button>
                    </form>

                    <div className="space-y-3">
                        {accounts.map((acc) => (
                            <div key={acc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="flex items-center gap-3">
                                    {acc.platform === 'INSTAGRAM' ? <Instagram size={18} className="text-pink-600" /> : <Twitter size={18} className="text-sky-500" />}
                                    <span className="font-medium">@{acc.username}</span>
                                </div>
                                <span className="text-xs text-slate-400">ID: {acc.id}</span>
                            </div>
                        ))}
                        {accounts.length === 0 && <p className="text-center text-slate-400 py-4">No accounts monitored yet.</p>}
                    </div>
                </section>

                {/* GROUPS SECTION */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <span className="bg-green-100 p-2 rounded-lg text-green-600"><MessageCircle size={20} /></span>
                            Notification Routing
                        </h2>
                        <button onClick={fetchWaGroups} className="text-sm text-green-600 underline">Refresh WA Groups</button>
                    </div>

                    <form onSubmit={handleAddGroup} className="flex flex-col gap-3 mb-6 bg-slate-50 p-4 rounded-lg">
                        <div className="flex gap-2">
                            <select
                                value={newGroupPlatform}
                                onChange={(e) => setNewGroupPlatform(e.target.value)}
                                className="border p-2 rounded bg-white w-1/3"
                            >
                                <option value="INSTAGRAM">Instagram</option>
                                <option value="TWITTER">Twitter</option>
                            </select>
                            <input
                                type="text"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                placeholder="Routing Name (e.g. 'Insta Group')"
                                className="border p-2 rounded flex-1 bg-white"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={selectedWaGroup}
                                onChange={(e) => setSelectedWaGroup(e.target.value)}
                                className="border p-2 rounded flex-1 bg-white"
                            >
                                <option value="">Select WhatsApp Group...</option>
                                {waGroups.map(g => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </select>
                            <button type="submit" className="bg-green-600 text-white px-4 rounded hover:bg-green-700">
                                <Plus size={20} />
                            </button>
                        </div>
                        {waGroups.length === 0 && <p className="text-xs text-orange-500">Click 'Refresh WA Groups' to load groups from phone.</p>}
                    </form>

                    <div className="space-y-3">
                        {groups.map((grp) => (
                            <div key={grp.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-slate-700">{grp.name}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${grp.platform === 'INSTAGRAM' ? 'bg-pink-100 text-pink-700' : 'bg-sky-100 text-sky-700'}`}>{grp.platform}</span>
                                </div>
                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                    <MessageCircle size={12} /> {grp.groupId}
                                </div>
                            </div>
                        ))}
                        {groups.length === 0 && <p className="text-center text-slate-400 py-4">No routing configured.</p>}
                    </div>
                </section>
            </main>
        </div>
    );
}
