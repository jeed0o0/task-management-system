import { useState } from "react";
import { useTasks, useCreateTask } from "../hooks/useTasks";
import { TaskList } from "../components/TaskList";
import { TaskForm } from "../components/TaskForm";
import { useAuthStore } from "../stores/authStore";
import type { TaskFilters, TaskPriority } from "../types";

export function Tasks() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const user = useAuthStore((s) => s.user);

  const filters: TaskFilters = {
    search: search || undefined,
    status: statusFilter as any || undefined,
  };

  const { data, isLoading } = useTasks(filters);
  const createTask = useCreateTask();

  const handleCreate = (formData: { title: string; description: string; priority: TaskPriority; assigneeId?: string }) => {
    createTask.mutate(formData, {
      onSuccess: () => setShowCreateForm(false),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showCreateForm ? "Cancel" : "+ New Task"}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Create New Task</h2>
          <TaskForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreateForm(false)}
            isLoading={createTask.isPending}
          />
        </div>
      )}

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Status</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      {data?.meta && (
        <p className="text-sm text-gray-500">
          Showing {data.data.length} of {data.meta.total} tasks
        </p>
      )}

      <TaskList tasks={data?.data ?? []} isLoading={isLoading} />
    </div>
  );
}
