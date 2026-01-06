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
    id: number;
    project_id: number;
    week_number: number;
    title: string;
    theme?: string;
    description?: string;
    deliverables?: Deliverable[];
    resources?: MilestoneResource[];
    guidance_notes?: string;
    due_date?: string;
}

interface Submission {
    id: number;
    submission_type: string;
    submission_url?: string;
    status: string;
    ai_feedback?: string;
    instructor_feedback?: string;
    score?: number;
    submitted_at: string;
}

export default function MilestoneDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [milestone, setMilestone] = useState<Milestone | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [submissionUrl, setSubmissionUrl] = useState('');
    const [submissionNotes, setSubmissionNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (params.id && params.week) {
            Promise.all([
                projectsApi.getMilestone(Number(params.id), Number(params.week)),
                projectsApi.listMySubmissions(Number(params.id))
            ])
                .then(([milestoneData, submissionsData]) => {
                    setMilestone(milestoneData);
                    // Filter submissions for this milestone
                    setSubmissions(submissionsData.filter((s: any) => s.milestone_id === milestoneData.id));
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [params.id, params.week]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!submissionUrl) return;

        setSubmitting(true);
        try {
            await projectsApi.submit(Number(params.id), Number(params.week), {
                submission_type: 'link',
                submission_url: submissionUrl,
                notes: submissionNotes || undefined
            });
            // Refresh submissions
            const newSubmissions = await projectsApi.listMySubmissions(Number(params.id));
            setSubmissions(newSubmissions.filter((s: any) => s.milestone_id === milestone?.id));
            setSubmissionUrl('');
            setSubmissionNotes('');
            alert('Submitted successfully!');
        } catch (error) {
            alert('Submission failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="app-container">
                <div className="main-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p className="text-secondary animate-pulse">Loading milestone...</p>
                </div>
            </div>
        );
    }

    if (!milestone) {
        return (
            <div className="app-container">
                <div className="main-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p className="text-secondary">Milestone not found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div style={{ marginBottom: '3rem' }}>
                    <h2 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>BADM 550</h2>
                    <p style={{ fontSize: '0.75rem', fontWeight: 500 }}>STUDENT PORTAL</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <a href="/student" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        Home
                    </a>
                    <a href="/student/projects" className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--accent-secondary)' }}>
                        Projects
                    </a>
                    <a href="/student/team" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        My Team
                    </a>
                </nav>

                {/* Submission status */}
                <div className="glass-card" style={{ padding: '1.25rem', marginTop: 'auto' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>WEEK {milestone.week_number}</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{milestone.title}</p>
                    {submissions.length > 0 && (
                        <span className="badge badge-success" style={{ marginTop: '0.5rem' }}>
                            SUBMITTED
                        </span>
                    )}
                </div>
            </aside>

            <main className="main-view animate-fade-in">
                <div style={{ marginBottom: '1rem' }}>
                    <Link
                        href={`/student/projects/${params.id}`}
                        style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}
                    >
                        ← Back to Project
                    </Link>
                </div>

                <header style={{ marginBottom: '3rem' }}>
                    <p style={{ color: 'var(--accent-secondary)', fontSize: '1rem', marginBottom: '0.5rem' }}>
                        Week {milestone.week_number}
                    </p>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        <span className="text-gradient">{milestone.title}</span>
                    </h1>
                    {milestone.theme && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            {milestone.theme}
                        </p>
                    )}
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '3rem' }}>
                    {/* Main content */}
                    <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Description */}
                        {milestone.description && (
                            <div className="glass-card" style={{ padding: '2rem' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Overview</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                                    {milestone.description}
                                </p>
                            </div>
                        )}

                        {/* Milestone Resources (videos, notebooks, etc.) */}
                        {milestone.resources && milestone.resources.length > 0 && (
                            <div className="glass-card" style={{ padding: '2rem' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Resources</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {milestone.resources.map((resource, index) => (
                                        <ResourceLink key={index} resource={resource} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Deliverables */}
                        {milestone.deliverables && milestone.deliverables.length > 0 && (
                            <div className="glass-card" style={{ padding: '2rem' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Deliverables</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {milestone.deliverables.map((deliverable, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                padding: '1.25rem',
                                                background: 'var(--bg-darker)',
                                                borderRadius: '12px',
                                                borderLeft: '3px solid var(--accent-primary)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                                                    {deliverable.name}
                                                </h4>
                                                {deliverable.points && (
                                                    <span className="badge badge-info">{deliverable.points} pts</span>
                                                )}
                                            </div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                {deliverable.description}
                                            </p>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                                                Submit: {deliverable.submission_type}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Guidance Notes */}
                        {milestone.guidance_notes && (
                            <div className="glass-card" style={{
                                padding: '2rem',
                                borderLeft: '3px solid var(--accent-secondary)'
                            }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--accent-secondary)' }}>
                                    Instructor Tips
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                                    {milestone.guidance_notes}
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Sidebar - Submission */}
                    <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Submit Form */}
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Submit Your Work</h3>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                                        SUBMISSION LINK
                                    </label>
                                    <input
                                        type="url"
                                        value={submissionUrl}
                                        onChange={(e) => setSubmissionUrl(e.target.value)}
                                        placeholder="Paste your Colab/Drive link"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '10px',
                                            background: 'var(--bg-darker)',
                                            border: '1px solid var(--border-light)',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.9rem'
                                        }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                                        NOTES (OPTIONAL)
                                    </label>
                                    <textarea
                                        value={submissionNotes}
                                        onChange={(e) => setSubmissionNotes(e.target.value)}
                                        placeholder="Any notes for the instructor..."
                                        rows={3}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '10px',
                                            background: 'var(--bg-darker)',
                                            border: '1px solid var(--border-light)',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.9rem',
                                            resize: 'none'
                                        }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting || !submissionUrl}
                                    className="btn btn-primary"
                                    style={{ width: '100%' }}
                                >
                                    {submitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </form>
                        </div>

                        {/* Previous Submissions */}
                        {submissions.length > 0 && (
                            <div className="glass-card" style={{ padding: '2rem' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Your Submissions</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {submissions.map((sub) => (
                                        <div
                                            key={sub.id}
                                            style={{
                                                padding: '1rem',
                                                background: 'var(--bg-darker)',
                                                borderRadius: '10px'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                <span className={`badge ${
                                                    sub.status === 'graded' ? 'badge-success' :
                                                    sub.status === 'reviewed' ? 'badge-info' :
                                                    'badge-warning'
                                                }`}>
                                                    {sub.status.toUpperCase()}
                                                </span>
                                                {sub.score !== null && sub.score !== undefined && (
                                                    <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>
                                                        {sub.score} pts
                                                    </span>
                                                )}
                                            </div>
                                            {sub.submission_url && (
                                                <a
                                                    href={sub.submission_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: 'var(--accent-secondary)', fontSize: '0.85rem' }}
                                                >
                                                    View submission →
                                                </a>
                                            )}
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                                                {new Date(sub.submitted_at).toLocaleString()}
                                            </p>
                                            {sub.ai_feedback && (
                                                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--accent-soft)', borderRadius: '8px' }}>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', marginBottom: '0.25rem' }}>AI FEEDBACK</p>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{sub.ai_feedback}</p>
                                                </div>
                                            )}
                                            {sub.instructor_feedback && (
                                                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: '8px' }}>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>INSTRUCTOR FEEDBACK</p>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{sub.instructor_feedback}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </main>
        </div>
    );
}

function ResourceLink({ resource }: { resource: MilestoneResource }) {
    const isYouTube = resource.type === 'video_youtube';
    const isColab = resource.type === 'notebook_colab';

    if (isYouTube) {
        // Extract video ID and show embed
        const videoId = resource.url.includes('watch?v=')
            ? resource.url.split('watch?v=')[1].split('&')[0]
            : resource.url.split('/').pop();

        return (
            <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>{resource.title}</p>
                <div style={{ aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden' }}>
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        allowFullScreen
                    />
                </div>
                {resource.description && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        {resource.description}
                    </p>
                )}
            </div>
        );
    }

    if (isColab) {
        return (
            <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.25rem',
                    background: '#F9AB00',
                    color: '#000',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textDecoration: 'none'
                }}
            >
                📓 {resource.title}
            </a>
        );
    }

    return (
        <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                background: 'var(--bg-darker)',
                borderRadius: '10px',
                textDecoration: 'none'
            }}
        >
            <span style={{ fontSize: '1.25rem' }}>
                {resource.type === 'document' ? '📄' :
                 resource.type === 'dataset' ? '📊' : '🔗'}
            </span>
            <div>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{resource.title}</p>
                {resource.description && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{resource.description}</p>
                )}
            </div>
        </a>
    );
}
