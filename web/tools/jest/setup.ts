import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { toMatchRenderedSnapshot } from './rendered-snapshot';
import 'mobx-react/batchingOptOut';

configure({ adapter: new Adapter() });

expect.extend({
  toMatchRenderedSnapshot,
});
