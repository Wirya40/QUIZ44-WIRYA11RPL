// pages/students/index.js
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Table, Input, Select, Button, Card, Space, message } from "antd";
import ExportCSV from "../../components/ExportCSV";
import { useAppContext } from "../../context/AppContext";
import { EyeOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function StudentsPage({ initialStudents = [], categories = [] }) {
  const { selectedMajor, setSelectedMajor } = useAppContext();

  const [students, setStudents] = useState(initialStudents || []);
  const [search, setSearch] = useState("");
  const [majorFilter, setMajorFilter] = useState(selectedMajor || null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 8 });

  useEffect(() => {
    if (selectedMajor) setMajorFilter(selectedMajor);
  }, [selectedMajor]);

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    return (students || []).filter((s) => {
      const name = `${s.firstName} ${s.lastName}`.toLowerCase();
      const matchName = q ? name.includes(q) : true;
      const majorVal = (s.major || s.company?.department || "").toLowerCase();
      const matchMajor = majorFilter ? majorVal.includes(String(majorFilter).toLowerCase()) : true;
      return matchName && matchMajor;
    });
  }, [students, search, majorFilter]);

  const columns = [
    {
      title: "Name",
      key: "name",
      render: (_, r) => `${r.firstName} ${r.lastName}`,
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "University", dataIndex: "university", key: "university" },
    { title: "Major", key: "major", render: (_, r) => r.major || r.company?.department || "-" },
    {
      title: "Action",
      key: "action",
      render: (_, r) => (
        <Space>
          <Link href={`/students/${r.id}`}><Button icon={<EyeOutlined />}>View</Button></Link>
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(r.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  function handleDelete(id) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    message.success("Deleted (local simulation)");
  }

  return (
    <div>
      <Card>
        <Space style={{ marginBottom: 12 }} wrap>
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 300 }}
          />

          <Select
            placeholder="Filter by Major"
            allowClear
            style={{ width: 240 }}
            value={majorFilter || undefined}
            onChange={(val) => { setMajorFilter(val); setSelectedMajor(val || ""); }}
          >
            {categories.map((c) => <Option key={c} value={c}>{c}</Option>)}
          </Select>

          <Button onClick={() => { setSearch(""); setMajorFilter(null); setSelectedMajor(""); }}>Reset</Button>

          <ExportCSV
            data={filtered.map(s => ({ id: s.id, name: `${s.firstName} ${s.lastName}`, email: s.email, university: s.university, major: s.major || s.company?.department }))}
            filename="students.csv"
          />
        </Space>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: filtered.length,
            showSizeChanger: true,
            onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
          }}
        />
      </Card>
    </div>
  );
}

// SSR: fetch students + categories
export async function getServerSideProps() {
  try {
    const [usersRes, categoriesRes] = await Promise.all([
      fetch("https://dummyjson.com/users?limit=100"),
      fetch("https://dummyjson.com/products/categories"),
    ]);
    const usersJson = await usersRes.json();
    const categories = await categoriesRes.json();

    const users = (usersJson.users || []).map((u) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      university: u.university,
      image: u.image,
      phone: u.phone,
      age: u.age,
      company: u.company || {},
      address: u.address || {},
      major: u.company?.department || "",
    }));

    return { props: { initialStudents: users, categories } };
  } catch (err) {
    console.error("SSR error:", err);
    return { props: { initialStudents: [], categories: [] } };
  }
}
