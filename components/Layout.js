// components/Layout.js
import React from "react";
import Link from "next/link";
import { Layout as AntLayout, Menu, Switch, Avatar } from "antd";
import { useAppContext } from "../context/AppContext";

const { Header, Sider, Content } = AntLayout;

export default function Layout({ children }) {
  const { theme, toggleTheme, userName } = useAppContext();

  return (
    <AntLayout style={{ minHeight: "100vh", background: theme === "dark" ? "#0b1220" : "#f0f2f5" }}>
      <Sider theme={theme === "dark" ? "dark" : "light"}>
        <div style={{ padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar>{userName?.[0] ?? "U"}</Avatar>
          <div style={{ color: theme === "dark" ? "#fff" : "#000", fontWeight: 700 }}>{userName}</div>
        </div>

        <Menu theme={theme === "dark" ? "dark" : "light"} mode="inline" defaultSelectedKeys={["students"]}>
          <Menu.Item key="dashboard">
            <Link href="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="students">
            <Link href="/students">Students</Link>
          </Menu.Item>
        </Menu>

        <div style={{ padding: 16 }}>
          <div style={{ color: theme === "dark" ? "#fff" : undefined, marginBottom: 8 }}>Theme</div>
          <Switch checked={theme === "dark"} onChange={toggleTheme} checkedChildren="Dark" unCheckedChildren="Light" />
        </div>
      </Sider>

      <AntLayout>
        <Header style={{ background: theme === "dark" ? "#071126" : "#fff", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, color: theme === "dark" ? "#fff" : undefined }}>Student App</div>
        </Header>

        <Content style={{ margin: 16 }}>{children}</Content>
      </AntLayout>
    </AntLayout>
  );
}
