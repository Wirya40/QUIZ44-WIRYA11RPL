import React, { useEffect, useState } from "react";
import { Card, List, Avatar, Skeleton } from "antd";

// -------------------------------------------------------
// USE ONLY getServerSideProps
// -------------------------------------------------------
export async function getServerSideProps() {
  // Fetch majors (categories) - returns ARRAY, not object
  const resMajors = await fetch("https://dummyjson.com/products/categories");
  const majors = await resMajors.json(); // already an array

  // Fetch total students
  const resUsers = await fetch("https://dummyjson.com/users");
  const dataUsers = await resUsers.json();

  return {
    props: {
      majors,                         // FIXED
      totalStudents: dataUsers.total, // FIXED
    },
  };
}

export default function DashboardPage({ majors, totalStudents }) {
  const [randomStudent, setRandomStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // CSR: Load random student
  useEffect(() => {
  async function loadRandomStudent() {
    try {
      const randomId = Math.floor(Math.random() * 30) + 1;

      const res = await fetch(`https://dummyjson.com/users/${randomId}`);
      const data = await res.json();

      setRandomStudent(data);
    } catch (error) {
      console.error(error);
    }
  }

  loadRandomStudent();
}, []);


  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>

      {/* SSG Majors */}
      <Card title="Majors (SSG)">
  <List
    dataSource={majors}
    renderItem={(item) => (
      <List.Item>
        {item.name}
      </List.Item>
    )}
  />
</Card>


      <br />

      {/* SSR Total Students */}
      <Card title="Total Students (SSR)">
        <p>{totalStudents}</p>
      </Card>

      <br />

      {/* CSR Random Student */}
     <Card title="Random Student of The Day" style={{ marginTop: 20 }}>
  {!randomStudent ? (
    <Skeleton avatar paragraph={{ rows: 3 }} />
  ) : (
    <Card.Meta
      avatar={<Avatar src={randomStudent?.image} />}
      title={`${randomStudent?.firstName} ${randomStudent?.lastName}`}
      description={randomStudent?.email}
    />
  )}
</Card>

    </div>
  );
}
