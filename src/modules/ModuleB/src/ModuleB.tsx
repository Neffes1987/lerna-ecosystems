import React, { PropsWithChildren } from 'react';

import { DEFAULT_TEST_ID } from './constants';
import { ModuleBProps } from './interfaces';

export const ModuleB = (props: PropsWithChildren<ModuleBProps>): JSX.Element => {
  const {  dataTestId = DEFAULT_TEST_ID } = props;

  return <div data-testid={dataTestId}>LERNA dep MODULE B</div>;
};
