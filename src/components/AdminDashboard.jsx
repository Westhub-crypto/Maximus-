import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';

const ADMIN_ID = 8067627422;
// Replace the string below with the exact URL Maximus gave you via /get_api
const WEBHOOK_URL = "YOUR_WEBHOOK_URL_HERE"; 

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [taskForm, setTaskForm] = useState({
    title: '',
    reward: '',
    type: 'basic', 
    url: ''
  });

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();

    const user = WebApp.initDataUnsafe?.user;

    // Security check
    if (user && user.id === ADMIN_ID) {
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskForm({ ...taskForm, [name]: value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    
    const payload = {
      admin_id: WebApp.initDataUnsafe?.user?.id || ADMIN_ID, // Fallback for local testing
      title: taskForm.title,
      reward: taskForm.reward,
      type: taskForm.type,
      url: taskForm.url
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        WebApp.showAlert(`Success! ${taskForm.type.toUpperCase()} task deployed to Maximus.`);
        setTaskForm({ title: '', reward: '', type: 'basic', url: '' });
      } else {
        WebApp.showAlert("Error sending task to bot.");
      }
    } catch (error) {
      WebApp.showAlert("Network error. Could not connect to Maximus.");
    }
  };

  if (loading) return <div className="text-white p-4 text-center">Verifying Admin Identity...</div>;

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-red-500 font-bold text-xl">
        Access Denied. Admins Only.
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white pb-20">
      <h1 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Maximus Control Panel
      </h1>

      <div className="bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Deploy New Task</h2>
        
        <form onSubmit={handleAddTask} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Task Title</label>
            <input 
              type="text" 
              name="title"
              value={taskForm.title}
              onChange={handleInputChange}
              required
              placeholder="e.g., Join our Official Channel" 
              className="w-full bg-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Reward</label>
              <input 
                type="number" 
                name="reward"
                value={taskForm.reward}
                onChange={handleInputChange}
                required
                placeholder="500" 
                className="w-full bg-gray-700 rounded-lg p-3 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Task Type</label>
              <select 
                name="type"
                value={taskForm.type}
                onChange={handleInputChange}
                className="w-full bg-gray-700 rounded-lg p-3 text-white focus:outline-none"
              >
                <option value="basic">Basic Task</option>
                <option value="vip">VIP Task</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Target URL</label>
            <input 
              type="url" 
              name="url"
              value={taskForm.url}
              onChange={handleInputChange}
              required
              placeholder="https://t.me/yourchannel" 
              className="w-full bg-gray-700 rounded-lg p-3 text-white focus:outline-none"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 mt-4"
          >
            Push to Database
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
