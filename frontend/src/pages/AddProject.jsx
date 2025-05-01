import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';
function AddProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { fetchUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title) {
      setError('Title is required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/projects`, {
        title,
        description
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Refresh user data to get updated projects
      await fetchUser();
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="mr-4 text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-purple-400">Create New Project</h1>
        </div>
        
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
          {error && (
            <div className="bg-red-500 text-white p-4 rounded-lg mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Project Title*
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 transition"
                placeholder="Enter project title"
              />
              <p className="mt-1 text-xs text-gray-400">Give your project a clear and specific name</p>
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 transition h-32"
                placeholder="Describe what this project is about"
              />
              <p className="mt-1 text-xs text-gray-400">Optional: Provide details about the project's purpose and goals</p>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Create Project
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="text-xs text-gray-400">
              <p className="mb-1">⚠️ Note: You can create a maximum of 4 projects.</p>
              <p>Create a project to start tracking tasks and progress.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProject; 