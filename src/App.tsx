import React, { useState, useEffect, useRef } from 'react';
import { Calendar, CheckCircle, Plus, Flame, Brain, Trash2, Link as LinkIcon, Clock, X, MessageSquare, Bell, BellOff, StickyNote, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Sun, Moon, Download, Upload } from 'lucide-react';

// Alarm beep sound (short beep as base64 data URI — no external file needed)
const ALARM_SOUND = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2LkZeYl5KNiIV/e3p6fYKIjpSXmJeTjomEf3t5eX2ChoySl5mYk46JhH97eXl9g4eOk5iZl5KNiIF9enp7f4WKkJWYmZaSjYeBfHl5fIGGjJKXmZiUj4qEfnt5en6DhoyRlpmYlI+KhH57eXp+g4eMkpeZmJSPioR+e3l6foOHjJKXmZiUj4qEfnt5en6Dh4yRl5mYk4+KhH97eXp+g4eMkpeZmJSPioR+e3l6foOHjJKXmZiUj4qEfnt5en6Dh4yRl5mYlI+KhH57eXp+g4eMkpeZmJSPioR+e3l6foOIjZOYmpiUj4qEfnt5en6DiI2TmJqYlI+KhH57eXp+g4iNk5iamJSPioR+e3l6foOIjZOYmpiUj4qEfnt5en6DiI2TmJqYlI+KhH57eXp+g4iNk5iamJSPi4V/e3p7f4SJj5SZmpiUkIuFgHx6e3+EiY+UmZqYlJCLhYB8ent/hImPlJmamJSQi4WAfHp7f4SJj5SZmpiUkIuFgHx6e3+EiY+UmZqYlI+KhH97enp+g4iNk5eZmJOOiYN+e3l6fYKHjJKXmJeTjomDfnt5en2Ch4yRl5iXk46Jg357eXp9goeMkpeYl5OOiYN+e3l6fYKHjJGXmJeTjomDfnt5en2Ch4ySl5iXk46Jg357eXl9goeMkpeYl5OOiIN9e3l5fYKGjJGXmJeTjYiDfXt5eX2ChoyRl5eXk42Ig317eXl9goaMkZeXl5ONiIN9e3l5fYKGjJGXl5eTjYiDfXt5eX2ChoyRl5eXk42Ig317eXl9goaMkZeXl5ONiIN9e3l5fYKGjJGXl5eTjYiDfXt5eX2ChoyRl5eXk42Ig317eXl9goaMkZeXl5ONiIN9e3l5fYKGjJGXl5eTjYiDfXt5eX2ChoyRl5eXk42Ig357eXp9goeMkpeYl5OOiYN+e3l6fYKHjJKXmJeTjomDfnt5en2Ch4yRl5iXk46Jg357eXp9goeMkpeYl5OOiYN+e3l6fYKHjJGXmJeTjomDfnt5en2Ch4ySl5iXk46Jg357eXl8gYWLkJWXl5KMh4J8enh5fIGFi5CVl5eSjIeCfHp4eXyBhYuQlZeXkoyHgnx6eHl8gYWLkJWXl5KMh4J8enh5fIGFi5CVl5eSjIeCfHp4eXyBhYuQlZeXkoyHgnx6eHl8gYWLkJWXl5KNh4J9enh6fIGGi5GWmJeTjYiDfXt5eX2ChoyRl5iXk46Ig357eXl9goaMkZeYl5OOiIN9e3l5fYKGjJGXmJeTjomDfnt5en2Ch4yRl5iXk46Jg357eXp9goeMkpeYl5OOiYN+e3l6fYKHjJKXmJeTjomEfnt5en2Ch4yRl5iXk46Jg357eXp9goeMkpeYl5OOiYN+e3l6fYKHjJKXmJeTjomEfnt5en6DiI2TmJqYlI+KhH57eXp+g4iNk5iamJSPi4V/fHp7f4SJj5SZmpiUkIuFgHx6e3+EiY+UmZqYlJCLhYB8ent/hImPlJmamJSQi4WAfHp7f4SJj5SZmpiUkIuFgHx6e3+EiY+UmZqYlJCLhYB8ent/hImPlJmamJSQi4WAfHt7f4SJj5WZmpiVkIuGgHx7fICFipCVmpqZlZCLhoB8e3yAhYqQlZqamZWQi4aAfHt8gIWKkJWampmVkIuGgHx7fICFipCVmpmZlI+LhX97enp+g4iNk5iZmJOOiYN+e3l6fYKHjJKXmZiTjomDfnt5en2ChoyRl5mYk46Jg357eXp9goaMkpeZmJOOiYN+e3l6fYKHjJKXmZiTjomDfnt5en2Ch4ySl5mYk46Jg357eXp9goeMkpeZmJSPioR+e3l6foOHjJKXmZiUj4qEfnt5en6Dh4yRl5mYlI+KhH57eXp+g4eMkpeZmJSPioR+e3l6foOHjJKXmZiUj4qEfnt5en6Dh4yRl5mYlI+KhH57eXp+g4eMkpeZmJSPioR+e3l6foOHjJKXmZiUj4qEfnt5en6Dh4yRl5mYlI+KhH57eXp+g4eMkw==';

