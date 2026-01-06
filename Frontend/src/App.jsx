import { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { api } from './api';
import { successAlert, errorAlert, confirmAlert } from './utills/alert';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(false);

  const filteredQuery = useMemo(() => search.trim(), [search]);

  const stats = useMemo(() => {
    const total = todos.length;
    const done = todos.filter((t) => t.completed).length;
    const active = total - done;
    return { total, done, active };
  }, [todos]);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/todos', {
        params: { search: filteredQuery || undefined },
      });
      setTodos(res.data);
    } catch (e) {
      errorAlert(
        'Gagal Memuat Data',
        e?.response?.data?.message || 'Tidak bisa mengambil data todo',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [filteredQuery]);

  const addTodo = async () => {
    const title = newTitle.trim();
    if (!title) {
      errorAlert('Gagal', 'Judul todo tidak boleh kosong');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/todos', { title });
      setNewTitle('');
      await fetchTodos();
      successAlert('Berhasil', 'Todo berhasil ditambahkan');
    } catch (e) {
      errorAlert(
        'Error',
        e?.response?.data?.message || 'Gagal menambahkan todo',
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id) => {
    const result = await confirmAlert(
      'Ubah Status?',
      'Apakah kamu yakin ingin mengubah status todo ini?',
    );

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      await api.patch(`/api/todos/${id}`);
      await fetchTodos();
      successAlert('Berhasil', 'Status todo berhasil diubah');
    } catch (e) {
      errorAlert(
        'Error',
        e?.response?.data?.message || 'Gagal mengubah status',
      );
    } finally {
      setLoading(false);
    }
  };

  const editTodo = async (todo) => {
    const result = await Swal.fire({
      title: 'Edit Todo',
      input: 'text',
      inputValue: todo.title,
      inputPlaceholder: 'Masukkan judul todo...',
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      focusConfirm: false,
      inputValidator: (value) => {
        if (!value || !value.trim()) return 'Judul tidak boleh kosong';
        return null;
      },
    });

    if (!result.isConfirmed) return;

    const nextTitle = (result.value || '').trim();
    if (!nextTitle || nextTitle === todo.title) return;

    setLoading(true);
    try {
      await api.put(`/api/todos/${todo.id}`, { title: nextTitle });
      await fetchTodos();
      successAlert('Berhasil', 'Todo berhasil diperbarui');
    } catch (e) {
      errorAlert(
        'Error',
        e?.response?.data?.message || 'Gagal update todo',
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    const result = await confirmAlert(
      'Hapus Todo?',
      'Todo yang dihapus tidak akan ditampilkan lagi',
    );

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      await api.delete(`/api/todos/${id}`);
      await fetchTodos();
      successAlert('Berhasil', 'Todo berhasil dihapus');
    } catch (e) {
      errorAlert('Error', e?.response?.data?.message || 'Gagal menghapus todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerCard}>
          <div style={styles.headerLeft}>
            <div style={styles.logo}>✅</div>
            <div>
              <h1 style={styles.h1}>Todo App</h1>
              <p style={styles.sub}>
                Manage task kamu dengan cepat — add, edit, search, dan delete.
              </p>
            </div>
          </div>

          <div style={styles.statsWrap}>
            <Stat label="Total" value={stats.total} />
            <Stat label="Active" value={stats.active} />
            <Stat label="Completed" value={stats.done} />
          </div>
        </div>

        {/* Actions */}
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Tambah Todo</h3>
            <div style={styles.formRow}>
              <input
                style={styles.input}
                placeholder="Contoh: Belajar NestJS..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addTodo();
                }}
                disabled={loading}
              />
              <button
                style={styles.primaryBtn}
                onClick={addTodo}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Add'}
              </button>
            </div>
            <p style={styles.hint}>
              Tips: tekan <b>Enter</b> untuk menambah todo.
            </p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Cari Todo</h3>
            <div style={styles.formRow}>
              <input
                style={styles.input}
                placeholder="Cari berdasarkan judul..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={loading}
              />
              <button
                style={styles.ghostBtn}
                onClick={fetchTodos}
                disabled={loading}
              >
                Refresh
              </button>
            </div>
            <div style={styles.pills}>
              <span style={styles.pill}>
                Menampilkan <b>{todos.length}</b> item
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h3 style={styles.tableTitle}>Daftar Todo</h3>
            <span style={styles.smallMuted}>
              {loading ? 'Syncing...' : 'Up to date'}
            </span>
          </div>

          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Title</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Status</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {todos.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={styles.empty}>
                      Belum ada todo. Tambahkan task pertama kamu ✨
                    </td>
                  </tr>
                ) : (
                  todos.map((t) => (
                    <tr key={t.id} style={styles.tr}>
                      <td style={styles.tdId}>#{t.id}</td>
                      <td style={styles.tdTitle}>
                        <div style={styles.titleWrap}>
                          <span style={styles.titleText}>{t.title}</span>
                          {t.completed ? (
                            <span style={styles.badgeDone}>Completed</span>
                          ) : (
                            <span style={styles.badgeActive}>Active</span>
                          )}
                        </div>
                      </td>

                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <label style={styles.switch}>
                          <input
                            type="checkbox"
                            checked={t.completed}
                            onChange={() => toggleTodo(t.id)}
                            disabled={loading}
                          />
                          <span style={styles.slider} />
                        </label>
                      </td>

                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <button
                          style={styles.editBtn}
                          onClick={() => editTodo(t)}
                          disabled={loading}
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => deleteTodo(t.id)}
                          disabled={loading}
                          title="Delete"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <footer style={styles.footer}>
          <small>© {new Date().getFullYear()} Eri Sukmawan — Fullstack Developer</small>
        </footer>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.stat}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background:
      'radial-gradient(1200px 600px at 10% 10%, rgba(59,130,246,0.25), transparent), radial-gradient(900px 500px at 90% 10%, rgba(34,197,94,0.18), transparent), linear-gradient(180deg, #0b1220 0%, #0b1220 100%)',
    padding: 24,
  },
  container: {
    maxWidth: 1100,
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial',
    color: '#e5e7eb',
  },

  headerCard: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.10)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 12px 28px rgba(0,0,0,0.35)',
    marginBottom: 16,
  },
  headerLeft: { display: 'flex', gap: 14, alignItems: 'center' },
  logo: {
    width: 46,
    height: 46,
    display: 'grid',
    placeItems: 'center',
    borderRadius: 14,
    background: 'rgba(59,130,246,0.20)',
    border: '1px solid rgba(59,130,246,0.35)',
  },
  h1: { margin: 0, fontSize: 22, letterSpacing: 0.2 },
  sub: { margin: '4px 0 0', color: 'rgba(229,231,235,0.75)', fontSize: 13 },

  statsWrap: { display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' },
  stat: {
    minWidth: 110,
    padding: '10px 12px',
    borderRadius: 14,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.10)',
    textAlign: 'center',
  },
  statLabel: { fontSize: 12, color: 'rgba(229,231,235,0.70)' },
  statValue: { fontSize: 18, fontWeight: 700, marginTop: 2 },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.10)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.25)',
  },
  cardTitle: { margin: 0, fontSize: 14, color: 'rgba(229,231,235,0.85)' },

  formRow: { display: 'flex', gap: 10, marginTop: 12 },
  input: {
    flex: 1,
    padding: '12px 12px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(0,0,0,0.25)',
    color: '#e5e7eb',
    outline: 'none',
  },
  hint: { marginTop: 10, fontSize: 12, color: 'rgba(229,231,235,0.65)' },

  primaryBtn: {
    padding: '12px 14px',
    borderRadius: 12,
    border: '1px solid rgba(59,130,246,0.35)',
    background: 'rgba(59,130,246,0.20)',
    color: '#e5e7eb',
    cursor: 'pointer',
    fontWeight: 600,
  },
  ghostBtn: {
    padding: '12px 14px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.06)',
    color: '#e5e7eb',
    cursor: 'pointer',
    fontWeight: 600,
  },

  pills: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 },
  pill: {
    fontSize: 12,
    padding: '6px 10px',
    borderRadius: 999,
    background: 'rgba(34,197,94,0.12)',
    border: '1px solid rgba(34,197,94,0.25)',
  },
  pillMuted: {
    fontSize: 12,
    padding: '6px 10px',
    borderRadius: 999,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.10)',
    color: 'rgba(229,231,235,0.80)',
  },

  tableCard: {
    padding: 16,
    borderRadius: 16,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.10)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.25)',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tableTitle: { margin: 0, fontSize: 14, color: 'rgba(229,231,235,0.90)' },
  smallMuted: { fontSize: 12, color: 'rgba(229,231,235,0.65)' },

  tableWrap: { overflowX: 'auto' },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    minWidth: 820,
  },
  th: {
    textAlign: 'left',
    fontSize: 12,
    letterSpacing: 0.3,
    color: 'rgba(229,231,235,0.70)',
    padding: '12px 10px',
    borderBottom: '1px solid rgba(255,255,255,0.10)',
  },
  tr: {},
  td: {
    padding: '12px 10px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    color: 'rgba(229,231,235,0.92)',
  },
  tdId: {
    padding: '12px 10px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    color: 'rgba(229,231,235,0.70)',
    width: 70,
  },
  tdTitle: {
    padding: '12px 10px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },

  titleWrap: { display: 'flex', gap: 10, alignItems: 'center' },
  titleText: { fontWeight: 600 },
  badgeDone: {
    fontSize: 11,
    padding: '4px 8px',
    borderRadius: 999,
    background: 'rgba(34,197,94,0.14)',
    border: '1px solid rgba(34,197,94,0.25)',
    color: '#bbf7d0',
  },
  badgeActive: {
    fontSize: 11,
    padding: '4px 8px',
    borderRadius: 999,
    background: 'rgba(59,130,246,0.14)',
    border: '1px solid rgba(59,130,246,0.25)',
    color: '#bfdbfe',
  },

  editBtn: {
    padding: '8px 12px',
    borderRadius: 12,
    border: '1px solid rgba(251,191,36,0.35)',
    background: 'rgba(251,191,36,0.15)',
    color: '#fde68a',
    cursor: 'pointer',
    fontWeight: 600,
    marginRight: 8,
  },
  deleteBtn: {
    padding: '8px 12px',
    borderRadius: 12,
    border: '1px solid rgba(239,68,68,0.35)',
    background: 'rgba(239,68,68,0.15)',
    color: '#fecaca',
    cursor: 'pointer',
    fontWeight: 600,
  },

  empty: {
    textAlign: 'center',
    padding: 22,
    color: 'rgba(229,231,235,0.70)',
  },

  footer: {
    marginTop: 14,
    textAlign: 'center',
    color: 'rgba(229,231,235,0.55)',
  },

  switch: { position: 'relative', display: 'inline-block', width: 46, height: 26 },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255,255,255,0.20)',
    transition: '0.2s',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.12)',
  },
};

const styleTag = document.createElement('style');
styleTag.innerHTML = `
  label[style*="position: relative"][style*="width: 46px"] input { opacity: 0; width: 0; height: 0; }
  label[style*="position: relative"][style*="width: 46px"] span::before {
    content: "";
    position: absolute;
    height: 20px;
    width: 20px;
    left: 3px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.90);
    transition: .2s;
    border-radius: 999px;
  }
  label[style*="position: relative"][style*="width: 46px"] input:checked + span {
    background: rgba(34,197,94,0.30);
    border-color: rgba(34,197,94,0.35);
  }
  label[style*="position: relative"][style*="width: 46px"] input:checked + span::before {
    transform: translate(20px, -50%);
  }

  @media (max-width: 900px) {
    .grid { grid-template-columns: 1fr !important; }
  }
`;
if (!document.head.querySelector('style[data-todo-ui="1"]')) {
  styleTag.setAttribute('data-todo-ui', '1');
  document.head.appendChild(styleTag);
}
