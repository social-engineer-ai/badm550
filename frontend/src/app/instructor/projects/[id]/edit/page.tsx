'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { projectsApi } from '@/lib/api';
import Link from 'next/link';

interface Deliverable {
    name: string;
    description: string;
    submission_type: string;
    points?: number;
}

interface MilestoneResource {
    title: string;
    type: string;
    url: string;
    description?: string;
}

interface Milestone {
    id?: number;
    week_number: number;
    title: string;
    theme?: string;
    description?: string;
    deliverables?: Deliverable[];
    resources?: MilestoneResource[];
    guidance_notes?: string;
}

interface Resource {
    id?: number;
    title: string;
    resource_type: string;
    url: string;
    description?: string;
    display_order?: number;
}

interface Project {
    id: number;
    name: string;
    description: string;
    client_name: string;
    status: string;
    milestones: Milestone[];
    resources: Resource[];
}

const resourceTypes = [
    { value: 'video_youtube', label: 'YouTube Video' },
    { value: 'video_mediaspace', label: 'MediaSpace Video' },
    { value: 'notebook_colab', label: 'Colab Notebook' },
    { value: 'document', label: 'Document' },
    { value: 'dataset', label: 'Dataset' },
    { value: 'link', label: 'Link' },
];

export default function EditProjectPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'milestones' | 'resources'>('details');

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        client_name: '',
        status: 'draft'
    });

    const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
    const [newResource, setNewResource] = useState<Resource>({
        title: '',
        resource_type: 'link',
        url: '',
        description: ''
    });

    useEffect(() => {
        if (params.id) {
            projectsApi.get(Number(params.id))
                .then((data) => {
                    setProject(data);
                    setFormData({
                        name: data.name || '',
                        description: data.description || '',
                        client_name: data.client_name || '',
                        status: data.status || 'draft'
                    });
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [params.id]);

    const handleUpdateProject = async () => {
        setSaving(true);
        try {
            const updated = await projectsApi.update(Number(params.id), formData);
            setProject({ ...project!, ...updated });
            alert('Project updated!');
        } catch (error) {
            alert('Failed to update project');
        } finally {
            setSaving(false);
        }
    };

    const handleAddMilestone = () => {
        const nextWeek = project?.milestones?.length
            ? Math.max(...project.milestones.map(m => m.week_number)) + 1
            : 1;
        setEditingMilestone({
            week_number: nextWeek,
            title: '',
            theme: '',
            description: '',
            deliverables: [],
            resources: [],
            guidance_notes: ''
        });
    };

    const handleSaveMilestone = async () => {
        if (!editingMilestone) return;
        setSaving(true);
        try {
            if (editingMilestone.id) {
                await projectsApi.updateMilestone(Number(params.id), editingMilestone.week_number, editingMilestone);
            } else {
                await projectsApi.createMilestone(Number(params.id), editingMilestone);
            }
            // Refresh project
            const updated = await projectsApi.get(Number(params.id));
            setProject(updated);
            setEditingMilestone(null);
        } catch (error) {
            alert('Failed to save milestone');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteMilestone = async (weekNumber: number) => {
        if (!confirm('Delete this milestone?')) return;
        try {
            await projectsApi.deleteMilestone(Number(params.id), weekNumber);
            const updated = await projectsApi.get(Number(params.id));
            setProject(updated);
        } catch (error) {
            alert('Failed to delete milestone');
        }
    };

    const handleAddResource = async () => {
        if (!newResource.title || !newResource.url) return;
        setSaving(true);
        try {
            await projectsApi.addResource(Number(params.id), newResource);
            const updated = await projectsApi.get(Number(params.id));
            setProject(updated);
            setNewResource({ title: '', resource_type: 'link', url: '', description: '' });
        } catch (error) {
            alert('Failed to add resource');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteResource = async (resourceId: number) => {
        if (!confirm('Delete this resource?')) return;
        try {
            await projectsApi.deleteResource(Number(params.id), resourceId);
            const updated = await projectsApi.get(Number(params.id));
            setProject(updated);
        } catch (error) {
            alert('Failed to delete resource');
        }
    };

    if (loading) {
        return (
            <div className="app-container">
                <div className="main-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p className="text-secondary animate-pulse">Loading project...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="app-container">
                <div className="main-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p className="text-secondary">Project not found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div style={{ marginBottom: '3rem' }}>
                    <h2 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>BADM 550</h2>
                    <p style={{ fontSize: '0.75rem', fontWeight: 500 }}>INSTRUCTOR PORTAL</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <a href="/instructor" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        Dashboard
                    </a>
                    <a href="/instructor/projects" className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--accent-secondary)' }}>
                        Projects
                    </a>
                    <a href="/instructor/admin" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        Admin
                    </a>
                </nav>
            </aside>

            <main className="main-view animate-fade-in">
                <div style={{ marginBottom: '1rem' }}>
                    <Link href="/instructor/projects" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
                        ← Back to Projects
                    </Link>
                </div>

                <header style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        <span className="text-gradient">Edit: {project.name}</span>
                    </h1>
                </header>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                    {(['details', 'milestones', 'resources'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
                            style={{ textTransform: 'capitalize' }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Details Tab */}
                {activeTab === 'details' && (
                    <div className="glass-card" style={{ padding: '2rem', maxWidth: '600px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                                    PROJECT NAME
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '10px',
                                        background: 'var(--bg-darker)',
                                        border: '1px solid var(--border-light)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                                    CLIENT NAME
                                </label>
                                <input
                                    type="text"
                                    value={formData.client_name}
                                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '10px',
                                        background: 'var(--bg-darker)',
                                        border: '1px solid var(--border-light)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                                    DESCRIPTION
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={5}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '10px',
                                        background: 'var(--bg-darker)',
                                        border: '1px solid var(--border-light)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.9rem',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                                    STATUS
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '10px',
                                        background: 'var(--bg-darker)',
                                        border: '1px solid var(--border-light)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <button
                                onClick={handleUpdateProject}
                                disabled={saving}
                                className="btn btn-primary"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Milestones Tab */}
                {activeTab === 'milestones' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                {project.milestones.length} milestone{project.milestones.length !== 1 ? 's' : ''}
                            </p>
                            <button onClick={handleAddMilestone} className="btn btn-secondary">
                                + Add Milestone
                            </button>
                        </div>

                        {editingMilestone && (
                            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                                <h3 style={{ marginBottom: '1.5rem' }}>
                                    {editingMilestone.id ? 'Edit' : 'New'} Milestone
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                                            WEEK NUMBER
                                        </label>
                                        <input
                                            type="number"
                                            value={editingMilestone.week_number}
                                            onChange={(e) => setEditingMilestone({ ...editingMilestone, week_number: Number(e.target.value) })}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '10px',
                                                background: 'var(--bg-darker)',
                                                border: '1px solid var(--border-light)',
                                                color: 'var(--text-primary)'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                                            TITLE
                                        </label>
                                        <input
                                            type="text"
                                            value={editingMilestone.title}
                                            onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '10px',
                                                background: 'var(--bg-darker)',
                                                border: '1px solid var(--border-light)',
                                                color: 'var(--text-primary)'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div style={{ marginTop: '1rem' }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                                        THEME
                                    </label>
                                    <input
                                        type="text"
                                        value={editingMilestone.theme || ''}
                                        onChange={(e) => setEditingMilestone({ ...editingMilestone, theme: e.target.value })}
                                        placeholder="e.g., Understanding the Data"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '10px',
                                            background: 'var(--bg-darker)',
                                            border: '1px solid var(--border-light)',
                                            color: 'var(--text-primary)'
                                        }}
                                    />
                                </div>
                                <div style={{ marginTop: '1rem' }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                                        DESCRIPTION
                                    </label>
                                    <textarea
                                        value={editingMilestone.description || ''}
                                        onChange={(e) => setEditingMilestone({ ...editingMilestone, description: e.target.value })}
                                        rows={4}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '10px',
                                            background: 'var(--bg-darker)',
                                            border: '1px solid var(--border-light)',
                                            color: 'var(--text-primary)',
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>
                                <div style={{ marginTop: '1rem' }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                                        GUIDANCE NOTES
                                    </label>
                                    <textarea
                                        value={editingMilestone.guidance_notes || ''}
                                        onChange={(e) => setEditingMilestone({ ...editingMilestone, guidance_notes: e.target.value })}
                                        rows={3}
                                        placeholder="Tips and hints for students..."
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '10px',
                                            background: 'var(--bg-darker)',
                                            border: '1px solid var(--border-light)',
                                            color: 'var(--text-primary)',
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                    <button onClick={handleSaveMilestone} disabled={saving} className="btn btn-primary">
                                        {saving ? 'Saving...' : 'Save Milestone'}
                                    </button>
                                    <button onClick={() => setEditingMilestone(null)} className="btn btn-ghost">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {project.milestones
                                .sort((a, b) => a.week_number - b.week_number)
                                .map((milestone) => (
                                    <div key={milestone.id || milestone.week_number} className="glass-card" style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    background: 'var(--accent-primary)',
                                                    borderRadius: '10px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 700,
                                                    flexShrink: 0
                                                }}>
                                                    {milestone.week_number}
                                                </div>
                                                <div>
                                                    <h4 style={{ marginBottom: '0.25rem' }}>{milestone.title}</h4>
                                                    {milestone.theme && (
                                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{milestone.theme}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => setEditingMilestone(milestone)}
                                                    className="btn btn-ghost"
                                                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteMilestone(milestone.week_number)}
                                                    className="btn btn-ghost"
                                                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: 'var(--danger)' }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Resources Tab */}
                {activeTab === 'resources' && (
                    <div>
                        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Add Project Resource</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                                        TITLE
                                    </label>
                                    <input
                                        type="text"
                                        value={newResource.title}
                                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                                        placeholder="Resource title"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '10px',
                                            background: 'var(--bg-darker)',
                                            border: '1px solid var(--border-light)',
                                            color: 'var(--text-primary)'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                                        TYPE
                                    </label>
                                    <select
                                        value={newResource.resource_type}
                                        onChange={(e) => setNewResource({ ...newResource, resource_type: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '10px',
                                            background: 'var(--bg-darker)',
                                            border: '1px solid var(--border-light)',
                                            color: 'var(--text-primary)'
                                        }}
                                    >
                                        {resourceTypes.map(t => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                                    URL
                                </label>
                                <input
                                    type="url"
                                    value={newResource.url}
                                    onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                                    placeholder="https://..."
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '10px',
                                        background: 'var(--bg-darker)',
                                        border: '1px solid var(--border-light)',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                                    DESCRIPTION
                                </label>
                                <input
                                    type="text"
                                    value={newResource.description || ''}
                                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                                    placeholder="Optional description"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '10px',
                                        background: 'var(--bg-darker)',
                                        border: '1px solid var(--border-light)',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                            </div>
                            <button
                                onClick={handleAddResource}
                                disabled={saving || !newResource.title || !newResource.url}
                                className="btn btn-secondary"
                                style={{ marginTop: '1.5rem' }}
                            >
                                {saving ? 'Adding...' : 'Add Resource'}
                            </button>
                        </div>

                        <h3 style={{ marginBottom: '1rem' }}>Project Resources ({project.resources.length})</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {project.resources.map((resource) => (
                                <div
                                    key={resource.id}
                                    className="glass-card"
                                    style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <div>
                                        <p style={{ fontWeight: 500 }}>{resource.title}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {resourceTypes.find(t => t.value === resource.resource_type)?.label}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => resource.id && handleDeleteResource(resource.id)}
                                        className="btn btn-ghost"
                                        style={{ padding: '0.5rem', color: 'var(--danger)' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
