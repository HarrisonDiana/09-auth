type LayoutProps = {
  children: React.ReactNode;
  sidebar: React.ReactNode; 
};

export default function Layout({ children, sidebar }: LayoutProps) {
  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      {sidebar}
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}