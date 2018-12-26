import defaultRouter from './default';
// import example from './example';
import vision from '../pages/vision/router';
import genius from '../pages/genius/router';

const paths = [];

paths.push(...defaultRouter);
paths.push(...genius);
paths.push(...vision);
// paths.push(...example);

export default paths;
