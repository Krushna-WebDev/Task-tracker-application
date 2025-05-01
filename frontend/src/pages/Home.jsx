import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import axios from "axios";
import { toast } from 'react-toastify';

function Home() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/projects`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setProjects(response.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again.");
        toast.error("Failed to load projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  const handleAddProject = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      navigate("/add-project");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove the project from the list
      setProjects(projects.filter(project => project._id !== projectId));
      toast.success("Project deleted successfully");
    } catch (err) {
      setError("Failed to delete project");
      toast.error("Failed to delete project");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-10 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="mb-6">You need to be logged in to add or manage projects.</p>
            <div className="flex space-x-4">
              <Link 
                to="/login" 
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded text-center transition"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded text-center transition"
              >
                Sign Up
              </Link>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-purple-400">Your Projects</h1>
          <button
            onClick={handleAddProject}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition duration-300 shadow-lg"
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Project
            </span>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {!user ? (
          <div className="bg-gray-800 rounded-xl p-10 text-center shadow-xl">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Welcome to TaskTracker</h2>
            <p className="text-lg mb-6">Sign in to start managing your projects and tasks.</p>
            <div className="flex justify-center space-x-4">
              <Link 
                to="/login" 
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition shadow-lg"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold transition shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-10 text-center shadow-xl animate-fadeIn">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <h3 className="text-xl text-gray-300 mb-4">You don't have any projects yet.</h3>
            <button
              onClick={() => navigate("/add-project")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition duration-300 shadow-lg"
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-700 hover:border-purple-500 transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-2xl font-semibold text-white">{project.title}</h2>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project._id);
                    }}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
                
                {project.description && (
                  <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                )}
                
                <p className="text-sm text-gray-500 mb-4">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </p>
                
                <button
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  <span>View Tasks</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
