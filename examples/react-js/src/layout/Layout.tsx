import { FunctionComponent } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import styles from './Layout.module.css';

interface LayoutProps {}

const Layout: FunctionComponent<LayoutProps> = () => {
  return (
    <div className={styles.layout}>
      <header>
        <h1>React native form validator</h1>
        <nav className={styles.nav}>
          <NavLink to="/function-form" className={({ isActive }) => (isActive ? styles.active : '')}>
            Functionanl Form
          </NavLink>
          <NavLink to="/class-form" className={({ isActive }) => (isActive ? styles.active : '')}>
            Class Based Form
          </NavLink>
        </nav>
      </header>

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