const INTERVALS = [3, 7, 14, 24, 30];

// Day badge colors for revision intervals
const DAY_BADGE_CONFIG: Record<number, string> = {
  3: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300',
  7: 'bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-950 dark:border-sky-800 dark:text-sky-300',
  14: 'bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-950 dark:border-violet-800 dark:text-violet-300',
  21: 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-300',
  24: 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-300',
  30: 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-300',
};
const DEFAULT_BADGE = 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300';

// Hard-hitting quotes database
const QUOTES = [
  "You have power over your mind, not outside events; realize this, and you will find strength. — Marcus Aurelius",
  "If it is not right, do not do it; if it is not true, do not say it. — Marcus Aurelius",
  "The impediment to action advances action; what stands in the way becomes the way. — Marcus Aurelius",
  "It is not the man who has too little, but the man who craves more, that is poor. — Seneca",
  "We suffer more often in imagination than in reality. — Seneca",
  "Luck is what happens when preparation meets opportunity. — Seneca",
  "No man is free who is not master of himself. — Epictetus",
  "It’s not what happens to you, but how you react to it that matters. — Epictetus",
  "First say to yourself what you would be; and then do what you have to do. — Epictetus",
  "Make the best use of what is in your power, and take the rest as it happens. — Epictetus"
];

const CONFETTI_COLORS = ['#F87171', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA', '#F472B6'];

const FEEDBACK_URL = 'https://forms.gle/KZaHhBhJNCirAWWn9';

// Shared input styling so light and dark themes stay consistent
const INPUT_CLASS = 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none';
const CARD_CLASS = 'bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm';

interface ConfettiPiece {
  id: string;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
}

interface Resource {
  id: string;
  url: string;
  title: string; // e.g., "YouTube Video", "PDF Notes"
}

interface Note {
  id: string;
  text: string;
  important: boolean; // "needs extra focus" flag
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
  originalDate: Date;
  resources: Resource[];
  reminderTime?: string;
  intervalDay?: number; // Which repetition day this task belongs to
  notes?: Note[]; // Sub-topics / personal notes
  topicKey?: string; // Shared key to sync notes across all revisions of same topic
}

type Theme = 'light' | 'dark';
type NotifState = NotificationPermission | 'unsupported';

// Only http(s) links are allowed, so a pasted or imported "javascript:" URL can never run code
const toSafeUrl = (raw: string): string | null => {
  const value = raw.trim();
  if (!value) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withScheme);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
};

// Turns stored or imported JSON into Task objects (also upgrades old saved formats)
const normalizeTasks = (raw: any[]): Task[] =>
  raw
    .filter(t => t && typeof t.text === 'string')
    .map((t: any) => {
      const parsedDate = t.date ? new Date(t.date) : new Date();
      const parsedOriginalDate = t.originalDate ? new Date(t.originalDate) : parsedDate;
      const resources: Resource[] = (t.resources || (t.docLink ? [{ id: 'old', url: t.docLink, title: 'Resource' }] : []))
        .map((r: any) => ({ id: String(r.id || crypto.randomUUID()), url: toSafeUrl(String(r.url || '')) || '', title: String(r.title || 'Resource') }))
        .filter((r: Resource) => r.url);
      return {
        id: String(t.id || crypto.randomUUID()),
        text: t.text,
        completed: Boolean(t.completed),
        date: parsedDate,
        originalDate: parsedOriginalDate,
        resources,
        reminderTime: typeof t.reminderTime === 'string' ? t.reminderTime : undefined,
        intervalDay: typeof t.intervalDay === 'number' ? t.intervalDay : undefined,
        notes: Array.isArray(t.notes)
          ? t.notes.filter((n: any) => n && typeof n.text === 'string').map((n: any) => ({ id: String(n.id || crypto.randomUUID()), text: n.text, important: Boolean(n.important) }))
          : [],
        topicKey: t.topicKey || `${t.text}_${parsedOriginalDate.getTime()}`
      };
    })
    .filter(t => !isNaN(t.date.getTime()));

const readStorage = (key: string): string | null => {
  try { return localStorage.getItem(key); } catch { return null; }
};
const writeStorage = (key: string, value: string) => {
  try { localStorage.setItem(key, value); } catch { /* storage unavailable (private mode) */ }
};

