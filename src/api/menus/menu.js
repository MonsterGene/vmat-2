import vision from '../../pages/vision/menu';
import genius from '../../pages/genius/menu';
import extraMenu from './extraMenu';

const Menu = [];

Menu.push(...genius);
Menu.push(...vision);
Menu.push(...extraMenu);
// Menu.push(...example);

export default Menu;
