import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState({
    name: '',
    age: '',
    address: '',
    guardianName: '',
    guardianContact: '',
  });
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const apiUrl = 'http://localhost:8080/students';

  useEffect(() => {
    axios.get(apiUrl)
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching students!', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  const addStudent = (e) => {
    e.preventDefault();

    if (!student.name || !student.age || !student.address || !student.guardianName || !student.guardianContact) {
      alert('Please fill all fields');
      return;
    }

    axios.post(apiUrl, {
      name: student.name,
      age: parseInt(student.age),
      address: student.address,
      guardianName: student.guardianName,
      guardianContact: student.guardianContact,
    })
    .then(response => {
      setStudents([...students, response.data]);  
      setStudent({ name: '', age: '', address: '', guardianName: '', guardianContact: '' }); 
    })
    .catch(error => {
      console.error('There was an error adding the student!', error);
    });
  };

  const editStudent = (id) => {
    const studentToEdit = students.find((student) => student.id === id);
    setStudent(studentToEdit);
    setEditing(true);
    setCurrentId(id);
  };

  const updateStudent = (e) => {
    e.preventDefault();

    if (!student.name || !student.age || !student.address || !student.guardianName || !student.guardianContact) {
      alert('Please fill all fields');
      return;
    }

    axios.put(`${apiUrl}/${currentId}`, {
      name: student.name,
      age: parseInt(student.age),
      address: student.address,
      guardianName: student.guardianName,
      guardianContact: student.guardianContact,
    })
    .then(response => {
      setStudents(students.map(s => (s.id === currentId ? response.data : s)));  
      setStudent({ name: '', age: '', address: '', guardianName: '', guardianContact: '' });  
      setEditing(false);
      setCurrentId(null);
    })
    .catch(error => {
      console.error('There was an error updating the student!', error);
    });
  };

  const deleteStudent = (id) => {
    axios.delete(`${apiUrl}/${id}`)
    .then(() => {
      setStudents(students.filter(student => student.id !== id));
    })
    .catch(error => {
      console.error('There was an error deleting the student!', error);
    });
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 p-8">
      <div className="flex space-x-8 w-full max-w-5xl">
        <div className="bg-white p-8 rounded-lg shadow-lg w-1/2 h-[630px] overflow-y-auto flex-shrink-0"> 
        <h1 className="text-2xl font-bold mb-4 text-center">Student Management</h1>

          <form onSubmit={editing ? updateStudent : addStudent} className="mb-4">
            <div className="mb-4">
              <label className="block mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={student.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={student.age}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={student.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Guardian</label>
              <input
                type="text"
                name="guardianName"
                value={student.guardianName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Contact</label>
              <input
                type="text"
                name="guardianContact"
                value={student.guardianContact}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full p-2 rounded-md text-white ${editing ? 'bg-yellow-500' : 'bg-blue-500'}`}
            >
              {editing ? 'Update Student' : 'Add Student'}
            </button>
          </form>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg w-full flex-grow"> {/* List grows, but form stays fixed */}
          <h2 className="text-xl font-bold mb-4 text-center">Students List</h2>
          <ul>
            {students.map((s) => (
              <li
                key={s.id}
                className="flex justify-between items-center mb-2 p-2 bg-gray-200 rounded-md"
              >
                <div>
                  <p className="font-bold">{s.name}</p>
                  <p>Age: {s.age}</p>
                  <p>Address: {s.address}</p>
                  <p>Guardian: {s.guardianName} ({s.guardianContact})</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => editStudent(s.id)}
                    className="bg-yellow-400 px-2 py-1 rounded-md text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteStudent(s.id)}
                    className="bg-red-500 px-2 py-1 rounded-md text-white"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
