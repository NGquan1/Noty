import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  ListTodo,
  ArrowRight,
  CheckCircle2,
  Clock,
  Target,
} from "lucide-react";

const HomePage = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <ListTodo className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Task Management Made Simple
              </span>
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Welcome to Noty
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay organized, boost productivity, and accomplish your goals with
              our intuitive task management system
            </p>
          </div>

          {/* Main CTA Card */}
          <div className="max-w-4xl mx-auto mb-16">
            <Link
              to="/tasks"
              className="group block p-8 rounded-3xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <ListTodo className="w-12 h-12" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      Get Started with Tasks
                    </h2>
                    <p className="text-white/90 text-lg">
                      Create, organize, and complete your tasks efficiently
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Track Progress
              </h3>
              <p className="text-gray-600 text-sm">
                Monitor your task completion and stay motivated
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Set Deadlines
              </h3>
              <p className="text-gray-600 text-sm">
                Never miss important dates with smart reminders
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Achieve Goals
              </h3>
              <p className="text-gray-600 text-sm">
                Turn your to-do list into accomplished goals
              </p>
            </div>
          </div>

          {authUser && (
            <div className="text-center mt-12">
              <p className="text-gray-600 text-lg">
                Welcome back,{" "}
                <span className="font-semibold text-primary">
                  {authUser.fullName}
                </span>
                ! 👋
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
