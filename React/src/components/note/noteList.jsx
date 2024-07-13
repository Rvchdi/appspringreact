import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEye, FiX, FiEdit, FiSave, FiPlus, FiDownload, FiSearch } from "react-icons/fi";

const Notes = () => {
  const [circulars, setCirculars] = useState([]);
  const [currentCircular, setCurrentCircular] = useState(null);
  const [editingCircular, setEditingCircular] = useState(null);
  const [creatingCircular, setCreatingCircular] = useState(false);
  const [newCircular, setNewCircular] = useState({ title: "", content: "" });
  const [isManager, setIsManager] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCirculars();
    checkManagerStatus();
  }, []);

  const fetchCirculars = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/circulars/");
      if (Array.isArray(response.data)) {
        setCirculars(response.data);
      } else {
        throw new Error("Unexpected data format");
      }
    } catch (error) {
      console.error("Error fetching circulars:", error);
      setError(`Failed to fetch circulars: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkManagerStatus = () => {
    const role = localStorage.getItem('role');
    const managerRoles = ["HR Manager", "IT Manager", "Marketing Manager"];
    setIsManager(managerRoles.includes(role));
  };

  const handleShowCircular = (circularId) => {
    const circularToShow = circulars.find((circular) => circular.id === circularId);
    setCurrentCircular(circularToShow);
    setEditingCircular(null);
  };

  const handleCloseCircular = () => {
    setCurrentCircular(null);
    setEditingCircular(null);
    setCreatingCircular(false);
  };

  const handleEditCircular = (circularId) => {
    const circularToEdit = circulars.find((circular) => circular.id === circularId);
    setEditingCircular({ ...circularToEdit });
    setCurrentCircular(null);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/circulars/${editingCircular.id}`, editingCircular);
      if (response.status === 200) {
        const updatedCirculars = circulars.map(circular => 
          circular.id === editingCircular.id ? response.data : circular
        );
        setCirculars(updatedCirculars);
        setEditingCircular(null);
      }
    } catch (error) {
      console.error("Error updating circular:", error);
      setError(`Failed to update circular: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingCircular) {
      setEditingCircular(prev => ({ ...prev, [name]: value }));
    } else {
      setNewCircular(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateCircular = () => {
    setCreatingCircular(true);
    setCurrentCircular(null);
    setEditingCircular(null);
  };
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCirculars = circulars.filter(circular =>
    circular.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    circular.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSaveNewCircular = async () => {
    try {
      const employeeId = localStorage.getItem('employeeId');
      const response = await axios.post(`http://localhost:8080/api/circulars/?employeeId=${employeeId}`, newCircular);
      if (response.status === 200) {
        setCirculars([...circulars, response.data]);
        setCreatingCircular(false);
        setNewCircular({ title: "", content: "" });
      }
    } catch (error) {
      console.error("Error creating circular:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      setError(`Failed to create circular: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDownloadPDF = async (circularId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/circulars/${circularId}/pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `circular_${circularId}.pdf`;
      link.click();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setError(`Failed to download PDF: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={fetchCirculars}>Retry</button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Circulars</h1>
              {isManager && (
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={handleCreateCircular}
                >
                  <FiPlus className="mr-2" /> New Circular
                </button>
              )}
            </div>
            <div className="mb-4">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search circulars"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {filteredCirculars.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No circulars available.</p>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filteredCirculars.map((circular) => (
                    <li key={circular.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">{circular.title}</h3>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleShowCircular(circular.id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <FiEye className="mr-1" /> View
                            </button>
                            <button
                              onClick={() => handleDownloadPDF(circular.id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <FiDownload className="mr-1" /> PDF
                            </button>
                            {isManager && (
                              <button
                                onClick={() => handleEditCircular(circular.id)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                              >
                                <FiEdit className="mr-1" /> Edit
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              Published: {new Date(circular.publishDate).toLocaleDateString()}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              Department: {circular.department?.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {(currentCircular || editingCircular || creatingCircular) && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    {currentCircular && (
                      <>
                        <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">{currentCircular.title}</h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">{currentCircular.content}</p>
                        </div>
                      </>
                    )}
                    {(editingCircular || creatingCircular) && (
                      <form onSubmit={(e) => { e.preventDefault(); editingCircular ? handleSaveEdit() : handleSaveNewCircular(); }}>
                        <div className="mb-4">
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={editingCircular ? editingCircular.title : newCircular.title}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                          <textarea
                            id="content"
                            name="content"
                            rows="4"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={editingCircular ? editingCircular.content : newCircular.content}
                            onChange={handleInputChange}
                            required
                          ></textarea>
                        </div>
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                          <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                          >
                            {editingCircular ? 'Save Changes' : 'Create Circular'}
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                            onClick={handleCloseCircular}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default Notes;