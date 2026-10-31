import React, { useState, useEffect, useRef } from 'react';
import { Calendar, CheckCircle, Plus, Flame, Brain, Trash2, Link as LinkIcon, Clock, X, MessageSquare, Bell, StickyNote, ChevronDown, ChevronUp } from 'lucide-react';

// Alarm beep sound (short beep as base64 data URI — no external file needed)
const ALARM_SOUND = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2LkZeYl5KNiIV/e3p6fYKIjpSXmJeTjomEf3t5eX2ChoySl5mYk46JhH97eXl9g4eOk5iZl5KNiIF9enp7f4WKkJWYmZaSjYeBfHl5fIGGjJKXmZiUj4qEfnt5en6DhoyRlpmYlI+KhH57eXp+g4eMkpeZmJSPioR+e3l6foOHjJKXmZiUj4qEfnt5en6Dh4yRl5mYk4+KhH97eXp+g4eMkpeZmJSPioR+e3l6foOHjJKXmZiUj4qEfnt5en6Dh4yRl5mYlI+KhH57eXp+g4eMkpeZmJSPioR+e3l6foOIjZOYmpiUj4qEfnt5en6DiI2TmJqYlI+KhH57eXp+g4iNk5iamJSPioR+e3l6foOIjZOYmpiUj4qEfnt5en6DiI2TmJqYlI+KhH57eXp+g4iNk5iamJSPi4V/e3p7f4SJj5SZmpiUkIuFgHx6e3+EiY+UmZqYlJCLhYB8ent/hImPlJmamJSQi4WAfHp7f4SJj5SZmpiUkIuFgHx6e3+EiY+UmZqYlI+KhH97enp+g4iNk5eZmJOOiYN+e3l6fYKHjJKXmJeTjomDfnt5en2Ch4yRl5iXk46Jg357eXp9goeMkpeYl5OOiYN+e3l6fYKHjJGXmJeTjomDfnt5en2Ch4ySl5iXk46Jg357eXl9goeMkpeYl5OOiIN9e3l5fYKGjJGXmJeTjYiDfXt5eX2ChoyRl5eXk42Ig317eXl9goaMkZeXl5ONiIN9e3l5fYKGjJGXl5eTjYiDfXt5eX2ChoyRl5eXk42Ig317eXl9goaMkZeXl5ONiIN9e3l5fYKGjJGXl5eTjYiDfXt5eX2ChoyRl5eXk42Ig317eXl9goaMkZeXl5ONiIN9e3l5fYKGjJGXl5eTjYiDfXt5eX2ChoyRl5eXk42Ig357eXp9goeMkpeYl5OOiYN+e3l6fYKHjJKXmJeTjomDfnt5en2Ch4yRl5iXk46Jg357eXp9goeMkpeYl5OOiYN+e3l6fYKHjJGXmJeTjomDfnt5en2Ch4ySl5iXk46Jg357eXl8gYWLkJWXl5KMh4J8enh5fIGFi5CVl5eSjIeCfHp4eXyBhYuQlZeXkoyHgnx6eHl8gYWLkJWXl5KMh4J8enh5fIGFi5CVl5eSjIeCfHp4eXyBhYuQlZeXkoyHgnx6eHl8gYWLkJWXl5KNh4J9enh6fIGGi5GWmJeTjYiDfXt5eX2ChoyRl5iXk46Ig357eXl9goaMkZeYl5OOiIN9e3l5fYKGjJGXmJeTjomDfnt5en2Ch4yRl5iXk46Jg357eXp9goeMkpeYl5OOiYN+e3l6fYKHjJKXmJeTjomEfnt5en2Ch4yRl5iXk46Jg357eXp9goeMkpeYl5OOiYN+e3l6fYKHjJKXmJeTjomEfnt5en6DiI2TmJqYlI+KhH57eXp+g4iNk5iamJSPi4V/fHp7f4SJj5SZmpiUkIuFgHx6e3+EiY+UmZqYlJCLhYB8ent/hImPlJmamJSQi4WAfHp7f4SJj5SZmpiUkIuFgHx6e3+EiY+UmZqYlJCLhYB8ent/hImPlJmamJSQi4WAfHt7f4SJj5WZmpiVkIuGgHx7fICFipCVmpqZlZCLhoB8e3yAhYqQlZqamZWQi4aAfHt8gIWKkJWampmVkIuGgHx7fICFipCVmpmZlI+LhX97enp+g4iNk5iZmJOOiYN+e3l6fYKHjJKXmZiTjomDfnt5en2ChoyRl5mYk46Jg357eXp9goaMkpeZmJOOiYN+e3l6fYKHjJKXmZiTjomDfnt5en2Ch4ySl5mYk46Jg357eXp9goeMkpeZmJSPioR+e3l6foOHjJKXmZiUj4qEfnt5en6Dh4yRl5mYlI+KhH57eXp+g4eMkpeZmJSPioR+e3l6foOHjJKXmZiUj4qEfnt5en6Dh4yRl5mYlI+KhH57eXp+g4eMkpeZmJSPioR+e3l6foOHjJKXmZiUj4qEfnt5en6Dh4yRl5mYlI+KhH57eXp+g4eMkw==';

