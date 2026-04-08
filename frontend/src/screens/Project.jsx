import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/User.context.jsx'
import { useLocation } from 'react-router-dom'
import axios from '../config/Axios'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'

/* ── fonts ── */
const FontLink = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
)

/* ── design tokens ── */
const T = {
  bg:      '#03030a',
  surface: '#06060f',
  panel:   '#08081a',
  border:  'rgba(255,255,255,0.06)',
  text:    'rgba(255,255,255,0.85)',
  muted:   'rgba(255,255,255,0.35)',
  dim:     'rgba(255,255,255,0.15)',
  violet:  '#7c3aed',
  emerald: '#34d399',
  grad:    'linear-gradient(135deg,#7c3aed,#06b6d4)',
}

const CSS = `
  *{box-sizing:border-box;}
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}
  .msg-in{animation:fadeUp .18s ease forwards}
  @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  .user-row:hover{background:rgba(255,255,255,0.04)}
  .user-sel{background:rgba(124,58,237,0.15)!important;border-color:rgba(124,58,237,0.4)!important}
  .icon-btn:hover{background:rgba(255,255,255,0.07)!important;color:rgba(255,255,255,0.9)!important}
`

/* ── helpers ── */
const avatarColor = (str = '') => {
  const colors = ['#7c3aed','#0891b2','#be185d','#b45309','#047857','#1d4ed8']
  let h = 0
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h)
  return colors[Math.abs(h) % colors.length]
}

// Show first letter of the part before @
const initials = (email = '') => {
  const local = email.split('@')[0] || email
  return local.slice(0, 2).toUpperCase()
}

