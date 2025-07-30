import React, { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const ROLES = ['admin', 'dev', 'designer', 'tester'];
const TASK_STATUS = ['Ongoing', 'Completed'];

const TeamManagement = () => {
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, edit: false, member: null });
  const [form, setForm] = useState({ name: '', role: 'dev', email: '', assignedProjects: [] });
  const [taskModal, setTaskModal] = useState({ open: false, member: null });
  const [taskForm, setTaskForm] = useState({ project: '', status: 'Ongoing', hours: '', note: '' });
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const user = JSON.parse(localStorage.getItem('admin_user'));

  // Fetch team members and projects
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const [teamRes, projRes] = await Promise.all([
        fetch(`${API}/api/admin/team`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/api/admin/projects`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setMembers(await teamRes.json());
      setProjects(await projRes.json());
    } catch {
      setMembers([]);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openAddModal = () => {
    setForm({ name: '', role: 'dev', email: '', assignedProjects: [] });
    setModal({ open: true, edit: false, member: null });
  };

  const openEditModal = (member) => {
    setForm({
      name: member.name,
      role: member.role,
      email: member.email,
      assignedProjects: member.assignedProjects.map(p => p._id)
    });
    setModal({ open: true, edit: true, member });
  };

  const closeModal = () => {
    setModal({ open: false, edit: false, member: null });
    setForm({ name: '', role: 'dev', email: '', assignedProjects: [] });
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
  };

  const handleFormChange = e => {
    const { name, value, selectedOptions } = e.target;
    if (name === 'assignedProjects') {
      // Now treat as textarea: split by newlines
      setForm(f => ({ ...f, assignedProjects: value.split('\n').map(v => v.trim()).filter(Boolean) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(
        modal.edit
          ? `${API}/api/admin/team/${modal.member._id}`
          : `${API}/api/admin/team`,
        {
          method: modal.edit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form)
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save member');
      showToast('success', modal.edit ? 'Member updated!' : 'Member added!');
      closeModal();
      fetchData();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team member?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API}/api/admin/team/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete member');
      showToast('success', 'Member deleted!');
      fetchData();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  // Task Tracker
  const openTaskModal = (member) => {
    setTaskForm({ project: '', status: 'Ongoing', hours: '', note: '' });
    setTaskModal({ open: true, member });
  };

  const closeTaskModal = () => {
    setTaskModal({ open: false, member: null });
    setTaskForm({ project: '', status: 'Ongoing', hours: '', note: '' });
  };

  const handleTaskChange = e => {
    const { name, value } = e.target;
    setTaskForm(f => ({ ...f, [name]: value }));
  };

  const handleTaskSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API}/api/admin/team/${taskModal.member._id}/task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(taskForm)
      });
      if (!res.ok) throw new Error('Failed to log task');
      showToast('success', 'Task logged!');
      closeTaskModal();
      fetchData();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl shadow p-6 mb-8 relative">
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold transition-all duration-300
          ${toast.type === 'success' ? 'bg-green-600' : ''}
          ${toast.type === 'error' ? 'bg-red-600' : ''}
        `}>
          {toast.message}
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-2xl font-semibold">Team Management</h2>
        {user?.role === 'admin' && (
          <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow">
            + Add Team Member
          </button>
        )}
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Role</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Projects</th>
                <th className="py-2 px-4">Tasks</th>
                {user?.role === 'admin' && <th className="py-2 px-4">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-6 text-gray-400">No team members found.</td></tr>
              ) : members.map(member => (
                <tr key={member._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="py-2 px-4">{member.name}</td>
                  <td className="py-2 px-4 capitalize">{member.role}</td>
                  <td className="py-2 px-4">{member.email}</td>
                  <td className="py-2 px-4">
                    {member.assignedProjects && member.assignedProjects.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {member.assignedProjects.map((p, i) => (
                          <span key={i} className="bg-blue-800 text-blue-100 px-2 py-0.5 rounded text-xs">{p.title}</span>
                        ))}
                      </div>
                    ) : <span className="text-gray-500 italic">None</span>}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => openTaskModal(member)}
                      className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-1 px-3 rounded"
                    >
                      Log Task
                    </button>
                  </td>
                  {user?.role === 'admin' && (
                    <td className="py-2 px-4 flex gap-2">
                      <button onClick={() => openEditModal(member)} className="text-blue-400 hover:underline flex items-center gap-1">Edit</button>
                      <button onClick={() => handleDelete(member._id)} className="text-red-400 hover:underline flex items-center gap-1">Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Add/Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-md relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl">&times;</button>
            <h3 className="text-xl font-semibold mb-4">{modal.edit ? 'Edit Team Member' : 'Add Team Member'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Name</label>
                <input type="text" name="name" className="w-full p-2 rounded bg-gray-800 text-white" value={form.name} onChange={handleFormChange} required />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Role</label>
                <select name="role" value={form.role} onChange={handleFormChange} className="w-full p-2 rounded bg-gray-800 text-white">
                  {ROLES.map((r, i) => (
                    <option key={i} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Email</label>
                <input type="email" name="email" className="w-full p-2 rounded bg-gray-800 text-white" value={form.email} onChange={handleFormChange} required />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Assign Projects</label>
                <textarea
                  name="assignedProjects"
                  className="w-full p-2 rounded bg-gray-800 text-white h-24"
                  value={form.assignedProjects.join('\n')}
                  onChange={handleFormChange}
                  placeholder="One project per line"
                />
                <div className="text-xs text-gray-400 mt-1">Type one project per line.</div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={loading}>{loading ? (modal.edit ? 'Updating...' : 'Adding...') : (modal.edit ? 'Update Member' : 'Add Member')}</button>
            </form>
          </div>
        </div>
      )}
      {/* Task Tracker Modal */}
      {taskModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-md relative">
            <button onClick={closeTaskModal} className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl">&times;</button>
            <h3 className="text-xl font-semibold mb-4">Log Task for {taskModal.member.name}</h3>
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Project</label>
                <input
                  type="text"
                  name="project"
                  className="w-full p-2 rounded bg-gray-800 text-white"
                  value={taskForm.project}
                  onChange={handleTaskChange}
                  placeholder="Type project name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Status</label>
                <select name="status" value={taskForm.status} onChange={handleTaskChange} className="w-full p-2 rounded bg-gray-800 text-white">
                  {TASK_STATUS.map((s, i) => (
                    <option key={i} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Hours</label>
                <input type="number" name="hours" className="w-full p-2 rounded bg-gray-800 text-white" value={taskForm.hours} onChange={handleTaskChange} />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Note</label>
                <textarea name="note" className="w-full p-2 rounded bg-gray-800 text-white" value={taskForm.note} onChange={handleTaskChange} rows={3} />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={loading}>{loading ? 'Logging...' : 'Log Task'}</button>
            </form>
            {/* Show task history for this member */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">Task History</h4>
              {taskModal.member.tasks && taskModal.member.tasks.length > 0 ? (
                <div className="max-h-40 overflow-y-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-gray-800">
                        <th className="py-1 px-2">Project</th>
                        <th className="py-1 px-2">Status</th>
                        <th className="py-1 px-2">Hours</th>
                        <th className="py-1 px-2">Note</th>
                        <th className="py-1 px-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taskModal.member.tasks.map((t, i) => (
                        <tr key={i} className="border-b border-gray-800">
                          <td className="py-1 px-2">{t.project || '-'}</td>
                          <td className="py-1 px-2">{t.status}</td>
                          <td className="py-1 px-2">{t.hours || '-'}</td>
                          <td className="py-1 px-2">{t.note || '-'}</td>
                          <td className="py-1 px-2">{new Date(t.date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <div className="text-gray-400">No tasks logged yet.</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement; 