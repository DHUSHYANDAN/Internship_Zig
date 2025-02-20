import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { baseurl } from '../url';
function Index() {
  const [events, setEvents] = useState([]);

  // Function to fetch data
  const fetchData = async () => {
    try {
      const { data } = await axios.get(baseurl+'/vieUsers');
      setEvents(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to handle delete
  const handleDelete = async (registration_number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return; 

    try {
      await axios.delete({}+`/deleteUser/${registration_number}`);
      
      alert('User deleted successfully');
      fetchData()

    } catch (error) {
      console.error('Error deleting data:', error);
      alert('Error deleting user. Please try again later.');
    }
    
  };


  useEffect(() => {
    fetchData();
  },[]);

  return (
    <>
    
      <div className="header">
        <h2>Existing Users</h2>
        <h3><Link to="/addUsers" className="add-user">AD Users</Link></h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Registration Number</th>
            <th>Department</th>
            <th>Date of Birth</th>
            <th>Email</th>
            <th>Description</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={event.registration_number}>
              <td>{index + 1}</td>
              <td>{event.name}</td>
              <td>{event.registration_number}</td>
              <td>{event.dept}</td>
              <td>{event.dob}</td>
              <td>{event.email}</td>
              <td>{event.description}</td>
              <td>
                <Link to={`/UpdateUsers/${event.registration_number}`} className="update">Update</Link>
              </td>
              <td>
                <Link onClick={() => handleDelete(event.registration_number)} className="delete">Delete</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Index;
