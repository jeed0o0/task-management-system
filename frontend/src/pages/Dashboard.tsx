import { useNavigate } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import { useAuthStore } from "../stores/authStore";
import { TaskStatus } from "../types";

export function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { data, isLoading } = useTasks({ limit: 5 });
  const tasks = data?.data ?? [];

  const stats = {
    todo: tasks.filter((t) => t.status === TaskStatus.TODO).length,
    inProgress: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
    inReview: tasks.filter((t) => t.status === TaskStatus.IN_REVIEW).length,
    done: tasks.filter((t) => t.status === TaskStatus.DONE).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome{user ? `, ${user.username}` : ""}
          </h1>
          <p className="text-gray-600 mt-1">Here's your task overview</p>
        </div>
        <button
          onClick={() => navigate("/tasks")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          View All Tasks
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "To Do", value: stats.todo, color: "bg-gray-500" },
          { label: "In Progress", value: stats.inProgress, color: "bg-yellow-500" },
          { label: "In Review", value: stats.inReview, color: "bg-purple-500" },
          { label: "Done", value: stats.done, color: "bg-green-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">{stat.label}</span>
              <div className={`w-3 h-3 rounded-full ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {isLoading ? "-" : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Recent Tasks</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => navigate(`/tasks/${task.id}`)}
              className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
            >
              <div>
                <p className="font-medium text-gray-900">{task.title}</p>
                <p className="text-sm text-gray-500">{task.status.replace("_", " ")}</p>
              </div>
              <span className="text-sm text-gray-500">{task.priority}</span>
            </div>
          ))}
          {!isLoading && tasks.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500">
              <p>No tasks yet. Create your first task!</p>
              <button
                onClick={() => navigate("/tasks")}
                className="mt-2 text-blue-600 hover:underline"
              >
                Go to Tasks
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
