import Spinner from "./Spinner";
import React from 'react';
import { render } from '@testing-library/react';

// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
test('spinner renders', () => {
  render(<Spinner/>)
})
