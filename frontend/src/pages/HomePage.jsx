import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { ListTodo } from "lucide-react";

const HomePage = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-base-200 flex flex-col justify-center">
      <div className="container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <h1 className="text-5xl font-extrabold mb-4 text-primary drop-shadow-lg">
              Welcome to Noty
            </h1>
            <p className="text-2xl text-gray-600 font-medium">
              Your personal workspace for{" "}
              <span className="text-primary font-bold">task management</span>
            </p>
          </div>

          <div className="flex justify-center">
            <Link
              to="/tasks"
              className="group p-12 rounded-2xl border-2 border-primary/20 bg-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex flex-col items-center gap-6 w-full max-w-md"
            >
              <ListTodo className="w-20 h-20 text-primary drop-shadow-md group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-3 text-primary">Tasks</h2>
                <p className="text-gray-500 font-medium text-lg">
                  Organize and track your tasks effectively
                </p>
              </div>
            </Link>
          </div>

          {authUser && (
            <div className="text-center mt-12">
              <p className="text-gray-600 text-lg">
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
