import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../api/auth";

export function Users() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 divide-y">
          {users?.map((user) => (
            <div key={user.id} className="px-4 py-3 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                {user.username[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
                {user.role}
              </span>
              {user._count && (
                <span className="text-sm text-gray-500">
                  {user._count.assignedTasks} tasks
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
