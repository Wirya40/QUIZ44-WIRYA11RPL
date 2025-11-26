// pages/index.js
import Link from "next/link";
import { Card, Button } from "antd";

export default function Home() {
  return (
    <div style={{ padding: 24 }}>
      <Card>
        <h1>Welcome — Student App</h1>
        <p>Use the links below to navigate.</p>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/dashboard"><Button type="primary">Dashboard</Button></Link>
          <Link href="/students"><Button>Students</Button></Link>
        </div>
      </Card>
    </div>
  );
}
