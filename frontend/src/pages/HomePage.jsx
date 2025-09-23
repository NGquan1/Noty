import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { ListTodo, Calendar, StickyNote } from "lucide-react";

const HomePage = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-base-200 flex flex-col justify-center">
      <div className="container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h1 className="text-5xl font-extrabold mb-4 text-primary drop-shadow-lg">
              Welcome to Noty
            </h1>
            <p className="text-2xl text-gray-600 font-medium">
              Your personal workspace for{" "}
              <span className="text-primary font-bold">tasks</span>,{" "}
              <span className="text-primary font-bold">calendar</span> and{" "}
              <span className="text-primary font-bold">notes</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Link
              to="/tasks"
              className="group p-8 rounded-2xl border-2 border-primary/20 bg-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex flex-col items-center gap-5"
            >
              <ListTodo className="w-16 h-16 text-primary drop-shadow-md group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2 text-primary">Tasks</h2>
                <p className="text-gray-500 font-medium">
                  Organize and track your tasks effectively
                </p>
              </div>
            </Link>

            <Link
              to="/calendar"
              className="group p-8 rounded-2xl border-2 border-primary/20 bg-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex flex-col items-center gap-5"
            >
              <Calendar className="w-16 h-16 text-primary drop-shadow-md group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2 text-primary">
                  Calendar
                </h2>
                <p className="text-gray-500 font-medium">
                  Manage your schedule and events
                </p>
              </div>
            </Link>

            <Link
              to="/notes"
              className="group p-8 rounded-2xl border-2 border-primary/20 bg-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex flex-col items-center gap-5"
            >
              <StickyNote className="w-16 h-16 text-primary drop-shadow-md group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2 text-primary">Notes</h2>
                <p className="text-gray-500 font-medium">
                  Keep your thoughts and ideas organized
                </p>
              </div>
            </Link>
          </div>

          {authUser && (
            <div className="text-center mt-12">
              <p className="text-gray-600">
                Welcome back,{" "}
                <span className="font-semibold">{authUser.fullName}</span>!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
