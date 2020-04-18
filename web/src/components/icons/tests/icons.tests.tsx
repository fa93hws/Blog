import * as React from 'react';
import { createIcon } from '../create-icon';

describe('createIcon', () => {
  const svg = '<path></path>';
  const Icon = createIcon(svg);

  it('should generate the small icon correctly', () => {
    expect(
      <Icon size="small" className="small-class" />,
    ).toMatchRenderedSnapshot();
  });

  it('should generate the medium icon correctly', () => {
    expect(
      <Icon size="medium" className="medium-class" />,
    ).toMatchRenderedSnapshot();
  });

  it('should generate the large icon correctly', () => {
    expect(
      <Icon size="large" className="large-class" />,
    ).toMatchRenderedSnapshot();
  });
});
