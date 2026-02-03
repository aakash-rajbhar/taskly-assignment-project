"use client";

import { motion } from "framer-motion";

export default function TaskCard({ task, onDelete, onToggle, onEdit }) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
    >
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggle}
            className="shrink-0"
          >
            {task.completed ? (
              <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <div className="w-5 h-5 border-2 border-neutral-300 rounded-full hover:border-indigo-600 transition-colors" />
            )}
          </button>
          <span className={`text-sm ${task.completed ? 'line-through text-neutral-400' : 'text-neutral-900'}`}>
            {task.title}
          </span>
        </div>
      </td>
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onEdit}
            className="text-xs text-neutral-600 hover:text-indigo-600 transition-colors px-3 py-1"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-xs text-neutral-600 hover:text-red-600 transition-colors px-3 py-1"
          >
            Delete
          </button>
        </div>
      </td>
    </motion.tr>
  );
}
