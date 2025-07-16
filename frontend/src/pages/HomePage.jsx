import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ListTodo, Calendar, StickyNote } from 'lucide-react';

const HomePage = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Noty</h1>
          <p className="text-xl text-gray-600">
            Your personal workspace for tasks, calendar events, and notes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/tasks"
            className="p-6 rounded-lg border hover:border-primary transition-colors flex flex-col items-center gap-4"
          >
            <ListTodo className="w-12 h-12 text-primary" />
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Tasks</h2>
              <p className="text-gray-600">
                Organize and track your tasks effectively
              </p>
            </div>
          </Link>

          <Link
            to="/calendar"
            className="p-6 rounded-lg border hover:border-primary transition-colors flex flex-col items-center gap-4"
          >
            <Calendar className="w-12 h-12 text-primary" />
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Calendar</h2>
              <p className="text-gray-600">
                Manage your schedule and events
              </p>
            </div>
          </Link>

          <Link
            to="/notes"
            className="p-6 rounded-lg border hover:border-primary transition-colors flex flex-col items-center gap-4"
          >
            <StickyNote className="w-12 h-12 text-primary" />
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Notes</h2>
              <p className="text-gray-600">
                Keep your thoughts and ideas organized
              </p>
            </div>
          </Link>
        </div>

        {authUser && (
          <div className="text-center mt-12">
            <p className="text-gray-600">
              Welcome back, <span className="font-semibold">{authUser.name}</span>!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;