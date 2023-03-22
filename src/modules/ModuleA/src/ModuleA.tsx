import React, { PropsWithChildren } from 'react';

import { DEFAULT_TEST_ID } from './constants';
import { ModuleAProps } from './interfaces';

export const ModuleA = (props: PropsWithChildren<ModuleAProps>): JSX.Element => {
  const { dataTestId = DEFAULT_TEST_ID } = props;

  return <div data-testid={dataTestId}>LERNA dep MODULE A</div>;
};
