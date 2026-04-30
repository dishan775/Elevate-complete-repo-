import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoveLeft, Plus, Search, FileText, Trash2, CheckCircle, Clock, StickyNote } from 'lucide-react';
import '../styles/saved-notes.css';

const STORAGE_KEY = 'elevate_saved_notes';

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function persistNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function formatDate(ts) {
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

export default function SavedNotes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState(() => loadNotes());
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState('');
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'typing'

  // Persist whenever notes change
  useEffect(() => { persistNotes(notes); }, [notes]);

  // Active note
  const activeNote = notes.find(n => n.id === activeId) || null;

  // Filtered notes
  const filtered = notes.filter(n => {
    const q = search.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
  });

  // Create new note
  const createNote = useCallback(() => {
    const newNote = {
      id: Date.now().toString(),
      title: '',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveId(newNote.id);
    setSaveStatus('typing');
  }, []);

  // Update note field
  const updateNote = useCallback((field, value) => {
    setSaveStatus('typing');
    setNotes(prev => prev.map(n =>
      n.id === activeId ? { ...n, [field]: value, updatedAt: Date.now() } : n
    ));
    // Simulate auto-save delay
    setTimeout(() => setSaveStatus('saved'), 800);
  }, [activeId]);

  // Delete note
  const deleteNote = useCallback((e, id) => {
    e.stopPropagation();
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeId === id) setActiveId(null);
  }, [activeId]);

  return (
    <div className="saved-notes-page">
      {/* Back Button */}
      <button className="sn-back-btn" onClick={() => navigate('/home')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.06)' }}>
        <MoveLeft size={16} /> Back to Home
      </button>

      {/* Header */}
      <div className="sn-header">
        <div className="sn-header-left">
          <div className="sn-header-icon">
            <StickyNote size={24} />
          </div>
          <div>
            <h1>Saved Notes</h1>
            <div className="sn-header-sub">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'} saved locally
            </div>
          </div>
        </div>
        <button className="sn-add-btn" onClick={createNote}>
          <Plus size={18} /> New Note
        </button>
      </div>

      {/* Layout */}
      <div className="sn-layout">
        {/* Left: Notes List */}
        <div className="sn-list-panel">
          <div className="sn-search-wrap">
            <Search size={16} className="sn-search-icon" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="sn-notes-list">
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>
                {notes.length === 0 ? 'No notes yet. Create your first note!' : 'No matching notes found.'}
              </div>
            )}
            {filtered.map(note => (
              <div
                key={note.id}
                className={`sn-note-card ${activeId === note.id ? 'active' : ''}`}
                onClick={() => setActiveId(note.id)}
              >
                <div className="sn-note-card-title">
                  {note.title || 'Untitled Note'}
                </div>
                <div className="sn-note-card-preview">
                  {note.content || 'No content yet...'}
                </div>
                <div className="sn-note-card-meta">
                  <span className="sn-note-card-date">
                    {formatDate(note.updatedAt)}
                  </span>
                  <button
                    className="sn-note-card-delete"
                    onClick={(e) => deleteNote(e, note.id)}
                    title="Delete note"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Editor */}
        <div className="sn-editor-panel">
          {activeNote ? (
            <>
              <div className="sn-editor-toolbar">
                <div className="sn-editor-toolbar-left">
                  <FileText size={14} />
                  <span>{formatDate(activeNote.updatedAt)}</span>
                </div>
                <div className={`sn-save-status ${saveStatus === 'saved' ? 'saved' : ''}`}>
                  {saveStatus === 'saved' ? (
                    <><CheckCircle size={13} /> Saved</>
                  ) : (
                    <><Clock size={13} /> Saving...</>
                  )}
                </div>
              </div>
              <input
                className="sn-title-input"
                type="text"
                placeholder="Give your note a title..."
                value={activeNote.title}
                onChange={e => updateNote('title', e.target.value)}
                autoFocus
              />
              <textarea
                className="sn-content-area"
                placeholder="Start writing your thoughts, study notes, ideas..."
                value={activeNote.content}
                onChange={e => updateNote('content', e.target.value)}
              />
            </>
          ) : (
            <div className="sn-empty-state">
              <div className="sn-empty-icon">
                <StickyNote size={36} />
              </div>
              <div className="sn-empty-title">Select or create a note</div>
              <div className="sn-empty-sub">
                Click on a note from the list or press "New Note" to start writing.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
