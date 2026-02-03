import React from 'react';

const UserGreeting = ({ name }) => {
  return (
    <div style={{
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: '#f0f4f8',
      color: '#2d3748',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '18px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      Hello, {name}!
    </div>
  );
};

export default UserGreeting;
