import React, { PropsWithChildren } from 'react';

import { DEFAULT_TEST_ID } from './constants';
import { COMPONENT_NAMEProps } from './interfaces';

export const COMPONENT_NAME = (props: PropsWithChildren<COMPONENT_NAMEProps>): JSX.Element => {
  const { children, dataTestId = DEFAULT_TEST_ID } = props;

  return <div data-testid={dataTestId}>{children}</div>;
};
