import React, { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const STATUS_OPTIONS = ['Ongoing', 'Completed', 'On Hold'];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, edit: false, project: null });
  const [form, setForm] = useState({ title: '', client: '', deadline: '', price: '', techStack: '', status: 'Ongoing', notes: '' });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({ client: '', status: '', from: '', to: '' });
  const [notesModal, setNotesModal] = useState({ open: false, project: null });
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const user = JSON.parse(localStorage.getItem('admin_user'));

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      if (filter.client) params.append('client', filter.client);
      if (filter.status) params.append('status', filter.status);
      if (filter.from) params.append('from', filter.from);
      if (filter.to) params.append('to', filter.to);
      if (search) params.append('q', search);
      const res = await fetch(`${API}/api/admin/projects?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProjects(data);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, [filter, search]);

  const openAddModal = () => {
    setForm({ title: '', client: '', deadline: '', price: '', techStack: '', status: 'Ongoing', notes: '' });
    setModal({ open: true, edit: false, project: null });
  };

  const openEditModal = (project) => {
    setForm({
      title: project.title,
      client: project.client,
      deadline: project.deadline ? project.deadline.slice(0, 10) : '',
      price: project.price,
      techStack: project.techStack,
      status: project.status,
      notes: project.notes || ''
    });
    setModal({ open: true, edit: true, project });
  };

  const closeModal = () => {
    setModal({ open: false, edit: false, project: null });
    setForm({ title: '', client: '', deadline: '', price: '', techStack: '', status: 'Ongoing', notes: '' });
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
  };

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(
        modal.edit
          ? `${API}/api/admin/projects/${modal.project._id}`
          : `${API}/api/admin/projects`,
        {
          method: modal.edit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form)
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save project');
      showToast('success', modal.edit ? 'Project updated!' : 'Project added!');
      closeModal();
      fetchProjects();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API}/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete project');
      showToast('success', 'Project deleted!');
      fetchProjects();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const handleStatusChange = async (project, status) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API}/api/admin/projects/${project._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      showToast('success', 'Status updated!');
      fetchProjects();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const openNotesModal = (project) => {
    setNotesModal({ open: true, project });
  };

  const handleNotesSave = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API}/api/admin/projects/${notesModal.project._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ notes: notesModal.project.notes })
      });
      if (!res.ok) throw new Error('Failed to save notes');
      showToast('success', 'Notes saved!');
      setNotesModal({ open: false, project: null });
      fetchProjects();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  // Unique clients for filter dropdown
  const uniqueClients = Array.from(new Set(projects.map(p => p.client)));

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
        <h2 className="text-2xl font-semibold">Projects</h2>
        {user?.role === 'admin' && (
          <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow">
            + Add New Project
          </button>
        )}
      </div>
      {/* Search & Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by title, client, tech stack..."
          className="p-2 rounded bg-gray-800 text-white border border-gray-700"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          value={filter.client}
          onChange={e => setFilter(f => ({ ...f, client: e.target.value }))}
          className="p-2 rounded bg-gray-800 text-white"
        >
          <option value="">All Clients</option>
          {uniqueClients.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={filter.status}
          onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
          className="p-2 rounded bg-gray-800 text-white"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s, i) => (
            <option key={i} value={s}>{s}</option>
          ))}
        </select>
        <input
          type="date"
          value={filter.from}
          onChange={e => setFilter(f => ({ ...f, from: e.target.value }))}
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          type="date"
          value={filter.to}
          onChange={e => setFilter(f => ({ ...f, to: e.target.value }))}
          className="p-2 rounded bg-gray-800 text-white"
        />
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
                <th className="py-2 px-4">Title</th>
                <th className="py-2 px-4">Client</th>
                <th className="py-2 px-4">Deadline</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">Tech Stack</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Notes</th>
                {user?.role === 'admin' && <th className="py-2 px-4">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-6 text-gray-400">No projects found.</td></tr>
              ) : projects.map(project => (
                <tr key={project._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="py-2 px-4">{project.title}</td>
                  <td className="py-2 px-4">{project.client}</td>
                  <td className="py-2 px-4">{project.deadline ? new Date(project.deadline).toLocaleDateString() : '-'}</td>
                  <td className="py-2 px-4">{project.price ? `₹${project.price}` : '-'}</td>
                  <td className="py-2 px-4">{project.techStack}</td>
                  <td className="py-2 px-4">
                    <span className={`px-3 py-1 rounded text-xs font-bold ${project.status === 'Completed' ? 'bg-green-700 text-green-100' : project.status === 'On Hold' ? 'bg-yellow-700 text-yellow-100' : 'bg-blue-700 text-blue-100'}`}>{project.status}</span>
                    {user?.role === 'admin' && (
                      <select
                        value={project.status}
                        onChange={e => handleStatusChange(project, e.target.value)}
                        className="ml-2 p-1 rounded bg-gray-800 text-white border border-gray-700"
                      >
                        {STATUS_OPTIONS.map((s, i) => (
                          <option key={i} value={s}>{s}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => openNotesModal(project)}
                      className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-1 px-3 rounded"
                    >
                      View/Edit
                    </button>
                  </td>
                  {user?.role === 'admin' && (
                    <td className="py-2 px-4 flex gap-2">
                      <button onClick={() => openEditModal(project)} className="text-blue-400 hover:underline flex items-center gap-1">Edit</button>
                      <button onClick={() => handleDelete(project._id)} className="text-red-400 hover:underline flex items-center gap-1">Delete</button>
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
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 rounded-lg shadow-lg p-3 sm:p-10 w-[98vw] max-w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[80vh] mt-2 mb-2 sm:my-0 flex flex-col justify-center overflow-y-auto">
            <div className="sticky top-0 z-10 bg-gray-900 rounded-t-lg flex items-center justify-between px-1 sm:px-0 pt-2 pb-3 border-b border-gray-800">
              <h3 className="text-2xl font-bold">{modal.edit ? 'Edit Project' : 'Add New Project'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white text-xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 pb-4 mt-2 overflow-y-auto">
              <div>
                <label className="block text-gray-300 mb-1">Title</label>
                <input type="text" name="title" className="w-full p-3 rounded bg-gray-800 text-white" value={form.title} onChange={handleFormChange} required />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Client</label>
                <input type="text" name="client" className="w-full p-3 rounded bg-gray-800 text-white" value={form.client} onChange={handleFormChange} required />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-gray-300 mb-1">Deadline</label>
                  <input type="date" name="deadline" className="w-full p-3 rounded bg-gray-800 text-white" value={form.deadline} onChange={handleFormChange} />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-300 mb-1">Price (₹)</label>
                  <input type="number" name="price" className="w-full p-3 rounded bg-gray-800 text-white" value={form.price} onChange={handleFormChange} />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Tech Stack</label>
                <input type="text" name="techStack" className="w-full p-3 rounded bg-gray-800 text-white" value={form.techStack} onChange={handleFormChange} />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-gray-300 mb-1">Status</label>
                  <select name="status" value={form.status} onChange={handleFormChange} className="w-full p-3 rounded bg-gray-800 text-white">
                    {STATUS_OPTIONS.map((s, i) => (
                      <option key={i} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-gray-300 mb-1">Notes</label>
                  <textarea name="notes" className="w-full p-3 rounded bg-gray-800 text-white" value={form.notes} onChange={handleFormChange} rows={3} />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded" disabled={loading}>{loading ? (modal.edit ? 'Updating...' : 'Adding...') : (modal.edit ? 'Update Project' : 'Add Project')}</button>
            </form>
          </div>
        </div>
      )}
      {/* Notes Modal */}
      {notesModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button onClick={() => setNotesModal({ open: false, project: null })} className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl">&times;</button>
            <h3 className="text-xl font-semibold mb-4">Project Notes</h3>
            <textarea
              className="w-full p-2 rounded bg-gray-800 text-white mb-4"
              rows={6}
              value={notesModal.project.notes || ''}
              onChange={e => setNotesModal(nm => ({ ...nm, project: { ...nm.project, notes: e.target.value } }))}
            />
            <button onClick={handleNotesSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save Notes</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects; 