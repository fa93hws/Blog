import * as React from 'react';
import { Link } from 'react-router-dom';
import { Text } from 'components/typography/typography';
import styles from './nav-links.css';

export type NavItem = {
  text: string;
  link: string;
};
const NavLink = ({ item: { text, link } }: { item: NavItem }) => (
  <li>
    <Link to={link} className={styles.link}>
      <Text.Micro>{text}</Text.Micro>
    </Link>
  </li>
);

export const NavLinks = ({ items }: { items: readonly NavItem[] }) => (
  <ul className={styles.list}>
    {items.map((item, idx) => (
      <NavLink item={item} key={idx} />
    ))}
  </ul>
);