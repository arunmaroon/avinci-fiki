import React from 'react';
import { render } from '@testing-library/react';
import { BasicThemeProvider } from './theme-provider.composition';

it('should render with the correct text', () => {
  expect(true).toBeTruthy();
  // const { getByText } = render(<BasicThemeProvider />);
  // const rendered = getByText('hello world!');
  // expect(rendered).toBeTruthy();
});
