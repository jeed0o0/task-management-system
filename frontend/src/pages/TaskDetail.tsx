import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTask, useUpdateTask, useDeleteTask, useAddComment } from "../hooks/useTasks";
import { useAuthStore } from "../stores/authStore";
import { TaskStatus, TaskPriority } from "../types";

const statusOptions = Object.values(TaskStatus);
const priorityOptions = Object.values(TaskPriority);

export function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: task, isLoading } = useTask(id!);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const addComment = useAddComment();
  const user = useAuthStore((s) => s.user);

  const [commentText, setCommentText] = useState("");

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-gray-100 rounded-lg" />;
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Task not found</h2>
        <button onClick={() => navigate("/tasks")} className="mt-4 text-blue-600 hover:underline">
          Back to tasks
        </button>
      </div>
    );
  }

  const handleStatusChange = (status: string) => {
    updateTask.mutate({ id: task.id, data: { status: status as TaskStatus } });
  };

  const handlePriorityChange = (priority: string) => {
    updateTask.mutate({ id: task.id, data: { priority: priority as TaskPriority } });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask.mutate(task.id, {
        onSuccess: () => navigate("/tasks"),
      });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment.mutate(
      { taskId: task.id, content: commentText },
      { onSuccess: () => setCommentText("") }
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate("/tasks")}
        className="text-blue-600 hover:underline text-sm"
      >
        &larr; Back to Tasks
      </button>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 flex-1">{task.title}</h1>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg text-sm"
          >
            Delete
          </button>
        </div>

        <p className="text-gray-600 mb-6">{task.description ?? "No description"}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s.replace("_", " ")}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={task.priority}
              onChange={(e) => handlePriorityChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {priorityOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-500 space-y-1">
          <p>Created by: {task.creator?.username}</p>
          {task.assignee && <p>Assigned to: {task.assignee.username}</p>}
          {task.dueDate && <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
          <p>Created: {new Date(task.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">
          Comments ({task.comments?.length ?? 0})
        </h2>

        <form onSubmit={handleAddComment} className="mb-6">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!commentText.trim() || addComment.isPending}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {addComment.isPending ? "Posting..." : "Post Comment"}
          </button>
        </form>

        <div className="space-y-4">
          {task.comments?.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{comment.author.username}</span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
