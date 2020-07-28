import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './msg.css'

const MsgWindow = () => {
  const [notifications, setnotifications] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => !isLoading && getNotifications(),3000);
    return () => clearInterval(interval);
  }, []);

  const getNotifications = () => {
    setLoading(true);
    axios
      .get('/notification/all', {
        headers: {
          'x-auth': localStorage.getItem('token')
        }
      })
      .then(res => {
        setnotifications(res.data.notification);
        setLoading(false);
      });
  };
  return (
      <div>
        <div>
            <h2 className="window pt-5">Real Time Notification Window</h2>
        </div>
        <div className="messagewindow">
        {notifications.map((item, index) => (
                    
            <div key={item._id}>
                    
                    <ul  className="nav navbar-nav"></ul>
                    <div>{item.msg}</div>
            </div>
        ))}
        </div>
      </div>
  );
};
export default MsgWindow;