function UserAvatar({ email = '', size = 28 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: avatarColor(email),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.34, fontWeight: 700, color: '#fff', flexShrink: 0,
      fontFamily: "'DM Sans',sans-serif", letterSpacing: '0.02em',
    }}>{initials(email)}</div>
  )
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
const Project = () => {
  const location = useLocation()

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const [isModalOpen,     setIsModalOpen]      = useState(false)
  const [selectedUserId,  setSelectedUserId]   = useState(new Set())
  const [project,         setProject]          = useState(location.state.project)
  const [message,         setMessage]          = useState('')
  const { user }                               = useContext(UserContext)
  const messageBox                             = useRef(null)

  const [users,    setUsers]    = useState([])
  const [messages, setMessages] = useState([])

  /* ── user selection ── */
  const handleUserClick = (id) => {
    setSelectedUserId(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  /* ── add collaborators ── */
  function addCollaborators() {
    axios.put('/project/add-user', {
      projectId: location.state.project._id,
      users: Array.from(selectedUserId),
    }).then(res => {
      console.log(res.data)
      setIsModalOpen(false)
      // refresh project to get updated users list
      axios.get(`/project/get-project/${location.state.project._id}`).then(res => {
        setProject(res.data.project)
      })
    }).catch(err => console.log(err))
  }

  /* ── send message ── */
  const send = () => {
    if (!message.trim()) return
    sendMessage('project-message', { message, sender: user })
    setMessages(prev => [...prev, { sender: user, message }])
    setMessage('')
  }

  const receive = (data) => {
    console.log(data)
    setMessages(prev => [...prev, data])
  }

  /* ── effects ── */
  useEffect(() => {
    initializeSocket(project._id)

    receiveMessage('project-message', data => {
      console.log(data)
      setMessages(prev => [...prev, data])
    })

    axios.get(`/project/get-project/${location.state.project._id}`).then(res => {
      
      setProject(res.data.project)
    })

    axios.get('/user/all').then(res => setUsers(res.data.users)).catch(console.log)
  }, [])

  useEffect(() => {
    if (messageBox.current) messageBox.current.scrollTop = messageBox.current.scrollHeight
  }, [messages])

  /* ── sender identity check ── */
  // Compare both _id and email to be safe across socket vs local state
  const isMyMessage = (msg) => {
    // console.log(msg)
    const senderId = msg.sender?._id?.toString()
    const userId   = user?._id?.toString()
    const senderEmail = msg.sender?.email
    return senderId && userId && senderId === userId && senderEmail === user.email
  }

  useEffect(() => {
  const savedMessages = localStorage.getItem("messages");

  if (savedMessages) {
    setMessages(JSON.parse(savedMessages));
  }
}, []);

useEffect(() => {
  localStorage.setItem("messages", JSON.stringify(messages));
}, [messages]);
const storageKey = `messages_${project._id}`;
// Load
useEffect(() => {
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    setMessages(JSON.parse(saved));
  }
}, [project._id]);

// Save
useEffect(() => {
  localStorage.setItem(storageKey, JSON.stringify(messages));
}, [messages, project._id]);

  /* ══════ RENDER ══════ */
  return (
    <>
      <FontLink />
      <style>{CSS}</style>

      <main style={{
        height: '100vh', width: '100vw', display: 'flex', overflow: 'hidden',
        background: T.bg, fontFamily: "'DM Sans',sans-serif", color: T.text,
      }}>

        {/* ───────── Chat Panel ───────── */}
        <section style={{
          width: 360, minWidth: 300, display: 'flex', flexDirection: 'column',
          background: T.surface, borderRight: `1px solid ${T.border}`,
          position: 'relative', flexShrink: 0,
        }}>

          {/* Chat header */}
          <header style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', background: T.panel,
            borderBottom: `1px solid ${T.border}`, flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9, background: T.grad,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 14, color: '#fff',
              }}>
                {project.name?.[0]?.toUpperCase() || 'P'}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{project.name}</div>
                <div style={{ fontSize: 10, color: T.emerald, marginTop: 1 }}>● Live</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {/* Add collaborator */}
              <button className="icon-btn" onClick={() => setIsModalOpen(true)} title="Add collaborator" style={iconBtnStyle}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
              </button>
              {/* View collaborators */}
              <button className="icon-btn" onClick={() => setIsSidePanelOpen(true)} title="View collaborators" style={iconBtnStyle}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </button>
            </div>
          </header>

          {/* ── Messages area ── */}
          <div
            ref={messageBox}
            style={{
              flex: 1, overflowY: 'auto', padding: '16px 12px',
              display: 'flex', flexDirection: 'column', gap: 12,
            }}
          >
            {messages.length === 0 && (
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 8,
                color: T.dim, paddingTop: 40,
              }}>
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24" opacity=".4">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span style={{ fontSize: 11 }}>No messages yet. Say hi!</span>
              </div>
            )}

            {messages.map((msg, i) => {
              const isMe = isMyMessage(msg)
              const senderEmail = msg.sender.user.email || ''

             return (
 <div
  key={i}
  className="msg-in"
  style={{
    display: 'flex',
    flexDirection: isMe ? 'row-reverse' : 'row',
    alignItems: 'flex-end',
    gap: 8,
  }}
>
  {/* Avatar — only for others */}
  {!isMe && <UserAvatar email={senderEmail} size={28} />}

  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isMe ? 'flex-end' : 'flex-start', // ✅ FIXED
      maxWidth: '75%',
      gap: 3,
    }}
  >
    {/* Sender email — only for others */}
    {!isMe && (
      <span
        style={{
          fontSize: 10,
          color: T.muted,
          paddingLeft: 4,
        }}
      >
        {senderEmail}
      </span>
    )}

    {/* Bubble */}
    <div
      style={{
        padding: '9px 13px',
        borderRadius: 14,
        borderBottomRightRadius: isMe ? 3 : 14,
        borderBottomLeftRadius: isMe ? 14 : 3,
        background: isMe
          ? 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(6,182,212,0.2))'
          : 'rgba(255,255,255,0.05)',
        border: isMe
          ? '1px solid rgba(124,58,237,0.3)'
          : `1px solid ${T.border}`,
        color: T.text,
      }}
    >
      {msg.message}
    </div>
  </div>
</div>)
            })}
          </div>

          {/* ── Input ── */}
          <div style={{
            padding: '10px 12px 14px', borderTop: `1px solid ${T.border}`,
            background: T.panel, flexShrink: 0,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${T.border}`,
              borderRadius: 12, padding: '8px 8px 8px 14px',
              transition: 'border-color .2s',
            }}>
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
                }}
                placeholder="Send a message..."
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: T.text, fontSize: 12.5, fontFamily: "'DM Sans',sans-serif",
                  placeholder: T.dim,
                }}
              />
              <button
                onClick={send}
                disabled={!message.trim()}
                style={{
                  width: 30, height: 30, borderRadius: 9,
                  background: message.trim() ? T.grad : 'rgba(255,255,255,0.06)',
                  border: 'none',
                  cursor: message.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 13, flexShrink: 0,
                  transition: 'all .15s',
                  opacity: message.trim() ? 1 : 0.35,
                }}
              >↑</button>
            </div>
            <p style={{ textAlign: 'center', fontSize: 10, color: T.dim, marginTop: 6, marginBottom: 0 }}>
              Enter to send · Shift+Enter for new line
            </p>
          </div>

          {/* ── Collaborators slide-over ── */}
          <div style={{
            position: 'absolute', inset: 0, background: T.panel,
            transform: isSidePanelOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform .25s cubic-bezier(.4,0,.2,1)', zIndex: 20,
            display: 'flex', flexDirection: 'column',
          }}>
            <header style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px', borderBottom: `1px solid ${T.border}`, flexShrink: 0,
            }}>
              <div>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15 }}>Collaborators</span>
                <span style={{
                  marginLeft: 8, fontSize: 10, background: 'rgba(124,58,237,0.2)',
                  border: '1px solid rgba(124,58,237,0.3)', color: '#c4b5fd',
                  padding: '2px 7px', borderRadius: 20, fontWeight: 600,
                }}>
                  {project.users?.length || 0}
                </span>
              </div>
              <button className="icon-btn" onClick={() => setIsSidePanelOpen(false)} style={iconBtnStyle}>✕</button>
            </header>

            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
              {project.users?.length === 0 && (
                <div style={{ padding: '24px 16px', textAlign: 'center', color: T.dim, fontSize: 12 }}>
                  No collaborators yet
                </div>
              )}
              {project.users?.map((u, i) => (
                <div
                  key={u._id || i}
                  className="user-row"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 10, cursor: 'default',
                    transition: 'background .15s',
                  }}
                >
                  <UserAvatar email={u.email} size={34} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 12, fontWeight: 500, color: T.text,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {u.email}
                    </div>
                    <div style={{ fontSize: 10, color: T.muted, marginTop: 1 }}>{u.name}</div>
                  </div>
                  {/* online dot */}
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: T.emerald,
                    boxShadow: `0 0 6px ${T.emerald}`,
                    flexShrink: 0,
                  }}/>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── Right panel ───────── */}
        <section style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: T.bg, color: T.dim, flexDirection: 'column', gap: 12,
        }}>
          <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24" opacity=".2">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
          </svg>
          <span style={{ fontSize: 13 }}>Nothing here yet</span>
        </section>

      </main>

      {/* ───────── Modal: Add Collaborators ───────── */}
      {isModalOpen && (
        <div
          onClick={e => e.target === e.currentTarget && setIsModalOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div style={{
            background: '#08081a', border: `1px solid ${T.border}`,
            borderRadius: 20, width: 420, padding: 24,
            boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, margin: 0 }}>
                Add Collaborator
              </h2>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)} style={iconBtnStyle}>✕</button>
            </div>
            <p style={{ fontSize: 12, color: T.muted, marginBottom: 18 }}>
              Select users to invite to <strong style={{ color: T.text }}>{project.name}</strong>
            </p>

            <div style={{
              maxHeight: 300, overflowY: 'auto',
              display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 18,
            }}>
              {users.map(u => {
                const sel = selectedUserId.has(u._id)
                // skip users already in the project
                const alreadyAdded = project.users?.some(pu => pu._id === u._id)
                return (
                  <div
                    key={u._id}
                    className={`user-row${sel ? ' user-sel' : ''}`}
                    onClick={() => !alreadyAdded && handleUserClick(u._id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 10,
                      cursor: alreadyAdded ? 'default' : 'pointer',
                      border: `1px solid ${sel ? 'rgba(124,58,237,0.3)' : 'transparent'}`,
                      transition: 'all .15s',
                      opacity: alreadyAdded ? 0.4 : 1,
                    }}
                  >
                    <UserAvatar email={u.email} size={32} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13, fontWeight: 500,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {u.email}
                      </div>
                      {alreadyAdded && (
                        <div style={{ fontSize: 10, color: T.emerald, marginTop: 1 }}>Already a member</div>
                      )}
                    </div>
                    {!alreadyAdded && (
                      <div style={{
                        width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                        background: sel ? T.violet : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${sel ? T.violet : T.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, transition: 'all .15s', color: '#fff',
                      }}>
                        {sel && '✓'}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 10,
                  border: `1px solid ${T.border}`,
                  background: 'transparent', color: T.muted,
                  fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
                }}
              >Cancel</button>
              <button
                onClick={addCollaborators}
                disabled={selectedUserId.size === 0}
                style={{
                  flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                  background: selectedUserId.size > 0 ? T.grad : 'rgba(255,255,255,0.06)',
                  color: '#fff', fontSize: 13, fontWeight: 600,
                  cursor: selectedUserId.size > 0 ? 'pointer' : 'not-allowed',
                  fontFamily: "'DM Sans',sans-serif", transition: 'all .15s',
                  opacity: selectedUserId.size > 0 ? 1 : 0.5,
                }}
              >
                Add {selectedUserId.size > 0 ? `(${selectedUserId.size})` : ''} Collaborators
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const iconBtnStyle = {
  width: 30, height: 30, borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.07)',
  background: 'transparent', color: 'rgba(255,255,255,0.35)',
  cursor: 'pointer', display: 'flex', alignItems: 'center',
  justifyContent: 'center', fontSize: 13, transition: 'all .15s',
  flexShrink: 0,
}

export default Project