import { Link } from "react-router-dom";
import type { Task } from "../types";

const priorityColors: Record<string, string> = {
  CRITICAL: "bg-red-100 text-red-800",
  HIGH: "bg-orange-100 text-orange-800",
  MEDIUM: "bg-blue-100 text-blue-800",
  LOW: "bg-gray-100 text-gray-800",
};

const statusColors: Record<string, string> = {
  TODO: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  IN_REVIEW: "bg-purple-100 text-purple-800",
  DONE: "bg-green-100 text-green-800",
};

interface Props {
  task: Task;
}

export function TaskCard({ task }: Props) {
  return (
    <Link
      to={`/tasks/${task.id}`}
      className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 truncate flex-1">{task.title}</h3>
        <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between text-xs">
        <span className={`px-2 py-0.5 rounded font-medium ${statusColors[task.status]}`}>
          {task.status.replace("_", " ")}
        </span>

        <div className="flex items-center gap-3 text-gray-500">
          {task.assignee && <span>{task.assignee.username}</span>}
          {task._count && <span>{task._count.comments} comments</span>}
          {task.dueDate && (
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
