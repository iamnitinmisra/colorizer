import React from "react";

const Room = props => {
  const mappedUsers = props.room.map(user => {
    return (
      <div key={user.id}>
        <div
          style={{
            height: `${user.thickness * 2}px`,
            width: `${user.thickness * 2}px`,
            borderRadius: "50%",
            backgroundColor: user.color
          }}
        ></div>
        {user.name}
      </div>
    );
  });
  return <div>{mappedUsers}</div>;
};

export default Room;