export default function App() {
  // State Management
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = readStorage('sr_tasks');
      return saved ? normalizeTasks(JSON.parse(saved)) : [];
    } catch {
      return [];
    }
  });

  const [streak, setStreak] = useState(() => {
    const saved = readStorage('sr_streak');
    return saved ? parseInt(saved) || 0 : 0;
  });

  const [streakLastUpdated, setStreakLastUpdated] = useState(() => {
    return readStorage('sr_streak_last_updated') || '';
  });

  const [lastVisit, setLastVisit] = useState(() => {
    return readStorage('sr_last_visit') || new Date().toDateString();
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = readStorage('rm_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [notifState, setNotifState] = useState<NotifState>(() =>
    'Notification' in window ? Notification.permission : 'unsupported'
  );

  // Form States
  const [newTask, setNewTask] = useState('');
  const [newTime, setNewTime] = useState('');
  const [formError, setFormError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const topicInputRef = useRef<HTMLInputElement>(null);

  // Multiple Links State
  const [tempLinks, setTempLinks] = useState<Resource[]>([]);
  const [currentLinkInput, setCurrentLinkInput] = useState('');
  const [currentLinkTitle, setCurrentLinkTitle] = useState('');
  const [linkError, setLinkError] = useState('');
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const confettiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Recall modal state (shown after 30-day revision)
  const [recallModalTask, setRecallModalTask] = useState<Task | null>(null);

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  // Backup import
  const importInputRef = useRef<HTMLInputElement>(null);
  const [backupMessage, setBackupMessage] = useState('');

  // Track which tasks have already been notified this session (avoid repeat alarms)
  const notifiedTaskIds = useRef<Set<string>>(new Set());

  // Notes UI state
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [noteImportant, setNoteImportant] = useState(false);

  // Daily Reality Check Quote
  const todayQuote = QUOTES[new Date().getDate() % QUOTES.length];

  useEffect(() => {
    writeStorage('sr_tasks', JSON.stringify(tasks));
    writeStorage('sr_streak', streak.toString());
    writeStorage('sr_last_visit', lastVisit);
    writeStorage('sr_streak_last_updated', streakLastUpdated);
  }, [tasks, streak, lastVisit, streakLastUpdated]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#020617' : '#4f46e5');
  }, [theme]);

  useEffect(() => {
    const today = new Date().toDateString();
    if (today !== lastVisit) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastVisit === yesterday.toDateString()) {
        // Streak continues
      } else {
        setStreak(0);
      }
      setLastVisit(today);
    }
  }, []);

  // Send browser notification when app opens with today's pending tasks
  useEffect(() => {
    const todayStr = new Date().toDateString();
    const pendingToday = tasks.filter(t => t.date.toDateString() === todayStr && !t.completed);
    if (pendingToday.length > 0 && "Notification" in window && Notification.permission === 'granted') {
      const notifKey = 'sr_last_open_notif';
      if (readStorage(notifKey) !== todayStr) {
        new Notification('RetentionMaster 🧠', {
          body: `You have ${pendingToday.length} topic${pendingToday.length > 1 ? 's' : ''} to revise today.`,
          icon: import.meta.env.BASE_URL + 'icon-192.png'
        });
        writeStorage(notifKey, todayStr);
      }
    }
  }, []);

  // Check reminderTime every 30 seconds — fire alarm + notification when it matches
  useEffect(() => {
    const playAlarm = () => {
      try {
        const audio = new Audio(ALARM_SOUND);
        audio.volume = 0.7;
        audio.play().catch(() => {});
      } catch (_) {}
    };

    const checkReminders = () => {
      const now = new Date();
      const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const todayStr = now.toDateString();

      tasks.forEach(t => {
        if (
          t.reminderTime &&
          t.reminderTime === currentHHMM &&
          !t.completed &&
          t.date.toDateString() === todayStr &&
          !notifiedTaskIds.current.has(t.id)
        ) {
          notifiedTaskIds.current.add(t.id);
          playAlarm();
          if ("Notification" in window && Notification.permission === 'granted') {
            new Notification('Time to revise! ⏰', {
              body: `"${t.text}" · Day ${t.intervalDay || '?'} revision`,
              icon: import.meta.env.BASE_URL + 'icon-192.png'
            });
          }
        }
      });
    };

    checkReminders();
    const intervalId = setInterval(checkReminders, 30000);
    return () => clearInterval(intervalId);
  }, [tasks]);

  useEffect(() => {
    return () => {
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
      }
    };
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    writeStorage('rm_theme', next);
  };

  // Ask for notification permission only when the user chooses to, not on page load
  const enableNotifications = async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setNotifState(result);
  };

  const triggerConfetti = () => {
    const pieces = Array.from({ length: 30 }).map(() => ({
      id: crypto.randomUUID(),
      left: Math.random() * 100,
      delay: Math.random() * 200,
      duration: 1400 + Math.random() * 800,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 6
    }));

    setConfettiPieces(pieces);
    if (confettiTimeoutRef.current) {
      clearTimeout(confettiTimeoutRef.current);
    }
    confettiTimeoutRef.current = setTimeout(() => {
      setConfettiPieces([]);
    }, 1800);
  };

  // Add a link to the temporary list
  const handleAddLink = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (!currentLinkInput.trim()) return;
    const url = toSafeUrl(currentLinkInput);
    if (!url) {
      setLinkError('Please paste a valid web link (starting with https://).');
      return;
    }

    setTempLinks([
      ...tempLinks,
      {
        id: crypto.randomUUID(),
        url,
        title: currentLinkTitle.trim() || 'Resource'
      }
    ]);
    setCurrentLinkInput('');
    setCurrentLinkTitle('');
    setLinkError('');
  };

  const removeTempLink = (id: string) => {
    setTempLinks(tempLinks.filter(l => l.id !== id));
  };

  const addRevisions = (taskText: string, resources: Resource[], time: string) => {
    const topicKey = `${taskText}_${new Date().toISOString()}`;
    const newTasks: Task[] = INTERVALS.map(days => {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return {
        id: crypto.randomUUID(),
        text: taskText,
        completed: false,
        date: date,
        originalDate: new Date(),
        resources: resources,
        reminderTime: time,
        intervalDay: days,
        notes: [],
        topicKey: topicKey
      };
    });
    setTasks([...tasks, ...newTasks]);
  };

  // Add a single extra revision N days from now for a topic
  const addExtraRevision = (task: Task, extraDays: number) => {
    const date = new Date();
    date.setDate(date.getDate() + extraDays);
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: task.text,
      completed: false,
      date: date,
      originalDate: task.originalDate,
      resources: task.resources,
      reminderTime: task.reminderTime,
      intervalDay: (task.intervalDay || 30) + extraDays,
      notes: task.notes || [],
      topicKey: task.topicKey || getTopicKey(task)
    };
    setTasks(prev => [...prev, newTask]);
  };

  // Handle recall modal responses
  const handleRecallYes = () => {
    setRecallModalTask(null);
  };

  const handleRecallNo = () => {
    if (recallModalTask) {
      addExtraRevision(recallModalTask, 30);
    }
    setRecallModalTask(null);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) {
      setFormError('Enter a topic name first.');
      topicInputRef.current?.focus();
      return;
    }

    // A link typed but not yet added with "Add" is included automatically
    const pendingUrl = currentLinkInput.trim() ? toSafeUrl(currentLinkInput) : null;
    const links = pendingUrl
      ? [...tempLinks, { id: crypto.randomUUID(), url: pendingUrl, title: currentLinkTitle.trim() || 'Resource' }]
      : tempLinks;

    addRevisions(newTask.trim(), links, newTime);

    setNewTask('');
    setTempLinks([]);
    setCurrentLinkInput('');
    setCurrentLinkTitle('');
    setNewTime('');
    setFormError('');
    setLinkError('');
  };

  const toggleTask = (taskId: string) => {
    const targetTask = tasks.find(t => t.id === taskId);
    const willComplete = targetTask && !targetTask.completed;

    const updatedTasks = tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);

    if (willComplete) {
      triggerConfetti();
      // If this is a 30-day (or beyond) revision, ask if they remember
      if (targetTask && targetTask.intervalDay && targetTask.intervalDay >= 30) {
        setRecallModalTask(targetTask);
      }
    }

    const todayStr = new Date().toDateString();
    const todaysTasks = updatedTasks.filter(t => t.date.toDateString() === todayStr);

    if (todaysTasks.length > 0 && todaysTasks.every(t => t.completed)) {
      if (streakLastUpdated !== todayStr) {
        setStreak(s => s + 1);
        setStreakLastUpdated(todayStr);
      }
    } else if (todaysTasks.length > 0 && todaysTasks.some(t => !t.completed)) {
      if (streakLastUpdated === todayStr) {
        setStreak(s => Math.max(0, s - 1));
        setStreakLastUpdated('');
      }
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    setDeleteTarget(null);
  };

  const deleteTopic = (task: Task) => {
    const key = getTopicKey(task);
    setTasks(tasks.filter(t => getTopicKey(t) !== key));
    setDeleteTarget(null);
  };

  // --- Backup (data only lives in this browser) ---
  const exportBackup = () => {
    const data = {
      app: 'RetentionMaster',
      version: 1,
      exportedAt: new Date().toISOString(),
      tasks,
      streak,
      streakLastUpdated,
      lastVisit
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `retentionmaster-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupMessage(`Backup saved with ${tasks.length} revision${tasks.length === 1 ? '' : 's'}.`);
  };

  const importBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const rawTasks = Array.isArray(data) ? data : data?.tasks;
      if (!Array.isArray(rawTasks)) throw new Error('not a backup');
      const imported = normalizeTasks(rawTasks);
      const ok = window.confirm(
        `Replace your current ${tasks.length} revision${tasks.length === 1 ? '' : 's'} with ${imported.length} from this backup?`
      );
      if (!ok) return;
      setTasks(imported);
      if (typeof data.streak === 'number') setStreak(Math.max(0, Math.floor(data.streak)));
      if (typeof data.streakLastUpdated === 'string') setStreakLastUpdated(data.streakLastUpdated);
      setBackupMessage(`Restored ${imported.length} revision${imported.length === 1 ? '' : 's'} from backup.`);
    } catch {
      setBackupMessage('That file is not a valid RetentionMaster backup.');
    }
  };

  // --- Notes / Sub-topics functions ---
  // Get topicKey for a task (used to sync notes across all revisions of same topic)
  const getTopicKey = (t: Task) => t.topicKey || `${t.text}_${t.originalDate}`;

  const toggleNotes = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
    setNoteInput('');
    setNoteImportant(false);
  };

  // Add a note to a task — syncs across all revisions of the same topic
  const addNote = (taskId: string) => {
    if (!noteInput.trim()) return;
    const target = tasks.find(t => t.id === taskId);
    if (!target) return;
    const key = getTopicKey(target);
    const newNote: Note = { id: crypto.randomUUID(), text: noteInput.trim(), important: noteImportant };
    setTasks(tasks.map(t =>
      getTopicKey(t) === key
        ? { ...t, notes: [...(t.notes || []), newNote] }
        : t
    ));
    setNoteInput('');
    setNoteImportant(false);
  };

  // Delete a note — removes from all revisions of the same topic
  const deleteNote = (taskId: string, noteId: string) => {
    const target = tasks.find(t => t.id === taskId);
    if (!target) return;
    const key = getTopicKey(target);
    setTasks(tasks.map(t =>
      getTopicKey(t) === key
        ? { ...t, notes: (t.notes || []).filter(n => n.id !== noteId) }
        : t
    ));
  };

  // Toggle important flag on a note
  const toggleNoteImportant = (taskId: string, noteId: string) => {
    const target = tasks.find(t => t.id === taskId);
    if (!target) return;
    const key = getTopicKey(target);
    setTasks(tasks.map(t =>
      getTopicKey(t) === key
        ? { ...t, notes: (t.notes || []).map(n => n.id === noteId ? { ...n, important: !n.important } : n) }
        : t
    ));
  };

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const isTodaySelected = selectedDate.toDateString() === todayStart.toDateString();

  const tasksForSelectedDate = tasks
    .filter(t => t.date.toDateString() === selectedDate.toDateString())
    .sort((a, b) => Number(a.completed) - Number(b.completed));

  // Revisions from past days that were never completed — shown on today's view so they don't vanish
  const overdueTasks = tasks
    .filter(t => !t.completed && t.date < todayStart)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const todayTasks = tasks.filter(t => t.date.toDateString() === todayStart.toDateString());
  const todayPending = todayTasks.filter(t => !t.completed).length + overdueTasks.length;
  const todayAllDone = todayTasks.length > 0 && todayPending === 0;

  const completedCount = tasksForSelectedDate.filter(t => t.completed).length;
  const topicCount = new Set(tasks.map(getTopicKey)).size;
  const deleteTargetSiblings = deleteTarget ? tasks.filter(t => getTopicKey(t) === getTopicKey(deleteTarget)).length : 0;

  const [quoteText, quoteAuthor] = todayQuote.split(' — ');

  const renderTask = (t: Task, overdue = false) => (
    <div key={t.id} className={`p-4 rounded-xl border transition-colors ${
      t.completed
        ? 'bg-slate-50 border-slate-200 dark:bg-slate-900/40 dark:border-slate-800'
        : overdue
          ? 'bg-white border-amber-300 dark:bg-slate-900 dark:border-amber-700'
          : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-700'
    }`}>
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => toggleTask(t.id)}
          aria-label={t.completed ? `Mark "${t.text}" as not done` : `Mark "${t.text}" as done`}
          className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
            t.completed
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-slate-300 dark:border-slate-600 text-transparent hover:border-emerald-500 hover:text-emerald-500'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`font-semibold break-words ${t.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>{t.text}</p>
            {t.intervalDay && (
              <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${DAY_BADGE_CONFIG[t.intervalDay] || DEFAULT_BADGE}`}>
                Day {t.intervalDay}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Learned {t.originalDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            {overdue && (
              <span className="text-amber-700 dark:text-amber-400 font-medium"> · Was due {t.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            )}
          </p>

          {((t.resources && t.resources.length > 0) || t.reminderTime) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {t.resources && t.resources.map((res, idx) => {
                const href = toSafeUrl(res.url);
                return href ? (
                  <a key={idx} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-900 px-2 py-1 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900 border">
                    <LinkIcon className="w-3 h-3" /> {res.title}
                  </a>
                ) : null;
              })}
              {t.reminderTime && (
                <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900 px-2 py-1 rounded-md border">
                  <Clock className="w-3 h-3" /> {t.reminderTime}
                </span>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setDeleteTarget(t)}
          aria-label={`Delete "${t.text}"`}
          title="Delete"
          className="p-1 -m-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Notes / Sub-topics Section */}
      <div className="mt-3 ml-9">
        <button
          type="button"
          onClick={() => toggleNotes(t.id)}
          aria-expanded={expandedTaskId === t.id}
          className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold"
        >
          <StickyNote className="w-3.5 h-3.5" />
          Notes ({(t.notes || []).length})
          {expandedTaskId === t.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {expandedTaskId === t.id && (
          <div className="mt-2 space-y-2">
            {(t.notes || []).length > 0 && (
              <ul className="space-y-1">
                {(t.notes || []).map(note => (
                  <li key={note.id} className={`flex items-start gap-2 text-sm p-2 rounded-lg border ${
                    note.important
                      ? 'bg-red-50 border-red-200 dark:bg-red-950/60 dark:border-red-900'
                      : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                  }`}>
                    <button
                      type="button"
                      onClick={() => toggleNoteImportant(t.id, note.id)}
                      title={note.important ? 'Marked as needing extra focus' : 'Mark as needing extra focus'}
                      className="mt-0.5 flex-shrink-0 text-xs"
                    >
                      {note.important ? '🔴' : '⚪'}
                    </button>
                    <span className={`flex-1 break-words ${note.important ? 'text-red-800 dark:text-red-300 font-medium' : 'text-slate-700 dark:text-slate-200'}`}>
                      {note.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteNote(t.id, note.id)}
                      className="text-slate-400 hover:text-red-600 flex-shrink-0"
                      title="Got it, remove this note"
                      aria-label="Remove note"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addNote(t.id); } }}
                placeholder="Add a sub-topic or note..."
                aria-label="New note"
                className={`flex-1 min-w-0 text-sm px-3 py-2 ${INPUT_CLASS}`}
              />
              <button
                type="button"
                onClick={() => setNoteImportant(!noteImportant)}
                title={noteImportant ? 'Will be marked as needing extra focus' : 'Mark as needing extra focus'}
                aria-pressed={noteImportant}
                className={`p-2 rounded-lg border text-xs ${
                  noteImportant
                    ? 'bg-red-50 border-red-300 dark:bg-red-950 dark:border-red-800'
                    : 'bg-white border-slate-300 dark:bg-slate-800 dark:border-slate-700 opacity-60 hover:opacity-100'
                }`}
              >
                🔴
              </button>
              <button
                type="button"
                onClick={() => addNote(t.id)}
                aria-label="Add note"
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">🔴 Needs extra focus &nbsp;·&nbsp; ✕ Remove once you've got it. Notes are shared across all revisions of this topic.</p>
          </div>
        )}
      </div>
    </div>
  );

  const iconButtonClass = 'w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition';

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors">
      {confettiPieces.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {confettiPieces.map(piece => (
            <span
              key={piece.id}
              style={{
                position: 'absolute',
                width: `${piece.size}px`,
                height: `${piece.size * 3}px`,
                borderRadius: '4px',
                backgroundColor: piece.color,
                left: `${piece.left}%`,
                top: '-10%',
                animation: `confettiFall ${piece.duration}ms ease-out forwards`,
                animationDelay: `${piece.delay}ms`
              }}
            />
          ))}
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 py-5 md:px-8 md:py-8">

        {/* Header */}
        <header className="flex justify-between items-center gap-3 mb-6">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base min-[375px]:text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white truncate leading-tight">RetentionMaster</h1>
              <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">Spaced repetition, made simple</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {notifState !== 'unsupported' && (
              <button
                type="button"
                onClick={notifState === 'default' ? enableNotifications : undefined}
                title={
                  notifState === 'granted'
                    ? 'Reminders are on'
                    : notifState === 'denied'
                      ? 'Notifications are blocked. Allow them in your browser settings.'
                      : 'Turn on reminder notifications'
                }
                aria-label={notifState === 'granted' ? 'Reminders are on' : 'Turn on reminder notifications'}
                className={`${iconButtonClass} ${notifState === 'granted' ? 'text-indigo-600 dark:text-indigo-400' : ''} ${notifState !== 'default' ? 'cursor-default' : ''}`}
              >
                {notifState === 'granted' ? <Bell className="w-4 h-4 fill-current" /> : <BellOff className="w-4 h-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className={iconButtonClass}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div
              title="Consecutive days with all revisions completed"
              className={`flex items-center gap-1.5 h-9 sm:h-10 px-2.5 sm:px-3 rounded-full border text-sm font-bold ${
                streak > 0
                  ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950 dark:border-orange-900 dark:text-orange-300'
                  : 'bg-white border-slate-300 text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-slate-400'}`} />
              <span>{streak}<span className="hidden sm:inline"> day streak</span></span>
            </div>
          </div>
        </header>

        {/* Today's Pending Revisions Alert Banner */}
        {(todayTasks.length > 0 || overdueTasks.length > 0) && (
          <div className={`rounded-xl p-4 mb-6 flex items-center gap-3 border ${
            todayAllDone
              ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-900'
              : 'bg-amber-50 border-amber-300 dark:bg-amber-950/60 dark:border-amber-900'
          }`}>
            {todayAllDone ? (
              <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            ) : (
              <Bell className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 animate-pulse" />
            )}
            <div className="flex-1">
              <p className={`font-bold ${todayAllDone ? 'text-emerald-800 dark:text-emerald-200' : 'text-amber-900 dark:text-amber-100'}`}>
                {todayAllDone
                  ? 'All done for today. Great work! 🎉'
                  : `You have ${todayPending} revision${todayPending > 1 ? 's' : ''} to do today`
                }
              </p>
              {!todayAllDone && overdueTasks.length > 0 && (
                <p className="text-sm text-amber-800 dark:text-amber-300 mt-0.5">
                  {overdueTasks.length} {overdueTasks.length > 1 ? 'are' : 'is'} overdue from earlier days.
                </p>
              )}
            </div>
            {!todayAllDone && !isTodaySelected && (
              <button
                type="button"
                onClick={() => setSelectedDate(new Date())}
                className="text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg flex-shrink-0"
              >
                View
              </button>
            )}
          </div>
        )}

        {/* Reality Check Quote */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-800 dark:to-slate-900 dark:border dark:border-indigo-900 rounded-2xl p-6 md:p-8 text-white shadow-md mb-6">
          <p className="text-xs font-bold tracking-widest text-indigo-200 mb-3">DAILY REALITY CHECK</p>
          <p className="text-lg md:text-2xl font-serif italic leading-relaxed">“{quoteText}”</p>
          {quoteAuthor && <p className="text-sm text-indigo-200 mt-3">— {quoteAuthor}</p>}
        </div>

        {/* Add Task Form */}
        <div className={`${CARD_CLASS} p-5 md:p-6 mb-6`}>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add a new topic</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">We'll schedule 5 revisions for you: Day 3, 7, 14, 24 and 30.</p>
          <form onSubmit={handleAddTask} noValidate className="flex flex-col gap-3">

            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1">
                <span className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Topic</span>
                <input
                  ref={topicInputRef}
                  type="text"
                  value={newTask}
                  onChange={(e) => { setNewTask(e.target.value); if (formError) setFormError(''); }}
                  placeholder="e.g. Photosynthesis"
                  aria-invalid={Boolean(formError)}
                  className={`w-full px-4 py-3 ${INPUT_CLASS} ${formError ? 'border-red-400 dark:border-red-500' : ''}`}
                />
              </label>
              <label className="sm:w-44">
                <span className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Reminder time (optional)</span>
                <div className={`flex items-center gap-2 px-3 py-3 focus-within:ring-2 focus-within:ring-indigo-500 ${INPUT_CLASS}`}>
                  <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="bg-transparent outline-none w-full text-sm"
                  />
                </div>
              </label>
            </div>
            {formError && <p role="alert" className="text-sm text-red-600 dark:text-red-400 -mt-1">{formError}</p>}

            {/* Multiple Link Adder */}
            <div>
              <span className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Study links (optional)</span>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={currentLinkTitle}
                  onChange={(e) => setCurrentLinkTitle(e.target.value)}
                  placeholder="Label (e.g. PDF notes)"
                  aria-label="Link label"
                  className={`sm:w-1/3 px-3 py-2 text-sm ${INPUT_CLASS}`}
                />
                <div className="flex flex-1 gap-2">
                  <input
                    type="url"
                    value={currentLinkInput}
                    onChange={(e) => { setCurrentLinkInput(e.target.value); if (linkError) setLinkError(''); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddLink(e); }}
                    placeholder="Paste a link"
                    aria-label="Link URL"
                    className={`flex-1 min-w-0 px-3 py-2 text-sm ${INPUT_CLASS}`}
                  />
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 px-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>
              {linkError && <p role="alert" className="text-sm text-red-600 dark:text-red-400 mt-1">{linkError}</p>}
            </div>

            {tempLinks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tempLinks.map(link => (
                  <span key={link.id} className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-900 px-2 py-1 rounded-md border">
                    <LinkIcon className="w-3 h-3" /> {link.title}
                    <button type="button" onClick={() => removeTempLink(link.id)} aria-label={`Remove ${link.title}`} className="hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 mt-1 shadow-sm transition-colors"
            >
              <Plus className="w-5 h-5" />
              Schedule revisions
            </button>
            {newTime && notifState === 'default' && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tip: <button type="button" onClick={enableNotifications} className="underline font-semibold text-indigo-600 dark:text-indigo-400">turn on notifications</button> so your reminder can alert you. Reminders work while the app is open.
              </p>
            )}
          </form>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">

          {/* Calendar */}
          <div className={`md:col-span-2 p-5 ${CARD_CLASS}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 whitespace-nowrap">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                {selectedDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center gap-1">
                <button type="button" aria-label="Previous month" onClick={() => { const d = new Date(selectedDate); d.setDate(1); d.setMonth(d.getMonth() - 1); setSelectedDate(d); }} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"><ChevronLeft className="w-4 h-4" /></button>
                <button type="button" onClick={() => setSelectedDate(new Date())} className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-1.5 rounded-lg">Today</button>
                <button type="button" aria-label="Next month" onClick={() => { const d = new Date(selectedDate); d.setDate(1); d.setMonth(d.getMonth() + 1); setSelectedDate(d); }} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {['S','M','T','W','T','F','S'].map((d, index) => <div key={index} className="text-slate-500 dark:text-slate-400 text-xs font-semibold pb-1">{d}</div>)}
              {(() => {
                const year = selectedDate.getFullYear();
                const month = selectedDate.getMonth();
                const startDay = new Date(year, month, 1).getDay();
                const totalDays = new Date(year, month + 1, 0).getDate();
                const totalCells = startDay + totalDays > 35 ? 42 : 35;

                return Array.from({ length: totalCells }).map((_, i) => {
                  const dayNum = i - startDay + 1;
                  if (dayNum < 1 || dayNum > totalDays) return <div key={i}></div>;

                  const currentDate = new Date(year, month, dayNum);
                  const dateStr = currentDate.toDateString();
                  const isSelected = dateStr === selectedDate.toDateString();
                  const isToday = dateStr === todayStart.toDateString();
                  const dayTasks = tasks.filter(t => t.date.toDateString() === dateStr);
                  const hasPending = dayTasks.some(t => !t.completed);
                  const allDone = dayTasks.length > 0 && !hasPending;

                  return (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setSelectedDate(currentDate)}
                      aria-label={`${currentDate.toDateString()}${dayTasks.length ? `, ${dayTasks.length} revision${dayTasks.length > 1 ? 's' : ''}` : ''}`}
                      aria-pressed={isSelected}
                      className={`relative aspect-square flex items-center justify-center rounded-full text-sm transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-bold'
                          : isToday
                            ? 'text-indigo-700 dark:text-indigo-300 font-bold ring-2 ring-indigo-200 dark:ring-indigo-800 hover:bg-indigo-50 dark:hover:bg-slate-800'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {dayNum}
                      {dayTasks.length > 0 && (
                        <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                          isSelected ? 'bg-white' : allDone ? 'bg-emerald-500' : currentDate < todayStart ? 'bg-amber-500' : 'bg-indigo-500'
                        }`} />
                      )}
                    </button>
                  );
                });
              })()}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" />Due</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />Completed</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" />Missed</span>
            </div>
          </div>

          {/* Task List */}
          <div className={`md:col-span-3 p-5 ${CARD_CLASS}`}>
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="font-bold text-xl text-slate-900 dark:text-white">
                  {isTodaySelected ? "Today's plan" : selectedDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </h2>
                {tasksForSelectedDate.length > 0 && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {completedCount} of {tasksForSelectedDate.length} done
                  </p>
                )}
              </div>
            </div>

            {isTodaySelected && overdueTasks.length > 0 && (
              <div className="mb-5">
                <h3 className="text-xs font-bold tracking-wider text-amber-700 dark:text-amber-400 mb-2">OVERDUE ({overdueTasks.length})</h3>
                <div className="space-y-3">
                  {overdueTasks.map(t => renderTask(t, true))}
                </div>
              </div>
            )}

            {isTodaySelected && overdueTasks.length > 0 && tasksForSelectedDate.length > 0 && (
              <h3 className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-2">TODAY ({tasksForSelectedDate.length})</h3>
            )}

            <div className="space-y-3">
              {tasksForSelectedDate.length === 0 && !(isTodaySelected && overdueTasks.length > 0) && (
                <div className="text-center py-8 px-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                  <p className="font-semibold text-slate-700 dark:text-slate-200">No revisions on this day</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {tasks.length === 0
                      ? 'Add your first topic above. Its revisions will appear on the calendar.'
                      : 'Pick a day with a dot on the calendar to see its revisions.'}
                  </p>
                </div>
              )}
              {tasksForSelectedDate.map(t => renderTask(t))}
            </div>
          </div>
        </div>

        {/* Backup + footer */}
        <footer className={`mt-6 p-5 ${CARD_CLASS}`}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h2 className="font-bold text-slate-900 dark:text-white">Your data stays on this device</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {topicCount} topic{topicCount === 1 ? '' : 's'} saved in this browser. Clearing browser data deletes them, so export a backup now and then.
              </p>
              {backupMessage && <p role="status" className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mt-1">{backupMessage}</p>}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={exportBackup}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Download className="w-4 h-4" /> Export
              </button>
              <button
                type="button"
                onClick={() => importInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200"
              >
                <Upload className="w-4 h-4" /> Import
              </button>
              <input ref={importInputRef} type="file" accept="application/json,.json" onChange={importBackup} className="hidden" />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400">
            <span>Built for students who want to remember what they learn.</span>
            <a href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              <MessageSquare className="w-4 h-4" /> Send feedback
            </a>
          </div>
        </footer>

        {/* Delete confirmation */}
        {deleteTarget && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="delete-title">
            <div className="bg-white dark:bg-slate-900 dark:border dark:border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-xl">
              <h3 id="delete-title" className="text-lg font-bold text-slate-900 dark:text-white mb-1">Delete revision?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">
                "<span className="font-semibold">{deleteTarget.text}</span>"{deleteTarget.intervalDay ? `, Day ${deleteTarget.intervalDay}` : ''}. This can't be undone.
              </p>
              <div className="flex flex-col gap-2">
                <button type="button" onClick={() => deleteTask(deleteTarget.id)} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl">
                  Delete this revision
                </button>
                {deleteTargetSiblings > 1 && (
                  <button type="button" onClick={() => deleteTopic(deleteTarget)} className="w-full bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950 dark:hover:bg-red-900 dark:text-red-300 border border-red-200 dark:border-red-900 font-semibold py-2.5 rounded-xl">
                    Delete the whole topic ({deleteTargetSiblings} revisions)
                  </button>
                )}
                <button type="button" onClick={() => setDeleteTarget(null)} className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-2.5 rounded-xl">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recall Modal - shown after completing 30+ day revision */}
        {recallModalTask && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="recall-title">
            <div className="bg-white dark:bg-slate-900 dark:border dark:border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
              <Brain className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
              <h3 id="recall-title" className="text-lg font-bold text-slate-900 dark:text-white mb-2">Do you still remember it? 🤔</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">Topic: <span className="font-semibold text-slate-800 dark:text-slate-100">{recallModalTask.text}</span></p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleRecallNo}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950 dark:hover:bg-red-900 dark:text-red-300 font-semibold py-3 rounded-xl border border-red-200 dark:border-red-900 transition"
                >
                  Not really 😕
                </button>
                <button
                  type="button"
                  onClick={handleRecallYes}
                  className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:text-emerald-300 font-semibold py-3 rounded-xl border border-emerald-200 dark:border-emerald-900 transition"
                >
                  Yes, I do ✅
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">Choosing "Not really" schedules one more revision in 30 days.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