// Day badge colors for revision intervals
const DAY_BADGE_CONFIG: Record<number, { bg: string; text: string }> = {
  3: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
  7: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
  14: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700' },
  21: { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700' },
  24: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700' },
  30: { bg: 'bg-red-50 border-red-200', text: 'text-red-700' },
};

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
  important: boolean; // "zyada dhyan dena" flag
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
  originalDate: Date;
  resources: Resource[]; // Changed from single link to array
  reminderTime?: string;
  intervalDay?: number; // Which repetition day this task belongs to
  notes?: Note[]; // Sub-topics / personal notes
  topicKey?: string; // Shared key to sync notes across all revisions of same topic
}

export default function App() {
  // State Management
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('sr_tasks');
    if (saved) {
      return JSON.parse(saved).map((t: any) => {
        const parsedDate = t.date ? new Date(t.date) : new Date();
        const parsedOriginalDate = t.originalDate ? new Date(t.originalDate) : parsedDate;
        return {
          ...t,
          date: parsedDate,
          originalDate: parsedOriginalDate,
          // Backward compatibility: Convert old docLink to new resources array
          resources: t.resources || (t.docLink ? [{ id: 'old', url: t.docLink, title: 'Resource' }] : []),
          notes: t.notes || [],
          topicKey: t.topicKey || `${t.text}_${parsedOriginalDate.getTime()}`
        };
      });
    }
    return [];
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('sr_streak');
    return saved ? parseInt(saved) : 0;
  });

  const [streakLastUpdated, setStreakLastUpdated] = useState(() => {
    return localStorage.getItem('sr_streak_last_updated') || '';
  });

  const [lastVisit, setLastVisit] = useState(() => {
    return localStorage.getItem('sr_last_visit') || new Date().toDateString();
  });

  // Form States
  const [newTask, setNewTask] = useState('');
  const [newTime, setNewTime] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Multiple Links State
  const [tempLinks, setTempLinks] = useState<Resource[]>([]);
  const [currentLinkInput, setCurrentLinkInput] = useState('');
  const [currentLinkTitle, setCurrentLinkTitle] = useState('');
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const confettiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Recall modal state (shown after 30-day revision)
  const [recallModalTask, setRecallModalTask] = useState<Task | null>(null);

  // Track which tasks have already been notified this session (avoid repeat alarms)
  const notifiedTaskIds = useRef<Set<string>>(new Set());

  // Notes UI state
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [noteImportant, setNoteImportant] = useState(false);

  // Daily Reality Check Quote
  const todayQuote = QUOTES[new Date().getDate() % QUOTES.length];

  useEffect(() => {
    localStorage.setItem('sr_tasks', JSON.stringify(tasks));
    localStorage.setItem('sr_streak', streak.toString());
    localStorage.setItem('sr_last_visit', lastVisit);
    localStorage.setItem('sr_streak_last_updated', streakLastUpdated);
  }, [tasks, streak, lastVisit, streakLastUpdated]);

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

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // Send browser notification when app opens with today's pending tasks
  useEffect(() => {
    const todayStr = new Date().toDateString();
    const pendingToday = tasks.filter(t => t.date.toDateString() === todayStr && !t.completed);
    if (pendingToday.length > 0 && "Notification" in window && Notification.permission === 'granted') {
      const notifKey = 'sr_last_open_notif';
      const lastNotif = localStorage.getItem(notifKey);
      if (lastNotif !== todayStr) {
        new Notification('RetentionMaster 🧠', {
          body: `Aaj ${pendingToday.length} topic${pendingToday.length > 1 ? 's' : ''} revise karne hain!`,
          icon: import.meta.env.BASE_URL + 'icon-192.png'
        });
        localStorage.setItem(notifKey, todayStr);
      }
    }
  }, []);

  // Check reminderTime every 60 seconds — fire alarm + notification when it matches
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
            new Notification('Revision Time! ⏰', {
              body: `"${t.text}" — Day ${t.intervalDay || '?'} revision`,
              icon: import.meta.env.BASE_URL + 'icon-192.png'
            });
          }
        }
      });
    };

    checkReminders();
    const intervalId = setInterval(checkReminders, 60000);
    return () => clearInterval(intervalId);
  }, [tasks]);

  useEffect(() => {
    return () => {
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
      }
    };
  }, []);

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
    
    setTempLinks([
      ...tempLinks, 
      { 
        id: crypto.randomUUID(), 
        url: currentLinkInput, 
        title: currentLinkTitle || 'Resource' 
      }
    ]);
    setCurrentLinkInput('');
    setCurrentLinkTitle('');
  };

  const removeTempLink = (id: string) => {
    setTempLinks(tempLinks.filter(l => l.id !== id));
  };

  const addRevisions = (taskText: string, resources: Resource[], time: string) => {
    const intervals = [3, 7, 14, 24, 30];
    const topicKey = `${taskText}_${new Date().toISOString()}`;
    const newTasks: Task[] = intervals.map(days => {
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
    if (!newTask.trim()) return;
    
    addRevisions(newTask, tempLinks, newTime);
    
    setNewTask('');
    setTempLinks([]);
    setNewTime('');
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
  };

  // --- Notes / Sub-topics functions ---
  // Get topicKey for a task (used to sync notes across all revisions of same topic)
  const getTopicKey = (t: Task) => t.topicKey || `${t.text}_${t.originalDate}`;

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

  const [quoteText, quoteAuthor] = todayQuote.split(' — ');

  const renderTask = (t: Task, overdue = false) => (
    <div key={t.id} className={`p-4 rounded-xl border transition-colors ${
      t.completed
        ? 'bg-slate-50 border-slate-200'
        : overdue
          ? 'bg-white border-amber-300'
          : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => toggleTask(t.id)}
          aria-label={t.completed ? 'Mark as not done' : 'Mark as done'}
          className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
            t.completed
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-slate-300 text-transparent hover:border-emerald-500 hover:text-emerald-500'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`font-semibold break-words ${t.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>{t.text}</p>
            {t.intervalDay && (() => {
              const cfg = DAY_BADGE_CONFIG[t.intervalDay] || { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-600' };
              return (
                <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text}`}>
                  Day {t.intervalDay}
                </span>
              );
            })()}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Learned: {t.originalDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            {overdue && (
              <span className="text-amber-700 font-medium"> · Due {t.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            )}
          </p>

          {((t.resources && t.resources.length > 0) || t.reminderTime) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {t.resources && t.resources.map((res, idx) => (
                <a key={idx} href={res.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md hover:bg-indigo-100 border border-indigo-100">
                  <LinkIcon className="w-3 h-3" /> {res.title}
                </a>
              ))}
              {t.reminderTime && (
                <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded-md border border-amber-200">
                  <Clock className="w-3 h-3" /> {t.reminderTime}
                </span>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => deleteTask(t.id)}
          aria-label="Delete revision"
          title="Delete"
          className="p-1 -m-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Notes / Sub-topics Section */}
      <div className="mt-3 ml-9">
        <button
          type="button"
          onClick={() => setExpandedTaskId(expandedTaskId === t.id ? null : t.id)}
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
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
                    note.important ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <button
                      type="button"
                      onClick={() => toggleNoteImportant(t.id, note.id)}
                      title={note.important ? 'Important hai' : 'Important mark karo'}
                      className="mt-0.5 flex-shrink-0 text-xs"
                    >
                      {note.important ? '🔴' : '⚪'}
                    </button>
                    <span className={`flex-1 break-words ${note.important ? 'text-red-800 font-medium' : 'text-slate-700'}`}>
                      {note.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteNote(t.id, note.id)}
                      className="text-slate-400 hover:text-red-600 flex-shrink-0"
                      title="Yaad ho gaya — delete karo"
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
                placeholder="Sub-topic ya note likho..."
                className="flex-1 min-w-0 text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setNoteImportant(!noteImportant)}
                title={noteImportant ? 'Important hai' : 'Important mark karo'}
                className={`p-2 rounded-lg border text-xs ${
                  noteImportant ? 'bg-red-50 border-red-300' : 'bg-white border-slate-300 opacity-60 hover:opacity-100'
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
            <p className="text-xs text-slate-500">🔴 = zyada dhyan dena &nbsp;|&nbsp; ✕ = yaad ho gaya to delete karo</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
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
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 truncate">RetentionMaster</h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href="https://forms.gle/KZaHhBhJNCirAWWn9"
              target="_blank"
              rel="noopener noreferrer"
              title="Feedback"
              className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-3 py-2 rounded-full text-sm font-medium hover:bg-slate-50 transition"
            >
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Feedback</span>
            </a>
            <div
              title="Lagataar kitne din saare revisions poore kiye"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm font-bold ${
                streak > 0 ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-slate-300 text-slate-700'
              }`}
            >
              <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-slate-400'}`} />
              <span>{streak}<span className="hidden sm:inline"> Day Streak</span></span>
            </div>
          </div>
        </header>

        {/* Today's Pending Revisions Alert Banner */}
        {(todayTasks.length > 0 || overdueTasks.length > 0) && (
          <div className={`rounded-xl p-4 mb-6 flex items-center gap-3 border ${
            todayAllDone ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-300'
          }`}>
            {todayAllDone ? (
              <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            ) : (
              <Bell className="w-6 h-6 text-amber-600 flex-shrink-0 animate-pulse" />
            )}
            <div className="flex-1">
              <p className={`font-bold ${todayAllDone ? 'text-emerald-800' : 'text-amber-900'}`}>
                {todayAllDone
                  ? 'Sab done! Great job! 🎉'
                  : `Aaj ${todayPending} topic${todayPending > 1 ? 's' : ''} revise karne hain!`
                }
              </p>
              {!todayAllDone && overdueTasks.length > 0 && (
                <p className="text-sm text-amber-800 mt-0.5">Inmein {overdueTasks.length} pichhle dinon se pending hain.</p>
              )}
            </div>
            {!todayAllDone && !isTodaySelected && (
              <button
                type="button"
                onClick={() => setSelectedDate(new Date())}
                className="text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg flex-shrink-0"
              >
                Dekho
              </button>
            )}
          </div>
        )}

        {/* Reality Check Quote */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 md:p-8 text-white shadow-md mb-6">
          <p className="text-xs font-bold tracking-widest text-indigo-200 mb-3">DAILY REALITY CHECK</p>
          <p className="text-lg md:text-2xl font-serif italic leading-relaxed">“{quoteText}”</p>
          {quoteAuthor && <p className="text-sm text-indigo-200 mt-3">— {quoteAuthor}</p>}
        </div>

        {/* Add Task Form */}
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
          <h2 className="text-lg font-bold text-slate-900">Naya topic add karo</h2>
          <p className="text-sm text-slate-500 mb-4">5 revisions apne aap banenge: Day 3, 7, 14, 24 aur 30</p>
          <form onSubmit={handleAddTask} className="flex flex-col gap-3">

            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1">
                <span className="block text-xs font-semibold text-slate-600 mb-1">Topic</span>
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="E.g., Photosynthesis mechanism..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </label>
              <label className="sm:w-40">
                <span className="block text-xs font-semibold text-slate-600 mb-1">Reminder (optional)</span>
                <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-3 py-3 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
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

            {/* Multiple Link Adder */}
            <div>
              <span className="block text-xs font-semibold text-slate-600 mb-1">Study links (optional)</span>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={currentLinkTitle}
                  onChange={(e) => setCurrentLinkTitle(e.target.value)}
                  placeholder="Label (e.g. PDF)"
                  className="sm:w-1/3 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                <div className="flex flex-1 gap-2">
                  <input
                    type="url"
                    value={currentLinkInput}
                    onChange={(e) => setCurrentLinkInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddLink(e); }}
                    placeholder="Paste link here..."
                    className="flex-1 min-w-0 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 rounded-lg text-sm font-medium text-slate-700"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>
            </div>

            {tempLinks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tempLinks.map(link => (
                  <span key={link.id} className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md border border-indigo-100">
                    <LinkIcon className="w-3 h-3" /> {link.title}
                    <button type="button" onClick={() => removeTempLink(link.id)} aria-label="Remove link" className="hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={!newTask.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 mt-1 shadow-sm transition-colors"
            >
              <Plus className="w-5 h-5" />
              Schedule Now 🚀
            </button>
          </form>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">

          {/* Calendar */}
          <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-slate-900 flex items-center gap-2 whitespace-nowrap">
                <Calendar className="w-4 h-4 text-indigo-600" />
                {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center gap-1">
                <button type="button" aria-label="Previous month" onClick={() => { const d = new Date(selectedDate); d.setDate(1); d.setMonth(d.getMonth() - 1); setSelectedDate(d); }} className="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100">←</button>
                <button type="button" onClick={() => setSelectedDate(new Date())} className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg">Today</button>
                <button type="button" aria-label="Next month" onClick={() => { const d = new Date(selectedDate); d.setDate(1); d.setMonth(d.getMonth() + 1); setSelectedDate(d); }} className="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100">→</button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {['S','M','T','W','T','F','S'].map((d, index) => <div key={index} className="text-slate-500 text-xs font-semibold pb-1">{d}</div>)}
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
                      aria-label={`${currentDate.toDateString()}${dayTasks.length ? `, ${dayTasks.length} revisions` : ''}`}
                      className={`relative aspect-square flex items-center justify-center rounded-full text-sm transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-bold'
                          : isToday
                            ? 'text-indigo-700 font-bold ring-2 ring-indigo-200 hover:bg-indigo-50'
                            : 'text-slate-700 hover:bg-slate-100'
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

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" />Revision due</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />Sab done</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" />Chhoot gaya</span>
            </div>
          </div>

          {/* Task List */}
          <div className="md:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="font-bold text-xl text-slate-900">
                  {isTodaySelected ? "Today's Plan" : selectedDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </h2>
                {tasksForSelectedDate.length > 0 && (
                  <p className="text-sm text-slate-500">
                    {completedCount}/{tasksForSelectedDate.length} done
                  </p>
                )}
              </div>
            </div>

            {isTodaySelected && overdueTasks.length > 0 && (
              <div className="mb-5">
                <h3 className="text-xs font-bold tracking-wider text-amber-700 mb-2">PICHHLE PENDING ({overdueTasks.length})</h3>
                <div className="space-y-3">
                  {overdueTasks.map(t => renderTask(t, true))}
                </div>
              </div>
            )}

            {isTodaySelected && overdueTasks.length > 0 && tasksForSelectedDate.length > 0 && (
              <h3 className="text-xs font-bold tracking-wider text-slate-500 mb-2">AAJ KE ({tasksForSelectedDate.length})</h3>
            )}

            <div className="space-y-3">
              {tasksForSelectedDate.length === 0 && !(isTodaySelected && overdueTasks.length > 0) && (
                <div className="text-center py-8 px-4 rounded-xl border-2 border-dashed border-slate-200">
                  <p className="font-semibold text-slate-700">Is din koi revision nahi</p>
                  <p className="text-sm text-slate-500 mt-1">Upar naya topic add kijiye, revisions apne aap calendar mein aa jayenge.</p>
                </div>
              )}
              {tasksForSelectedDate.map(t => renderTask(t))}
            </div>
          </div>
        </div>

        {/* Recall Modal - shown after completing 30+ day revision */}
        {recallModalTask && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
              <Brain className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Yaad Aaya? 🤔</h3>
              <p className="text-sm text-slate-600 mb-1">Topic: <span className="font-semibold text-slate-800">{recallModalTask.text}</span></p>
              <p className="text-sm text-slate-500 mb-6">Kya aapko yeh topic yaad hai?</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleRecallNo}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-3 rounded-xl border border-red-200 transition"
                >
                  Nahi 😕
                </button>
                <button
                  type="button"
                  onClick={handleRecallYes}
                  className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold py-3 rounded-xl border border-emerald-200 transition"
                >
                  Haan! ✅
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-3">"Nahi" select karne par 30 din baad phir revision schedule hoga</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
