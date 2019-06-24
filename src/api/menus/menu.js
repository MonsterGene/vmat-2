import vision from '../../pages/vision/menu';
import genius from '../../pages/genius/menu';
import gitLab from './gitLab';

const Menu = [];

Menu.push(...genius);
Menu.push(...vision);
Menu.push(gitLab);
// Menu.push(...example);

export default Menu;
