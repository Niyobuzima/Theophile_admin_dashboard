import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  title: string;
  subtitle?: string;
}

export default function Layout({ children, currentPage, onPageChange, title, subtitle }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar currentPage={currentPage} onPageChange={onPageChange} />

      <div className="ml-64">
        <Header title={title} subtitle={subtitle} />

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
